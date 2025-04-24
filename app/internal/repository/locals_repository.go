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
