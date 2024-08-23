package models

type AssetAttributes struct {
	Key          string      `json:"key"`
	Value        interface{} `json:"value"`
	LastUpdateTs int         `json:"lastUpdateTs"`
}

type Rate struct {
	Water    *float64 `json:"water"`
	Energy   *float64 `json:"energy"`
	HotWater *float64 `json:"hotWater"`
	Air      *float64 `json:"air"`
	Gas      *float64 `json:"gas"`
}

type Settings struct {
	Currency *string          `json:"currency"`
	Rate     *map[string]Rate `json:"rate"`
	RateType *string          `json:"rateType"`
}
type Asset struct {
	Id struct {
		Id         string `json:"id"`
		EntityType string `json:"entityType"`
	} `json:"id"`
	Name     string    `json:"name"`
	Label    string    `json:"label"`
	Settings *Settings `json:"settings"`
}

type AssetGroup struct {
	Data []Asset `json:"data"`
}
