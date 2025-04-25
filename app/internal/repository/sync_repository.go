package repository

import (
	"app/internal/model"
	"time"

	"gorm.io/gorm"
)

func CreateSyncLog(db *gorm.DB, siteID string) error {
	syncLog := &model.SyncLogs{
		CreatedAt: time.Now(),
		SiteID:    siteID,
	}
	if err := db.Create(syncLog).Error; err != nil {
		return err
	}
	return nil
}
