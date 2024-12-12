package main

import (
	"app/api/handlers"
	"app/internal/config"
	"app/internal/database"
	"log"
	"net/http"
)

func main() {
	config.LoadConfig()
	database.Connect()
	r := handlers.NewRouter()

	log.Println("Server started on: http://localhost:4001")
	if err := http.ListenAndServe(":4001", r); err != nil {
		log.Fatal(err)
	}
}
