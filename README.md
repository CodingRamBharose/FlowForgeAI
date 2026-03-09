# FlowForgeAI

A full-stack AI workflow management platform built with React and Express.js. Design, execute, and monitor AI-powered workflows with a visual drag-and-drop builder, real-time activity tracking, role-based access control, and an admin dashboard.

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socketdotio)
![MUI](https://img.shields.io/badge/MUI-5.15-007FFF?logo=mui)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite)

---

## Features

- **Visual Workflow Builder** — Drag-and-drop canvas powered by React Flow
- **Role-Based Access Control** — Admin, Engineer, Reviewer, and Viewer roles with granular permissions
- **Real-Time Updates** — Socket.IO powered live activity feed and notifications
- **Analytics Dashboard** — Charts and stats via Recharts
- **Audit Trail** — Full history of workflow changes and user actions
- **User Management** — Admin panel to assign roles and manage users
- **Command Palette** — Quick actions with `Ctrl+K`
- **Dark / Light Theme** — Toggle between themes with MUI + Tailwind
- **Workflow Templates** — Start from pre-built templates
- **Import / Export** — JSON-based workflow import and export

---

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React 18.2 | UI framework |
| TypeScript 5.3 | Type safety |
| Vite 5.1 | Build tool & dev server |
| Redux Toolkit | State management |
| React Router v6 | Client-side routing |
| MUI v5 | Component library |
| Tailwind CSS 3.4 | Utility-first styling |
| React Flow | Visual workflow canvas |
| Recharts | Analytics charts |
| Framer Motion | Page transitions & animations |
| React Query | Server state & caching |
| Axios | HTTP client |
| Zod + React Hook Form | Form validation |
| cmdk | Command palette |

### Backend

| Technology | Purpose |
| --- | --- |
| Express.js 4.21 | REST API framework |
| Mongoose 8.5 | MongoDB ODM |
| JSON Web Tokens | Authentication (access + refresh tokens) |
| Socket.IO 4.8 | Real-time events |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| CORS | Cross-origin support |

---

## Project Structure

```
FlowForgeAI/
├── package.json            # Root monorepo (concurrently)
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # UI components by domain
│   │   ├── features/       # Redux slices & hooks
│   │   ├── routes/         # Router config & layouts
│   │   ├── services/       # API client (Axios)
│   │   ├── hooks/          # Shared custom hooks
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Helpers & utilities
│   └── package.json
└── backend/                # Express.js API
    ├── src/
    │   ├── config/         # Environment config
    │   ├── middleware/      # Auth & permission middleware
    │   ├── models/         # Mongoose schemas
    │   ├── routes/         # API route handlers
    │   ├── seed.js         # Database seeder
    │   └── server.js       # Entry point
    └── package.json
```

---

## Prerequisites

- **Node.js** >= 18
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **npm** >= 9

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/FlowForgeAI.git
cd FlowForgeAI
```

### 2. Install dependencies

```bash
npm run install:all
```

This installs root, frontend, and backend dependencies in one step.

### 3. Configure environment variables

Create `backend/.env`:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/flowforgeai
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# Admin account (created by seed script)
ADMIN_EMAIL=admin@flowforge.ai
ADMIN_PASSWORD=changeme
ADMIN_NAME=Admin User
```

### 4. Seed the database

```bash
npm run seed
```

This creates the admin user defined in your `.env`.

### 5. Start development servers

```bash
npm run dev
```

This launches both servers concurrently:

| Service | URL |
| --- | --- |
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start frontend & backend concurrently |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |
| `npm run build` | Build frontend for production |
| `npm start` | Run backend in production mode |
| `npm run seed` | Seed database with admin user |
| `npm run install:all` | Install all dependencies |

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register (always creates Viewer) |
| POST | `/api/auth/login` | Public | Login, returns JWT tokens |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| GET | `/api/auth/me` | Authenticated | Get current user |

### Workflows

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/workflows` | WORKFLOW_VIEW | List workflows |
| GET | `/api/workflows/:id` | WORKFLOW_VIEW | Get workflow |
| POST | `/api/workflows` | WORKFLOW_CREATE | Create workflow |
| PUT | `/api/workflows/:id` | WORKFLOW_EDIT | Update workflow |
| DELETE | `/api/workflows/:id` | WORKFLOW_DELETE | Delete workflow |
| PATCH | `/api/workflows/:id/publish` | WORKFLOW_PUBLISH | Publish workflow |
| PATCH | `/api/workflows/:id/approve` | WORKFLOW_APPROVE | Approve workflow |
| PATCH | `/api/workflows/:id/rollback` | WORKFLOW_ROLLBACK | Rollback workflow |

### Users (Admin only)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/users` | List all users |
| PATCH | `/api/users/:id/role` | Update user role |
| DELETE | `/api/users/:id` | Delete user |

### Audit, Notifications, Activity

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/audit` | Paginated audit logs |
| GET | `/api/audit/stats` | Audit statistics |
| GET | `/api/notifications` | List notifications |
| PATCH | `/api/notifications/:id/read` | Mark notification read |
| PATCH | `/api/notifications/read-all` | Mark all read |
| DELETE | `/api/notifications/:id` | Delete notification |
| GET | `/api/activity` | List activities |
| POST | `/api/activity` | Create activity |
| GET | `/api/health` | Health check |

---

## Roles & Permissions

| Role | Permissions |
| --- | --- |
| **Admin** | All permissions + user management |
| **Engineer** | Create, edit, view workflows |
| **Reviewer** | Approve workflows, view audit logs |
| **Viewer** | View workflows only |

New accounts registered via signup are always assigned the **Viewer** role. Only an Admin can promote users to other roles.

---

## Build for Production

```bash
npm run build
```

The frontend production bundle is output to `frontend/dist/`.

---

## License

MIT
