# EduTrack — Student Management System

A full-stack MERN application for managing students, courses, attendance, and academic
records. Built with React, Node.js/Express, MongoDB, and JWT authentication.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, Context API, Tailwind CSS, Vite |
| Backend | Node.js, Express.js (MVC architecture) |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt password hashing |
| Charts | Recharts |
| Forms | React Hook Form |
| Notifications | react-hot-toast |

---

## 2. Project Folder Structure


edutrack/
├── backend/
│   ├── config/
│   │   └── db.js                  # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── courseController.js
│   │   ├── attendanceController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect + role authorize
│   │   └── errorMiddleware.js     # notFound + centralized errorHandler
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Course.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── apiFeatures.js         # search/filter/sort/paginate helper
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js           # Axios instance + interceptors
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx, Sidebar.jsx, Layout.jsx
│   │   │   ├── ProtectedRoute.jsx, Loader.jsx
│   │   │   ├── DashboardCard.jsx, Pagination.jsx
│   │   │   ├── StudentTable.jsx, StudentForm.jsx
│   │   │   ├── CourseTable.jsx, AttendanceTable.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx, Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx, AddStudent.jsx, EditStudent.jsx
│   │   │   ├── Courses.jsx, AddCourse.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Profile.jsx, NotFound.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── postman/
│   └── EduTrack.postman_collection.json
└── README.md   (this file)


---

## 3. Database Schema Design

### User (Admin)
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique |
| password | String | required, hashed with bcrypt, `select:false` |
| role | String | enum `['admin']`, default `admin` |
| avatar | String | optional URL |

### Student
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique |
| phone | String | required |
| rollNumber | String | required, unique |
| department | String | required |
| semester | Number | required, 1–12 |
| address | String | optional |
| dateOfBirth | Date | required |
| profileImage | String | optional URL |
| enrolledCourses | [ObjectId] | ref `Course` |

### Course
| Field | Type | Notes |
|---|---|---|
| courseName | String | required |
| courseCode | String | required, unique, uppercase |
| credits | Number | required, 1–10 |
| instructorName | String | required |
| semester | Number | required, 1–12 |

### Attendance
| Field | Type | Notes |
|---|---|---|
| studentId | ObjectId | ref `Student`, required |
| courseId | ObjectId | ref `Course`, required |
| date | Date | required |
| status | String | enum `['Present','Absent']`, required |

A compound unique index on `(studentId, courseId, date)` prevents duplicate attendance
entries and enables upsert-based re-marking.

---

## 4. API Documentation

Base URL: `http://localhost:5000/api`
All endpoints below except `/auth/register` and `/auth/login` require:
`Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new admin |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/profile` | Get current admin profile |
| PUT | `/auth/profile` | Update name/email/password |

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET | `/students` | List students. Query: `search, department, semester, sortBy, order, page, limit` |
| GET | `/students/:id` | Get single student |
| POST | `/students` | Create student |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |

### Courses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/courses` | List courses. Query: `search, semester, page, limit` |
| GET | `/courses/:id` | Get single course |
| POST | `/courses` | Create course |
| PUT | `/courses/:id` | Update course |
| DELETE | `/courses/:id` | Delete course |

### Attendance
| Method | Endpoint | Description |
|---|---|---|
| GET | `/attendance` | List records. Query: `studentId, courseId, date, startDate, endDate, page, limit` |
| GET | `/attendance/:id` | Get single record |
| POST | `/attendance` | Mark attendance — single record, or `{ records: [...] }` for bulk class marking. Upserts to avoid duplicates. |
| PUT | `/attendance/:id` | Update a record's status/date |
| DELETE | `/attendance/:id` | Delete a record |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/stats` | Total students, total courses, attendance %, department breakdown, 7-day attendance trend, recent activity feed |

All responses follow the shape:
```json
{ "success": true, "data": ... }
```
Errors follow:
```json
{ "success": false, "message": "..." }
```

A ready-to-import Postman collection is included at `postman/EduTrack.postman_collection.json`
(auto-saves the JWT token into a collection variable after login/register).

---

## 5. JWT Authentication Setup

1. On register/login, the backend signs a JWT (`jsonwebtoken`) containing the user's `id`,
   expiring per `JWT_EXPIRES_IN` (default 7 days).
2. The frontend stores the token in `localStorage` and attaches it as
   `Authorization: Bearer <token>` on every request via an Axios request interceptor
   (`frontend/src/api/axios.js`).
3. The backend's `protect` middleware (`backend/middleware/authMiddleware.js`) verifies the
   token on every private route and attaches the authenticated user to `req.user`.
4. Passwords are hashed with `bcryptjs` (10 salt rounds) in a Mongoose `pre('save')` hook on
   the `User` model — plaintext passwords are never stored.
5. A 401 response anywhere in the app clears local storage and redirects to `/login`
   (Axios response interceptor).

---

## 6. Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### Backend
```bash
cd backend
cp .env.example .env     # then edit MONGO_URI / JWT_SECRET
npm install
npm run dev               # nodemon, http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

Register your first admin at `/register`, then log in.

---

## 7. Deployment Guide

