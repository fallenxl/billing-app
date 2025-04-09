package config

import (
	"log"

	"github.com/spf13/viper"
)

var AppConfig *Config

type Config struct {
	App struct {
		Port string `mapstructure:"PORT"`
	} `mapstructure:",squash"`
	TB struct {
		URI string `mapstructure:"TB_URI"`
	} `mapstructure:",squash"`
}

func LoadConfig() {
	viper.SetConfigFile("../../.env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file, %s", err)
	}

	AppConfig = &Config{}
	if err := viper.Unmarshal(&AppConfig); err != nil {
		log.Fatalf("Error unmarshalling config, %s", err)
	}
}
