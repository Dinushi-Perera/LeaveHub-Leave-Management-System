# Leave Management System - Complete Setup Guide

## System Architecture

```
┌─────────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│  React Frontend │◄───────►│  Golang (Gin) API    │◄───────►│  PostgreSQL DB  │
│   (Next.js 16)  │  HTTP   │  (Port 8080)         │  SQL    │  (Port 5432)    │
└─────────────────┘         └──────────────────────┘         └─────────────────┘
   (Port 3000)
```

## Prerequisites

Before starting, ensure you have installed:

1. **Node.js** (v18+) - https://nodejs.org/
2. **Go** (v1.21+) - https://golang.org/dl/
3. **PostgreSQL** (v14+) - https://www.postgresql.org/download/

## Quick Start (5 minutes)

### Step 1: Setup PostgreSQL Database

```bash
# On macOS (with Homebrew):
brew install postgresql
brew services start postgresql

# On Linux (Ubuntu/Debian):
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# On Windows:
# Download and run PostgreSQL installer from https://www.postgresql.org/download/windows/

# Verify installation
psql --version
```

### Step 2: Setup Backend (Golang + Gin)

```bash
cd backend

# Copy environment file
cp .env.example .env

# Update .env with your PostgreSQL credentials (if needed)
# Default: DB_HOST=localhost, DB_USER=postgres, DB_PASSWORD=postgres

# Run setup script (creates database and migrations)
# On macOS/Linux:
chmod +x setup.sh
./setup.sh

# On Windows (use Git Bash or WSL):
bash setup.sh

# Download Go dependencies
go mod download

# Start the backend server
go run main.go
```

The backend should now be running on `http://localhost:8080`

**Expected output:**
```
Database connected successfully
Schema initialized
Data seeded
[GIN-debug] Loaded HTML Templates (2): ...
[GIN-debug] Listening and serving HTTP on :8080
```

### Step 3: Setup Frontend (React + Next.js)

```bash
# Go to project root
cd ..

# Install dependencies
npm install
# or
pnpm install

# Create .env.local (if not exists)
# NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Start development server
npm run dev
# or
pnpm dev
```

The frontend should now be running on `http://localhost:3000`

## Manual Database Setup (if setup.sh doesn't work)

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL prompt:
CREATE DATABASE leave_management;
\c leave_management

# Run migrations
\i /path/to/backend/migrations/001_init.sql
\i /path/to/backend/migrations/002_seed.sql

# Exit
\q
```

## Test Credentials

### Employee Account
- **Email:** employee@example.com
- **Password:** password123
- **Role:** Employee

### Manager Account
- **Email:** manager@example.com
- **Password:** password123
- **Role:** Manager

## API Endpoints

Full API documentation is available in `backend/API.md`

### Key Endpoints:
- `POST /api/login` - Login
- `GET /api/me` - Get current user
- `POST /api/leaves/apply` - Apply for leave
- `GET /api/leaves/my` - Get my leaves
- `GET /api/leaves/all` - Get all leaves (manager only)
- `PUT /api/leaves/:id/approve` - Approve/reject leave (manager only)
- `GET /api/dashboard/employee` - Employee dashboard
- `GET /api/dashboard/manager` - Manager dashboard

## Project Structure

```
.
├── app/                      # Next.js app directory
│   ├── login/               # Login page
│   ├── dashboard/           # Employee dashboard
│   ├── my-leaves/          # Employee leaves
│   ├── apply-leave/        # Apply leave form
│   ├── approve-leaves/     # Manager approvals
│   ├── profile/            # User profile
│   ├── help/               # Help & FAQ
│   └── layout.tsx          # Root layout
├── context/                 # React Context
│   └── AuthContext.tsx      # Authentication state
├── components/              # React components
│   └── DashboardLayout.tsx  # Shared layout
├── lib/                     # Utilities
│   └── api.ts              # API client
├── backend/                 # Golang backend
│   ├── main.go             # Entry point
│   ├── models/             # Data models
│   ├── handlers/           # API handlers
│   ├── middleware/         # Auth middleware
│   ├── database/           # DB connection
│   ├── migrations/         # SQL migrations
│   └── utils/              # Utilities
└── public/                 # Static assets
```

## Troubleshooting

### Backend won't start

**Error: "failed to connect to database"**
```bash
# Check PostgreSQL is running
# macOS:
brew services list

# Linux:
sudo systemctl status postgresql

# Windows:
# Check Services app
```

**Error: "port 8080 already in use"**
```bash
# Change PORT in backend/.env
PORT=8081

# Restart backend
go run main.go
```

### Frontend can't connect to backend

**Error: "Connection error"**

1. Ensure backend is running on http://localhost:8080
2. Check NEXT_PUBLIC_API_URL in `.env.local`
3. Make sure CORS is enabled in backend (it is by default)

```bash
# Frontend .env.local should have:
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Database connection issues

**Error: "password authentication failed"**

Edit `backend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<your_password>
DB_NAME=leave_management
```

## Running Tests

### Backend Tests
```bash
cd backend
go test ./...
```

### Frontend Tests
```bash
npm run test
# or
pnpm test
```

## Building for Production

### Build Frontend
```bash
npm run build
npm start
```

### Build Backend
```bash
cd backend
go build -o leave-management-api
./leave-management-api
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=leave_management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=8080
GIN_MODE=debug  # Change to 'release' in production
```

## Common Tasks

### Reset Database
```bash
cd backend
dropdb -U postgres leave_management
./setup.sh
```

### View Database
```bash
# Connect to database
psql -U postgres -d leave_management

# View all tables
\dt

# View users
SELECT * FROM users;

# View leaves
SELECT * FROM leave_requests;

# Exit
\q
```

### Change User Password (in database)
```bash
# Passwords are hashed, so you need to add them via API or directly hash:
# Use bcrypt to hash: cost 10, password "newpassword123"
# Then UPDATE users SET password = '$hashed' WHERE id = 1;
```

## Deployment

### Deploy to Heroku (Backend)
```bash
cd backend
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy to Vercel (Frontend)
```bash
# Push to GitHub
git push origin main

# Connect repository to Vercel
# Set NEXT_PUBLIC_API_URL environment variable in Vercel dashboard
```

## Support

For issues or questions:
1. Check API documentation: `backend/API.md`
2. Review error messages in console
3. Check server logs for details
4. Verify database connection
5. Ensure all ports are available

