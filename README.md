# LeaveHub-Leave-Management-System
A full-stack internal Leave Management System built with Go, PostgreSQL, and React. Enables employees to submit leave requests digitally while managers can review, approve, or reject them. Features a real time dashboard for company-wide leave visibility, replacing manual processes with a clean, efficient workflow
<div align="center">

<svg width="800" height="120" viewBox="0 0 800 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6C63FF"/>
      <stop offset="50%" style="stop-color:#E040FB"/>
      <stop offset="100%" style="stop-color:#00BCD4"/>
    </linearGradient>
    <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFD700"/>
      <stop offset="50%" style="stop-color:#FF6B6B"/>
      <stop offset="100%" style="stop-color:#00E5FF"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="800" height="120" rx="18" fill="url(#bg)" opacity="0.95"/>
  <circle cx="60" cy="30" r="18" fill="#FFD700" opacity="0.25">
    <animate attributeName="r" values="18;26;18" dur="2.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="740" cy="90" r="14" fill="#00E5FF" opacity="0.25">
    <animate attributeName="r" values="14;22;14" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="400" cy="10" r="8" fill="#FF6B6B" opacity="0.3">
    <animate attributeName="cy" values="10;18;10" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="400" y="58" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="42" font-weight="900" fill="url(#text-grad)" filter="url(#glow)">
    🗓️ LeaveHub
    <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite"/>
  </text>
  <text x="400" y="90" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="17" fill="#FFFFFF" opacity="0.92" letter-spacing="2">
    Leave Management System — ABC Company
  </text>
  <rect x="150" y="108" width="500" height="4" rx="2" fill="#FFD700" opacity="0.5">
    <animate attributeName="width" values="500;380;500" dur="2.8s" repeatCount="indefinite"/>
    <animate attributeName="x" values="150;210;150" dur="2.8s" repeatCount="indefinite"/>
  </rect>
</svg>

<br/>

![React](https://img.shields.io/badge/React-Next.js_16-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Golang](https://img.shields.io/badge/Golang-Gin_API-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-FF6B6B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

> *A simple, fast & real-time leave management solution — replacing manual processes for small teams.*

**✨ Made by Dinushi Perera**

</div>

---

## 🚀 What is LeaveHub?

LeaveHub lets employees apply for leave and managers approve or reject — all in one clean dashboard. No paperwork, no spreadsheets.

```
 React Frontend  ◄──HTTP──►  Golang (Gin) API  ◄──SQL──►  PostgreSQL DB
  (Port 3000)                   (Port 8080)                 (Port 5432)
```

---

## ⚡ Quick Setup (5 Minutes)

### 1️⃣ &nbsp; Database

```bash
# macOS
brew install postgresql && brew services start postgresql

# Linux
sudo apt-get install postgresql && sudo systemctl start postgresql

# Windows — Download installer from https://www.postgresql.org/download/windows/
```

### 2️⃣ &nbsp; Backend

```bash
cd backend
cp .env.example .env      # Edit DB credentials if needed

chmod +x setup.sh
./setup.sh                # Creates DB & runs migrations

go mod download
go run main.go            # Runs on http://localhost:8080
```

✅ You should see: `Database connected` → `Schema initialized` → `Server on :8080`

### 3️⃣ &nbsp; Frontend

```bash
cd ..                     # Project root
npm install
npm run dev               # Runs on http://localhost:3000
```

> **Tip:** Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8080/api`

---

## 🔑 Test Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👤 Employee | `employee@example.com` | `password123` |
| 👨‍💼 Manager | `manager@example.com` | `password123` |

---

## 🛠️ Environment Variables

**`backend/.env`**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=leave_management
JWT_SECRET=your_secret_key
PORT=8080
GIN_MODE=debug
```

**`.env.local`** (Frontend root)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/login` | 🔐 Login |
| `GET`  | `/api/me` | 👤 Current user |
| `POST` | `/api/leaves/apply` | 📝 Apply leave |
| `GET`  | `/api/leaves/my` | 📋 My leaves |
| `GET`  | `/api/leaves/all` | 📊 All leaves *(Manager)* |
| `PUT`  | `/api/leaves/:id/approve` | ✅ Approve / Reject *(Manager)* |
| `GET`  | `/api/dashboard/employee` | 🖥️ Employee dashboard |
| `GET`  | `/api/dashboard/manager` | 📈 Manager dashboard |

---

## 🧩 Features at a Glance

-  **Apply Leave** — Casual, Sick, Annual with date picker & reason
-  **Approve / Reject** — One-click manager actions with comments
-  **Leave Balance** — Auto-updates when leave is approved
-  **Validations** — No overlapping dates, no past dates, balance checks
-  **Who's Off Today** — Team visibility across dashboards
-  **Responsive** — Mobile, tablet & desktop ready

---

## 🔧 Common Issues

| Problem | Fix |
|---------|-----|
| `failed to connect to database` | Make sure PostgreSQL is running |
| `port 8080 already in use` | Set `PORT=8081` in `backend/.env` |
| `Connection error` on frontend | Check `NEXT_PUBLIC_API_URL` in `.env.local` |
| `password authentication failed` | Update `DB_PASSWORD` in `backend/.env` |

**Reset database anytime:**
```bash
cd backend && dropdb -U postgres leave_management && ./setup.sh
```

---

## 📁 Project Structure

```
LeaveHub/
├── app/               # Next.js pages (login, dashboard, leaves...)
├── components/        # Shared UI components
├── context/           # Auth context
├── lib/               # API client
└── backend/
    ├── main.go        # Entry point
    ├── handlers/      # Route handlers
    ├── models/        # Data models
    ├── migrations/    # SQL files
    └── middleware/    # JWT auth
```

---

<div align="center">

<svg width="580" height="56" viewBox="0 0 580 56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="footer-bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#6C63FF;stop-opacity:0.2"/>
      <stop offset="50%" style="stop-color:#E040FB;stop-opacity:0.2"/>
      <stop offset="100%" style="stop-color:#00BCD4;stop-opacity:0.2"/>
    </linearGradient>
  </defs>
  <rect width="580" height="56" rx="12" fill="url(#footer-bg)"/>
  <text x="290" y="24" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="#9B8FFF" font-weight="600">
    ⭐ If LeaveHub helped you, please give it a star!
  </text>
  <text x="290" y="43" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#AAAAAA">
    Built by Dinushi Perera · MIT License · 2024
  </text>
</svg>

</div>
