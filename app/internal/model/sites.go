package model

type SiteTB struct {
	ID          EntityRef `json:"id" gorm:"primaryKey"`
	CustomerID  EntityRef `json:"customerId"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	Label       string    `json:"label"`
	LocalsGroup *string   `json:"localsGroup"`
}

type FormatTemplate struct {
	Name       string `json:"name"`
	Format     string `json:"format"`
	FormatType string `json:"formatType"`
}
type Tariff struct {
	EnergyRate float64 `json:"energyRate"`
	WaterRate  float64 `json:"waterRate"`
}
type Site struct {
	ID            string            `json:"id" gorm:"primaryKey;not null"`
	CustomerID    string            `json:"customerId" gorm:"index;not null"`
	Name          string            `json:"name" gorm:"type:varchar(255);index;not null"`
	Type          string            `json:"type" gorm:"type:varchar(255);not null"`
	Label         *string           `json:"label" gorm:"type:varchar(50);null"`
	LocalsGroup   *string           `json:"localsGroup" gorm:"type:varchar(255);null"`
	Email         *string           `json:"email" gorm:"type:varchar(255);null"`
	Phone         *string           `json:"phone" gorm:"type:varchar(255);null"`
	Address       *string           `json:"address" gorm:"type:varchar(255);null"`
	Website       *string           `json:"website" gorm:"type:varchar(255);null"`
	SupportInfo   *string           `json:"supportInfo" gorm:"type:varchar(255);null"`
	PaymentInfo   *string           `json:"paymentInfo" gorm:"type:varchar(255);null"`
	GlobalCharges *[]Charges        `json:"globalCharges" gorm:"type:json"`
	Templates     *[]FormatTemplate `json:"templates" gorm:"type:json"`
	Currency      *string           `json:"currency" gorm:"type:varchar(10);null"`
	Tariff        *Tariff           `json:"tariff" gorm:"type:json"`
}

type SiteGroup struct {
	Data          []SiteTB `json:"data"`
	TotalPages    int      `json:"totalPages"`
	TotalElements int      `json:"totalElements"`
	HasNext       bool     `json:"hasNext"`
}
