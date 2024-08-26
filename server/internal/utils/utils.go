package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"golang.org/x/text/encoding/charmap"
	"golang.org/x/text/transform"
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
		return "L."
	default:
		return ""
	}
}

func ParseDate(date int64) string {
	return time.UnixMilli(date).Format("02/01/2006")
}

func GetResolution(startDate int64, endDate int64) int64 {
	diff := endDate - startDate
	// if the difference is less than 1 day

	if diff <= 86400000 {
		return 3600000
	}
	// if the difference is less than 1 month, RESOLUTION_PER_day
	if diff <= 2764740000 {
		return 86400000
	}
	return 2592000000

}

func GetRateByDeviceType(deviceType string, rate map[string]interface{}) float64 {
	if strings.Contains(strings.ToLower(deviceType), "water meter") {
		return rate["water"].(float64)
	}
	if strings.Contains(strings.ToLower(deviceType), "energy meter") {
		return rate["energy"].(float64)
	}
	if strings.Contains(strings.ToLower(deviceType), "hot water meter") {
		return rate["hotWater"].(float64)
	}
	if strings.Contains(strings.ToLower(deviceType), "air meter") {
		return rate["air"].(float64)
	}
	if strings.Contains(strings.ToLower(deviceType), "gas meter") {
		return rate["gas"].(float64)
	}
	return 0
}

func GetUnitByDeviceType(deviceType string, units map[string]interface{}) string {
	if strings.Contains(strings.ToLower(deviceType), "water meter") {
		return units["water"].(string)
	}
	if strings.Contains(strings.ToLower(deviceType), "energy meter") {
		return units["energy"].(string)
	}
	if strings.Contains(strings.ToLower(deviceType), "hot water meter") {
		return units["hotWater"].(string)
	}
	if strings.Contains(strings.ToLower(deviceType), "air meter") {
		return units["air"].(string)
	}
	if strings.Contains(strings.ToLower(deviceType), "gas meter") {
		return units["gas"].(string)
	}
	return ""
}

func ParseUTF8(input string) string {
	reader := transform.NewReader(strings.NewReader(input), charmap.ISO8859_1.NewDecoder())
	utf8String, _ := ioutil.ReadAll(reader)
	return string(utf8String)
}

// parse number to pay format ex. 1000 -> 1,000.00 with comma and two decimals
func FormatNumber(num float64) string {
	// Formatea el número con dos decimales
	parts := strings.Split(fmt.Sprintf("%.2f", num), ".")

	// Parte entera con comas
	intPart := parts[0]
	decPart := parts[1]

	var formattedIntPart strings.Builder
	for i, digit := range intPart {
		if i > 0 && (len(intPart)-i)%3 == 0 {
			formattedIntPart.WriteString(",")
		}
		formattedIntPart.WriteRune(digit)
	}

	return formattedIntPart.String() + "." + decPart
}

func GenerateRandomNumber(start int, end int) int {
	return start + time.Now().Nanosecond()%(end-start)
}
