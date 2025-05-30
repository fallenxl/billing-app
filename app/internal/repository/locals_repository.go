package repository

import (
	"app/config"
	"app/internal/model"
)

type LocalsResponse struct {
	Data       []model.Local `json:"data"`
	Total      int64         `json:"total"`
	HasNext    bool          `json:"hasNext"`
	TotalPages int64         `json:"totalPages"`
}

func GetLocalsBySiteId(siteId string, pageSize int, pageNumber int, textSearch string) (LocalsResponse, error) {
	var locals []model.Local
	var totalElements int64

	query := config.DB.Table("locals").Where("site_id = ?", siteId)

	if textSearch != "" {
		query = query.Where("name LIKE ?", "%"+textSearch+"%")
	}

	// Obtener el total de elementos
	if err := query.Count(&totalElements).Error; err != nil {
		return LocalsResponse{}, err
	}

	// Paginación
	offset := (pageNumber - 1) * pageSize
	if err := query.Select("id, name, type, customer_id, site_id").
		Limit(pageSize).
		Offset(offset).
		Find(&locals).Error; err != nil {
		return LocalsResponse{}, err
	}

	return LocalsResponse{
		Data:       locals,
		Total:      totalElements,
		TotalPages: totalElements / int64(pageSize),
		HasNext:    totalElements > int64(pageSize*(pageNumber+1)),
	}, nil
}

func GetDevicesByLocalId(localId string, pageSize int, pageNumber int) ([]model.MeterExport, error) {
	var devices []model.Meter
	var exportDevices []model.MeterExport
	query := config.DB.Table("meters").Where("local_id = ?", localId)

	// Paginación
	offset := (pageNumber - 1) * pageSize
	if err := query.Select("id, entity_type, name, type, local_id").
		Limit(pageSize).
		Offset(offset).
		Find(&devices).Error; err != nil {
		return nil, err
	}
	for _, device := range devices {
		exportDevice := model.MeterExport{
			ID:          device.ID,
			EntityType:  device.EntityType,
			Name:        device.Name,
			Type:        device.Type,
			Description: device.Description,
			LocalID:     device.LocalID,
			Local:       device.Local,
			Telemetry:   nil, // Telemetry will be fetched later
		}
		exportDevices = append(exportDevices, exportDevice)
	}

	return exportDevices, nil
}

func GetTelemetryByMeterId(meterId string, startTs string, endTs string) ([]model.Telemetry, error) {
	var telemetry []model.Telemetry

	query := config.DB.Table("telemetries").Where("meter_id = ? AND date BETWEEN ? AND ?", meterId, startTs, endTs).Order("date ASC")

	if err := query.Find(&telemetry).Error; err != nil {
		return nil, err
	}

	return telemetry, nil
}
