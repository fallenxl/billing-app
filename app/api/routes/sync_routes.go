package routes

import (
	"app/api/handlers"
	middleware "app/pkg/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterSyncRoutes(r *gin.RouterGroup) {
	sync := r.Group("/sync", middleware.AuthMiddleware)
	{
		sync.GET("/", handlers.SyncHandler)
		sync.POST("/telemetry", handlers.SyncHandler)
	}
}
