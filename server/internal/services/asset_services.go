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

	addressAttr := FindAttributeByKey(assetAttributes, "address")
	if addressAttr != nil {
		address := addressAttr.(string)
		asset.Address = &address
	}

	emailAttr := FindAttributeByKey(assetAttributes, "email")
	if emailAttr != nil {
		email := emailAttr.(string)
		asset.Email = &email
	}

	phoneAttr := FindAttributeByKey(assetAttributes, "phone")
	if phoneAttr != nil {
		phone := phoneAttr.(string)
		asset.Phone = &phone
	}

	rateAttr := FindAttributeByKey(assetAttributes, "rate")
	if rateAttr != nil {
		rate := rateAttr.(map[string]models.Rate)
		asset.Settings.Rate = &rate
	}

	currencyAttr := FindAttributeByKey(assetAttributes, "currency")
	if currencyAttr != nil {
		currency := currencyAttr.(string)
		asset.Settings.Currency = &currency
	}

	rateTypeAttr := FindAttributeByKey(assetAttributes, "rateType")
	if rateTypeAttr != nil {
		rateType := rateTypeAttr.(string)
		asset.Settings.RateType = &rateType
	}

	eneeTariffAttr := FindAttributeByKey(assetAttributes, "eneeTariff")
	if eneeTariffAttr != nil {
		eneeTariff := eneeTariffAttr.(string)
		asset.Settings.EneeTariff = &eneeTariff
	}

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

func GetSiteByIdService(token string, assetId string) (models.Asset, error) {
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

	// address := FindAttributeByKey(assetAttributes, "address").(string)
	// asset.Address = &address
	fmt.Println(assetAttributes)
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

func SetAssetAttributesService(token string, assetId string, entityType string, attributes string) error {
	_, err := utils.Request(config.ThingsboardApiURL+"plugins/telemetry/"+entityType+"/"+assetId+"/SERVER_SCOPE", "POST", attributes, token)
	if err != nil {
		return err
	}
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
