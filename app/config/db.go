package config

import (
	"fmt"
	"log"
	"net/url"
	"strings"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	host, user, password, dbname, port := parseDatabaseURI(AppConfig.Datasource.URI)
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=America/Tegucigalpa",
		host,
		user,
		password,
		dbname,
		port,
	)
	fmt.Println("Conectando a la base de datos...", dsn)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("No se pudo conectar a la base de datos: %v", err)
	}

	DB = db
	log.Println("Base de datos conectada exitosamente")
}

func parseDatabaseURI(uri string) (string, string, string, string, string) {
	uri = strings.TrimPrefix(uri, "jdbc:")

	u, err := url.Parse(uri)
	if err != nil {
		fmt.Println("Error parsing URI:", err)
		return "", "", "", "", ""
	}

	// Extraer el host y puerto
	host := "localhost"
	port := u.Port()

	// Extraer el nombre de la base de datos del path
	dbname := strings.TrimPrefix(u.Path, "/")

	// Extraer user y password de los parámetros
	query := u.Query()
	user := query.Get("user")
	password := query.Get("password")

	return host, user, password, dbname, port
}
