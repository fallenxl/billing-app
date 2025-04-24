package model

type Meter struct {
	ID          string  `json:"id" gorm:"primaryKey"`
	EntityType  string  `json:"entityType" gorm:"not null"`
	Name        string  `json:"name" gorm:"index; not null"`
	Type        string  `json:"type" gorm:"not null"`
	Description *string `json:"description"`
	LocalID     string  `gorm:"not null"`
	Local       Local   `json:"localId" gorm:"foreignKey:LocalID; references:ID; constraint:OnDelete:CASCADE"`
}
