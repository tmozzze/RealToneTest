package models

// Request represents the structure of the request message for the gRPC service.
type Request struct {
    AudioFile []byte `json:"audio_file"` // The audio file data
}

// Response represents the structure of the response message for the gRPC service.
type Response struct {
    IsSynthetic bool    `json:"is_synthetic"` // Indicates if the audio is synthetic
    Probability float64 `json:"probability"`  // Probability score of the audio being synthetic
}