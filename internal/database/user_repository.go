package database

import (
	"database/sql" // Required for sql.ErrNoRows
	"errors"       // Required for wrapping errors
	"fmt"

	"example.com/auth_service/internal/models"
	"github.com/jmoiron/sqlx"
	// "example.com/auth_service/pkg/logger" // Assuming you have a logger package
)

// userRepositoryImpl implements the models.UserRepository interface.
type userRepositoryImpl struct {
	db *sqlx.DB
	// logger *logger.Logger // Optional: inject logger if needed for db operations logging
}

// NewUserRepository creates a new instance that implements models.UserRepository.
func NewUserRepository(db *sqlx.DB /*, logger *logger.Logger*/) models.UserRepository {
	return &userRepositoryImpl{
		db: db,
		// logger: logger,
	}
}

// CreateUser inserts a new user into the database.
func (r *userRepositoryImpl) CreateUser(user *models.User) error {
	query := `INSERT INTO users (id, username, email, password_hash, created_at, updated_at)
			  VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := r.db.Exec(query, user.ID, user.Username, user.Email, user.Password, user.CreatedAt, user.UpdatedAt)
	if err != nil {
		// r.logger.Error("Error creating user in DB", zap.Error(err), zap.String("email", user.Email))
		return fmt.Errorf("CreateUser: failed to insert user: %w", err)
	}
	// r.logger.Info("User successfully created in DB", zap.String("userID", user.ID))
	return nil
}

// GetUserByEmail retrieves a user from the database by their email.
// Returns sql.ErrNoRows if no user is found.
func (r *userRepositoryImpl) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	query := `SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE email = $1`
	err := r.db.Get(&user, query, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// r.logger.Debug("User not found by email", zap.String("email", email))
			return nil, err // Return sql.ErrNoRows directly for service layer to check
		}
		// r.logger.Error("Error fetching user by email from DB", zap.Error(err), zap.String("email", email))
		return nil, fmt.Errorf("GetUserByEmail: query error: %w", err)
	}
	// r.logger.Debug("User found by email", zap.String("email", email), zap.String("userID", user.ID))
	return &user, nil
}

// GetUserByID retrieves a user from the database by their ID.
// Returns sql.ErrNoRows if no user is found.
func (r *userRepositoryImpl) GetUserByID(id string) (*models.User, error) {
	var user models.User
	query := `SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE id = $1`
	err := r.db.Get(&user, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// r.logger.Debug("User not found by ID", zap.String("userID", id))
			return nil, err // Return sql.ErrNoRows directly
		}
		// r.logger.Error("Error fetching user by ID from DB", zap.Error(err), zap.String("userID", id))
		return nil, fmt.Errorf("GetUserByID: query error: %w", err)
	}
	// r.logger.Debug("User found by ID", zap.String("userID", id))
	return &user, nil
}
