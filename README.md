# 🚗 SmartCommute — Corporate Carpooling Platform

> A smart corporate carpooling and demand generation platform that helps companies reduce commute costs, CO₂ emissions, and office crowd levels through intelligent ride matching and real-time analytics.

---

## 🔴 Live Demo

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@smartcommute.com | admin123 |
| 👤 Employee | rahul@smartcommute.com | user123 |

---

## 📸 Screenshots

### Admin Analytics Dashboard
- Full analytics with 14-day demand trends
- Office crowd monitoring
- Carpool group management
- CSV export

### Employee Dashboard  
- Personalized ride requests
- Carpool matching
- Cost & CO₂ savings tracker

---

## ✨ Features

### 👑 Admin Portal
- 📊 **Analytics Dashboard** — 14-day demand trends, matches, cost saved
- 📈 **Charts** — Line chart, Bar chart, Pie chart (Recharts)
- 🏢 **Office Crowd Levels** — Real-time LOW / MEDIUM / HIGH monitoring
- 👥 **Carpool Group Management** — View all active sharing groups
- 📋 **Demand Requests Table** — Filter by office, status, search
- 📥 **CSV Export** — Download all requests as spreadsheet
- 🔐 **Role-Based Access** — Admin-only protected routes

### 👤 Employee Portal
- 🙋 **Personalized Dashboard** — Time-based greeting, personal stats
- 📝 **Submit Ride Requests** — Pick office, date, time, location
- 🚗 **My Rides** — View matched carpool partners and routes
- 💰 **Cost Savings** — Track money saved through carpooling
- 🌱 **CO₂ Tracker** — Personal carbon footprint reduction
- 🔔 **Notifications** — Ride match and request updates

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | Core framework |
| Tailwind CSS | Styling |
| React Router v6 | Navigation & protected routes |
| Recharts | Analytics charts |
| React Query | Data fetching & caching |
| Framer Motion | Animations |
| Lucide Icons | Icon library |
| Vite | Build tool |

### Backend (built but decoupled)
| Technology | Purpose |
|------------|---------|
| FastAPI (Python) | REST API |
| PostgreSQL | Database |
| Docker | Containerization |

---

## 🏗️ Architecture Decision

This project uses a **Mock Service Layer** pattern — a deliberate
architectural decision to decouple the frontend from the backend.

```
┌─────────────────────────────────────────┐
│           React Frontend                │
├─────────────────────────────────────────┤
│         services/api.ts                 │
│      (Mock Service Layer)               │
│  mirrors real REST API contracts        │
├─────────────────────────────────────────┤
│           mockData.ts                   │
│    (In-memory data store)               │
└─────────────────────────────────────────┘
```

### Why Mock Service Layer?
- ✅ **Zero setup** — runs without backend or database
- ✅ **Same API contracts** — swapping real backend is one config change
- ✅ **Consistent demo data** — no flaky network issues during demos
- ✅ **Industry standard** — used by Google, Meta for frontend dev & testing
- ✅ **Faster development** — frontend and backend can be built in parallel

### To Connect Real Backend
```typescript
// services/api.ts — change one line:
const BASE_URL = 'https://your-api.com'  // was: mock functions
```
Every component works without a single change.

---

## 📁 Project Structure

```
smart-commute-hub/
├── frontend/                   # React TypeScript app
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AppSidebar.tsx  # Navigation with role filtering
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── RouteMap.tsx    # SVG map visualization
│   │   │   ├── DemoBadge.tsx   # Demo credentials badge
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx          # Dual role login
│   │   │   ├── AdminDashboardPage.tsx # Full analytics
│   │   │   ├── DashboardPage.tsx      # Employee view
│   │   │   ├── MyRidesPage.tsx        # Carpool groups
│   │   │   ├── NewRequestPage.tsx     # Submit request
│   │   │   └── OfficesPage.tsx        # Office listing
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx        # Demo auth + roles
│   │   │   ├── ThemeContext.tsx
│   │   │   └── NotificationContext.tsx
│   │   ├── services/
│   │   │   └── api.ts                 # Mock service layer
│   │   └── mockData.ts                # Demo data store
│   ├── index.html
│   └── package.json
│
├── backend/                    # FastAPI + PostgreSQL
│   ├── main.py
│   ├── models/
│   ├── routes/
│   └── requirements.txt
│
└── docker-compose.yml          # Full stack with Docker
```

---

## 🚀 Run Locally

### Frontend Only (recommended for demo)
```bash
# Clone the repo
git clone https://github.com/Vinayg24/smartcommute.git

# Go to frontend
cd smartcommute/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open: **http://localhost:8080**

### Full Stack with Docker
```bash
# From project root
docker-compose up
```
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Database: PostgreSQL on port 5432

---

## 🔐 Authentication

The app uses role-based authentication with two distinct portals:

```
Login Page
├── 👑 Admin Portal
│   └── Redirects to /admin/dashboard
│       ├── Full analytics
│       ├── All demand requests
│       ├── Carpool management
│       └── CSV export
│
└── 👤 Employee Portal
    └── Redirects to /dashboard
        ├── Personal requests
        ├── My rides
        └── Cost savings
```

---

## 📊 Key Metrics Tracked

| Metric | Description |
|--------|-------------|
| 🚗 Total Requests | Daily ride requests across all offices |
| 👥 Active Ride Shares | Currently matched carpool groups |
| ₹ Cost Saved | Money saved through carpooling (INR) |
| 🌱 CO₂ Reduced | Carbon footprint reduction in kg |

---

## 🗺️ Offices Supported

| Office | Location | Capacity |
|--------|----------|----------|
| BKC HQ | Bandra Kurla Complex, Mumbai | 200 |
| Powai Tech Park | Hiranandani Gardens, Powai | 150 |
| Lower Parel Hub | Lower Parel, Mumbai | 100 |

---

## 👨‍💻 Author

**Vinay G**  
- GitHub: [@Vinayg24](https://github.com/Vinayg24)

---

## 📄 License

MIT License — feel free to use this project for learning and demos.

---

⭐ **If you found this helpful, please give it a star!**