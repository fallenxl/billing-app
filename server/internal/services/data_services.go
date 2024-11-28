package services

import (
	"fmt"
	"server/internal/models"
	"server/internal/templates/excel"
	"server/internal/templates/pdf"
	"server/internal/templates/supports"
	"server/internal/utils"
	"strconv"
	"strings"
	"time"

	"github.com/gocolly/colly"
)

func ParseDataService(firstTelemetry models.Telemetry, lastTelemetry models.Telemetry, rate map[string]interface{}, deviceType string) models.ParseTelemetry {
	var parseTelemetry models.ParseTelemetry
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
	exportedData.SendEmail = data.SendEmail
	exportedData.Customer = data.Customer
	exportedData.Branch = data.Branch
	exportedData.Rate = data.Rate
	exportedData.Units = data.Units
	exportedData.Currency = data.Currency
	exportedData.StartDateTs = data.StartDateTs
	exportedData.EndDateTs = data.EndDateTs

	// ver hora de inicio y fin ya parseada en formato de fecha
	fmt.Println("Start Date: ", time.UnixMilli(data.StartDateTs).AddDate(0, 0, 0).Format("02/01/2006"))
	fmt.Println("End Date: ", time.UnixMilli(data.EndDateTs).AddDate(0, 0, 0).Format("02/01/2006"))

	for _, entity := range data.SelectedDevices {
		var assetData models.DeviceData
		assetData.Id = entity.Id
		assetData.EntityType = entity.EntityType
		assetData.Name = entity.ToName
		assetData.Label = entity.Label
		assetData.Type = entity.Type
		assetData.Charges = entity.Charges
		assetData.Email = entity.Email
		assetData.Telemetry = &map[string][]models.Data{}
		assetRelations, err := GetAssetRelationsByID(entity.Id, entity.EntityType, token)
		assetData.Relations = &[]models.DeviceData{}
		if err != nil {
			continue
		}

		for _, device := range assetRelations {
			diff := data.EndDateTs - data.StartDateTs
			firstTelemetry := GetDeviceTelemetryById(device.Id, device.EntityType, device.Type, data.StartDateTs, data.EndDateTs, diff, "", "MIN", token)
			fmt.Println("resolution: ", resolution)
			lastTelemetry := GetDeviceTelemetryById(device.Id, device.EntityType, device.Type, data.StartDateTs, data.EndDateTs, diff, "", "MAX", token)
			parseTelemetry := ParseDataService(firstTelemetry, lastTelemetry, data.Rate, device.Type)
			telemetry := GetDeviceTelemetryById(device.Id, device.EntityType, device.Type, data.StartDateTs, data.EndDateTs, resolution, "", "SUM", token)
			deviceData := models.DeviceData{
				Id:            device.Id,
				EntityType:    device.EntityType,
				Name:          device.ToName,
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

		exportedData.Relations = append(exportedData.Relations, assetData)

	}
	return exportedData, nil
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
		filename, err := supports.CreateSupportPdf(filename, data)
		if err != nil {
			return "", err
		}
		return filename, nil
	default:
		filename := fmt.Sprintf("%s-%s.pdf", data.Customer, data.Branch)
		return filename, nil
	}
}

func GetEnergyRateENEE() (string, error) {
	c := colly.NewCollector()

	var energyPrice string

	c.OnHTML("table", func(e *colly.HTMLElement) {
		e.ForEach("tr", func(_ int, row *colly.HTMLElement) {
			if row.Text == "" {
				return
			}

			if strings.Contains(row.Text, "Servicio General en Baja Tensión") {
				energyPrice = row.ChildText("td:nth-of-type(4)")

			}
		})
	})

	err := c.Visit("https://www.cree.gob.hn/tarifas-vigentes-enee/")
	if err != nil {
		return "", err
	}

	if energyPrice == "" {
		return "", err
	}

	return energyPrice, nil
}
