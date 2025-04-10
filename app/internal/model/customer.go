package model

type Customer struct {
	ID               EntityRef      `json:"id"`
	CreatedTime      int64          `json:"createdTime"`
	Country          *string        `json:"country"`
	State            *string        `json:"state"`
	City             *string        `json:"city"`
	Address          *string        `json:"address"`
	Address2         *string        `json:"address2"`
	Zip              *string        `json:"zip"`
	Phone            *string        `json:"phone"`
	Email            *string        `json:"email"`
	Title            string         `json:"title"`
	TenantID         EntityRef      `json:"tenantId"`
	ParentCustomerID *EntityRef     `json:"parentCustomerId"`
	ExternalID       *EntityRef     `json:"externalId"`
	Version          int            `json:"version"`
	CustomMenuID     *string        `json:"customMenuId"`
	Name             string         `json:"name"`
	CustomerID       *EntityRef     `json:"customerId"`
	OwnerID          EntityRef      `json:"ownerId"`
	AdditionalInfo   AdditionalInfo `json:"additionalInfo"`
	Img              *string        `json:"img,omitempty"` // si le asignás una imagen luego
}

type EntityRef struct {
	EntityType string `json:"entityType"`
	ID         string `json:"id"`
}

type AdditionalInfo struct {
	Description              string  `json:"description"`
	AllowWhiteLabeling       bool    `json:"allowWhiteLabeling"`
	HomeDashboardID          *string `json:"homeDashboardId"`
	HomeDashboardHideToolbar bool    `json:"homeDashboardHideToolbar"`
}
