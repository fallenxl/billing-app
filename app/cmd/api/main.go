package main

import (
	"app/api/routes"
	"app/config"

	"log"
)

func main() {
	config.LoadConfig()
	router := routes.SetupRouter()

	port := config.AppConfig.App.Port

	err := router.Run(":" + port)

	if err != nil {
		log.Fatal(err)
	}
}
