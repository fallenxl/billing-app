package handlers

import (
	"app/internal/model"
	"app/internal/services/thingsboard"

	"github.com/gin-gonic/gin"
)

func GetSiteInfoByIdHandler(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(400, gin.H{"error": "ID is required"})
		return
	}

	token, exists := c.Get("token")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	data, err := thingsboard.GetAssetInfoByIdService(id, token.(string))
	if err != nil {
		c.JSON(500, gin.H{"error": "Error sending request to API"})
		return
	}
	var siteInfo model.Relation

	siteInfo.To = model.EntityRef(data.ID)
	siteInfo.From = model.EntityRef(data.CustomerID)
	siteInfo.FromName = &data.CustomerID.ID
	siteInfo.ToName = &data.Name
	siteInfo.AdditionalInfo = data.AdditionalInfo
	siteInfo.Type = data.Type
	c.JSON(200, gin.H{"message": "Site data", "success": true, "data": siteInfo})

}

func GetLocalsBySiteIdHandler(c *gin.Context) {
	// get id from url
	id := c.Param("id")
	if id == "" {
		c.JSON(400, gin.H{"error": "ID is required"})
		return
	}
	token, exists := c.Get("token")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	data, err := thingsboard.GetFromRelationsService(id, "ASSET", token.(string))
	if err != nil {
		c.JSON(500, gin.H{"error": "Error sending request to API"})
		return
	}

	if len(data) == 0 {
		c.JSON(404, gin.H{"error": "No data found"})
		return
	}

	var locals []model.Local
	for _, item := range data {
		var local model.Local
		localAttributes, err := thingsboard.GetAttributesService(item.To.EntityType, item.To.ID, token.(string), []string{"label", "buidingOwner", "email", "phone", "address"})
		if err != nil {
			c.JSON(500, gin.H{"error": "Error sending request to API"})
			return
		}
		var label, buildingOwner, email, phone, address string
		thingsboard.FindAttributeByKey(localAttributes, "buidingOwner", &buildingOwner)
		thingsboard.FindAttributeByKey(localAttributes, "label", &label)
		thingsboard.FindAttributeByKey(localAttributes, "email", &email)
		thingsboard.FindAttributeByKey(localAttributes, "phone", &phone)
		thingsboard.FindAttributeByKey(localAttributes, "address", &address)

		var charges []model.Charges
		thingsboard.FindAttributeByKey(localAttributes, "charges", &charges)

		local.To = model.EntityRef(item.To)
		local.From = model.EntityRef(item.From)
		local.FromName = item.FromName
		local.ToName = item.ToName
		local.Label = &label
		local.BuildingOwner = &buildingOwner
		local.Email = &email
		local.Phone = &phone
		local.Address = &address
		local.Charges = &charges

		locals = append(locals, local)

	}

	c.JSON(200, gin.H{"message": "Locals data", "success": true, "data": locals})
}
