package routes

import (
	"app/api/handlers"
	middleware "app/pkg/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterSitesRoutes(r *gin.RouterGroup) {
	sites := r.Group("/sites", middleware.AuthMiddleware)
	{
		sites.GET("/:id", handlers.GetSiteInfoByIdHandler)
		sites.GET("/:id/locals", handlers.GetLocalsBySiteIdHandler)
		sites.PUT("/:id", handlers.UpdateSiteHandler)
	}
}
