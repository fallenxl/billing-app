package models

type AuthDTO struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type AuthResponse struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refreshToken"`
	Scope        string `json:"scope"`
}
