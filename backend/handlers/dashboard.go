package handlers

import (
	"database/sql"
	"leave-management-api/database"
	"leave-management-api/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// GetEmployeeDashboard returns employee dashboard stats
func GetEmployeeDashboard(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	// Get leave balance stats
	var stats models.DashboardStats
	err := database.DB.QueryRow(
		"SELECT total, used, remaining FROM leave_balance WHERE user_id = $1",
		userID,
	).Scan(&stats.TotalLeaves, &stats.UsedLeaves, &stats.RemainingLeaves)

	if err == sql.ErrNoRows {
		stats = models.DashboardStats{
			TotalLeaves:     14,
			UsedLeaves:      0,
			RemainingLeaves: 14,
		}
	}

	// Get pending requests count
	database.DB.QueryRow(
		"SELECT COUNT(*) FROM leave_requests WHERE user_id = $1 AND status = 'pending'",
		userID,
	).Scan(&stats.PendingRequests)

	// Get recent leave requests
	rows, err := database.DB.Query(
		"SELECT id, user_id, start_date, end_date, type, COALESCE(reason, ''), status, comment, approved_by, created_at, updated_at FROM leave_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5",
		userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var recentRequests = []*models.LeaveRequest{}
	for rows.Next() {
		var leave models.LeaveRequest
		var comment sql.NullString
		var approvedBy sql.NullInt64
		if err := rows.Scan(&leave.ID, &leave.UserID, &leave.StartDate, &leave.EndDate, &leave.Type, &leave.Reason, &leave.Status, &comment, &approvedBy, &leave.CreatedAt, &leave.UpdatedAt); err != nil {
			continue
		}
		if comment.Valid {
			leave.Comment = comment.String
		}
		if approvedBy.Valid {
			leave.ApprovedBy = int(approvedBy.Int64)
		}
		recentRequests = append(recentRequests, &leave)
	}

	// Check if user is on leave today
	today := time.Now()
	var isOnLeaveToday bool
	database.DB.QueryRow(
		"SELECT EXISTS(SELECT 1 FROM leave_requests WHERE user_id = $1 AND status = 'approved' AND start_date <= $2 AND end_date >= $3)",
		userID, today, today,
	).Scan(&isOnLeaveToday)

	dashboard := models.EmployeeDashboard{
		Stats:          &stats,
		RecentRequests: recentRequests,
		IsOnLeaveToday: isOnLeaveToday,
	}

	c.JSON(http.StatusOK, dashboard)
}

// GetManagerDashboard returns manager dashboard stats
func GetManagerDashboard(c *gin.Context) {
	// Get pending leave requests
	rows, err := database.DB.Query(
		`SELECT l.id, l.user_id, l.start_date, l.end_date, l.type, l.reason, l.status, l.comment, l.approved_by, l.created_at, l.updated_at, u.id, u.name, u.email
		FROM leave_requests l
		JOIN users u ON l.user_id = u.id
		WHERE l.status = 'pending'
		ORDER BY l.created_at DESC`,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var pendingRequests = []*models.LeaveRequest{}
	for rows.Next() {
		var leave models.LeaveRequest
		var user models.User
		var comment sql.NullString
		var approvedBy sql.NullInt64
		if err := rows.Scan(&leave.ID, &leave.UserID, &leave.StartDate, &leave.EndDate, &leave.Type, &leave.Reason, &leave.Status, &comment, &approvedBy, &leave.CreatedAt, &leave.UpdatedAt, &user.ID, &user.Name, &user.Email); err != nil {
			continue
		}
		if comment.Valid {
			leave.Comment = comment.String
		}
		if approvedBy.Valid {
			leave.ApprovedBy = int(approvedBy.Int64)
		}
		leave.User = &user
		pendingRequests = append(pendingRequests, &leave)
	}

	// Get employees off today
	today := time.Now()
	offRows, err := database.DB.Query(
		`SELECT DISTINCT u.id, u.name, l.type, l.start_date, l.end_date
		FROM users u
		JOIN leave_requests l ON u.id = l.user_id
		WHERE l.status = 'approved' AND l.start_date <= $1 AND l.end_date >= $2
		ORDER BY u.name`,
		today, today,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer offRows.Close()

	var employeesOffToday = []*models.EmployeeOffInfo{}
	for offRows.Next() {
		var info models.EmployeeOffInfo
		if err := offRows.Scan(&info.ID, &info.Name, &info.LeaveType, &info.StartDate, &info.EndDate); err != nil {
			continue
		}
		employeesOffToday = append(employeesOffToday, &info)
	}

	// Get approved this month count
	monthStart := time.Date(today.Year(), today.Month(), 1, 0, 0, 0, 0, time.Local)
	monthEnd := monthStart.AddDate(0, 1, 0).Add(-time.Second)

	var approvedThisMonth int
	database.DB.QueryRow(
		"SELECT COUNT(*) FROM leave_requests WHERE status = 'approved' AND updated_at >= $1 AND updated_at <= $2",
		monthStart, monthEnd,
	).Scan(&approvedThisMonth)

	dashboard := models.ManagerDashboard{
		PendingRequests:   pendingRequests,
		EmployeesOffToday: employeesOffToday,
		ApprovedThisMonth: approvedThisMonth,
	}

	c.JSON(http.StatusOK, dashboard)
}

// GetTodayStatus returns today's status
func GetTodayStatus(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	today := time.Now()

	var isOnLeave bool
	var leaveType string
	var startDate, endDate time.Time

	err := database.DB.QueryRow(
		"SELECT l.type, l.start_date, l.end_date FROM leave_requests l WHERE l.user_id = $1 AND l.status = 'approved' AND l.start_date <= $2 AND l.end_date >= $3",
		userID, today, today,
	).Scan(&leaveType, &startDate, &endDate)

	if err == nil {
		isOnLeave = true
	}

	c.JSON(http.StatusOK, gin.H{
		"is_on_leave": isOnLeave,
		"leave_type":  leaveType,
		"start_date":  startDate,
		"end_date":    endDate,
	})
}
