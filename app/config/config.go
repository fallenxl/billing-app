package config

import (
	"log"

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
		URI string `mapstructure:"DATASOURCE_URI"`
	} `mapstructure:",squash"`
}

func LoadConfig() {
	viper.SetDefault("PORT", "4001")
	viper.SetDefault("MAX_SITES", 1000)
	viper.SetDefault("MAX_LOCALS", 1000)
	viper.SetDefault("FILE_SERVICE_URI", "http://localhost:5000/api/v1/files")
	viper.SetDefault("TB_URI", "http://localhost:8080/api")
	viper.SetConfigFile(".env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()
	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Error reading config file, %s", err)
	}

	AppConfig = &Config{}
	if err := viper.Unmarshal(&AppConfig); err != nil {
		log.Fatalf("Error unmarshalling config, %s", err)
	}
}
