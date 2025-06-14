package thingsboard

import (
	"app/config"
	"app/internal/model"
	"app/pkg/utils"

	"fmt"
)

func GetCustomerEntityGroupService(groupId string, pageSize string, page string, textSearch string, token string) (model.CustomerGroup, error) {
	if pageSize == "" {
		pageSize = "10"
	}
	if page == "" {
		page = "0"
	}
	uri := fmt.Sprintf("%s/entityGroup/%s/customers?pageSize=%s&page=%s&textSearch=%s", config.AppConfig.TB.URI, groupId, pageSize, page, textSearch)
	fmt.Println("URI: ", uri)
	var customerGroup model.CustomerGroup
	response, err := utils.SendRequest("GET", uri, utils.DefaultHeaderToken(token), nil, &customerGroup)
	if err != nil {
		fmt.Println(err)
		return model.CustomerGroup{}, err
	}
	if response.StatusCode != 200 {
		fmt.Println("Error: ", response.StatusCode, response.Body)
		return model.CustomerGroup{}, fmt.Errorf("error: %s", response.Body)
	}

	for i, customer := range customerGroup.Data {
		// Get customer attributes
		attributes, err := GetAttributesService(customer.ID.EntityType, customer.ID.ID, token, []string{"img", "sitesGroup"})
		if err != nil {
			fmt.Println("Error getting customer attributes: ", err)
			continue
		}
		var imgStr, sitesGroupStr string
		FindAttributeByKey(attributes, "img", &imgStr)
		FindAttributeByKey(attributes, "sitesGroup", &sitesGroupStr)
		customerGroup.Data[i].Img = &imgStr
		customerGroup.Data[i].SitesGroup = &sitesGroupStr
	}

	return customerGroup, nil
}

func GetSiteEntityGroupService(groupId string, pageSize string, page string, textSearch string, token string) (model.SiteGroup, error) {
	if pageSize == "" {
		pageSize = "10"
	}
	if page == "" {
		page = "0"
	}
	uri := fmt.Sprintf("%s/entityGroup/%s/assets?pageSize=%s&page=%s&textSearch=%s", config.AppConfig.TB.URI, groupId, pageSize, page, textSearch)

	var siteGroup model.SiteGroup
	response, err := utils.SendRequest("GET", uri, utils.DefaultHeaderToken(token), nil, &siteGroup)
	if err != nil {
		fmt.Println(err)
		return model.SiteGroup{}, err
	}
	if response.StatusCode != 200 {
		fmt.Println("Error: ", response.StatusCode, response.Body)
		return model.SiteGroup{}, fmt.Errorf("error: %s", response.Body)
	}

	for i, site := range siteGroup.Data {
		// Get customer attributes
		attributes, err := GetAttributesService(site.ID.EntityType, site.ID.ID, token, []string{"localsGroup"})
		if err != nil {
			fmt.Println("Error getting customer attributes: ", err)
			continue
		}
		var localGroupStr string
		FindAttributeByKey(attributes, "localsGroup", &localGroupStr)
		siteGroup.Data[i].LocalsGroup = &localGroupStr
	}

	return siteGroup, nil
}

func GetLocalEntityGroupService(groupId string, pageSize string, page string, textSearch string, token string) (model.LocalGroup, error) {
	if pageSize == "" {
		pageSize = "10"
	}
	if page == "" {
		page = "0"
	}
	uri := fmt.Sprintf("%s/entityGroup/%s/assets?pageSize=%s&page=%s&textSearch=%s", config.AppConfig.TB.URI, groupId, pageSize, page, textSearch)

	var localGroup model.LocalGroup
	response, err := utils.SendRequest("GET", uri, utils.DefaultHeaderToken(token), nil, &localGroup)
	if err != nil {
		fmt.Println(err)
		return model.LocalGroup{}, err
	}
	if response.StatusCode != 200 {
		fmt.Println("Error: ", response.StatusCode, response.Body)
		return model.LocalGroup{}, fmt.Errorf("error: %s", response.Body)
	}

	return localGroup, nil
}
