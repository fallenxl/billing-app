package routes

import (
	"app/api/handlers"
	middleware "app/pkg/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterExportRoutes(r *gin.RouterGroup) {
	export := r.Group("/export", middleware.AuthMiddleware)
	{
		export.POST("/", handlers.ExportHandler)
	}
}
