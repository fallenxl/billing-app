package model

type LocalTB struct {
	ID            EntityRef  `json:"id"`
	CustomerID    EntityRef  `json:"customerId"`
	Name          string     `json:"name"`
	Type          string     `json:"type"`
	Label         string     `json:"label"`
	BuildingOwner *string    `json:"buidingOwner"`
	Email         *string    `json:"email"`
	Phone         *string    `json:"phone"`
	Address       *string    `json:"address"`
	Charges       *[]Charges `json:"charges"`
	// CreatedTime    int64          `json:"createdTime"`
	// TenantID       EntityRef      `json:"tenantId"`
	// AssetProfileID EntityRef      `json:"assetProfileId"`
	// ExternalID     *EntityRef     `json:"externalId"`
	// Version        int            `json:"version"`
	// OwnerID        EntityRef      `json:"ownerId"`
	// AdditionalInfo AdditionalInfo `json:"additionalInfo"`

}

type Local struct {
	ID            string     `json:"id" gorm:"primaryKey"`
	CustomerID    string     `json:"customerId" gorm:"index; not null"`
	Name          string     `json:"name" gorm:"index; not null"`
	Type          string     `json:"type" gorm:"not null"`
	Label         *string    `json:"label"`
	BuildingOwner *string    `json:"buidingOwner"`
	Email         *string    `json:"email"`
	Phone         *string    `json:"phone"`
	Address       *string    `json:"address"`
	Charges       *[]Charges `json:"charges" gorm:"type:json"`
	SiteID        string     `gorm:"not null"`
	// donts show siteId in json, because it is not needed in the response
	Site Site `json:"-" gorm:"foreignKey:SiteID; references:ID; constraint:OnDelete:CASCADE"`
}

type LocalsSelected struct {
	ID            string         `json:"id" gorm:"primaryKey"`
	CustomerID    string         `json:"customerId" gorm:"index; not null"`
	Name          string         `json:"name" gorm:"index; not null"`
	Type          string         `json:"type" gorm:"not null"`
	Label         *string        `json:"label"`
	BuildingOwner *string        `json:"buidingOwner"`
	Email         *string        `json:"email"`
	Phone         *string        `json:"phone"`
	Address       *string        `json:"address"`
	Charges       *[]Charges     `json:"charges" gorm:"type:json"`
	SiteID        string         `gorm:"not null"`
	Devices       *[]MeterExport `json:"devices"`
}

type Charges struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Amount      float64 `json:"amount"`
	Type        string  `json:"type"` // "fixed" or "variable"
	Unit        string  `json:"unit"` // "hour" or "day"
}

type LocalGroup struct {
	Data          []LocalTB `json:"data"`
	TotalPages    int       `json:"totalPages"`
	TotalElements int       `json:"totalElements"`
	HasNext       bool      `json:"hasNext"`
}
