package services

import (
	"fmt"
	"server/internal/config"
	"server/internal/models"
	"server/internal/utils"
)

// Auth

func LoginService(username string, password string) (models.LoginResponse, error) {
	//Api login URL
	response, err := utils.Request(config.ThingsboardApiURL+"auth/login", "POST", "{\"username\":\""+username+"\",\"password\":\""+password+"\"}", "")
	if err != nil {
		fmt.Println(err)
		return models.LoginResponse{}, err
	}

	//Parse response
	authResponse := models.AuthResponse{}
	err = utils.ParseResponse(response, &authResponse)
	if err != nil {
		fmt.Println(err)
		return models.LoginResponse{}, err
	}

	var userResponse models.UserResponse
	resp, err := GetUserService(username, authResponse.Token)

	if err != nil {
		fmt.Println(err)
		return models.LoginResponse{}, err
	}

	err = utils.ParseResponse(resp, &userResponse)
	if err != nil {
		fmt.Println(err)
		return models.LoginResponse{}, err
	}

	var loginResponse models.LoginResponse
	loginResponse.RefreshToken = authResponse.RefreshToken
	loginResponse.Token = authResponse.Token
	loginResponse.FirsName = userResponse.Data[0].FirstName
	loginResponse.LastName = userResponse.Data[0].LastName
	loginResponse.Email = userResponse.Data[0].Email
	loginResponse.Authority = userResponse.Data[0].Authority
	loginResponse.Name = userResponse.Data[0].FirstName + " " + userResponse.Data[0].LastName
	loginResponse.Id = userResponse.Data[0].Id.Id
	loginResponse.CustomerId = userResponse.Data[0].CustomerId.Id

	//loginResponse.AssetInfo.Type = assetType.(string)
	//loginResponse.AssetInfo.Name = assetResponse[0].ToName
	//loginResponse.AssetInfo.Id = assetResponse[0].To.Id
	//loginResponse.AssetInfo.EntityType = assetResponse[0].To.EntityType
	return loginResponse, nil
}

func GetCurrentUserService(token string) (models.User, error) {
	response, err := utils.Request(config.ThingsboardApiURL+"auth/user", "GET", "", token)
	if err != nil {
		return models.User{}, err
	}

	var userResponse models.User
	err = utils.ParseResponse(response, &userResponse)
	if err != nil {
		return models.User{}, err
	}

	userResponse.Name = userResponse.FirstName + " " + userResponse.LastName
	return userResponse, nil
}
