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
	RefreshToken string   `json:"refreshToken"`
	Token        string   `json:"token"`
	User         UserInfo `json:"user"`
}
type RequestResponse struct {
	StatusCode int
	Response   []byte
	Error      error
}
