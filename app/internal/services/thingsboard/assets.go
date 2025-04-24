package thingsboard

import (
	"app/config"
	"app/internal/model"
	"app/pkg/utils"
	"fmt"
)

func GetSiteInfoByIdService(id string, token string) (model.SiteTB, error) {
	var assetInfo model.SiteTB
	uri := fmt.Sprintf("%s/asset/info/%s", config.AppConfig.TB.URI, id)
	response, err := utils.SendRequest("GET", uri, utils.DefaultHeaderToken(token), nil, &assetInfo)
	if err != nil {
		return assetInfo, err
	}

	if response.StatusCode != 200 {
		return assetInfo, fmt.Errorf("error getting asset info: %s", response.Status)
	}

	attributes, err := GetAttributesService(assetInfo.ID.EntityType, assetInfo.ID.ID, token, []string{"localsGroup"})
	if err != nil {
		return assetInfo, err
	}

	var localsGroupStr string
	FindAttributeByKey(attributes, "localsGroup", &localsGroupStr)
	assetInfo.LocalsGroup = &localsGroupStr

	return assetInfo, nil
}
