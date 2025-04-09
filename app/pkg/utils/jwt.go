package utils

import (
	"fmt"
	"log"

	"github.com/golang-jwt/jwt/v4"
)

type tokenClaims struct {
	Sub        string `json:"sub"`
	Id         string `json:"userId"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	CustomerId string `json:"customerId"`
	Enabled    bool   `json:"enabled"`
}

func DecodeToken(tokenString string) (*tokenClaims, error) {
	// Decodificar el token sin verificar la firma
	// Esto devuelve el encabezado y el cuerpo del token
	parsedToken, _, err := jwt.NewParser().ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		log.Fatalf("Error al decodificar el token: %v", err)
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("error al obtener los claims del token")
	}

	var tokenData tokenClaims
	if err := mapClaimsToTokenClaims(claims, &tokenData); err != nil {
		return nil, fmt.Errorf("error al convertir los claims a tokenClaims: %v", err)
	}

	return &tokenData, nil

}

func mapClaimsToTokenClaims(claims jwt.MapClaims, tokenData *tokenClaims) error {
	// Asignar los valores de los claims al objeto tokenClaims
	if sub, ok := claims["sub"].(string); ok {
		tokenData.Sub = sub
	}
	if id, ok := claims["userId"].(string); ok {
		tokenData.Id = id
	}
	if firstName, ok := claims["firstName"].(string); ok {
		tokenData.FirstName = firstName
	}
	if lastName, ok := claims["lastName"].(string); ok {
		tokenData.LastName = lastName
	}
	if customerId, ok := claims["customerId"].(string); ok {
		tokenData.CustomerId = customerId
	}
	if enabled, ok := claims["enabled"].(bool); ok {
		tokenData.Enabled = enabled
	}

	return nil
}
