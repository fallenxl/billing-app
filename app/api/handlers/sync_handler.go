package handlers

import (
	"app/config"
	"app/internal/services/sync"
	"app/pkg/utils"
	"net/http"
	"strconv"
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

	// Tiempos
	now := time.Now()
	defaultStartTs := time.Date(now.Year(), now.Month(), now.Day()-1, 0, 0, 0, 0, now.Location()).UnixMilli()
	startTs, _ := strconv.ParseInt(utils.GetQueryParam(c, "startTs", ""), 10, 64)
	if startTs == 0 {
		startTs = defaultStartTs
	}

	defaultEndTs := now.UnixMilli()
	endTs, _ := strconv.ParseInt(utils.GetQueryParam(c, "endTs", ""), 10, 64)
	if endTs == 0 {
		endTs = defaultEndTs
	}

	if startTs > endTs {
		c.JSON(http.StatusBadRequest, gin.H{"error": "startTs must be before endTs"})
		return
	}

	// Buscar locals
	db := config.DB
	rows, err := db.Table("locals").Select("id").Where("site_id = ?", siteId).Rows()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var localIds []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		localIds = append(localIds, id)
	}
	if len(localIds) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No locals found for the given siteId"})
		return
	}

	// Ejecutar sincronización
	for _, id := range localIds {
		if err := sync.SyncTelemetryByLocal(token.(string), id, startTs, endTs); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Sync completed successfully", "success": true})
}
