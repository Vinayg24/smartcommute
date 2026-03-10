## SmartCommute 🚗
### Office Travel Demand Generator

## Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind + Vite
- **Backend**: FastAPI + Uvicorn
- **Database**: PostgreSQL + SQLAlchemy + Alembic
- **Cache**: Redis
- **Auth**: JWT + bcrypt
- **Realtime**: WebSockets

## Quick Start

### Manual Setup

```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
python seed_data.py
uvicorn main:app --reload
```

```bash
# Terminal 2 - Frontend
npm install
npm run dev
```

### Open App
- **Frontend**: `http://localhost:8080`
- **Login (Admin)**: `admin@smartcommute.com` / `admin123`
- **Login (Employee)**: `rahul@smartcommute.com` / `user123`

### Docker Setup

```bash
docker-compose up --build
```

Then open `http://localhost:5173`.

## Features
- **✅ JWT Auth + RBAC (4 roles)**
- **✅ Haversine ride-share matching**
- **✅ Live crowd detection**
- **✅ Real-time WebSocket notifications**
- **✅ Google Maps ready (mock fallback)**
- **✅ Analytics + CSV export**
- **✅ Redis caching**
- **✅ Docker-based environment**
- **✅ PyTest test suite**
