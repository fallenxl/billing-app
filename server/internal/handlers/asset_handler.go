package handlers

import (
	"github.com/gorilla/mux"
	"net/http"
	"server/internal/services"
	"server/internal/utils"
)

func GetAssetsGroup(w http.ResponseWriter, r *http.Request) {
	//Get token from request
	token := r.Context().Value("token").(string)
	//Get assets by group id
	assets, err := services.GetAssetsByGroupIDService(token)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Server error")
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, assets)
}

func GetAssetById(w http.ResponseWriter, r *http.Request) {
	//Get token from request
	token := r.Context().Value("token").(string)
	//Get asset id from request
	assetId := mux.Vars(r)["assetId"]
	//Get asset by id
	asset, err := services.GetAssetByIdService(token, assetId)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Server error")
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, asset)
}

func GetCustomerById(w http.ResponseWriter, r *http.Request) {
	//Get token from request
	token := r.Context().Value("token").(string)
	//Get asset id from request
	customerId := mux.Vars(r)["customerId"]
	//Get asset by id
	customer, err := services.GetCustomerByIdService(token, customerId)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Server error")
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, customer)
}
