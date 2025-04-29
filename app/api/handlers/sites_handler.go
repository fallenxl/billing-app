package handlers

import (
	"app/internal/model"
	"app/internal/repository"
	"app/pkg/utils"

	"github.com/gin-gonic/gin"
)

func GetSiteInfoByIdHandler(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(400, gin.H{"error": "ID is required"})
		return
	}
	data, err := repository.GetSiteInfoById(id)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error getting site data"})
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

	data, err := repository.GetLocalsBySiteId(id, utils.StringToInt(pageSize), utils.StringToInt(pageNumber), textSearch)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error getting locals data"})
		return
	}

	c.JSON(200, gin.H{"message": "Locals data", "success": true, "data": data.Data, "totalPages": data.TotalPages, "totalElements": data.Total, "hasNext": data.HasNext})
}

func UpdateSiteHandler(c *gin.Context) {
	var site model.SiteRequest
	if err := c.ShouldBindJSON(&site); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}

	updatedSite, err := repository.UpdateSite(site)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error updating site data"})
		return
	}

	c.JSON(200, gin.H{"message": "Site updated successfully", "success": true, "data": updatedSite})
}
