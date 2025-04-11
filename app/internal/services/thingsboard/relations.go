package thingsboard

import (
	"app/config"
	"app/internal/model"
	"app/pkg/utils"
	"fmt"
)

func GetFromRelationsService(id string, entityType string, token string) (model.RelationResponse, error) {
	uri := config.AppConfig.TB.URI + "/relations/info?fromId=" + id + "&fromType=" + entityType
	var relations model.RelationResponse
	response, err := utils.SendRequest("GET", uri, utils.DefaultHeaderToken(token), nil, &relations)
	if err != nil {
		return nil, err
	}
	if response.StatusCode != 200 {
		return nil, fmt.Errorf("error: %s", response.Body)
	}
	return relations, nil
}
