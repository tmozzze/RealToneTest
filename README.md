# Project Title

This project consists of a Go REST API for user registration and authentication, and a Python gRPC stub for audio processing.

## Go REST API

Handles user registration and login, storing user data in a PostgreSQL database.

### Features

- User registration (`/api/v1/users/register`)
- User login (`/api/v1/users/login`)
- JWT-based authentication
- Password hashing with bcrypt
- PostgreSQL database integration using sqlx
- Gin HTTP framework

### Project Structure

- `cmd/server`: Main application
- `internal/auth`: Authentication logic
- `internal/config`: Configuration
- `internal/database`: Database interactions
- `internal/handlers`: HTTP handlers
- `internal/middleware`: Request middleware
- `internal/models`: Data models
- `pkg/logger`: Logging utilities
- `pkg/utils`: Common utility functions

## Python gRPC Service (Stub)

A stub service that accepts audio data and returns results in a predefined format.

(Details to be added) 