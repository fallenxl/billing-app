package services

import (
	"fmt"
	"server/internal/models"
	"server/internal/templates/excel"
	"server/internal/templates/pdf"
	"server/internal/utils"
	"strconv"
	"strings"
)

func ParseDataService(firstTelemetry models.Telemetry, lastTelemetry models.Telemetry, rate map[string]interface{}, deviceType string) models.ParseTelemetry {
	var parseTelemetry models.ParseTelemetry
	// for _, data := range telemetry.Data {
	// 	parseCurrentMonth, _ := strconv.ParseFloat(data[len(data)-1].Value, 64)
	// 	parsePrevMonth, _ := strconv.ParseFloat(data[0].Value, 64)
	// 	parseTelemetry.CurrentMonth = float64(parseCurrentMonth)
	// 	parseTelemetry.PreviousMonth = float64(parsePrevMonth)
	// 	rate := utils.GetRateByDeviceType(deviceType, rate)
	// 	parseTelemetry.TotalConsumed = float64(parseCurrentMonth - parsePrevMonth)
	// 	parseTelemetry.TotalToPay = float64(parseTelemetry.TotalConsumed * rate)

	// }
	var previousMonth float64
	var currentMonth float64
	if strings.Contains(strings.ToLower(deviceType), "water meter") {
		waterFirstTelemetry, ok := firstTelemetry.Data["pulseCount"]
		if !ok {
			return parseTelemetry
		}
		waterLastTelemetry, ok := lastTelemetry.Data["pulseCount"]
		if !ok {
			return parseTelemetry
		}
		previousMonth, _ = strconv.ParseFloat(waterFirstTelemetry[0].Value, 64)
		currentMonth, _ = strconv.ParseFloat(waterLastTelemetry[0].Value, 64)

	} else if strings.Contains(strings.ToLower(deviceType), "energy meter") {
		energyFirstTelemetry, ok := firstTelemetry.Data["energyCount"]
		if !ok {
			return parseTelemetry
		}
		energyLastTelemetry, ok := lastTelemetry.Data["energyCount"]
		if !ok {
			return parseTelemetry
		}
		previousMonth, _ = strconv.ParseFloat(energyFirstTelemetry[0].Value, 64)
		currentMonth, _ = strconv.ParseFloat(energyLastTelemetry[0].Value, 64)
	}

	parseTelemetry.CurrentMonth = currentMonth
	parseTelemetry.PreviousMonth = previousMonth
	getRate := utils.GetRateByDeviceType(deviceType, rate)
	parseTelemetry.TotalConsumed = currentMonth - previousMonth
	parseTelemetry.TotalToPay = float64(parseTelemetry.TotalConsumed * getRate)

	return parseTelemetry
}

