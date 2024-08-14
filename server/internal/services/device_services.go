package services

import (
	"fmt"
	"server/internal/config"
	"server/internal/models"
	"server/internal/utils"
	"strings"
)

func getKeysByDeviceType(deviceType string) string {
	if strings.Contains(strings.ToLower(deviceType), "water meter") {
		return "pulseCount"
	}
	if strings.Contains(strings.ToLower(deviceType), "energy meter") {
		return "energyCount"
	}
	return ""
}
func GetDeviceById(id string, token string) (models.Device, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"device/"+id, "GET", "", token)
	if err != nil {
		return models.Device{}, err
	}

	var device models.Device
	err = utils.ParseResponse(response, &device)
	if err != nil {
		return models.Device{}, err
	}

	return device, nil
}

func GetDeviceTelemetryById(id string, entityType string, deviceType string, startDate int64, endDate int64, token string) models.Telemetry {
	resolution := getResolution(startDate, endDate)
	telemetryPath := fmt.Sprintf("plugins/telemetry/%s/%s/values/timeseries?keys=%s&startTs=%d&endTs=%d&limit=50000&interval=%d&lagg=AVG&orderBy=ASC&useStrictDataTypes=false", entityType, id, getKeysByDeviceType(deviceType), startDate, endDate, resolution)
	response, err := utils.Request(config.ThingsboardApiURL+telemetryPath, "GET", "", token)
	if err != nil {
		return models.Telemetry{}
	}
	var telemetry models.Telemetry
	err = utils.ParseResponse(response, &telemetry.Data)
	if err != nil {
		return models.Telemetry{}
	}
	return telemetry

}

func getResolution(startDate int64, endDate int64) int64 {
	diff := endDate - startDate
	// if the difference is less than 1 day
	if diff < 86400 {
		return 3600000
	}
	// if the difference is less than 1 month, RESOLUTION_PER_WEEK
	if diff <= 2419200 {
		return 604800000
	}

	//	if the difference is less than 1 year, RESOLUTION_PER_MONTH
	if diff <= 31536000 {
		return 2592000000
	}

	return 3600000 * 24
}
