package model

type SiteTB struct {
	ID          EntityRef `json:"id" gorm:"primaryKey"`
	CustomerID  EntityRef `json:"customerId"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	Label       string    `json:"label"`
	LocalsGroup *string   `json:"localsGroup"`
	// CreatedTime    int64          `json:"createdTime"`
	// TenantID       EntityRef      `json:"tenantId"`
	// AssetProfileID EntityRef      `json:"assetProfileId"`
	// ExternalID     *EntityRef     `json:"externalId"`
	// Version        int            `json:"version"`
	// OwnerID        EntityRef      `json:"ownerId"`
	// AdditionalInfo AdditionalInfo `json:"additionalInfo"`

}

type Site struct {
	ID          string  `json:"id" gorm:"primaryKey;not null"`
	CustomerID  string  `json:"customerId" gorm:"index;not null"`
	Name        string  `json:"name" gorm:"type:varchar(255);index;not null"`
	Type        string  `json:"type" gorm:"type:varchar(255);not null"`
	Label       *string `json:"label" gorm:"type:varchar(50);null"`
	LocalsGroup *string `json:"localsGroup" gorm:"type:varchar(255);null"`
}

type SiteGroup struct {
	Data          []SiteTB `json:"data"`
	TotalPages    int      `json:"totalPages"`
	TotalElements int      `json:"totalElements"`
	HasNext       bool     `json:"hasNext"`
}
