## Leave Management System - API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Public Endpoints

### 1. Login
```
POST /login
```
**Request:**
```json
{
  "email": "employee@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Employee",
    "email": "employee@example.com",
    "phone": "9876543210",
    "department": "Engineering",
    "designation": "Software Engineer",
    "role": "employee"
  }
}
```

---

## Protected Endpoints

### 2. Get Current User
```
GET /me
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "John Employee",
  "email": "employee@example.com",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer",
  "role": "employee"
}
```

### 3. Get User Profile with Balance
```
GET /profile
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Employee",
    "email": "employee@example.com",
    "phone": "9876543210",
    "department": "Engineering",
    "designation": "Software Engineer",
    "role": "employee"
  },
  "balance": {
    "id": 1,
    "user_id": 1,
    "total": 14,
    "used": 2,
    "remaining": 12
  }
}
```

### 4. Update User Profile
```
PUT /profile
Headers: Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "John Updated",
  "phone": "9876543220",
  "department": "Engineering",
  "designation": "Senior Engineer"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully"
}
```

### 5. Get All Users
```
GET /users
Headers: Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Employee",
    "email": "employee@example.com",
    "phone": "9876543210",
    "department": "Engineering",
    "designation": "Software Engineer",
    "role": "employee"
  },
  ...
]
```

---

## Leave Management Endpoints

### 6. Apply for Leave
```
POST /leaves/apply
Headers: Authorization: Bearer <token>
```

**Request:**
```json
{
  "start_date": "2024-04-10",
  "end_date": "2024-04-15",
  "type": "annual",
  "reason": "Vacation"
}
```

**Response:**
```json
{
  "id": 5,
  "message": "Leave applied successfully"
}
```

### 7. Get My Leaves
```
GET /leaves/my
Headers: Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "start_date": "2024-03-20T00:00:00Z",
    "end_date": "2024-03-22T00:00:00Z",
    "type": "casual",
    "reason": "Personal work",
    "status": "approved",
    "comment": "",
    "approved_by": 2,
    "created_at": "2024-03-15T10:30:00Z",
    "updated_at": "2024-03-16T14:20:00Z"
  },
  ...
]
```

### 8. Get All Leaves (Manager Only)
```
GET /leaves/all?status=pending
Headers: Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): "pending", "approved", "rejected"

**Response:**
```json
[
  {
    "id": 2,
    "user_id": 1,
    "start_date": "2024-04-10T00:00:00Z",
    "end_date": "2024-04-15T00:00:00Z",
    "type": "annual",
    "reason": "Vacation",
    "status": "pending",
    "comment": "",
    "approved_by": null,
    "created_at": "2024-03-15T10:30:00Z",
    "updated_at": "2024-03-15T10:30:00Z",
    "user": {
      "id": 1,
      "name": "John Employee",
      "email": "employee@example.com"
    }
  },
  ...
]
```

### 9. Approve/Reject Leave (Manager Only)
```
PUT /leaves/:id/approve
Headers: Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "approved",
  "comment": "Approved"
}
```

**Response:**
```json
{
  "message": "Leave request processed successfully"
}
```

---

## Dashboard Endpoints

### 10. Get Employee Dashboard
```
GET /dashboard/employee
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "stats": {
    "total_leaves": 14,
    "used_leaves": 2,
    "remaining_leaves": 12,
    "pending_requests": 1
  },
  "recent_requests": [
    {
      "id": 2,
      "user_id": 1,
      "start_date": "2024-04-10T00:00:00Z",
      "end_date": "2024-04-15T00:00:00Z",
      "type": "annual",
      "reason": "Vacation",
      "status": "pending",
      "comment": "",
      "created_at": "2024-03-15T10:30:00Z",
      "updated_at": "2024-03-15T10:30:00Z"
    }
  ],
  "is_on_leave_today": false
}
```

### 11. Get Manager Dashboard
```
GET /dashboard/manager
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "pending_requests": [
    {
      "id": 2,
      "user_id": 1,
      "start_date": "2024-04-10T00:00:00Z",
      "end_date": "2024-04-15T00:00:00Z",
      "type": "annual",
      "reason": "Vacation",
      "status": "pending",
      "user": {
        "id": 1,
        "name": "John Employee",
        "email": "employee@example.com"
      }
    }
  ],
  "employees_off_today": [
    {
      "id": 3,
      "name": "Mike Employee",
      "leave_type": "sick",
      "start_date": "2024-03-25T00:00:00Z",
      "end_date": "2024-03-25T00:00:00Z"
    }
  ],
  "approved_this_month": 3
}
```

### 12. Get Today Status
```
GET /dashboard/today-status
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "is_on_leave": false,
  "leave_type": "",
  "start_date": "0001-01-01T00:00:00Z",
  "end_date": "0001-01-01T00:00:00Z"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message"
}
```

### Common Error Codes:
- `400 Bad Request`: Invalid input or business logic violation
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User doesn't have permission (non-manager accessing manager endpoint)
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Test Credentials

Employee:
```
Email: employee@example.com
Password: password123
```

Manager:
```
Email: manager@example.com
Password: password123
```

---
