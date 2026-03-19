package handlers

import (
	"database/sql"
	"leave-management-api/database"
	"leave-management-api/models"
	"leave-management-api/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Login authenticates a user and returns a JWT token
func Login(c *gin.Context) {
	var req models.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Query user by email
	var user models.User
	var hashedPassword string

	err := database.DB.QueryRow(
		"SELECT id, name, email, password, COALESCE(phone, ''), COALESCE(department, ''), COALESCE(designation, ''), role FROM users WHERE email = $1",
		req.Email,
	).Scan(&user.ID, &user.Name, &user.Email, &hashedPassword, &user.Phone, &user.Department, &user.Designation, &user.Role)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Check password
	if !utils.CheckPassword(hashedPassword, req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Generate JWT token
	token, err := utils.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	response := models.LoginResponse{
		Token: token,
		User:  &user,
	}

	c.JSON(http.StatusOK, response)
}

// GetMe returns the current user's information
func GetMe(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	var user models.User
	err := database.DB.QueryRow(
		"SELECT id, name, email, COALESCE(phone, ''), COALESCE(department, ''), COALESCE(designation, ''), role FROM users WHERE id = $1",
		userID,
	).Scan(&user.ID, &user.Name, &user.Email, &user.Phone, &user.Department, &user.Designation, &user.Role)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, user)
}
