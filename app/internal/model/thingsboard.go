package model

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

// Customer models
type CustomerGroup struct {
	Data          []Customer `json:"data"`
	TotalPages    int        `json:"totalPages"`
	TotalElements int        `json:"totalElements"`
	HasNext       bool       `json:"hasNext"`
}

// Teleemtry models

type Attribute struct {
	Key          string      `json:"key"`
	Value        interface{} `json:"value"`
	LastUpdateTs int64       `json:"lastUpdateTs"`
}

type Relation struct {
	From           EntityRef   `json:"from"`
	To             EntityRef   `json:"to"`
	Type           string      `json:"type"`
	TypeGroup      string      `json:"typeGroup"`
	Version        int64       `json:"version"`
	FromName       string      `json:"fromName"`       // puede ser null
	ToName         string      `json:"toName"`         // puede ser null
	AdditionalInfo interface{} `json:"additionalInfo"` // puede ser null o cualquier objeto
}

type RelationResponse []Relation

type Group struct {
	ID   EntityRef `json:"id"`
	Name string    `json:"name"`
}

type AssetInfo struct {
	ID             EntityRef      `json:"id"`
	CreatedTime    int64          `json:"createdTime"`
	TenantID       EntityRef      `json:"tenantId"`
	CustomerID     EntityRef      `json:"customerId"`
	Name           string         `json:"name"`
	Type           string         `json:"type"`
	Label          string         `json:"label"`
	AssetProfileID EntityRef      `json:"assetProfileId"`
	Version        int64          `json:"version"`
	OwnerName      string         `json:"ownerName"`
	Groups         []Group        `json:"groups"`
	OwnerID        EntityRef      `json:"ownerId"`
	AdditionalInfo map[string]any `json:"additionalInfo"` // puedes usar map[string]interface{} también
}

type TelemetryValue struct {
	Ts    int64  `json:"ts"`
	Value string `json:"value"`
}
