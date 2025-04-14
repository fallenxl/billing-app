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
	uri := config.AppConfig.TB.URI + "/plugins/telemetry/" + entityType + "/" + entityId + "/values/attributes/SERVER_SCOPE" + keysStr
	var attributes []model.Attribute
	response, err := utils.SendRequest("GET", uri, utils.DefaultHeaderToken(token), nil, &attributes)
	if err != nil {
		fmt.Println("Error: ", err)
		return nil, err
	}
	if response.StatusCode != 200 {
		return nil, fmt.Errorf("error: %s", response.Body)
	}

	return attributes, nil
}

func FindAttributeByKey(attributes []model.Attribute, key string, response interface{}) interface{} {
	for _, attribute := range attributes {
		if attribute.Key == key {
			switch res := response.(type) {
			case *[]string:
				if v, ok := attribute.Value.([]interface{}); ok {
					var result []string
					for _, item := range v {
						if s, ok := item.(string); ok {
							result = append(result, s)
						}
					}
					*res = result
					return result
				}
			case *string:
				if v, ok := attribute.Value.(string); ok {
					*res = v
					return v
				}
			case *float64:
				if v, ok := attribute.Value.(float64); ok {
					*res = v
					return v
				}
			case *int:
				if v, ok := attribute.Value.(float64); ok {
					*res = int(v)
					return *res
				}
			case *[]interface{}:
				if v, ok := attribute.Value.([]interface{}); ok {
					*res = v
					return v
				}
			default:
				// Retorna el valor sin convertir si no se conoce el tipo
				return attribute.Value
			}
		}
	}
	return nil
}
