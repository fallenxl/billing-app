package model

import "time"

type ExportData struct {
	LocalsSelected []LocalsSelected `json:"localsSelected"`
	Customer       Customer         `json:"customer"`
	Site           Site             `json:"site"`
	Format         string           `json:"format"` // validate: "pdf", "excel", "support"
	StartDate      time.Time        `json:"startDate"`
	EndDate        time.Time        `json:"endDate"`
	Settings       Settings         `json:"settings"`
}

type Settings struct {
	Tariff        Tariff    `json:"tariff"`
	GlobalCharges []Charges `json:"globalCharges"`
	Currency      string    `json:"currency"`
}
