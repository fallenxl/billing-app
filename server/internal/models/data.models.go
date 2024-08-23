package models

type DataDTO struct {
	Format          string                  `json:"format"`
	Customer        string                  `json:"customer"`
	Branch          string                  `json:"branch"`
	Img             string                  `json:"img"`
	StartDateTs     int64                   `json:"startDateTs"`
	EndDateTs       int64                   `json:"endDateTs"`
	Rate            map[string]interface{}  `json:"rate"`
	Units           map[string]interface{}  `json:"units"`
	Currency        string                  `json:"currency"`
	SelectedDevices []AssetRelationResponse `json:"selectedDevices"`
}

type ParseTelemetry struct {
	PreviousMonth float64 `json:"previousMonth"`
	CurrentMonth  float64 `json:"currentMonth"`
	TotalConsumed float64 `json:"totalConsumed"`
	TotalToPay    float64 `json:"totalToPay"`
}

type ExportedData struct {
	Img         string                 `json:"img"`
	Customer    string                 `json:"customer"` // Cliente
	Branch      string                 `json:"branch"`   // Sucursal
	Rate        map[string]interface{} `json:"rate"`
	Units       map[string]interface{} `json:"units"`
	Currency    string                 `json:"currency"` // Moneda
	StartDateTs int64                  `json:"startDate"`
	EndDateTs   int64                  `json:"endDate"`
	Relations   []DeviceData           `json:"relations"`
}

type DeviceData struct {
	Id            string             `json:"id"`
	EntityType    string             `json:"entityType"`
	Name          string             `json:"name"`  // Nombre
	Label         string             `json:"label"` // Etiqueta
	Type          string             `json:"type"`
	Relations     *[]DeviceData      `json:"relations"`     // Relaciones
	Telemetry     *map[string][]Data `json:"telemetry"`     // Telemetria
	PreviousMonth *float64           `json:"previousMonth"` // Mes Anterior
	CurrentMonth  *float64           `json:"currentMonth"`  // Mes Actual
	TotalConsumed *float64           `json:"totalConsumed"` // Total Consumido
	TotalToPay    *float64           `json:"totalToPay"`    // Total a Pagar
}
