package models

type Customer struct {
	Id struct {
		Id         string `json:"id"`
		EntityType string `json:"entityType"`
	} `json:"id"`
	Name           string  `json:"name"`
	Label          string  `json:"label"`
	Img            *string `json:"img"`
	AssetProfileId struct {
		Id         string `json:"id"`
		EntityType string `json:"entityType"`
	} `json:"assetProfileId"`
}

type CustomerGroup struct {
	Data []Customer `json:"data"`
}
