package models

// USER

type UserID struct {
	Id string `json:"id"`
}
type User struct {
	Id         UserID `json:"id"`
	Authority  string `json:"authority"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	CustomerId UserID `json:"customerId"`
}
type UserResponse struct {
	Data []User `json:"data"`
}
