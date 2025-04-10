package handlers

import (
	"github.com/gin-gonic/gin"
)

func GetCustomersHandler(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Customers data", "success": true})
}
