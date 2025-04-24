package model

type Site struct {
	ID          EntityRef `json:"id"`
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

type SiteGroup struct {
	Data          []Site `json:"data"`
	TotalPages    int    `json:"totalPages"`
	TotalElements int    `json:"totalElements"`
	HasNext       bool   `json:"hasNext"`
}
