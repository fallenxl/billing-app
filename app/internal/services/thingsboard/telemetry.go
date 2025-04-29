package thingsboard

import (
	"app/config"
	"app/internal/model"
	"app/pkg/utils"
	"fmt"
	"net/http"
	"strings"
)

//  'https://dashboard.lumenenergysolutions.com/api/plugins/telemetry/DEVICE/26b7de80-140d-11f0-863b-f730addc68ba/values/timeseries?keys=energyCount&startTs=1745440907000&endTs=1745527307000&interval=86400000&limit=50000&agg=MAX&useStrictDataTypes=false'

func GetTelemetryService(deviceID string, entityType string, keys []string, startTs, endTs int64, interval int64, agg string, token string) (map[string][]model.TelemetryValue, error) {
	url := fmt.Sprintf("%s/plugins/telemetry/%s/%s/values/timeseries?keys=%s&startTs=%d&endTs=%d&interval=%d&limit=50000&agg=%s&useStrictDataTypes=false", config.AppConfig.TB.URI, entityType, deviceID, strings.Join(keys, ","), startTs, endTs, interval, agg)
	var response map[string][]model.TelemetryValue
	resp, err := utils.SendRequest("GET", url, utils.DefaultHeaderToken(token), nil, &response)
	if err != nil {
		return nil, fmt.Errorf("error getting telemetry data: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error getting telemetry data: %s", resp.Status)
	}

	return response, nil
}
