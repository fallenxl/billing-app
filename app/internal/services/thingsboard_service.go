package services

import (
	"app/config"
	"app/internal/model"
	"app/pkg/utils"
	"fmt"
)

func GetEntityGroupCustomersService(groupId string, token string) (model.CustomerGroup, error) {
	uri := fmt.Sprintf("%s/entityGroup/%s/customers?pageSize=200&page=0", config.AppConfig.TB.URI, groupId)

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

	return customerGroup, nil

}
