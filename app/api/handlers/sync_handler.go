package handlers

import (
	"app/config"
	"app/internal/services/sync"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func SyncHandler(c *gin.Context) {
	token, _ := c.Get("token")
	customerID := c.Param("customerId")
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

func SyncTelemetryBySiteHandler(c *gin.Context) {
	token, _ := c.Get("token")
	siteId := c.Param("siteId")
	if siteId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "siteId is required"})
		return
	}

	db := config.DB
	localsIds, err := db.Table("locals").Select("id").Where("site_id = ?", siteId).Rows()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer localsIds.Close()

	var localIds []string
	for localsIds.Next() {
		var id string
		if err := localsIds.Scan(&id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		localIds = append(localIds, id)
	}
	if len(localIds) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No locals found for the given siteId"})
		return
	}

	startTs := time.Now().Truncate(24*time.Hour).UnixNano() / 1e6
	endTs := time.Now().Truncate(24*time.Hour).Add(24*time.Hour-1).UnixNano() / 1e6
	for _, id := range localIds {
		if err := sync.SyncTelemetryByLocal(token.(string), id, startTs, endTs); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Sync data", "success": true})
}
