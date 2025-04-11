package thingsboard

import (
	"app/config"
	"app/internal/model"
	"app/pkg/utils"
	"fmt"
)

func GetAttributesService(entityType string, entityId string, token string, keys []string) ([]model.Attribute, error) {
	keysStr := ""
	if len(keys) > 0 {
		keysStr = "?keys="
		for i, key := range keys {
			if i > 0 {
				keysStr += ","
			}
			keysStr += key
		}
	}
	uri := config.AppConfig.TB.URI + "/plugins/telemetry/" + entityType + "/" + entityId + "/values/attributes" + keysStr
	var attributes []model.Attribute
	response, err := utils.SendRequest("GET", uri, utils.DefaultHeaderToken(token), nil, &attributes)
	if err != nil {
		return nil, err
	}
	if response.StatusCode != 200 {
		return nil, fmt.Errorf("error: %s", response.Body)
	}

	return attributes, nil
}

func FindAttributeByKey(attributes []model.Attribute, key string) interface{} {
	for _, attribute := range attributes {
		if attribute.Key == key {
			return attribute.Value
		}
	}
	return nil
}
