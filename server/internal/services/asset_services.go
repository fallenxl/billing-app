package services

import (
	"fmt"
	"server/internal/config"
	"server/internal/models"
	"server/internal/utils"
)

func GetAssetsByGroupIDService(token string) (models.CustomerGroup, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"entityGroup/ce0482e0-5425-11ef-aa15-a127638e3a77/customers?pageSize=100&page=0", "GET", "", token)
	if err != nil {
		fmt.Println(err)
		return models.CustomerGroup{}, err
	}
	var customer models.CustomerGroup
	err = utils.ParseResponse(response, &customer)
	if err != nil {
		fmt.Println(err)
		return models.CustomerGroup{}, err
	}

	for i := 0; i < len(customer.Data); i++ {
		assetAttributes, err := GetAssetAttributesService(token, customer.Data[i].Id.Id, customer.Data[i].Id.EntityType)
		if err != nil {
			fmt.Println(err)
			return models.CustomerGroup{}, err
		}

		//rate := FindAtrributeByKey(assetAttributes, "rate").(map[string]interface{})
		img := FindAttributeByKey(assetAttributes, "img")
		if img != nil {
			img := img.(string)
			customer.Data[i].Img = &img
		}

	}

	return customer, nil
}

func GetAssetsByGroupID(id string, token string) (models.Customer, error) {

	url := fmt.Sprintf("%scustomer/%s", config.ThingsboardApiURL, id)
	response, err := utils.Request(url, "GET", "", token)
	if err != nil {
		fmt.Println(err)
		return models.Customer{}, err
	}
	var customer models.Customer
	err = utils.ParseResponse(response, &customer)
	if err != nil {
		fmt.Println(err)
		return models.Customer{}, err
	}

	assetAttributes, err := GetAssetAttributesService(token, customer.Id.Id, customer.Id.EntityType)
	if err != nil {
		fmt.Println(err)
		return models.Customer{}, err
	}

	//rate := FindAtrributeByKey(assetAttributes, "rate").(map[string]interface{})
	img := FindAttributeByKey(assetAttributes, "img")
	if img != nil {
		img := img.(string)
		customer.Img = &img
	}

	return customer, nil
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

	rate := FindAttributeByKey(assetAttributes, "rate").(map[string]models.Rate)
	currency := FindAttributeByKey(assetAttributes, "currency").(string)
	rateType := FindAttributeByKey(assetAttributes, "rateType").(string)
	eneeTariff := FindAttributeByKey(assetAttributes, "eneeTariff").(string)
	fmt.Println(eneeTariff)
	asset.Settings.RateType = &rateType
	asset.Settings.Rate = &rate
	asset.Settings.Currency = &currency
	asset.Settings.EneeTariff = &eneeTariff

	return asset, nil

}

func GetCustomerByIdService(token string, assetId string) (models.Customer, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"customer/info/"+assetId, "GET", "", token)
	if err != nil {
		return models.Customer{}, err
	}
	var asset models.Customer
	err = utils.ParseResponse(response, &asset)
	if err != nil {
		fmt.Println(err)
		return models.Customer{}, err
	}

	var assetAttributes []models.AssetAttributes
	assetAttributes, err = GetAssetAttributesService(token, assetId, "CUSTOMER")
	if err != nil {
		fmt.Println(err)
		return models.Customer{}, err
	}

	img := FindAttributeByKey(assetAttributes, "img").(string)
	asset.Img = &img

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

// url example: https://dashboard.lumenenergysolutions.com/api/plugins/telemetry/ASSET/311f1240-5f35-11ef-b270-6d27b0c9502e/SERVER_SCOPE POST METHOD
func SetAssetAttributesService(token string, assetId string, entityType string, attributes string) error {
	response, err := utils.Request(config.ThingsboardApiURL+"plugins/telemetry/"+entityType+"/"+assetId+"/SERVER_SCOPE", "POST", attributes, token)
	if err != nil {
		return err
	}
	fmt.Println(response)
	return nil
}

func FindAttributeByKey(assetAttributes []models.AssetAttributes, key string) interface{} {
	for i := 0; i < len(assetAttributes); i++ {
		if assetAttributes[i].Key == key {
			return assetAttributes[i].Value
		}
	}

	return nil
}
