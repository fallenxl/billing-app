package sync

import (
	"app/config"
	"app/internal/services/thingsboard"
	"fmt"
	"log"
)

func SyncData(token string, customerID string) error {
	customerSites, err := thingsboard.GetSiteEntityGroupService(customerID, config.AppConfig.App.MaxSites, "", "", token)
	if err != nil {
		return fmt.Errorf("error getting customer sites: %w", err)
	}

	siteIDs := make([]string, 0, len(customerSites.Data))
	localIDs := make([]string, 0)
	meterIDs := make([]string, 0)

	for _, site := range customerSites.Data {
		siteIDs = append(siteIDs, site.ID.ID)

		err := config.DB.Exec(`CALL upsert_site(?, ?, ?, ?, ?)`,
			site.ID.ID, site.Name, site.Type, site.CustomerID.ID, site.LocalsGroup).Error
		if err != nil {
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

			err := config.DB.Exec(`CALL upsert_local(?, ?, ?, ?, ?)`,
				local.ID.ID, local.CustomerID.ID, local.Name, local.Type, site.ID.ID).Error
			if err != nil {
				log.Printf("upsert_local error: %v", err)
				continue
			}

			meters, err := thingsboard.GetFromRelationsService(local.ID.ID, local.ID.EntityType, token)
			if err != nil {
				log.Printf("get meters error: %v", err)
				continue
			}

			for _, meter := range meters {
				meterIDs = append(meterIDs, meter.To.ID)

				err := config.DB.Exec(`CALL upsert_meter(?, ?, ?, ?, ?)`,
					meter.To.ID, meter.ToName, meter.Type, local.ID.ID, meter.To.EntityType).Error
				if err != nil {
					log.Printf("upsert_meter error: %v", err)
				}
			}
		}
	}

	// Eliminación de registros obsoletos
	deleteIfNotIn := func(table string, ids []string) {
		if len(ids) == 0 {
			return
		}
		err := config.DB.Exec(`DELETE FROM `+table+` WHERE id NOT IN ?`, ids).Error
		if err != nil {
			log.Printf("error deleting from %s: %v", table, err)
		}
	}

	deleteIfNotIn("sites", siteIDs)
	deleteIfNotIn("locals", localIDs)
	deleteIfNotIn("meters", meterIDs)

	return nil
}

func SyncTelemetryByLocal(token string, localIds []string) error {
	if len(localIds) == 0 {
		return fmt.Errorf("localIds is required")
	}

	for _, localId := range localIds {
		// Aquí es donde podrías agregar la lógica real de sincronización con ThingsBoard
		fmt.Println("Syncing telemetry for localId:", localId, "with token:", token)
	}

	return nil
}
