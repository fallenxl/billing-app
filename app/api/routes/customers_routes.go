package routes

import (
	"app/api/handlers"
	middleware "app/pkg/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterCustomersRoutes(r *gin.RouterGroup) {
	customers := r.Group("/customers", middleware.AuthMiddleware)
	{
		customers.GET("/", handlers.GetCustomersHandler)
		customers.GET("/:id/sites", handlers.GetCustomerSitesHandler)
		customers.GET("/:id", handlers.GetCustomerByIdHandler)
	}
}
