package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"time"
)

// Request realiza una solicitud HTTP y devuelve el cuerpo de la respuesta y cualquier error encontrado
func Request(url string, method string, body string, token string) ([]byte, error) {
	// Crear un cliente HTTP con un timeout
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	// Crear una solicitud HTTP
	req, err := http.NewRequest(method, url, bytes.NewBuffer([]byte(body)))
	if err != nil {
		return nil, err
	}

	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	// Establecer los encabezados necesarios
	req.Header.Set("Content-Type", "application/json")

	// Enviar la solicitud HTTP
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Leer el cuerpo de la respuesta
	responseBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// Comprobar el estado de la respuesta
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return responseBody, fmt.Errorf("HTTP request failed with status %d: %s", resp.StatusCode, responseBody)
	}
	return responseBody, nil
}

func ParseResponse(response []byte, v interface{}) error {
	err := json.Unmarshal(response, &v)
	if err != nil {
		return err
	}
	return nil
}

func ParseBody(r *http.Request, v interface{}) error {
	err := json.NewDecoder(r.Body).Decode(&v)
	if err != nil {
		return err
	}
	return nil
}

func RespondWithError(w http.ResponseWriter, statusCode int, message string) {
	RespondWithJSON(w, statusCode, map[string]string{"error": message})

}

func RespondWithJSON(w http.ResponseWriter, statusCode int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(response)
}

// downloadImage descarga una imagen desde una URL y la guarda en un archivo
func DownloadImage(url, filepath string) error {
	// Realizar la solicitud HTTP para obtener la imagen
	resp, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("error fetching image: %v", err)
	}
	defer resp.Body.Close()

	// Crear el archivo donde se guardará la imagen
	file, err := os.Create(filepath)
	if err != nil {
		return fmt.Errorf("error creating file: %v", err)
	}
	defer file.Close()

	// Copiar el contenido de la respuesta HTTP al archivo
	_, err = io.Copy(file, resp.Body)
	if err != nil {
		return fmt.Errorf("error saving image: %v", err)
	}

	return nil
}

func GetCurrencySymbol(currency string) string {
	switch currency {
	case "USD":
		return "$"
	case "MXN":
		return "$"
	case "EUR":
		return "€"
	case "LPS":
		return "L"
	default:
		return ""
	}
}

func ParseDate(date int64) string {
	return time.UnixMilli(date).Format("02/01/2006")
}
