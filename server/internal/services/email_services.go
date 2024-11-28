package services

import (
	"log"

	"gopkg.in/gomail.v2"
)

func SendEmailService(to string, subject string, body string, pdfPath string) error {
	// Configuración de la cuenta de Gmail
	smtpHost := "smtp.gmail.com"
	smtpPort := 587
	senderEmail := "axl.santos@lumenenergysolutions.com"
	senderPassword := "ylxw acpq hqov jmup" // Cambia esto por tu contraseña o App Password

	// Crear el mensaje
	m := gomail.NewMessage()
	m.SetHeader("From", "Info Lumen Billing <"+senderEmail+">")
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	// Adjuntar el archivo PDF
	if pdfPath != "" {
		m.Attach(pdfPath)
	}

	// Conexión al servidor SMTP
	d := gomail.NewDialer(smtpHost, smtpPort, senderEmail, senderPassword)

	// Enviar el correo
	if err := d.DialAndSend(m); err != nil {
		log.Printf("Error al enviar el correo: %v", err)
		return err
	}

	log.Println("Correo enviado exitosamente")
	return nil
}
