package handlers

import (
	"database/sql"
	"leave-management-api/database"
	"leave-management-api/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// ApplyLeave applies for a new leave
func ApplyLeave(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	var req models.ApplyLeaveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse dates
	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format"})
		return
	}

	endDate, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date format"})
		return
	}

	// Validate dates
	if startDate.After(endDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Start date must be before end date"})
		return
	}

	if startDate.Before(time.Now().AddDate(0, 0, -1)) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot apply leave for past dates"})
		return
	}

	// Check for overlapping leaves
	var count int
	err = database.DB.QueryRow(
		"SELECT COUNT(*) FROM leave_requests WHERE user_id = $1 AND status != 'rejected' AND ((start_date <= $2 AND end_date >= $3) OR (start_date <= $4 AND end_date >= $5))",
		userID, endDate, startDate, endDate, startDate,
	).Scan(&count)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Overlapping leave request already exists"})
		return
	}

	// Check leave balance
	var remaining int
	err = database.DB.QueryRow(
		"SELECT remaining FROM leave_balance WHERE user_id = $1",
		userID,
	).Scan(&remaining)

	if err == sql.ErrNoRows {
		// Auto-create default leave balance for the user if it doesn't exist
		_, insertErr := database.DB.Exec("INSERT INTO leave_balance (user_id, total, used, remaining) VALUES ($1, 14, 0, 14)", userID)
		if insertErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create leave balance"})
			return
		}
		remaining = 14
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error checking balance"})
	}

	leaveDays := int(endDate.Sub(startDate).Hours()/24) + 1

	if leaveDays > remaining {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient leave balance"})
		return
	}

	// Insert leave request
	var leaveID int
	err = database.DB.QueryRow(
		"INSERT INTO leave_requests (user_id, start_date, end_date, type, reason, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING id",
		userID, startDate, endDate, req.Type, req.Reason,
	).Scan(&leaveID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to apply leave"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": leaveID, "message": "Leave applied successfully"})
}

// GetMyLeaves gets all leaves for current user
func GetMyLeaves(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	rows, err := database.DB.Query(
		"SELECT id, user_id, start_date, end_date, type, COALESCE(reason, ''), status, comment, approved_by, created_at, updated_at FROM leave_requests WHERE user_id = $1 ORDER BY created_at DESC",
		userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var leaves = []models.LeaveRequest{}
	for rows.Next() {
		var leave models.LeaveRequest
		var comment sql.NullString
		var approvedBy sql.NullInt64

		if err := rows.Scan(&leave.ID, &leave.UserID, &leave.StartDate, &leave.EndDate, &leave.Type, &leave.Reason, &leave.Status, &comment, &approvedBy, &leave.CreatedAt, &leave.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning leaves"})
			return
		}

		if comment.Valid {
			leave.Comment = comment.String
		}
		if approvedBy.Valid {
			leave.ApprovedBy = int(approvedBy.Int64)
		}

		leaves = append(leaves, leave)
	}

	c.JSON(http.StatusOK, leaves)
}

// GetAllLeaves gets all leave requests (for managers)
func GetAllLeaves(c *gin.Context) {
	status := c.DefaultQuery("status", "")

	query := "SELECT id, user_id, start_date, end_date, type, COALESCE(reason, ''), status, comment, approved_by, created_at, updated_at FROM leave_requests"
	args := []interface{}{}

	if status != "" {
		query += " WHERE status = $1"
		args = append(args, status)
	}

	query += " ORDER BY created_at DESC"

	rows, err := database.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var leaves = []models.LeaveRequest{}
	for rows.Next() {
		var leave models.LeaveRequest
		var comment sql.NullString
		var approvedBy sql.NullInt64

		if err := rows.Scan(&leave.ID, &leave.UserID, &leave.StartDate, &leave.EndDate, &leave.Type, &leave.Reason, &leave.Status, &comment, &approvedBy, &leave.CreatedAt, &leave.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning leaves"})
			return
		}

		if comment.Valid {
			leave.Comment = comment.String
		}
		if approvedBy.Valid {
			leave.ApprovedBy = int(approvedBy.Int64)
		}

		// Get user info
		var user models.User
		database.DB.QueryRow("SELECT id, name, email FROM users WHERE id = $1", leave.UserID).Scan(&user.ID, &user.Name, &user.Email)
		leave.User = &user

		leaves = append(leaves, leave)
	}

	c.JSON(http.StatusOK, leaves)
}

// ApproveLeave approves or rejects a leave request
func ApproveLeave(c *gin.Context) {
	leaveIDStr := c.Param("id")
	leaveID, err := strconv.Atoi(leaveIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid leave ID"})
		return
	}

	managerID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	var req models.ApproveLeaveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get the leave request
	var leave models.LeaveRequest
	err = database.DB.QueryRow(
		"SELECT id, user_id, start_date, end_date, status FROM leave_requests WHERE id = $1",
		leaveID,
	).Scan(&leave.ID, &leave.UserID, &leave.StartDate, &leave.EndDate, &leave.Status)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Leave request not found"})
		return
	}

	if leave.Status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Leave request is already processed"})
		return
	}

	// Update leave request
	_, err = database.DB.Exec(
		"UPDATE leave_requests SET status = $1, comment = $2, approved_by = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4",
		req.Status, req.Comment, managerID, leaveID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update leave"})
		return
	}

	// If approved, update leave balance
	if req.Status == "approved" {
		leaveDays := int(leave.EndDate.Sub(leave.StartDate).Hours()/24) + 1

		_, err = database.DB.Exec(
			"UPDATE leave_balance SET used = used + $1, remaining = remaining - $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3",
			leaveDays, leaveDays, leave.UserID,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update leave balance"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Leave request processed successfully"})
}
