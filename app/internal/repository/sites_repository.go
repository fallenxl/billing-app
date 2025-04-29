package repository

import (
	"app/config"
	"app/internal/model"
)

type SitesResponse struct {
	Data       []model.Site `json:"data"`
	Total      int64        `json:"total"`
	HasNext    bool         `json:"hasNext"`
	TotalPages int64        `json:"totalPages"`
}

func GetSiteInfoById(id string) (model.Site, error) {
	var site model.Site
	err := config.DB.Table("sites").Where("id = ?", id).First(&site).Error
	if err != nil {
		return model.Site{}, err
	}
	return site, nil
}

func GetSitesByCustomerId(customerId string, pageSize int, pageNumber int, textSearch string) (SitesResponse, error) {
	var sites []model.Site
	var totalElements int64

	query := config.DB.Table("sites").Where("customer_id = ?", customerId)

	if textSearch != "" {
		query = query.Where("name LIKE ?", "%"+textSearch+"%")
	}

	// Obtener el total de elementos
	if err := query.Count(&totalElements).Error; err != nil {
		return SitesResponse{}, err
	}

	// Paginación
	offset := (pageNumber - 1) * pageSize
	// all columns
	if err := query.Select("*").
		Limit(pageSize).
		Offset(offset).
		Find(&sites).Error; err != nil {
		return SitesResponse{}, err
	}

	return SitesResponse{
		Data:       sites,
		Total:      totalElements,
		TotalPages: totalElements / int64(pageSize),
		HasNext:    totalElements > int64(pageSize*(pageNumber+1)),
	}, nil
}

func UpdateSite(site model.SiteRequest) (model.Site, error) {
	data := config.DB.Table("sites").Where("id = ?", site.ID).Updates(site)
	if data.Error != nil {
		return model.Site{}, data.Error
	}
	if data.RowsAffected == 0 {
		return model.Site{}, nil
	}

	var updatedSite model.Site
	err := config.DB.Table("sites").Where("id = ?", site.ID).First(&updatedSite).Error
	if err != nil {
		return model.Site{}, err
	}
	return updatedSite, nil
}
