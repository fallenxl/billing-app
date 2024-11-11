package handlers

import (
	"net/http"
	"os"
	"server/internal/models"
	"server/internal/services"
	"server/internal/utils"
	"strconv"
)

func HandleDataExport(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	// Parsear el cuerpo de la solicitud
	var body models.DataDTO
	err := utils.ParseBody(r, &body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Obtener el token y manejar la exportación de datos
	token := r.Context().Value("token").(string)
	// SendMessageToClient(token, "Datos exportados con éxito")
	exportedData, err := services.HandleDataService(body, token)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Llamar a la función que maneja la creación del archivo y envía mensajes de progreso por WebSocket
	filename, err := services.HandleFormatExportData(exportedData, body.Format)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer os.Remove(filename) // Asegúrate de eliminar el archivo al final

	// Ahora que el archivo está listo, proceder con la respuesta HTTP para la descarga
	w.Header().Set("Content-Disposition", "attachment; filename="+filename)
	w.Header().Set("Content-Description", "File Transfer")
	w.Header().Set("Content-Type", "application/octet-stream")

	// Servir el archivo
	http.ServeFile(w, r, filename)

}

func HandleEneeEnergyRate(w http.ResponseWriter, r *http.Request) {
	energyPrice, err := services.GetEnergyRateENEE()
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
