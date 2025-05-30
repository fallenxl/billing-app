package handlers

import (
	"app/config"
	"app/internal/model"
	"app/internal/repository"
	"app/pkg/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ExportHandler(c *gin.Context) {
	var exportData model.ExportData
	if err := c.ShouldBindJSON(&exportData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	for index, item := range exportData.LocalsSelected {
		devices, err := repository.GetDevicesByLocalId(item.ID, 10000, 0)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch devices for local: " + item.Name})
			return
		}
		item.Devices = &devices

		for _, device := range *item.Devices {
			telemetry, err := repository.GetTelemetryByMeterId(device.ID, exportData.StartDate.Format("2006-01-02 15:04:05"), exportData.EndDate.Format("2006-01-02 15:04:05"))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch telemetry for device: " + device.Name})
				return
			}
			device.Telemetry = &telemetry
			if item.Devices != nil && len(*item.Devices) > index {
				(*item.Devices)[index].Telemetry = &telemetry
			}
		}
		exportData.LocalsSelected[index] = item
	}

	fmt.Println("Export data prepared:", config.AppConfig.FileService.URI)
	var response interface{}
	resp, err := utils.SendRequest("POST", config.AppConfig.FileService.URI, utils.DefaultHeaderToken("file"), exportData, &response)
	if err != nil {
		fmt.Println("Failed to send export data to file service:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send export data to file service: " + err.Error()})
		return
	}
	fmt.Println("Export data sent to file service:", resp.Status)
	c.JSON(http.StatusOK, gin.H{
		"message":  "Export data received successfully",
		"data":     exportData,
		"response": response,
	})

}
