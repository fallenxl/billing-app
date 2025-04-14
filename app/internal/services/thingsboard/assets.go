package thingsboard

import (
	"app/config"
	"app/internal/model"
	"app/pkg/utils"
	"fmt"
)

func GetAssetInfoByIdService(id string, token string) (model.AssetInfo, error) {
	var assetInfo model.AssetInfo
	uri := fmt.Sprintf("%s/asset/info/%s", config.AppConfig.TB.URI, id)
	response, err := utils.SendRequest("GET", uri, utils.DefaultHeaderToken(token), nil, &assetInfo)
	if err != nil {
		return assetInfo, err
	}

	if response.StatusCode != 200 {
		return assetInfo, fmt.Errorf("error getting asset info: %s", response.Status)
	}
	return assetInfo, nil
}
