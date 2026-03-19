package models

import "time"

// User represents an employee or manager
type User struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	Password    string    `json:"-"` // Never expose password
	Phone       string    `json:"phone"`
	Department  string    `json:"department"`
	Designation string    `json:"designation"`
	Role        string    `json:"role"` // "employee" or "manager"
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// LeaveRequest represents a leave application
type LeaveRequest struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	StartDate  time.Time `json:"start_date"`
	EndDate    time.Time `json:"end_date"`
	Type       string    `json:"type"` // "casual", "sick", "annual", "unpaid"
	Reason     string    `json:"reason"`
	Status     string    `json:"status"` // "pending", "approved", "rejected"
	Comment    string    `json:"comment"`
	ApprovedBy int       `json:"approved_by"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	User       *User     `json:"user,omitempty"`
}

// LeaveBalance represents leave balance for an employee
type LeaveBalance struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Total     int       `json:"total"`
	Used      int       `json:"used"`
	Remaining int       `json:"remaining"`
	UpdatedAt time.Time `json:"updated_at"`
}

// LoginRequest for login endpoint
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse contains token and user info
type LoginResponse struct {
	Token string `json:"token"`
	User  *User  `json:"user"`
}

// ApplyLeaveRequest for applying leave
type ApplyLeaveRequest struct {
	StartDate string `json:"start_date" binding:"required"`
	EndDate   string `json:"end_date" binding:"required"`
	Type      string `json:"type" binding:"required"`
	Reason    string `json:"reason" binding:"required"`
}

// ApproveLeaveRequest for approving/rejecting leave
type ApproveLeaveRequest struct {
	Status  string `json:"status" binding:"required"` // "approved" or "rejected"
	Comment string `json:"comment"`
}

// UpdateProfileRequest for updating user profile
type UpdateProfileRequest struct {
	Name        string `json:"name"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	Department  string `json:"department"`
	Designation string `json:"designation"`
}

// DashboardStats for dashboard endpoints
type DashboardStats struct {
	TotalLeaves     int `json:"total_leaves"`
	UsedLeaves      int `json:"used_leaves"`
	RemainingLeaves int `json:"remaining_leaves"`
	PendingRequests int `json:"pending_requests"`
}

// EmployeeDashboard for employee dashboard
type EmployeeDashboard struct {
	Stats          *DashboardStats `json:"stats"`
	RecentRequests []*LeaveRequest `json:"recent_requests"`
	IsOnLeaveToday bool            `json:"is_on_leave_today"`
}

// ManagerDashboard for manager dashboard
type ManagerDashboard struct {
	PendingRequests   []*LeaveRequest    `json:"pending_requests"`
	EmployeesOffToday []*EmployeeOffInfo `json:"employees_off_today"`
	ApprovedThisMonth int                `json:"approved_this_month"`
}

// EmployeeOffInfo shows who is off today
type EmployeeOffInfo struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	LeaveType string    `json:"leave_type"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}
