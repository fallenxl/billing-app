package model

type Telemetry struct {
	Date         string  `json:"date" gorm:"primaryKey;type:date"`
	MeterID      string  `json:"meterId" gorm:"primaryKey"`
	FirstValue   float64 `json:"firstValue" gorm:"type:decimal(10,2)"`
	FirstValueTs int64   `json:"firstValueTs"`
	LastValue    float64 `json:"lastValue" gorm:"type:decimal(10,2)"`
	LastValueTs  int64   `json:"lastValueTs"`
	Consumption  float64 `json:"consumption" gorm:"type:decimal(10,2)"`
	UpdatedAt    string  `json:"updatedAt"`
	LocalID      string  `json:"localId" gorm:"not null"`
	Local        Local   `json:"-" gorm:"foreignKey:LocalID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
