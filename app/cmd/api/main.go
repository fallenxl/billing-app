package main

import (
	"app/api/routes"
	"app/config"
	"app/cron"
	"log"
)

func main() {

	config.LoadConfig() // Load the configuration from the config file
	config.InitDB()     // Initialize the database connection

	router := routes.SetupRouter() // Setup the router with all routes

	cron.InitCronJobs() // Initialize and start the cron jobs

	port := "4001"

	err := router.Run(":" + port)

	if err != nil {
		log.Fatal(err)
	}
}
