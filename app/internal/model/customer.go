package model

type Customer struct {
	ID         EntityRef  `json:"id"`
	Title      string     `json:"title"`
	Name       string     `json:"name"`
	CustomerID *EntityRef `json:"customerId"`
	Img        *string    `json:"img,omitempty"`        // si le asignás una imagen luego
	SitesGroup *string    `json:"sitesGroup,omitempty"` // si le asignás un grupo de sitios luego
	// CreatedTime      int64          `json:"createdTime"`
	// Country          *string        `json:"country"`
	// State            *string        `json:"state"`
	// City             *string        `json:"city"`
	// Address          *string        `json:"address"`
	// Address2         *string        `json:"address2"`
	// Zip              *string        `json:"zip"`
	// Phone            *string        `json:"phone"`
	// Email            *string        `json:"email"`
	// TenantID         EntityRef      `json:"tenantId"`
	// ParentCustomerID *EntityRef     `json:"parentCustomerId"`
	// ExternalID       *EntityRef     `json:"externalId"`
	// Version          int            `json:"version"`
	// CustomMenuID     *string        `json:"customMenuId"`
	// OwnerID          EntityRef      `json:"ownerId"`
	// AdditionalInfo   AdditionalInfo `json:"additionalInfo"`
}
