package utils

import (
	"fmt"
	"time"
)

func PrintLog(message string) {
	time := time.Now().Format("2006-01-02 15:04:05")
	fmt.Printf("[%s] %s\n", time, message)
}
