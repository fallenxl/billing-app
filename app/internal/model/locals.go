package model

type Local struct {
	FromName      *string    `json:"fromName"`
	ToName        *string    `json:"toName"`
	To            EntityRef  `json:"to"`
	From          EntityRef  `json:"from"`
	Label         *string    `json:"label"`
	BuildingOwner *string    `json:"buidingOwner"`
	Email         *string    `json:"email"`
	Phone         *string    `json:"phone"`
	Address       *string    `json:"address"`
	Charges       *[]Charges `json:"charges"`
}

type Charges struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Amount      float64 `json:"amount"`
	Type        string  `json:"type"` // "fixed" or "variable"
	Unit        string  `json:"unit"` // "hour" or "day"
}
