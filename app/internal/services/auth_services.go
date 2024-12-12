package services

import (
	"app/internal/config"
	"app/internal/models"
	"app/internal/utils"
	"fmt"
)

// Auth

func LoginService(username string, password string) (models.LoginResponse, error) {
	//Api login URL
	response, err := utils.Request(config.AppConfig.Thingsboard.Api+"auth/login", "POST", "{\"username\":\""+username+"\",\"password\":\""+password+"\"}", "")
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
	loginResponse.User.FirstName = userResponse.Data[0].FirstName
	loginResponse.User.LastName = userResponse.Data[0].LastName
	loginResponse.User.Email = userResponse.Data[0].Email
	loginResponse.User.Authority = userResponse.Data[0].Authority
	loginResponse.User.Name = userResponse.Data[0].FirstName + " " + userResponse.Data[0].LastName
	loginResponse.User.Id = userResponse.Data[0].Id.Id
	loginResponse.User.CustomerId = userResponse.Data[0].CustomerId.Id

	return loginResponse, nil
}

func GetCurrentUserService(token string) (models.User, error) {
	response, err := utils.Request(config.AppConfig.Thingsboard.Api+"auth/user", "GET", "", token)
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
