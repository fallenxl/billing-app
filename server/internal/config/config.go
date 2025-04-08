package config

import (
	"log"

	"github.com/spf13/viper"
)

var AppConfig *Config

type Config struct {
	Thingsboard struct {
		Api string `mapstructure:"TB_URI"`
	} `mapstructure:",squash"`
	Datasource struct {
		URI string `mapstructure:"DATASOURCE_URI"`
	} `mapstructure:",squash"`
}

func LoadConfig() {
	viper.SetConfigFile("../../../.env")
	viper.AutomaticEnv()
	viper.AddConfigPath(".")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatal("Error reading config file, ", err)
	}

	AppConfig = &Config{}
	if err := viper.Unmarshal(AppConfig); err != nil {
		log.Fatal("Error unmarshalling config, ", err)
	}
}
