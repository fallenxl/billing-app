package models

type from struct {
	Id         string `json:"id"`
	EntityType string `json:"entityType"`
}

type to struct {
	Id         string `json:"id"`
	EntityType string `json:"entityType"`
}
type additionalInfo struct {
	Type string `json:"type"`
}

type RelationResponse struct {
	From          from           `json:"from"`
	To            to             `json:"to"`
	ToName        string         `json:"toName"`
	EntityType    string         `json:"entityType"`
	Id            string         `json:"id"`
	Label         string         `json:"label"`
	Type          string         `json:"type"`
	AdditionaInfo additionalInfo `json:"additionalInfo"`
}

type RelationsExport struct {
	Name       string            `json:"name"`
	Type       string            `json:"type"`
	Id         string            `json:"id"`
	EntityType string            `json:"entityType"`
	Relations  []RelationsExport `json:"relations"`
}
