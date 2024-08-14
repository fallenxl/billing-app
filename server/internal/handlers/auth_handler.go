package handlers

import (
	"net/http"
	"server/internal/models"
	"server/internal/services"
	"server/internal/utils"
)

func Login(w http.ResponseWriter, r *http.Request) {
	var body models.AuthDTO
	err := utils.ParseBody(r, &body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	authResponse, err := services.LoginService(body.Username, body.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, authResponse)
}

func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	token := r.Context().Value("token").(string)
	user, err := services.GetCurrentUserService(token)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Server error")
		return
	}
	utils.RespondWithJSON(w, http.StatusOK, user)
}
