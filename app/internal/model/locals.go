package model

type Local struct {
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

type Charges struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Amount      float64 `json:"amount"`
	Type        string  `json:"type"` // "fixed" or "variable"
	Unit        string  `json:"unit"` // "hour" or "day"
}

type LocalGroup struct {
	Data          []Local `json:"data"`
	TotalPages    int     `json:"totalPages"`
	TotalElements int     `json:"totalElements"`
	HasNext       bool    `json:"hasNext"`
}
