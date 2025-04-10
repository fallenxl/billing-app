package handlers

import (
	"app/config"
	"app/internal/services"

	"github.com/gin-gonic/gin"
)

func GetCustomersHandler(c *gin.Context) {
	token, exists := c.Get("token")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}
	data, err := services.GetEntityGroupCustomersService(config.AppConfig.TB.BillingGroupId, token.(string))
	if err != nil {
		c.JSON(500, gin.H{"error": "Error sending request to API"})
		return
	}
	c.JSON(200, gin.H{"message": "Customers data", "success": true, "data": data.Data})
}
