package middleware

import (
	"context"
	"github.com/golang-jwt/jwt/v4"
	"net/http"
	"strings"
)

type Claims struct {
	jwt.RegisteredClaims
	UserId string `json:"userId"`
	Sub    string `json:"sub"`
}

// BearerTokenMiddleware es un middleware que verifica si la solicitud contiene un Bearer Token válido
func BearerTokenMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header is missing", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		token := parts[1]
		// Aquí puedes agregar lógica adicional para validar el token
		if !isValidToken(token) {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Agrega el token al contexto de la solicitud
		ctx := context.WithValue(r.Context(), "token", token)
		r = r.WithContext(ctx)
		// Llama al siguiente handler
		next.ServeHTTP(w, r)
	})
}

// isValidToken es una función de ayuda para validar el token
// Aquí puedes agregar la lógica de validación real
func isValidToken(token string) bool {
	// Por ahora, asumimos que cualquier token no vacío es válido
	return token != ""
}
