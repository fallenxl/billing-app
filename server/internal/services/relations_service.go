package services

import (
	"encoding/json"
	"server/internal/config"
	"server/internal/models"
	"server/internal/utils"
	"strings"
)

func GetRelations(token string, entityType string, id string) ([]models.AssetRelationResponse, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"relations/info?fromId="+id+"&fromType="+entityType, "GET", "", token)
	if err != nil {
		return nil, err
	}
	var relations []models.AssetRelationResponse
	err = utils.ParseResponse(response, &relations)
	if err != nil {
		return []models.AssetRelationResponse{}, err
	}

	return relations, nil
}
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
			assetAttributes, _ := GetAssetAttributesService(token, relations[i].To.Id, relations[i].To.EntityType)
			relations[i].EntityType = relations[i].To.EntityType
			relations[i].Id = relations[i].To.Id
			attributeMap := map[string]func(interface{}){
				"address": func(value interface{}) { address := value.(string); relations[i].Address = &address },
				"charges": func(value interface{}) {
					deviceCharges := value.([]interface{})
					relations[i].Charges = &deviceCharges
				},
				"label":         func(value interface{}) { label := value.(string); relations[i].Label = &label },
				"phone":         func(value interface{}) { phone := value.(string); relations[i].Phone = &phone },
				"email":         func(value interface{}) { email := value.(string); relations[i].Email = &email },
				"buildingOwner": func(value interface{}) { buildingOwner := value.(string); relations[i].BuildingOwner = &buildingOwner },
				"latitude":      func(value interface{}) { latitude := value.(float64); relations[i].Latitude = &latitude },
				"longitude":     func(value interface{}) { longitude := value.(float64); relations[i].Longitude = &longitude },
			}
			for key, assignFunc := range attributeMap {
				utils.AssignAttributeIfExists(assetAttributes, key, assignFunc)
			}
			if relations[i].EntityType == "DEVICE" {
				relations[i].Type = deviceInfo.Type
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
		if strings.Contains(relations[i].ToName, "EMS") {
			continue
		}
		relations[i].EntityType = relations[i].To.EntityType
		relations[i].Id = relations[i].To.Id
		relations[i].Type = "SITE"
		attributes, _ := GetAssetAttributesService(token, relations[i].Id, relations[i].EntityType)

		attributeMap := map[string]func(interface{}){
			"address": func(value interface{}) { address := value.(string); relations[i].Address = &address },
			"label":   func(value interface{}) { label := value.(string); relations[i].Label = &label },
			"phone":   func(value interface{}) { phone := value.(string); relations[i].Phone = &phone },
			"email":   func(value interface{}) { email := value.(string); relations[i].Email = &email },
			"templates": func(value interface{}) {
				templates := value.(map[string]interface{})
				relations[i].Settings.Templates = &templates
			},
			"rate":     func(value interface{}) { rate := value.(map[string]interface{}); relations[i].Settings.Rate = &rate },
			"currency": func(value interface{}) { currency := value.(string); relations[i].Settings.Currency = &currency },
			"rateType": func(value interface{}) { rateType := value.(string); relations[i].Settings.RateType = &rateType },
			"units":    func(value interface{}) { units := value.(map[string]interface{}); relations[i].Settings.Units = &units },
		}
		for key, assignFunc := range attributeMap {
			utils.AssignAttributeIfExists(attributes, key, assignFunc)
		}
		payload = append(payload, relations[i])

	}
	return payload, nil
}

func UpdateBranchName(token string, body models.NameUpdate) (string, error) {

	bodyJSON, err := json.Marshal(body)
	if err != nil {
		return "", err
	}
	_, err = utils.Request(config.ThingsboardApiURL+"asset", "POST", string(bodyJSON), token)
	if err != nil {
		return "", err
	}

	return string(bodyJSON), nil
}
