package routes

import (
	"app/api/handlers"
	middleware "app/pkg/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterSyncRoutes(r *gin.RouterGroup) {
	sync := r.Group("/sync", middleware.AuthMiddleware)
	{
		sync.POST("/:customerId", handlers.SyncHandler)
		sync.POST("/telemetry/:siteId", handlers.SyncTelemetryBySiteHandler)
	}
}
