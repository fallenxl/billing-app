package cron

import (
	"app/internal/services/sync"
	"app/pkg/utils"

	"github.com/robfig/cron/v3"
)

// InitCronJobs inicializa y arranca los cron jobs
func InitCronJobs() {
	c := cron.New(cron.WithSeconds())

	// 12:00 AM
	_, err := c.AddFunc("0 0 0 * * *", func() {
		utils.PrintLog("Sincronizando datos de Thingsboard a la base de datos")
		sync.SyncAllTelemetry()
	})
	if err != nil {
		panic(err)
	}

	// 12:00 PM
	_, err = c.AddFunc("0 0 12 * * *", func() {
		utils.PrintLog("Sincronizando datos de Thingsboard a la base de datos")
		// Llama a otra función si es necesario
		sync.SyncAllTelemetry()
	})
	if err != nil {
		panic(err)
	}

	c.Start()
}
