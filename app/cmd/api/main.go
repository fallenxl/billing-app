package main

import (
	"app/api/routes"
	"app/config"
	"log"

	"github.com/spf13/viper"
)

func main() {

	viper.SetDefault("PORT", "4001")
	config.LoadConfig()
	config.InitDB()
	router := routes.SetupRouter()

	port := config.AppConfig.App.Port

	err := router.Run(":" + port)

	if err != nil {
		log.Fatal(err)
	}
}
