package model

type CustomerGroup struct {
	Data          []Customer `json:"data"`
	TotalPages    int        `json:"totalPages"`
	TotalElements int        `json:"totalElements"`
	HasNext       bool       `json:"hasNext"`
}
