package sync

import (
	"app/config"
	"app/internal/model"
	"app/internal/repository"
	"app/internal/services/thingsboard"
	"app/pkg/utils"
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"gorm.io/gorm"
)

func SyncData(token, customerID string) error {
	customerSites, err := thingsboard.GetSiteEntityGroupService(customerID, config.AppConfig.App.MaxSites, "", "", token)
	if err != nil {
		return fmt.Errorf("error getting customer sites: %w", err)
	}

	var siteIDs, localIDs []string

	for _, site := range customerSites.Data {
		siteIDs = append(siteIDs, site.ID.ID)

		if err := upsertSite(site); err != nil {
			log.Printf("upsert_site error: %v", err)
			continue
		}

		if site.LocalsGroup == nil {
			continue
		}

		locals, err := thingsboard.GetLocalEntityGroupService(*site.LocalsGroup, config.AppConfig.App.MaxLocals, "", "", token)
		if err != nil {
			log.Printf("get locals error: %v", err)
			continue
		}

		for _, local := range locals.Data {
			localIDs = append(localIDs, local.ID.ID)

			if err := upsertLocal(local, site.ID.ID); err != nil {
				log.Printf("upsert_local error: %v", err)
				continue
			}

			meters, err := thingsboard.GetFromRelationsService(local.ID.ID, local.ID.EntityType, token)
			if err != nil {
				log.Printf("get meters error: %v", err)
				continue
			}

			for _, meter := range meters {
				// meterIDs = append(meterIDs, meter.To.ID)

				meterType := prefixMeterType(meter.ToName)
				if err := upsertMeter(meter, local.ID.ID, meterType); err != nil {
					log.Printf("upsert_meter error: %v", err)
				}
			}
		}
	}

	deleteMissing("sites", siteIDs, "customer_id", customerID)
	deleteMissing("locals", localIDs, "customer_id", customerID)
	// deleteMissing("meters", meterIDs)

	return nil
}

func SyncTelemetryByLocal(token, localID string, startTs, endTs int64) error {
	rows, err := config.DB.Table("meters").
		Select("id, name, type, entity_type").
		Where("local_id = ?", localID).Rows()
	if err != nil {
		return fmt.Errorf("error getting meters: %w", err)
	}
	defer rows.Close()

	oneDay := int64(24 * time.Hour / time.Millisecond)

	for rows.Next() {
		var id, name, meterType, entityType string
		if err := rows.Scan(&id, &name, &meterType, &entityType); err != nil {
			return fmt.Errorf("error scanning meters: %w", err)
		}

		fmt.Println("meter", id, name, meterType, entityType)
		keys := keysByMeterType(meterType)
		if keys == nil {
			continue
		}

		data, err := thingsboard.GetTelemetryService(id, entityType, keys, startTs, endTs, oneDay, "MAX", token)
		if err != nil {
			log.Printf("error getting telemetry data for %s: %v", id, err)
			continue
		}
		fmt.Println("startTs", time.UnixMilli(startTs).Format(time.RFC3339), "endTs", time.UnixMilli(endTs).Format(time.RFC3339))
		values := data[keys[0]]
		if len(values) < 2 {
			log.Printf("insufficient telemetry points for %s", id)
			continue
		}

		// Procesar cada par de días
		for i := 0; i < len(values)-1; i++ {
			first := values[i]
			last := values[i+1]

			firstValue, err := strconv.ParseFloat(first.Value, 64)
			if err != nil {
				log.Printf("error parsing firstValue for %s: %v", id, err)
				continue
			}
			lastValue, err := strconv.ParseFloat(last.Value, 64)
			if err != nil {
				log.Printf("error parsing lastValue for %s: %v", id, err)
				continue
			}

			saveDate := time.UnixMilli(last.Ts)

			if err := saveDailyTelemetry(localID, id, saveDate, firstValue, lastValue, first.Ts, last.Ts); err != nil {
				log.Printf("error saving telemetry for %s: %v", id, err)
			}
		}
	}

	return nil
}

