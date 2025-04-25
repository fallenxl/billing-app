package model

import "time"

type SyncLogs struct {
	ID        string    `gorm:"primaryKey; type:integer; autoIncrement; not null"`
	CreatedAt time.Time `json:"created_at"`
	SiteID    string    `json:"site_id" gorm:"not null"`
	Site      Site      `json:"site" gorm:"foreignKey:SiteID;references:ID"`
}
