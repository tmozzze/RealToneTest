package utils

import (
    "log"
)

// LogError logs an error message to the console.
func LogError(err error) {
    if err != nil {
        log.Printf("Error: %v", err)
    }
}

// RespondWithError formats an error response.
func RespondWithError(message string) map[string]string {
    return map[string]string{"error": message}
}

// IsEmpty checks if a string is empty.
func IsEmpty(s string) bool {
    return len(s) == 0
}