func SyncAllTelemetry() error {
	now := time.Now()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day()-1, 0, 0, 0, 0, now.Location())
	startTs := startOfDay.UnixNano() / int64(time.Millisecond)
	endTs := now.UnixNano() / int64(time.Millisecond)

	loginRequest := model.LoginRequest{
		Username: config.AppConfig.TB.Username,
		Password: config.AppConfig.TB.Password,
	}
	var loginResponse model.LoginResponse
	uri := config.AppConfig.TB.URI + "/auth/login"
	_, err := utils.SendRequest("POST", uri, nil, loginRequest, &loginResponse)

	if err != nil {
		return fmt.Errorf("error sending request to API: %w", err)
	}

	customers, err := thingsboard.GetCustomerEntityGroupService(config.AppConfig.TB.BillingGroupId, config.AppConfig.App.MaxSites, "", "", loginResponse.Token)
	if err != nil {
		return fmt.Errorf("error getting customers: %w", err)
	}

	for _, customer := range customers.Data {
		customerID := customer.ID.ID
		maxSites, err := strconv.Atoi(config.AppConfig.App.MaxSites)
		if err != nil {
			return fmt.Errorf("invalid MaxSites value: %w", err)
		}
		sites, err := repository.GetSitesByCustomerId(customerID, maxSites, 0, "")
		if err != nil {
			return fmt.Errorf("error getting sites: %w", err)
		}
		for _, site := range sites.Data {
			utils.PrintLog(fmt.Sprintf("Syncing telemetry for  %s - %s", customer.Name, site.Name))
			locals, err := repository.GetLocalsBySiteId(site.ID, maxSites, 0, "")
			if err != nil {
				return fmt.Errorf("error getting locals: %w", err)
			}
			for _, local := range locals.Data {
				if err := SyncTelemetryByLocal(loginResponse.Token, local.ID, startTs, endTs); err != nil {
					log.Printf("error syncing telemetry for local %s: %v", local.Name, err)
				}

			}

			repository.CreateSyncLog(config.DB, site.ID)
		}

	}
	utils.PrintLog("Sync completed successfully")
	return nil
}
func upsertSite(site model.SiteTB) error {
	return config.DB.Exec(`CALL upsert_site(?, ?, ?, ?, ?)`,
		site.ID.ID, site.Name, site.Type, site.CustomerID.ID, site.LocalsGroup).Error
}

func upsertLocal(local model.LocalTB, siteID string) error {
	return config.DB.Exec(`CALL upsert_local(?, ?, ?, ?, ?)`,
		local.ID.ID, local.CustomerID.ID, local.Name, local.Type, siteID).Error
}

func upsertMeter(meter model.Relation, localID, meterType string) error {
	return config.DB.Exec(`CALL upsert_meter(?, ?, ?, ?, ?)`,
		meter.To.ID, meter.ToName, meterType, localID, meter.To.EntityType).Error
}

func deleteMissing(table string, ids []string, foreignKey string, id string) {
	if len(ids) == 0 {
		return
	}
	err := config.DB.Exec(
		`DELETE FROM `+table+` WHERE id NOT IN (?) AND `+foreignKey+` = ?`,
		ids, id,
	).Error
	if err != nil {
		log.Printf("error deleting from %s: %v", table, err)
	}
}

func saveDailyTelemetry(localID string, meterID string, date time.Time, firstValue, lastValue float64, firstTs, lastTs int64) error {
	formattedDate := date.Format("02/01/06")

	var telemetry model.Telemetry
	err := config.DB.Where("meter_id = ? AND date = ?", meterID, formattedDate).First(&telemetry).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		telemetry = model.Telemetry{
			Date:         formattedDate,
			MeterID:      meterID,
			FirstValue:   firstValue,
			FirstValueTs: firstTs,
			LastValue:    lastValue,
			LastValueTs:  lastTs,
			Consumption:  lastValue - firstValue,
			UpdatedAt:    date.Format(time.RFC3339),
			LocalID:      localID,
		}
		return config.DB.Create(&telemetry).Error
	} else if err != nil {
		return fmt.Errorf("error checking telemetry: %w", err)
	}

	telemetry.FirstValue = firstValue
	telemetry.FirstValueTs = firstTs
	telemetry.LastValue = lastValue
	telemetry.LastValueTs = lastTs
	telemetry.Consumption = lastValue - firstValue
	telemetry.UpdatedAt = time.Now().Format(time.RFC3339)

	return config.DB.Save(&telemetry).Error
}

func prefixMeterType(name string) string {
	switch strings.ToLower(strings.Split(name, "-")[0]) {
	case "em":
		return "Energy"
	case "wm":
		return "Water"
	default:
		return "Unknown"
	}
}

func keysByMeterType(meterType string) []string {
	switch meterType {
	case "Energy":
		return []string{"energyCount"}
	case "Water":
		return []string{"pulseCount"}
	default:
		return []string{"E"}
	}
}
