package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		// allow all origins
		AllowOrigins:     []string{"*"},                                                // Origen permitido (puedes especificar un dominio específico)
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"}, // Métodos HTTP permitidos
		AllowHeaders:     []string{"Content-Type", "Authorization"},                    // Cabeceras permitidas
		ExposeHeaders:    []string{"Content-Length"},                                   // Cabeceras expuestas al cliente
		AllowCredentials: true,                                                         // Permitir credenciales                                    // Tiempo de caché de pre-flight
	}))

	api := router.Group("/api/v1")
	{
		RegisterAuthRoutes(api)      // Registra las rutas de autenticación
		RegisterCustomersRoutes(api) // Registra las rutas de clientes
		RegisterSitesRoutes(api)     // Registra las rutas de sitios
		RegisterSyncRoutes(api)      // Registra las rutas de sincronización
		RegisterExportRoutes(api)    // Registra las rutas de exportación
	}

	return router
}
