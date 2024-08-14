package models

type AssetAttributes struct {
	Key          string      `json:"key"`
	Value        interface{} `json:"value"`
	LastUpdateTs int         `json:"lastUpdateTs"`
}

type RateInfo struct {
	Unit string      `json:"unit"`
	Rate interface{} `json:"rate"`
}
type Rate struct {
	Water    RateInfo `json:"water"`
	Energy   RateInfo `json:"energy"`
	HotWater RateInfo `json:"hotWater"`
	Air      RateInfo `json:"air"`
	Gas      RateInfo `json:"gas"`
}
type Asset struct {
	Id struct {
		Id         string `json:"id"`
		EntityType string `json:"entityType"`
	} `json:"id"`
	Name           string                  `json:"name"`
	Label          string                  `json:"label"`
	Img            *interface{}            `json:"img"`
	Rate           *map[string]interface{} `json:"rate"`
	Currency       *interface{}            `json:"currency"`
	AssetProfileId struct {
		Id         string `json:"id"`
		EntityType string `json:"entityType"`
	} `json:"assetProfileId"`
}
type AssetGroup struct {
	Data []Asset `json:"data"`
}
