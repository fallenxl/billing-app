// middleware/auth.go
package middleware

import (
	"net/http"
	"strings"

	"app/pkg/utils"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
		return
	}
	// Validar formato Bearer
	splitToken := strings.Split(authHeader, " ")
	if len(splitToken) != 2 || strings.ToLower(splitToken[0]) != "bearer" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
		return
	}

	tokenString := splitToken[1]

	// Decodificar y validar token
	claims, err := utils.DecodeToken(tokenString)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	// Verificar si el token tiene el claim "sub"
	if claims.Sub == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token does not contain 'sub' claim"})
		return
	}

	// Verificar si el token no expiró
	if claims.Exp < utils.GetCurrentTimestamp() {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token has expired"})
		return
	}

	// Guardar claims en contexto si necesitas acceder después
	c.Set("claims", claims)
	c.Set("token", tokenString)

	// Continuar con la solicitud
	c.Next()

}
