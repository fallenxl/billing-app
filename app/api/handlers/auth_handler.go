package handlers

import (
	"app/config"
	"app/internal/model"
	"app/pkg/utils"

	"github.com/gin-gonic/gin"
)

func LoginHandler(c *gin.Context) {
	var loginRequest model.LoginRequest
	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request payload"})
		return
	}
	var loginResponse model.LoginResponse
	uri := config.AppConfig.TB.URI + "/auth/login"
	_, err := utils.SendRequest("POST", uri, nil, loginRequest, &loginResponse)

	if err != nil {
		c.JSON(500, gin.H{"error": "Error sending request to API"})
		return
	}

	data, err := utils.DecodeToken(loginResponse.Token)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error decoding token", "success": false, "message": "Error decoding token"})
		return
	}

	c.JSON(200, gin.H{"message": "Login successful", "data": data, "token": loginResponse.Token, "success": true})
}

func MeHandler(c *gin.Context) {
	claims, exists := c.Get("claims")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	tokenString, exists := c.Get("token")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	c.JSON(200, gin.H{"message": "User data", "data": claims, "success": true, "token": tokenString})
}