func HandleDataService(data models.DataDTO, token string) (models.ExportedData, error) {
	var exportedData models.ExportedData
	resolution := utils.GetResolution(data.StartDateTs, data.EndDateTs)
	exportedData.Img = data.Img
	exportedData.Customer = data.Customer
	exportedData.Branch = data.Branch
	exportedData.Rate = data.Rate
	exportedData.Units = data.Units
	exportedData.Currency = data.Currency
	exportedData.StartDateTs = data.StartDateTs
	exportedData.EndDateTs = data.EndDateTs

	for _, entity := range data.SelectedDevices {
		switch entity.EntityType {
		case "DEVICE":
			var deviceData models.DeviceData
			deviceInfo, err := GetDeviceById(entity.Id, entity.EntityType, token)
			if err != nil {
				continue
			}
			// telemetry := GetDeviceTelemetryById(entity.Id, entity.EntityType, deviceInfo.Type, data.StartDateTs, data.EndDateTs, 0, "", token)
			diff := data.EndDateTs - data.StartDateTs
			firstTelemetry := GetDeviceTelemetryById(entity.Id, entity.EntityType, deviceInfo.Type, data.StartDateTs, data.EndDateTs, diff, "energyCount", "MIN", token)
			lastTelemetry := GetDeviceTelemetryById(entity.Id, entity.EntityType, deviceInfo.Type, data.StartDateTs, data.EndDateTs, diff, "energyCount", "MAX", token)
			parseTelemetry := ParseDataService(firstTelemetry, lastTelemetry, data.Rate, deviceInfo.Type)
			telemetry := GetDeviceTelemetryById(entity.Id, entity.EntityType, deviceInfo.Type, data.StartDateTs, data.EndDateTs, resolution, "", "SUM", token)
			deviceData.Name = deviceInfo.Name
			deviceData.Label = deviceInfo.Label
			deviceData.Type = deviceInfo.Type
			deviceData.Id = deviceInfo.Id.Id
			deviceData.EntityType = deviceInfo.Id.EntityType
			deviceData.Telemetry = &telemetry.Data
			deviceData.PreviousMonth = &parseTelemetry.PreviousMonth
			deviceData.CurrentMonth = &parseTelemetry.CurrentMonth
			deviceData.TotalConsumed = &parseTelemetry.TotalConsumed
			deviceData.TotalToPay = &parseTelemetry.TotalToPay
			exportedData.Relations = append(exportedData.Relations, deviceData)
		case "ASSET":
			var assetData models.DeviceData
			assetData.Id = entity.Id
			assetData.EntityType = entity.EntityType
			assetData.Name = entity.ToName
			assetData.Label = entity.Label
			assetData.Type = entity.Type
			assetData.Telemetry = &map[string][]models.Data{}
			assetRelations, err := GetAssetRelationsByID(entity.Id, entity.EntityType, token)
			assetData.Relations = &[]models.DeviceData{}
			if err != nil {
				continue
			}
			assetRelationsAgrouped := GroupRelationsByName(assetRelations)
			for _, relation := range assetRelationsAgrouped {
				for _, device := range relation {
					if device.EntityType == "DEVICE" {
						diff := data.EndDateTs - data.StartDateTs
						firstTelemetry := GetDeviceTelemetryById(device.Id, device.EntityType, device.Type, data.StartDateTs, data.EndDateTs, diff, "energyCount", "MIN", token)
						lastTelemetry := GetDeviceTelemetryById(device.Id, device.EntityType, device.Type, data.StartDateTs, data.EndDateTs, diff, "energyCount", "MAX", token)
						// telemetry := GetDeviceTelemetryById(device.Id, device.EntityType, device.Type, data.StartDateTs, data.EndDateTs, 0, "", token)
						parseTelemetry := ParseDataService(firstTelemetry, lastTelemetry, data.Rate, device.Type)
						telemetry := GetDeviceTelemetryById(device.Id, device.EntityType, device.Type, data.StartDateTs, data.EndDateTs, resolution, "", "SUM", token)
						deviceData := models.DeviceData{
							Id:            device.Id,
							EntityType:    device.EntityType,
							Name:          device.Name,
							Label:         device.Label,
							Type:          device.Type,
							Telemetry:     &telemetry.Data,
							PreviousMonth: &parseTelemetry.PreviousMonth,
							CurrentMonth:  &parseTelemetry.CurrentMonth,
							TotalConsumed: &parseTelemetry.TotalConsumed,
							TotalToPay:    &parseTelemetry.TotalToPay,
						}
						*assetData.Relations = append(*assetData.Relations, deviceData)
					}

				}
			}

			exportedData.Relations = append(exportedData.Relations, assetData)
		}

	}

	return exportedData, nil
}

func GroupRelationsByName(relations []models.AssetRelationResponse) map[string][]models.DeviceData {
	relationsAgrouped := map[string][]models.DeviceData{}
	for _, relation := range relations {
		prefix := strings.Split(relation.ToName, "-")[1]
		if _, ok := relationsAgrouped[prefix]; ok {
			relationsAgrouped[relation.ToName] = append(relationsAgrouped[prefix], models.DeviceData{
				Label:      relation.Label,
				Type:       relation.Type,
				Id:         relation.To.Id,
				EntityType: relation.To.EntityType,
				Name:       relation.ToName,
			})
		} else {
			relationsAgrouped[prefix] = []models.DeviceData{
				{

					Name:       relation.ToName,
					Label:      relation.Label,
					Type:       relation.Type,
					Id:         relation.To.Id,
					EntityType: relation.To.EntityType,
				},
			}
		}
	}
	return relationsAgrouped
}

func HandleFormatExportData(data models.ExportedData, format string) (string, error) {
	switch format {
	case "pdf":
		filename := fmt.Sprintf("%s-%s.pdf", data.Customer, data.Branch)
		filename, err := pdf.CreatePDF(filename, data)
		if err != nil {
			return "", err
		}
		return filename, nil
	case "excel":
		filename := fmt.Sprintf("%s-%s.xlsx", data.Customer, data.Branch)
		filename, err := excel.CreateExcel(filename, data)
		if err != nil {
			return "", err
		}
		return filename, nil
	case "support":
		filename := fmt.Sprintf("%s-%s.zip", data.Customer, data.Branch)
		filename, err := pdf.CreateSupportPdf(filename, data)
		if err != nil {
			return "", err
		}
		return filename, nil
	default:
		filename := fmt.Sprintf("%s-%s.pdf", data.Customer, data.Branch)
		return filename, nil
	}
}
