package services

import (
	"fmt"
	"server/internal/config"
	"server/internal/models"
	"server/internal/utils"
)

func GetAssetsByGroupIDService(token string) (models.AssetGroup, error) {

	response, err := utils.Request(config.ThingsboardApiURL+"entityGroup/ce0482e0-5425-11ef-aa15-a127638e3a77/customers?pageSize=100&page=0", "GET", "", token)
	if err != nil {
		return models.AssetGroup{}, err
	}
	var assets models.AssetGroup
	err = utils.ParseResponse(response, &assets)
	if err != nil {
		fmt.Println(err)
		return models.AssetGroup{}, err
	}

	for i := 0; i < len(assets.Data); i++ {
		assetAttributes, err := GetAssetAttributesService(token, assets.Data[i].Id.Id, assets.Data[i].Id.EntityType)
		if err != nil {
			fmt.Println(err)
			return models.AssetGroup{}, err
		}

		rate := FindAtrributeByKey(assetAttributes, "rate").(map[string]interface{})
		img := FindAtrributeByKey(assetAttributes, "img")
		currency := FindAtrributeByKey(assetAttributes, "currency")

		assets.Data[i].Rate = &rate
		assets.Data[i].Img = &img
		assets.Data[i].Currency = &currency

	}

	return assets, nil
}

func GetAssetByIdService(token string, assetId string) (models.Asset, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"asset/info/"+assetId, "GET", "", token)
	if err != nil {
		return models.Asset{}, err
	}
	var asset models.Asset
	err = utils.ParseResponse(response, &asset)
	if err != nil {
		fmt.Println(err)
		return models.Asset{}, err
	}

	var assetAttributes []models.AssetAttributes
	assetAttributes, err = GetAssetAttributesService(token, assetId, "ASSET")
	if err != nil {
		fmt.Println(err)
		return models.Asset{}, err
	}

	img := FindAtrributeByKey(assetAttributes, "img")
	rate := FindAtrributeByKey(assetAttributes, "rate").(map[string]interface{})
	currency := FindAtrributeByKey(assetAttributes, "currency")
	asset.Img = &img
	asset.Rate = &rate
	asset.Currency = &currency

	return asset, nil

}

func GetCustomerByIdService(token string, assetId string) (models.Asset, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"customer/info/"+assetId, "GET", "", token)
	if err != nil {
		return models.Asset{}, err
	}
	var asset models.Asset
	err = utils.ParseResponse(response, &asset)
	if err != nil {
		fmt.Println(err)
		return models.Asset{}, err
	}

	var assetAttributes []models.AssetAttributes
	assetAttributes, err = GetAssetAttributesService(token, assetId, "CUSTOMER")
	if err != nil {
		fmt.Println(err)
		return models.Asset{}, err
	}

	img := FindAtrributeByKey(assetAttributes, "img")
	rate := FindAtrributeByKey(assetAttributes, "rate").(map[string]interface{})
	currency := FindAtrributeByKey(assetAttributes, "currency")
	asset.Img = &img

	asset.Rate = &rate
	asset.Currency = &currency

	return asset, nil

}

func GetAssetAttributesService(token string, assetId string, entityType string) ([]models.AssetAttributes, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"plugins/telemetry/"+entityType+"/"+assetId+"/values/attributes", "GET", "", token)
	if err != nil {
		return []models.AssetAttributes{}, err
	}
	var assetAttributes []models.AssetAttributes
	err = utils.ParseResponse(response, &assetAttributes)
	if err != nil {
		fmt.Println(err)
		return []models.AssetAttributes{}, err
	}
	return assetAttributes, nil
}

func FindAtrributeByKey(assetAttributes []models.AssetAttributes, key string) interface{} {
	for i := 0; i < len(assetAttributes); i++ {
		if assetAttributes[i].Key == key {
			return assetAttributes[i].Value
		}
	}

	return nil
}
