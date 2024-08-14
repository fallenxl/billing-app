package services

import (
	"fmt"
	"server/internal/config"
	"server/internal/utils"
)

func GetUserService(username string, token string) ([]byte, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"userInfos/all?pageSize=1&page=0&includeCustomers=true&textSearch="+username, "GET", "", token)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return response, nil
}
