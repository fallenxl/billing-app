package thingsboard

import (
	"app/config"
	"app/internal/model"
	"app/pkg/utils"
)

func GetCustomerInfoService(id string, token string) (model.Customer, error) {
	url := config.AppConfig.TB.URI + "/customer/info/" + id
	var customerData model.Customer
	response, err := utils.SendRequest("GET", url, utils.DefaultHeaderToken(token), nil, &customerData)
	if err != nil {
		return model.Customer{}, err
	}
	if response.StatusCode != 200 {
		return model.Customer{}, err
	}
	attributes, err := GetAttributesService(customerData.ID.EntityType, customerData.ID.ID, token, []string{"img", "sitesGroup"})
	if err != nil {
		return model.Customer{}, err
	}
	var imgStr, sitesGroupStr string
	FindAttributeByKey(attributes, "sitesGroup", &sitesGroupStr)
	FindAttributeByKey(attributes, "img", &imgStr)
	customerData.Img = &imgStr
	customerData.SitesGroup = &sitesGroupStr

	return customerData, nil

}
