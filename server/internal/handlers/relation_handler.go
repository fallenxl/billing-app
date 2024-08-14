package handlers

import (
	"github.com/gorilla/mux"
	"net/http"
	"server/internal/services"
	"server/internal/utils"
)

func GetCustomerRelationById(w http.ResponseWriter, r *http.Request) {
	//Get token from request
	token := r.Context().Value("token").(string)
	//Get asset id from request
	customerId := mux.Vars(r)["customerId"]
	//Get asset by id
	customer, err := services.GetRelationsByID(customerId, "CUSTOMER", token)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Server error")
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, customer)
}

func GetAssetRelationById(w http.ResponseWriter, r *http.Request) {
	//Get token from request
	token := r.Context().Value("token").(string)
	//Get asset id from request
	assetId := mux.Vars(r)["assetId"]
	//Get asset by id
	customer, err := services.GetRelationsByID(assetId, "ASSET", token)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Server error")
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, customer)
}
