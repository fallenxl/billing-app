package handlers

import (
	"net/http"
	md "server/pkg/middleware"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func NewRouter() http.Handler {
	r := mux.NewRouter()
	//set prefix api/billing/v1
	r = r.PathPrefix("/api/billing/v1").Subrouter()
	r.HandleFunc("/auth/login", Login).Methods("POST")

	// Protected routes
	protectedRoutes := r.PathPrefix("/").Subrouter()
	protectedRoutes.Use(md.BearerTokenMiddleware)
	protectedRoutes.HandleFunc("/auth/current", GetCurrentUser).Methods("GET")
	protectedRoutes.HandleFunc("/assets/group", GetAssetsGroup).Methods("GET")
	protectedRoutes.HandleFunc("/assets/{assetId}", GetAssetById).Methods("GET")
	protectedRoutes.HandleFunc("/assets/group/{groupId}", GetAssetsByGroupID).Methods("GET")
	protectedRoutes.HandleFunc("/customer/{customerId}", GetCustomerById).Methods("GET")
	protectedRoutes.HandleFunc("/customer/{customerId}/relation", GetCustomerRelationById).Methods("GET")
	protectedRoutes.HandleFunc("/assets/{assetId}/relation", GetAssetRelationById).Methods("GET")
	protectedRoutes.HandleFunc("/data/export", HandleDataExport).Methods("POST")
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Permitir todos los orígenes
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})
	handler := c.Handler(r)
	return handler
}
