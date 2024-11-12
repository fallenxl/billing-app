package services

import (
	"encoding/json"
	"fmt"
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
			relations[i].Type = deviceInfo.Type
			relations[i].Label = deviceInfo.Label

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
			address := FindAttributeByKey(attributes, "address")
			if address != nil {
				address := address.(string)
				relations[i].Address = &address
			}
			phone := FindAttributeByKey(attributes, "phone")
			if phone != nil {
				phone := phone.(string)
				relations[i].Phone = &phone
			}
			email := FindAttributeByKey(attributes, "email")
			if email != nil {
				email := email.(string)
				relations[i].Email = &email
			}
			templates := FindAttributeByKey(attributes, "templates")
			if templates != nil {
				templates := templates.(map[string]interface{})
				relations[i].Settings.Templates = &templates
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

func UpdateBranchName(token string, body models.NameUpdate) error {
	bodyJSON, err := json.Marshal(body)
	if err != nil {
		return err
	}
	fmt.Println(string(bodyJSON), fmt.Sprintf(config.ThingsboardApiURL+"asset"))
	res, err := utils.Request(config.ThingsboardApiURL+"asset", "POST", string(bodyJSON), token)
	if err != nil {
		return err
	}
	return utils.ParseResponse(res, nil)
}
