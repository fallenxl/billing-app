package handlers

import (
	"fmt"
	"net/http"
	"server/internal/utils"
	md "server/pkg/middleware"
	"strconv"
	"strings"

	"github.com/gocolly/colly"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func NewRouter() http.Handler {
	r := mux.NewRouter()
	//set prefix api/billing/v1
	r = r.PathPrefix("/api/billing/v1").Subrouter()
	r.HandleFunc("/auth/login", Login).Methods("POST")
	r.HandleFunc("/enee", handler).Methods("GET")
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
	protectedRoutes.HandleFunc("/assets/{assetId}/attributes", SetAssetAttributes).Methods("POST")
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
func getEnergyRateENEE() (string, error) {
	c := colly.NewCollector()

	var energyPrice string

	c.OnHTML("table", func(e *colly.HTMLElement) {
		e.ForEach("tr", func(_ int, row *colly.HTMLElement) {
			if row.Text == "" {
				return
			}
			// fmt.Println(row.Text)
			if strings.Contains(row.Text, "Servicio General en Baja Tensión") {
				energyPrice = row.ChildText("td:nth-of-type(4)")
				fmt.Println(energyPrice)
			}
		})
	})

	err := c.Visit("https://www.cree.gob.hn/tarifas-vigentes-enee/")
	if err != nil {
		return "", err
	}

	if energyPrice == "" {
		return "", err
	}

	return energyPrice, nil
}

func handler(w http.ResponseWriter, r *http.Request) {
	energyPrice, err := getEnergyRateENEE()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	parseEnergyPrice, err := strconv.ParseFloat(energyPrice, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, map[string]float64{"energyPrice": parseEnergyPrice})
}
