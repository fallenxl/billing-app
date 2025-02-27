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

type AssetRelationDb struct {
	FromID         string  `gorm:"type:varchar(255);not null;primary_key" json:"from_id"`
	FromEntityType string  `gorm:"type:varchar(255);not null" json:"from_entity_type"`
	ToID           string  `gorm:"type:varchar(255);not null;primary_key" json:"to_id"`
	ToEntityType   string  `gorm:"type:varchar(255);not null" json:"to_entity_type"`
	ToName         string  `gorm:"type:varchar(255);not null" json:"to_name"`
	EntityType     string  `gorm:"type:varchar(255);not null" json:"entity_type"`
	Type           string  `gorm:"type:varchar(255);not null" json:"type"`
	Id             string  `gorm:"type:varchar(255);not null" json:"id"`
	Label          string  `gorm:"type:varchar(255);not null" json:"label"`
	Address        string  `gorm:"type:varchar(255);not null" json:"address"`
	Phone          string  `gorm:"type:varchar(255);not null" json:"phone"`
	Email          string  `gorm:"type:varchar(255);not null" json:"email"`
	BuildingOwner  string  `gorm:"type:varchar(255);not null" json:"building_owner"`
	Latitude       float64 `gorm:"type:float;not null" json:"latitude"`
	Longitude      float64 `gorm:"type:float;not null" json:"longitude"`
}

func (AssetRelationDb) TableName() string {
	return "asset_relations"
}
