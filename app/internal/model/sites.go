package model

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type SiteTB struct {
	ID          EntityRef `json:"id" gorm:"primaryKey"`
	CustomerID  EntityRef `json:"customerId"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	Label       string    `json:"label"`
	LocalsGroup *string   `json:"localsGroup"`
}

type FormatTemplate struct {
	Name       string `json:"name"`
	Format     string `json:"format"`
	FormatType string `json:"formatType"`
}
type Tariff struct {
	EnergyRate Rate `json:"energyRate"`
	WaterRate  Rate `json:"waterRate"`
}

type Rate struct {
	Value string `json:"value"`
	Unit  string `json:"unit"`
}
type Site struct {
	ID            string            `json:"id" gorm:"primaryKey;not null"`
	CustomerID    string            `json:"customerId" gorm:"index;not null"`
	Name          string            `json:"name" gorm:"type:varchar(255);index;not null"`
	Type          string            `json:"type" gorm:"type:varchar(255);not null"`
	Label         *string           `json:"label" gorm:"type:varchar(50);null"`
	LocalsGroup   *string           `json:"localsGroup" gorm:"type:varchar(255);null"`
	Email         *string           `json:"email" gorm:"type:varchar(255);null"`
	Phone         *string           `json:"phone" gorm:"type:varchar(255);null"`
	Address       *string           `json:"address" gorm:"type:varchar(255);null"`
	Website       *string           `json:"website" gorm:"type:varchar(255);null"`
	SupportInfo   *string           `json:"supportInfo" gorm:"type:varchar(255);null"`
	PaymentInfo   *string           `json:"paymentInfo" gorm:"type:varchar(255);null"`
	GlobalCharges *[]Charges        `json:"globalCharges" gorm:"type:json;serializer:json"`
	Templates     *[]FormatTemplate `json:"templates" gorm:"type:json;serializer:json"`
	Currency      *string           `json:"currency" gorm:"type:varchar(10);null"`
	Tariff        *Tariff           `json:"tariff" gorm:"type:json;serializer:json"`
}

type SiteGroup struct {
	Data          []SiteTB `json:"data"`
	TotalPages    int      `json:"totalPages"`
	TotalElements int      `json:"totalElements"`
	HasNext       bool     `json:"hasNext"`
}

type SiteRequest struct {
	ID          string  `json:"id" bind:"required"`
	Type        string  `json:"type" bind:"optional"`
	Label       *string `json:"label" bind:"optional"`
	LocalsGroup *string `json:"localsGroup" bind:"optional"`
	Email       *string `json:"email" bind:"optional"`
	Phone       *string `json:"phone" bind:"optional"`
	Address     *string `json:"address" bind:"optional"`
	SupportInfo *string `json:"supportInfo" bind:"optional"`
	PaymentInfo *string `json:"paymentInfo" bind:"optional"`
	// GlobalCharges *[]Charges        `json:"globalCharges" bind:"optional"`
	// Templates     *[]FormatTemplate `json:"templates" bind:"optional"`
	Currency *string `json:"currency" bind:"optional"`
	Tariff   *Tariff `json:"tariff" bind:"optional"`
}

func (t Tariff) Value() (driver.Value, error) {
	return json.Marshal(t)
}

func (t *Tariff) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("failed to convert value to []byte")
	}
	return json.Unmarshal(bytes, t)
}

func (f *FormatTemplate) Value() (driver.Value, error) {
	return json.Marshal(f)
}

func (f *FormatTemplate) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("failed to convert value to []byte")
	}
	return json.Unmarshal(bytes, f)
}

func (c *Charges) Value() (driver.Value, error) {
	return json.Marshal(c)
}

func (c *Charges) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("failed to convert value to []byte")
	}
	return json.Unmarshal(bytes, c)
}
