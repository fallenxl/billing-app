package handlers

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Esto permite conexiones desde cualquier origen. Asegúrate de modificarlo según tu necesidad de seguridad.
		},
	}
	clients = make(map[string]*websocket.Conn)
	mu      sync.Mutex
)

func AddClient(clientID string, conn *websocket.Conn) {
	mu.Lock()
	clients[clientID] = conn
	mu.Unlock()
}

func RemoveClient(clientID string) {
	mu.Lock()
	delete(clients, clientID)
	mu.Unlock()
}

func SendMessageToClient(clientID, message string) {
	mu.Lock()
	conn, ok := clients[clientID]
	mu.Unlock()
	if ok {
		err := conn.WriteMessage(websocket.TextMessage, []byte(message))
		if err != nil {
			RemoveClient(clientID)
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
	var err error

	clientToken := r.URL.Query().Get("token")
	if clientToken == "" {
		log.Println("No se proporcionó un ID de cliente")
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error al actualizar la conexión:", err)
		return
	}

	AddClient(clientToken, conn)

	// defer conn.Close()
	defer func() {
		RemoveClient(clientToken)
		conn.Close()
	}()
}
