package handlers

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// Configuración para el WebSocket
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Esto permite conexiones desde cualquier origen. Asegúrate de modificarlo según tu necesidad de seguridad.
	},
}

func reader(conn *websocket.Conn) {
	for {
		// read in a message
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		// print out that message for clarity
		log.Println(string(p))
		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
}

func WriteMessage(conn *websocket.Conn, message string) {
	if err := conn.WriteMessage(websocket.TextMessage, []byte(message)); err != nil {
		log.Println(err)
		return
	}
}

// WebSocketHandler maneja la conexión WebSocket
func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	// Actualiza la conexión HTTP a WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error al actualizar la conexión:", err)
		return
	}

	conn.WriteMessage(websocket.TextMessage, []byte("Conexión establecida"))
	reader(conn)
}
