package models

//AUTH

type RelationInfo struct {
	EntityType string `json:"entityType"`
	Type       string `json:"type"`
	Name       string `json:"name"`
	Id         string `json:"id"`
}

type CustomerID struct {
	Id string `json:"id"`
}
type LoginResponse struct {
	RefreshToken string `json:"refreshToken"`
	Token        string `json:"token"`
	FirsName     string `json:"firstName"`
	LastName     string `json:"lastName"`
	Email        string `json:"email"`
	Authority    string `json:"authority"`
	Name         string `json:"name"`
	Id           string `json:"id"`
	CustomerId   string `json:"customerId"`
	//AssetInfo    RelationInfo `json:"assetInfo"`
}
type RequestResponse struct {
	StatusCode int
	Response   []byte
	Error      error
}
