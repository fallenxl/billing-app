package config

import (
	"app/internal/model"
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
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

	if err := createDatabaseIfNotExists(host, user, password, dbname, port); err != nil {
		log.Fatalf("Error al crear la base de datos: %v", err)
	}
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

func createDatabaseIfNotExists(host, user, password, dbname, port string) error {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=postgres port=%s sslmode=disable", host, user, password, port)
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return err
	}
	defer db.Close()

	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1)", dbname).Scan(&exists)
	if err != nil {
		return err
	}
	if !exists {
		_, err = db.Exec("CREATE DATABASE " + dbname)
		if err != nil {
			return err
		}
	}
	return nil
}

func loadSQLFromFile(path string) (string, error) {
	bytes, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}
