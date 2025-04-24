package handlers

import (
	"app/internal/services/thingsboard"
	"app/pkg/utils"

	"github.com/gin-gonic/gin"
)

func GetSiteInfoByIdHandler(c *gin.Context) {
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

	data, err := thingsboard.GetSiteInfoByIdService(id, token.(string))
	if err != nil {
		c.JSON(500, gin.H{"error": "Error sending request to API"})
		return
	}

	c.JSON(200, gin.H{"message": "Site data", "success": true, "data": data})

}

func GetLocalsBySiteIdHandler(c *gin.Context) {
	// get id from url
	id := c.Param("id")
	if id == "" {
		c.JSON(400, gin.H{"error": "ID is required"})
		return
	}
	pageSize := utils.GetQueryParam(c, "size", "10")
	pageNumber := utils.GetQueryParam(c, "page", "0")
	textSearch := utils.GetQueryParam(c, "q", "")

	token, exists := c.Get("token")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	data, err := thingsboard.GetLocalEntityGroupService(id, pageSize, pageNumber, textSearch, token.(string))
	if err != nil {
		c.JSON(500, gin.H{"error": "Error sending request to API"})
		return
	}

	c.JSON(200, gin.H{"message": "Locals data", "success": true, "data": data.Data, "totalPages": data.TotalPages, "totalElements": data.TotalElements, "hasNext": data.HasNext})
}
