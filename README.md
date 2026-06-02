# Job Portal

A full-stack job portal application built as a monorepo. It features a public-facing user interface for job seekers and an admin dashboard for managing job listings and users.

## 🚀 Tech Stack

This project is built using modern web technologies and a monorepo architecture managed by **pnpm workspaces** and **Turborepo**.

### Frontend (`apps/web`)
- **React 19**
- **Vite**
- **TypeScript**
- **Tailwind CSS 4**
- **Redux Toolkit** for state management
- **React Router DOM** for routing
- **Axios** for API requests

### Backend (`apps/api`)
- **NestJS 11**
- **TypeScript**
- **PostgreSQL** with **TypeORM**
- **JWT** for authentication
- **bcrypt** for password hashing

### Shared Packages (`packages/types`)
- Shared TypeScript types and interfaces used by both the frontend and backend.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [pnpm](https://pnpm.io/) (v10+)
- [PostgreSQL](https://www.postgresql.org/)

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jobportal
   ```

2. Install dependencies for the entire workspace:
   ```bash
   pnpm install
   ```

3. Environment Setup:
   - Create a `.env` file in `apps/api` (refer to `.env.example` if available) and configure your PostgreSQL database connection URL and JWT secret.
   - Create a `.env` file in `apps/web` for any required frontend environment variables (e.g., `VITE_API_URL`).

## 💻 Running the Application

You can run both the frontend and backend simultaneously from the root directory using concurrently, or individually.

### Run everything (Frontend + Backend)
```bash
pnpm run dev
```

### Run individually

**Backend (API):**
```bash
pnpm run dev:api
```

**Frontend (Web):**
```bash
pnpm run dev:web
```

## 📂 Project Structure

jobportal/
├── apps/
│   ├── api/          # NestJS backend application
│   └── web/          # React frontend application
├── packages/
│   └── types/        # Shared TypeScript types
├── package.json      # Root package.json (workspace config & scripts)
└── pnpm-workspace.yaml # pnpm workspace definition
