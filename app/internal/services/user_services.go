package services

import (
	"app/internal/config"
	"app/internal/utils"
)

func GetUserService(username string, token string) ([]byte, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"userInfos/all?pageSize=1&page=0&includeCustomers=true&textSearch="+username, "GET", "", token)
	if err != nil {

		return nil, err
	}
	return response, nil
}
