package handlers

import (
	"app/config"
	"app/internal/services/thingsboard"

	"github.com/gin-gonic/gin"
)

func GetCustomersHandler(c *gin.Context) {
	token, exists := c.Get("token")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}
	data, err := thingsboard.GetCustomerEntityGroupService(config.AppConfig.TB.BillingGroupId, "", "", "", token.(string))
	if err != nil {
		c.JSON(500, gin.H{"error": "Error sending request to API"})
		return
	}
	c.JSON(200, gin.H{"message": "Customers data", "success": true, "data": data.Data, "totalPages": data.TotalPages, "totalElements": data.TotalElements, "hasNext": data.HasNext})
}

func GetCustomerByIdHandler(c *gin.Context) {
	// get id from url
	id := c.Param("id")
	if id == "" {
		c.JSON(400, gin.H{"error": "ID is required"})
		return
	}
	token, exists := c.Get("token")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	data, err := thingsboard.GetCustomerInfoService(id, token.(string))
	if err != nil {
		c.JSON(500, gin.H{"error": "Error sending request to API"})
		return
	}

	c.JSON(200, gin.H{"message": "Customer data", "success": true, "data": data})
}

func GetCustomerSitesHandler(c *gin.Context) {
	// get id from url
	id := c.Param("id")
	if id == "" {
		c.JSON(400, gin.H{"error": "ID is required"})
		return
	}
	token, exists := c.Get("token")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	data, err := thingsboard.GetSiteEntityGroupService(id, "", "", "", token.(string))
	if err != nil {
		c.JSON(500, gin.H{"error": "Error sending request to API"})
		return
	}

	c.JSON(200, gin.H{"message": "Customer sites data", "success": true, "data": data.Data, "totalPages": data.TotalPages, "totalElements": data.TotalElements, "hasNext": data.HasNext})
}
