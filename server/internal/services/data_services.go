package services

import (
	"fmt"
	"server/internal/models"
	"server/internal/templates/excel"
	"server/internal/templates/pdf"
	"server/internal/templates/supports"
	"strconv"
	"strings"
)

func parseDataToExport(data models.Telemetry, rate map[string]interface{}) models.ParseTelemetry {
	telemetry := data.Data
	var parse models.ParseTelemetry
	for key, value := range telemetry {
		if strings.Contains(key, "pulseCount") {
			//convert value of ft3 to m3
			previous, _ := strconv.ParseFloat(value[0].Value, 64)
			current, _ := strconv.ParseFloat(value[len(value)-1].Value, 64)
			parsePrevious := previous * 0.1 * 0.0283168
			parseCurrent := current * 0.1 * 0.0283168
			parse.PreviousMonth = fmt.Sprintf("%.2f", parsePrevious)
			parse.CurrentMonth = fmt.Sprintf("%.2f", parseCurrent)
			//parse to float
			water, _ := rate["water"].(map[string]interface{})
			rate, _ := water["rate"].(float64)

			parse.TotalConsumed = parseCurrent - parsePrevious
			parse.TotalToPay = rate * (parseCurrent - parsePrevious)
		}

		if strings.Contains(key, "energyCount") {
			previous, _ := strconv.ParseFloat(value[0].Value, 64)
			current, _ := strconv.ParseFloat(value[len(value)-1].Value, 64)

			parse.PreviousMonth = value[0].Value
			parse.CurrentMonth = value[len(value)-1].Value
			//parse to float
			energy, _ := rate["energy"].(map[string]interface{})
			rate, _ := energy["rate"].(float64)
			parse.TotalConsumed = current - previous
			parse.TotalToPay = rate * (current - previous)
		}
	}

	return parse
}
func ProcessDataService(data models.DataDTO, token string) []models.ExportedData {
	var response []models.ExportedData
	var exportedData models.ExportedData
	exportedData.Customer = data.Customer
	exportedData.Branch = data.Branch
	exportedData.Img = data.Img
	exportedData.StartDateTs = data.StartDateTs
	exportedData.EndDateTs = data.EndDateTs
	exportedData.Rate = data.Rate
	exportedData.Currency = data.Currency

	for _, device := range data.SelectedDevices {
		if device.EntityType == "ASSET" {
			exportedData.Site = device.ToName
			assetRelations, err := GetRelationsByID(device.Id, device.EntityType, token)
			if err != nil {
				continue
			}

			for _, relation := range assetRelations {
				if relation.To.EntityType == "DEVICE" {
					deviceInfo, err := GetDeviceById(relation.To.Id, token)
					if err != nil {
						continue
					}
					if strings.Contains(strings.ToLower(deviceInfo.Type), "water meter") {
						telemetry := GetDeviceTelemetryById(relation.To.Id, relation.To.EntityType, deviceInfo.Type, data.StartDateTs, data.EndDateTs, token)
						parse := parseDataToExport(telemetry, data.Rate)
						if parse.PreviousMonth == "" {
							parse.PreviousMonth = "0.00"
						}
						if parse.CurrentMonth == "" {
							parse.CurrentMonth = "0.00"
						}
						exportedData.Relations.WaterMeter = append(exportedData.Relations.WaterMeter, models.DeviceData{
							Name:          deviceInfo.Name,
							Label:         deviceInfo.Label,
							Type:          deviceInfo.Type,
							Telemetry:     telemetry.Data,
							PreviousMonth: parse.PreviousMonth,
							CurrentMonth:  parse.CurrentMonth,
							TotalConsumed: parse.TotalConsumed,
							TotalToPay:    parse.TotalToPay,
						})

					}
					if strings.Contains(strings.ToLower(deviceInfo.Type), "energy meter") {
						telemetry := GetDeviceTelemetryById(relation.To.Id, relation.To.EntityType, deviceInfo.Type, data.StartDateTs, data.EndDateTs, token)
						parse := parseDataToExport(telemetry, data.Rate)
						if parse.PreviousMonth == "" {
							parse.PreviousMonth = "0.00"
						}
						if parse.CurrentMonth == "" {
							parse.CurrentMonth = "0.00"
						}
						exportedData.Relations.EnergyMeter = append(exportedData.Relations.EnergyMeter, models.DeviceData{
							Name:          deviceInfo.Name,
							Label:         deviceInfo.Label,
							Type:          deviceInfo.Type,
							Telemetry:     telemetry.Data,
							PreviousMonth: parse.PreviousMonth,
							CurrentMonth:  parse.CurrentMonth,
							TotalConsumed: parse.TotalConsumed,
							TotalToPay:    parse.TotalToPay,
						})
					}
				}

			}
			exportedData.EntityType = device.EntityType

		}
		response = append(response, exportedData)
		exportedData.Relations = models.TypeDevice{}

	}
	return response
}

func HandleExportDataService(data models.DataDTO, token string) (string, error) {
	exportedData := ProcessDataService(data, token)
	switch data.Format {
	case "pdf":
		filename := fmt.Sprintf("%s-%s-%s.pdf", data.Customer, data.StartDateTs, data.EndDateTs)

		return pdf.CreatePDF(filename, data, exportedData)
	case "excel":
		filename := fmt.Sprintf("%s.xlsx", data.Customer)
		fmt.Println(filename)
		return excel.CreateExcel(filename, data, exportedData)
	case "support":
		filename := fmt.Sprintf("%s.zip", data.Customer)
		return supports.CreateInvoicesAndZip(filename, data, exportedData)
	default:
		filename := "data.pdf"
		return pdf.CreatePDF(filename, data, exportedData)
	}
}