### Database — MongoDB Atlas
1. Create a free cluster at mongodb.com/atlas.
2. Add a database user and whitelist your deployment IP (or `0.0.0.0/0` for simplicity).
3. Copy the connection string into `MONGO_URI`.

### Backend — Render (or Railway/Fly.io)
1. Push the `backend/` folder to a Git repository.
2. Create a new **Web Service** on Render, root directory `backend`.
3. Build command: `npm install` · Start command: `npm start`.
4. Add environment variables: `NODE_ENV=production`, `PORT` (Render injects this),
   `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (your deployed frontend URL).
5. Deploy — note the resulting API URL, e.g. `https://edutrack-api.onrender.com/api`.

### Frontend — Vercel (or Netlify)
1. Push the `frontend/` folder to a Git repository (or same repo, different root).
2. Import the project in Vercel, set root directory to `frontend`.
3. Framework preset: Vite. Build command: `npm run build`. Output dir: `dist`.
4. Add environment variable `VITE_API_URL=https://edutrack-api.onrender.com/api`.
5. Deploy, then update the backend's `CLIENT_URL` to match the deployed frontend domain
   (for CORS) and redeploy the backend.

### Production checklist
- [ ] Strong, random `JWT_SECRET`
- [ ] MongoDB Atlas IP allowlist tightened to your host's IP
- [ ] `NODE_ENV=production` on the backend
- [ ] CORS `origin` locked to the real frontend domain
- [ ] HTTPS enabled on both services (default on Render/Vercel)

---

## 8. Feature Checklist

- [x] JWT auth with bcrypt hashing, protected routes
- [x] Student CRUD with search, department/semester filters, sorting, pagination
- [x] Course CRUD with inline editing
- [x] Attendance: bulk daily marking, status toggle, filtering, pagination
- [x] Dashboard: stat cards, department bar chart, 7-day attendance trend line chart, recent activity feed
- [x] Form validation (React Hook Form), toast notifications, loading states
- [x] Responsive layout (collapsible sidebar on mobile)
- [x] Centralized error handling middleware on the backend
- [x] Environment-variable based configuration

---

## 9. Frontend v2 — Premium SaaS Redesign

The frontend (`frontend/`) was redesigned end-to-end as a portfolio-grade SaaS UI. The backend
API was **not modified** — every chart, KPI, and trend is computed from the existing
`/students`, `/courses`, `/attendance`, `/dashboard/stats`, and `/auth` endpoints.

### Stack additions
`@tanstack/react-query` (server state/caching), `framer-motion` (animation), `react-icons`
(Feather icon set) — added alongside the existing React Router, Axios, React Hook Form,
Recharts, and react-hot-toast.

### Design system
- **Color**: cobalt brand (`#3D5AFE`) for actions/navigation, amber accent (`#F5A623`)
  reserved for attendance/streak contexts, full light + dark themes (class-based, persisted
  to `localStorage`, respects `prefers-color-scheme` on first load).
- **Type**: Manrope (display/headings), Inter (body/UI), JetBrains Mono (roll numbers,
  course codes, dates).
- **Primitives** (`src/components/ui/`): Button, Card, Input/Select/Textarea, Modal, Table,
  Badge, Avatar, Dropdown, Tabs, ChartContainer, Skeleton, EmptyState, AnimatedCounter,
  Pagination — every page is composed from these.

### Signature element
A GitHub-contribution-style **attendance heatmap** (`components/attendance/AttendanceHeatmap.jsx`)
is reused across the Dashboard ("Institution Pulse"), the Attendance page (full history), and
each Student Profile (per-student streak) — turning attendance, the core subject of the app,
into the product's recurring visual identity.

### New pages
`/students/:id` (Student Profile with Overview/Attendance/Courses/Performance tabs),
`/reports` (cross-entity breakdowns + CSV export), `/settings` (account, theme, local
preferences) — all wired into the sidebar alongside the redesigned Dashboard, Students,
Courses, and Attendance pages.

### Data layer
`src/api/queries.js` wraps every endpoint in a React Query hook (with cache invalidation on
mutations); `src/lib/analytics.js` holds pure functions that turn raw records into chart-ready
shapes (monthly activity, course enrollment, growth trends, heatmap buckets) — all derived
from genuine timestamps in the database, nothing fabricated.

To run: same setup as section 6 — `cd frontend && npm install && npm run dev`.

## 10. Resume Bullet Points


- Designed and developed **EduTrack**, a full-stack Student Management System using
  React.js, Node.js, Express.js, and MongoDB, following MVC architecture on the backend.
- Redesigned the entire frontend as a premium SaaS dashboard (React Query, Framer Motion,
  Tailwind CSS) with a custom design system, light/dark theming, and a GitHub-style
  attendance heatmap as a signature, reusable data visualization.
- Implemented JWT-based authentication with bcrypt password hashing and protected route
  middleware for secure admin access control.
- Built CRUD modules for student, course, and attendance management with server-side
  search, filtering, sorting, and pagination (~15 REST endpoints).
- Designed a dashboard with aggregated MongoDB queries (aggregation pipelines) powering
  real-time stat cards and Recharts visualizations for enrollment and attendance trends.
- Authored a complete Postman collection and REST API documentation to streamline backend
  testing and onboarding.
#