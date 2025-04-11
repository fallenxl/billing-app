package model

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

// Relations models
type EntityId struct {
	EntityType string `json:"entityType"`
	ID         string `json:"id"`
}

type Relation struct {
	From           EntityId    `json:"from"`
	To             EntityId    `json:"to"`
	Type           string      `json:"type"`
	TypeGroup      string      `json:"typeGroup"`
	Version        int64       `json:"version"`
	FromName       *string     `json:"fromName"`       // puede ser null
	ToName         *string     `json:"toName"`         // puede ser null
	AdditionalInfo interface{} `json:"additionalInfo"` // puede ser null o cualquier objeto
}

type RelationResponse []Relation
