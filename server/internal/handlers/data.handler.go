package handlers

import (
	"net/http"
	"os"
	"server/internal/models"
	"server/internal/services"
	"server/internal/utils"
)

func HandleDataExport(w http.ResponseWriter, r *http.Request) {
	var body models.DataDTO
	err := utils.ParseBody(r, &body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token := r.Context().Value("token").(string)
	exportedData, err := services.HandleDataService(body, token)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	filename, err := services.HandleFormatExportData(exportedData, body.Format)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer os.Remove(filename)
	// set header to download file
	w.Header().Set("Content-Disposition", "attachment; filename="+filename)
	w.Header().Set("Content-Description", "File Transfer")

	// octet-stream: binary file
	w.Header().Set("Content-Type", "application/octet-stream")

	// serve file
	http.ServeFile(w, r, filename)

}
