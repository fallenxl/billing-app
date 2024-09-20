package services

import (
	"fmt"
	"server/internal/config"
	"server/internal/models"
	"server/internal/utils"
	"strings"
	"sync"
)

func getKeysByDeviceType(deviceType string, agg string) string {
	if agg == "MAX" || agg == "MIN" || agg == "AVG" {
		if strings.Contains(strings.ToLower(deviceType), "water meter") {
			return "pulseCount"
		}
		if strings.Contains(strings.ToLower(deviceType), "energy meter") {
			return "energyCount"
		}
	} else {
		if strings.Contains(strings.ToLower(deviceType), "water meter") {
			return "deltaPulseCount"
		}
		if strings.Contains(strings.ToLower(deviceType), "energy meter") {
			return "deltaEnergyCount"
		}
	}
	return ""
}
func GetDeviceById(id string, entityType string, token string) (models.Device, error) {
	url := fmt.Sprintf("%s%s/%s", config.ThingsboardApiURL, strings.ToLower(entityType), id)
	response, err := utils.Request(url, "GET", "", token)
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

func GetDeviceTelemetryById(id string, entityType string, deviceType string, startDate int64, endDate int64, resolution int64, key string, agg string, token string) models.Telemetry {
	var mux sync.Mutex

	mux.Lock()
	defer mux.Unlock()

	if agg == "" {
		agg = "NONE"
	}
	if key == "" {
		key = getKeysByDeviceType(deviceType, agg)
	}
	telemetryPath := fmt.Sprintf("plugins/telemetry/%s/%s/values/timeseries?keys=%s&startTs=%d&endTs=%d&limit=50000&interval=%d&agg=%s&orderBy=ASC&useStrictDataTypes=false", entityType, id, key, startDate, endDate, resolution, agg)
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
