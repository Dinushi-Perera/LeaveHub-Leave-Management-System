package handlers

import (
	"database/sql"
	"leave-management-api/database"
	"leave-management-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetProfile gets user profile with leave balance
func GetProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
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

	// Get leave balance
	var balance models.LeaveBalance
	err = database.DB.QueryRow(
		"SELECT id, user_id, total, used, remaining FROM leave_balance WHERE user_id = $1",
		userID,
	).Scan(&balance.ID, &balance.UserID, &balance.Total, &balance.Used, &balance.Remaining)

	if err == sql.ErrNoRows {
		// Create default balance if not exists
		balance = models.LeaveBalance{
			UserID:    userID.(int),
			Total:     14,
			Used:      0,
			Remaining: 14,
		}
	}

	response := gin.H{
		"user":    user,
		"balance": balance,
	}

	c.JSON(http.StatusOK, response)
}

// UpdateProfile updates user profile
func UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	var req models.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update user profile
	_, err := database.DB.Exec(
		"UPDATE users SET name = $1, phone = $2, department = $3, designation = $4, email = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $5",
		req.Name, req.Phone, req.Department, req.Designation, userID, req.Email,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}

// GetAllUsers gets all users (for managers to see team members)
func GetAllUsers(c *gin.Context) {
	rows, err := database.DB.Query(
		"SELECT id, name, email, COALESCE(phone, ''), COALESCE(department, ''), COALESCE(designation, ''), role FROM users ORDER BY name",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Phone, &user.Department, &user.Designation, &user.Role); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning users"})
			return
		}
		users = append(users, user)
	}

	c.JSON(http.StatusOK, users)
}
