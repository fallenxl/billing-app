package config

import (
	"app/internal/model"
	"fmt"
	"log"
	"net/url"
	"os"
	"strings"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	host := AppConfig.Datasource.Host
	user := AppConfig.Datasource.User
	password := AppConfig.Datasource.Password
	dbname := AppConfig.Datasource.DBName
	port := AppConfig.Datasource.Port
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=America/Tegucigalpa",
		host,
		user,
		password,
		dbname,
		port,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("No se pudo conectar a la base de datos: %v", err)
	}

	db.AutoMigrate(&model.Site{})
	db.AutoMigrate(&model.Local{})
	db.AutoMigrate(&model.Meter{})
	db.AutoMigrate(&model.Telemetry{})
	db.AutoMigrate(&model.SyncLogs{})

	sitesProcedures, err := loadSQLFromFile("db/procedures.sql")
	if err != nil {
		log.Fatalf("Error al cargar el archivo de procedimientos: %v", err)
	}

	if err := db.Exec(sitesProcedures).Error; err != nil {
		log.Fatalf("Error al ejecutar el procedimiento: %v", err)
	}
	DB = db

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

func loadSQLFromFile(path string) (string, error) {
	bytes, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}
