package main

import (
	"log"
	"net/http"
	"server/internal/handlers"
)

func main() {
	r := handlers.NewRouter()
	log.Println("Server started on: http://localhost:8080")

	//filename := "sample.pdf"
	//err := pdf.CreatePDF(filename)
	//if err != nil {
	//	fmt.Println("Error creating PDF file: ", err)
	//	return
	//}
	//
	//err = pdf.OpenPDF(filename)
	//if err != nil {
	//	fmt.Println("Error opening PDF file: ", err)
	//	return
	//}
	//fmt.Println("PDF file created and opened successfully")

	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}

}
