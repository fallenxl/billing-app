package models

type DataDTO struct {
	Format          string                 `json:"format"`
	Customer        string                 `json:"customer"`
	Branch          string                 `json:"branch"`
	Img             string                 `json:"img"`
	StartDateTs     int64                  `json:"startDateTs"`
	EndDateTs       int64                  `json:"endDateTs"`
	Rate            map[string]interface{} `json:"rate"`
	Currency        string                 `json:"currency"`
	SelectedDevices []RelationResponse     `json:"selectedDevices"`
}

type ParseTelemetry struct {
	PreviousMonth string  `json:"previousMonth"`
	CurrentMonth  string  `json:"currentMonth"`
	TotalConsumed float64 `json:"totalConsumed"`
	TotalToPay    float64 `json:"totalToPay"`
}

type ExportedData struct {
	Img         string                 `json:"img"`
	Customer    string                 `json:"customer"` // Cliente
	Branch      string                 `json:"branch"`   // Sucursal
	Site        string                 `json:"site"`     // Sitio
	Rate        map[string]interface{} `json:"rate"`
	Currency    string                 `json:"currency"` // Moneda
	EntityType  string                 `json:"entityType"`
	StartDateTs int64                  `json:"startDate"`
	EndDateTs   int64                  `json:"endDate"`
	Relations   TypeDevice             `json:"relations"`  //If EntityType is ASSET, then Relations will be a list of devices, IF EntityType is DEVICE, then Relations will be empty
	DeviceData  *DeviceData            `json:"deviceData"` //If EntityType is DEVICE, then DeviceData will be the device data , IF EntityType is ASSET, then DeviceData will be empty
}
type TypeDevice struct {
	WaterMeter    []DeviceData `json:"waterMeter"`
	EnergyMeter   []DeviceData `json:"energyMeter"`
	GasMeter      []DeviceData `json:"gasMeter"`
	HotWaterMeter []DeviceData `json:"hotWaterMeter"`
	AirMeter      []DeviceData `json:"airMeter"`
}
type DeviceData struct {
	Name          string            `json:"name"`          // Nombre
	Label         string            `json:"label"`         // Etiqueta
	Type          string            `json:"type"`          // Tipo
	Telemetry     map[string][]Data `json:"telemetry"`     // Telemetria
	PreviousMonth string            `json:"previousMonth"` // Mes Anterior
	CurrentMonth  string            `json:"currentMonth"`  // Mes Actual
	TotalConsumed float64           `json:"totalConsumed"` // Total Consumido
	TotalToPay    float64           `json:"totalToPay"`    // Total a Pagar
}
