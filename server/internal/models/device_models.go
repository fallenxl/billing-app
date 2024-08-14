package models

type id struct {
	Id         string `json:"id"`
	EntityType string `json:"entityType"`
}

type Device struct {
	Id    id     `json:"id"`
	Name  string `json:"name"`
	Type  string `json:"type"`
	Label string `json:"label"`
}

type Data struct {
	Value string `json:"value"`
	Ts    int64  `json:"ts"`
}
type Telemetry struct {
	Data map[string][]Data `json:"data"`
}
