package models

type from struct {
	Id         string `json:"id"`
	EntityType string `json:"entityType"`
}

type to struct {
	Id         string `json:"id"`
	EntityType string `json:"entityType"`
}
type settings struct {
	Currency *string                 `json:"currency"`
	Rate     *map[string]interface{} `json:"rate"`
	RateType *string                 `json:"rateType"`
	Units    *map[string]interface{} `json:"units"`
}
type AssetRelationResponse struct {
	From       from                    `json:"from"`
	To         to                      `json:"to"`
	ToName     string                  `json:"toName"`
	EntityType string                  `json:"entityType"`
	Id         string                  `json:"id"`
	Label      string                  `json:"label"`
	Type       string                  `json:"type"`
	Meters     []AssetRelationResponse `json:"meters"`
}

type CustomerRelationResponse struct {
	From       from     `json:"from"`
	To         to       `json:"to"`
	ToName     string   `json:"toName"`
	EntityType string   `json:"entityType"`
	Id         string   `json:"id"`
	Label      string   `json:"label"`
	Type       string   `json:"type"`
	Settings   settings `json:"settings"`
}
