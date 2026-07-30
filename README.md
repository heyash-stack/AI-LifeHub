# AI LifeHub — Intelligent Life & Productivity Platform

**AI LifeHub** is an enterprise-grade full-stack platform designed to manage personal productivity, task execution, habits, daily journaling, and AI-driven lifestyle insights.

---

## 🏗 Architecture & Tech Stack

### Frontend Architecture
- **Framework**: React 18 + Vite + TypeScript
- **State & Routing**: React Context API, React Router v6, TanStack React Query v5
- **UI & Styling**: Custom HSL Design Tokens, Vanilla CSS Glassmorphism System, Lucide Icons

### Backend Architecture
- **Server**: Node.js + Express + TypeScript
- **Security**: Helmet, CORS, Rate Limiter, Bcrypt password hashing, JWT Access & Refresh Token Rotation
- **Validation & Logging**: Zod Schema validation, Winston structured logger, Express Async Handler

### Database & ORM
- **Database**: PostgreSQL 16
- **ORM**: Prisma ORM with versioned SQL migrations and TypeScript client generation

### Infrastructure & Containerization
- Docker & Docker Compose multi-container orchestration (`PostgreSQL` + `Backend API` + `Frontend UI`).

---

## 📁 Repository Folder Structure

```text
ai-lifehub/
├── docker/                 # Containerization & orchestration manifests
├── backend/                # Server API (Controllers, Services, Middlewares, Utilities)
├── frontend/               # Client UI (Components, Context, Pages, Layouts, API Client)
├── prisma/                 # Database Schema, Migrations, and Seeders
└── public/                 # Public static assets
```

---

## 🚀 Running Locally

### Option A: Via Docker Compose (Recommended)
```bash
docker-compose -f docker/dev/docker-compose.yml up --build
```
- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

### Option B: Native Execution
1. **Start PostgreSQL Database**: Ensure PostgreSQL server is running locally on port `5432`.
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run prisma:migrate
   npm run dev
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🔑 Environment Variables

Copy `.env.example` in `backend/` to `.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/ailifehub?schema=public
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

---

## 🛡 API Endpoints Summary

- `POST /api/v1/auth/register` — User registration & session provisioning
- `POST /api/v1/auth/login` — Authentication & JWT issuing
- `POST /api/v1/auth/refresh` — Refresh token rotation
- `GET /health` — Service health verification
