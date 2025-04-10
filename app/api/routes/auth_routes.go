package routes

import (
	"app/api/handlers"
	middleware "app/pkg/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(r *gin.RouterGroup) {
	auth := r.Group("/auth")
	{
		auth.POST("/login", handlers.LoginHandler)
		auth.GET("/me", middleware.AuthMiddleware, handlers.MeHandler)
	}
}
