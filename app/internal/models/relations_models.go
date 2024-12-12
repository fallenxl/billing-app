package models

type from struct {
	Id         string `json:"id"`
	EntityType string `json:"entityType"`
}

type to struct {
	Id         string `json:"id"`
	EntityType string `json:"entityType"`
}

type NameUpdate struct {
	Id         from   `json:"id"`
	CustomerId to     `json:"customerId"`
	Name       string `json:"name"`
	Label      string `json:"label"`
}
type settings struct {
	Currency  *string                 `json:"currency"`
	Rate      *map[string]interface{} `json:"rate"`
	RateType  *string                 `json:"rateType"`
	Units     *map[string]interface{} `json:"units"`
	Templates *map[string]interface{} `json:"templates"`
}
type AssetRelationResponse struct {
	From          from                    `json:"from"`
	To            to                      `json:"to"`
	ToName        string                  `json:"toName"`
	EntityType    string                  `json:"entityType"`
	Type          string                  `json:"type"`
	Id            string                  `json:"id"`
	Label         *string                 `json:"label"`
	Address       *string                 `json:"address"`
	Phone         *string                 `json:"phone"`
	Email         *string                 `json:"email"`
	BuildingOwner *string                 `json:"buildingOwner"`
	Latitude      *float64                `json:"latitude"`
	Longitude     *float64                `json:"longitude"`
	Meters        []AssetRelationResponse `json:"meters"`
}

type CustomerRelationResponse struct {
	From       from     `json:"from"`
	Address    *string  `json:"address"`
	Phone      *string  `json:"phone"`
	Email      *string  `json:"email"`
	To         to       `json:"to"`
	ToName     string   `json:"toName"`
	EntityType string   `json:"entityType"`
	Id         string   `json:"id"`
	Label      *string  `json:"label"`
	Type       string   `json:"type"`
	Settings   settings `json:"settings"`
}
