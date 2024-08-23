package services

import (
	"server/internal/config"
	"server/internal/models"
	"server/internal/utils"
	"strings"
)

func GetAssetRelationsByID(id string, entityType string, token string) ([]models.AssetRelationResponse, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"relations/info?fromId="+id+"&fromType="+entityType, "GET", "", token)
	if err != nil {
		return nil, err
	}

	var relations []models.AssetRelationResponse
	err = utils.ParseResponse(response, &relations)
	if err != nil {
		return []models.AssetRelationResponse{}, err
	}

	var aggregatedRelations []models.AssetRelationResponse
	for i := range relations {
		if entityType == "ASSET" {

			deviceInfo, err := GetDeviceById(relations[i].To.Id, relations[i].To.EntityType, token)
			if err != nil {
				return nil, err
			}
			relations[i].EntityType = relations[i].To.EntityType
			relations[i].Id = relations[i].To.Id
			relations[i].Label = relations[i].ToName
			relations[i].Type = deviceInfo.Type
			if relations[i].EntityType == "DEVICE" {
				device, err := GetDeviceById(relations[i].Id, relations[i].EntityType, token)
				if err != nil {
					return nil, err
				}
				if device.Label == "" {
					relations[i].Label = device.Name
				} else {
					relations[i].Label = device.Label
				}
				relations[i].Type = device.Type
			}
			aggregatedRelations = append(aggregatedRelations, relations[i])
		}
	}
	return aggregatedRelations, nil
}

func GetCustomerRelationsByID(id string, entityType string, token string) ([]models.CustomerRelationResponse, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"relations/info?fromId="+id+"&fromType="+entityType, "GET", "", token)
	if err != nil {
		return nil, err
	}

	var relations []models.CustomerRelationResponse
	err = utils.ParseResponse(response, &relations)
	if err != nil {
		return []models.CustomerRelationResponse{}, err
	}

	var payload []models.CustomerRelationResponse
	for i := range relations {
		if !strings.Contains(relations[i].ToName, "EMS") {
			relations[i].EntityType = relations[i].To.EntityType
			relations[i].Id = relations[i].To.Id
			relations[i].Label = relations[i].ToName
			relations[i].Type = "SITE"
			attributes, err := GetAssetAttributesService(token, relations[i].Id, relations[i].EntityType)
			if err != nil {
				continue
			}
			rate := FindAttributeByKey(attributes, "rate")
			if rate != nil {
				rate := rate.(map[string]interface{})
				relations[i].Settings.Rate = &rate
			}
			currency := FindAttributeByKey(attributes, "currency")
			if currency != nil {
				currency := currency.(string)
				relations[i].Settings.Currency = &currency
			}
			rateType := FindAttributeByKey(attributes, "rateType")
			if rateType != nil {
				rateType := rateType.(string)
				relations[i].Settings.RateType = &rateType
			}
			units := FindAttributeByKey(attributes, "units")
			if units != nil {
				units := units.(map[string]interface{})
				relations[i].Settings.Units = &units
			}
			payload = append(payload, relations[i])
		}

	}
	return payload, nil
}
