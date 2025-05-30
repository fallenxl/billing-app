package config

import (
	"log"
	"os"

	"github.com/spf13/viper"
)

var AppConfig *Config

type Config struct {
	FileService struct {
		URI string `mapstructure:"FILE_SERVICE_URI"`
	} `mapstructure:",squash"`
	App struct {
		Port      string `mapstructure:"PORT"`
		MaxSites  string `mapstructure:"MAX_SITES"`
		MaxLocals string `mapstructure:"MAX_LOCALS"`
	} `mapstructure:",squash"`
	TB struct {
		URI            string `mapstructure:"TB_URI"`
		BillingGroupId string `mapstructure:"TB_BILLING_ID"`
		Username       string `mapstructure:"TB_USERNAME"`
		Password       string `mapstructure:"TB_PASSWORD"`
	} `mapstructure:",squash"`
	Datasource struct {
		URI      string `mapstructure:"DATASOURCE_URI"`
		DBName   string `mapstructure:"DB_NAME"`
		Host     string `mapstructure:"DB_HOST"`
		User     string `mapstructure:"DB_USER"`
		Password string `mapstructure:"DB_PASSWORD"`
		Port     string `mapstructure:"DB_PORT"`
	} `mapstructure:",squash"`
}

func LoadConfig() {
	viper.SetDefault("PORT", "4001")
	viper.SetDefault("MAX_SITES", 1000)
	viper.SetDefault("MAX_LOCALS", 1000)
	viper.SetDefault("TB_URI", os.Getenv("TB_URI"))
	viper.SetDefault("TB_USERNAME", os.Getenv("TB_USERNAME"))
	viper.SetDefault("TB_PASSWORD", os.Getenv("TB_PASSWORD"))
	viper.SetDefault("TB_BILLING_ID", os.Getenv("TB_BILLING_ID"))
	viper.SetDefault("DATASOURCE_URI", os.Getenv("DATASOURCE_URI"))
	viper.SetDefault("DB_NAME", os.Getenv("DB_NAME"))
	viper.SetDefault("DB_HOST", os.Getenv("DB_HOST"))
	viper.SetDefault("DB_USER", os.Getenv("DB_USER"))
	viper.SetDefault("DB_PASSWORD", os.Getenv("DB_PASSWORD"))
	viper.SetDefault("DB_PORT", os.Getenv("DB_PORT"))
	viper.SetDefault("FILE_SERVICE_URI", "http://localhost:5000/api/v1/files")
	viper.SetDefault("TB_URI", "http://localhost:8080/api")
	viper.SetConfigFile(".env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv() // Read environment variables that match the config keys
	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Error reading config file, %s", err)
	}

	AppConfig = &Config{}
	if err := viper.Unmarshal(&AppConfig); err != nil {
		log.Fatalf("Error unmarshalling config, %s", err)
	}
}
