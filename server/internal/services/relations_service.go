package services

import (
	"server/internal/config"
	"server/internal/models"
	"server/internal/utils"
)

func GetRelationsByID(id string, entityType string, token string) ([]models.RelationResponse, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"relations/info?fromId="+id+"&fromType="+entityType, "GET", "", token)
	if err != nil {
		return nil, err
	}

	var relations []models.RelationResponse
	err = utils.ParseResponse(response, &relations)
	if err != nil {
		return []models.RelationResponse{}, err
	}

	for i := range relations {
		relations[i].EntityType = relations[i].To.EntityType
		relations[i].Id = relations[i].To.Id
		relations[i].Label = relations[i].ToName
		relations[i].Type = "SITE"
		if relations[i].EntityType == "DEVICE" {
			device, err := GetDeviceById(relations[i].Id, token)
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
	}
	return relations, nil
}
