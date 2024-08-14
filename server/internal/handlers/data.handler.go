package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"server/internal/models"
	"server/internal/services"
)

func ExportDataFormat(w http.ResponseWriter, r *http.Request) {
	var data models.DataDTO
	_ = json.NewDecoder(r.Body).Decode(&data)
	token := r.Context().Value("token").(string)

	filename, err := services.HandleExportDataService(data, token)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return

	}
	defer os.Remove(filename)
	w.Header().Set("Content-Disposition", "attachment; filename="+filename)
	w.Header().Set("Content-Type", "application/octet-stream")
	//w.Header().Set("Content-Length", fmt.Sprintf("%d", len(filename)))

	http.ServeFile(w, r, filename)

	//utils.RespondWithJSON(w, http.StatusOK, services.ProcessDataService(data, token))

}
