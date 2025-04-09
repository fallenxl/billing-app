package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

func SendRequest(method, url string, headers map[string]string, body interface{}, response interface{}) (*http.Response, error) {
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	// Crear el cuerpo de la solicitud dependiendo de si el body es nil o no
	var requestBody []byte
	var err error

	if body != nil {
		switch v := body.(type) {
		case string:
			// Si el body es un string, lo dejamos tal cual
			requestBody = []byte(v)
		default:
			// Si el body no es un string, lo convertimos a JSON
			requestBody, err = json.Marshal(body)
			if err != nil {
				return nil, fmt.Errorf("error al convertir el body a JSON: %v", err)
			}
		}
	}

	// Crear la solicitud HTTP
	req, err := http.NewRequest(method, url, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, fmt.Errorf("error creando la solicitud: %v", err)
	}

	// Configurar los headers
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	// Enviar la solicitud
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error al enviar la solicitud: %v", err)
	}

	// Leer el cuerpo de la respuesta
	defer resp.Body.Close()
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error leyendo el cuerpo de la respuesta: %v", err)
	}

	// Decodificar la respuesta JSON en la interfaz proporcionada
	if err := json.Unmarshal(bodyBytes, response); err != nil {
		return nil, fmt.Errorf("error al decodificar la respuesta: %v", err)
	}

	return resp, nil
}

// DefaultHeader es una función para obtener los headers por defecto para las solicitudes HTTP.
func DefaultHeaderToken(token string) map[string]string {
	return map[string]string{
		"Authorization": "Bearer " + token,
		"Content-Type":  "application/json",
	}
}
