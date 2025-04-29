package main

import (
    "log"
    "net"

    "google.golang.org/grpc"
    "your_project_path/pkg/api" // Update with your actual project path
    "your_project_path/pkg/handlers" // Update with your actual project path
)

func main() {
    // Create a listener on TCP port 50051
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }

    // Create a new gRPC server
    s := grpc.NewServer()

    // Register the service handler
    api.RegisterYourServiceServer(s, &handlers.YourServiceHandler{}) // Update with your actual service and handler

    log.Println("gRPC server is running on port 50051...")
    
    // Start the server
    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}