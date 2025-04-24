package handlers

import (
	"app/internal/services/sync"
	"app/pkg/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SyncHandler(c *gin.Context) {
	token, _ := c.Get("token")
	customerID := utils.GetQueryParam(c, "customerId", "")
	if customerID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customerId is required"})
		return
	}

	err := sync.SyncData(token.(string), customerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Sync data", "success": true})
}

func SyncTelemetryByLocalHandler(c *gin.Context) {
	token, _ := c.Get("token")

	localIds, err := utils.GetBodyParam(c, "localIds", []string{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "localIds is required"})
		return
	}

	localIdsArray, ok := localIds.([]string)
	if !ok || len(localIdsArray) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "localIds must be a non-empty array of strings"})
		return
	}

	if err := sync.SyncTelemetryByLocal(token.(string), localIdsArray); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Sync data", "success": true})
}
