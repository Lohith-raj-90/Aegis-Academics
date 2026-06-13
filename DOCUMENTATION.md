# Aegis Academics — Technical Documentation

> **Version:** 1.0.0  
> **Author:** Lohith R C  
> **Institution:** Kalpataru Institute of Technology (KIT), Tiptur — CSE Department  
> **Repository:** [github.com/Lohith-raj-90/Aegis-Academics](https://github.com/Lohith-raj-90/Aegis-Academics)  
> **Live:** [aegis-academics.onrender.com](https://aegis-academics.onrender.com)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [Technical Stack](#3-technical-stack)
4. [System Architecture](#4-system-architecture)
5. [Application Flow](#5-application-flow)
6. [Code Model & Logic](#6-code-model--logic)
7. [Database Schema](#7-database-schema)
8. [API Reference](#8-api-reference)
9. [Authentication & Security](#9-authentication--security)
10. [Security Assessment](#10-security-assessment)
11. [Strengths & Limitations](#11-strengths--limitations)
12. [Strategic Roadmap](#12-strategic-roadmap)
13. [Implementation Plan](#13-implementation-plan)
14. [Immediate Next Steps](#14-immediate-next-steps)

---

## 1. Project Overview

**Aegis Academics** is a full-stack academic command center designed for college students under the Visvesvaraya Technological University (VTU) system. It consolidates attendance forecasting, exam planning, syllabus management, placement quizzes, interactive 3D math visualizers, and an AI-powered study companion into a single unified workspace.

### Problem Statement

VTU mandates a strict 75% attendance threshold for examination eligibility. Students juggle fragmented spreadsheets, paper notebooks, WhatsApp groups, and guesswork to track attendance, study schedules, and syllabus coverage. There is no single source of truth.

### Solution

Aegis Academics provides a centralized command center with:

- **Real-time attendance simulation** — predict the impact of skipping classes before taking leave
- **AI-powered study assistant** — ask questions about calculus, quantum physics, or automata theory
- **Interactive 3D visualizations** — rotate and explore mathematical projections in the browser
- **Placement-ready quizzes** — diagnostic tests with readiness scoring
- **Unified task planner** — schedule and track study sessions across subjects

### Core Philosophy

The application follows a "cyber-grid" dark aesthetic with a sci-fi command shell design language, optimized for long study sessions with reduced eye strain. All features work offline with built-in heuristic fallbacks when the AI backend is unavailable.

---

## 2. Key Features

| Module | Description | Key Capabilities |
|--------|-------------|------------------|
| **Dashboard** | Central command hub | Semester progress, readiness scores, subject mastery, weekly velocity charts, AI advisor feed |
| **Attendance Tracker** | VTU eligibility simulator | Per-subject tracking, "Can I Bunk?" calculator, predictive trend sparklines, batch day logging, weekly timetable context |
| **Planner** | Study task scheduler | Day-wise task management, priority levels, unscheduled study targets, completion tracking |
| **Library** | Syllabus resource vault | 5 categorized resources, sync status tracking, abstract previews, subject filtering |
| **Quiz Suite** | Placement diagnostics | Multiple-choice, flashcards, short-answer, and technical question types with readiness scoring |
| **AI Chat** | Gemini-powered study companion | Real-time LLM responses with exponential backoff, offline heuristic fallback, topic-aware keyword highlighting |
| **3D Sandbox** | Interactive math visualizer | WebGL-style quantum core renderer with drag-to-rotate, orbital animations, coordinate projections |
| **Landing Page** | Public promotional page | 3D scroll animations, interactive quiz sandbox, developer bio, contact form |

### Attendance Sub-Features

- **Batch Day Logging** — log all 5 subjects for a specific date in one action
- **Weekly Timetable Context** — auto-detects scheduled subjects for the selected day
- **"Can I Bunk?" Calculator** — dynamically calculates safe skip count or recovery sessions needed
- **Predictive Trend Sparklines** — visual attendance velocity per subject with Up/Down indicators
- **Warning Thresholds** — pulsing red indicators when attendance drops below 75%

---

## 3. Technical Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0.1 | UI framework with hooks-based state management |
| **TypeScript** | 5.8.2 | Type-safe development |
| **Tailwind CSS** | 4.1.14 | Utility-first styling with custom theme |
| **Motion (Framer Motion)** | 12.23.24 | Animations, scroll reveals, 3D transitions |
| **Lucide React** | 0.546.0 | Icon library |
| **Vite** | 6.2.3 | Build tool and dev server |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express** | 4.21.2 | HTTP server framework |
| **Node.js** | 20.x | Runtime environment |
| **esbuild** | 0.25.0 | Server bundle compilation |

### Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** (production) | Managed | Primary database via Render |
| **SQLite** (local dev) | better-sqlite3 12.10.0 | Local development fallback |

### AI Integration

| Technology | Version | Purpose |
|------------|---------|---------|
| **@google/genai** | 2.8.0 | Google Gemini AI client |
| **Primary Model** | gemini-2.5-flash | Main AI response generation |
| **Fallback Model** | gemini-2.5-flash-lite | Backup when primary is unavailable |

### Security & Auth

| Technology | Version | Purpose |
|------------|---------|---------|
| **bcrypt** | 6.0.0 | Password hashing (10 salt rounds) |
| **jsonwebtoken** | 9.0.3 | JWT token creation and verification |
| **dotenv** | 17.2.3 | Environment variable management |

### DevOps

| Technology | Purpose |
|------------|---------|
| **Render** | Cloud hosting with PostgreSQL |
| **Docker** | Container deployment (node:20) |
| **GitHub Actions** | Auto-deploy on push |

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│  │  React SPA   │  │  Tailwind   │  │  Motion/Framer      │    │
│  │  (App.tsx)   │  │  CSS v4     │  │  Animations          │    │
│  └──────┬──────┘  └─────────────┘  └─────────────────────┘    │
│         │                                                       │
│  ┌──────┴──────────────────────────────────────────────────┐   │
│  │  localStorage Cache                                      │   │
│  │  • aegis_token (JWT)                                     │   │
│  │  • aegis_user_cache (profile fallback)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP/REST (JSON)
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                       EXPRESS SERVER                             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Middleware Stack                                        │   │
│  │  1. express.json() — Body parsing                       │   │
│  │  2. CORS headers — Access control                       │   │
│  │  3. asyncHandler — Async error catching                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Router (22 endpoints)                              │   │
│  │  • /api/auth/* — Registration, login, logout, profile   │   │
│  │  • /api/tasks — CRUD for study tasks                    │   │
│  │  • /api/unscheduled — Study targets                     │   │
│  │  • /api/library — Resource management                   │   │
│  │  • /api/chat/messages — Chat persistence                │   │
│  │  • /api/attendance — Attendance logging                 │   │
│  │  • /api/user/* — Profile updates                        │   │
│  │  • /api/chat — AI proxy (Gemini API)                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Auth Layer                                              │   │
│  │  • JWT verification (7-day expiry)                      │   │
│  │  • Session validation (DB-backed)                       │   │
│  │  • bcrypt password comparison                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  AI Engine                                               │   │
│  │  • Primary: gemini-2.5-flash                            │   │
│  │  • Fallback: gemini-2.5-flash-lite                      │   │
│  │  • Retry: 3 attempts × 2 models, exponential backoff   │   │
│  │  • Offline: Built-in heuristic responses                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│                                                                 │
│  ┌─────────────────────────┐  ┌────────────────────────────┐   │
│  │  PostgreSQL (Production) │  │  SQLite (Local Dev)        │   │
│  │  Render Managed DB       │  │  aegis.db (WAL mode)       │   │
│  │  SSL: rejectUnauthorized │  │  Auto-created on startup   │   │
│  │  = false                 │  │                            │   │
│  └─────────────────────────┘  └────────────────────────────┘   │
│                                                                 │
│  Unified query() function — auto-detects Postgres vs SQLite    │
│  Translates $N → ? parameters transparently                     │
└─────────────────────────────────────────────────────────────────┘
```

### Dual Database Engine

The `db.ts` module implements a transparent dual-engine architecture:

- **Production (Render):** PostgreSQL via `pg` pool with SSL, activated when `DATABASE_URL` is set
- **Local Development:** SQLite via `better-sqlite3` with WAL journal mode, stored as `aegis.db`

A single `query()` function abstracts both engines:
- Translates PostgreSQL `$N` parameter placeholders to SQLite `?` placeholders
- Auto-detects SELECT vs. INSERT/UPDATE/DELETE to return rows or `lastInsertRowid`
- Both engines create identical table schemas on startup

---

## 5. Application Flow

### 5.1 Authentication Flow

```
User opens app
    │
    ▼
Check localStorage for "aegis_token"
    │
    ├── Token exists → Set isLoggedIn = true
    │       │
    │       ▼
    │   fetchUserData()
    │       │
    │       ├── GET /api/auth/me (with Bearer token)
    │       │       │
    │       │       ├── 200 OK → Load profile, tasks, library, chat
    │       │       │           Cache profile in localStorage
    │       │       │
    │       │       ├── 401 Unauthorized → handleLogout()
    │       │       │                       Clear token + cache
    │       │       │                       Show login page
    │       │       │
    │       │       └── Network error → Retry 3x (2s, 4s, 6s)
    │       │                           On failure: restore cached profile
    │       │
    │       └── Show main app with data (or cached fallback)
    │
    └── No token → Show login/register page
            │
            ├── Login: POST /api/auth/login
            │   → Store JWT in localStorage
            │   → fetchUserData() → Show dashboard
            │
            └── Register: POST /api/auth/register
                → Store JWT in localStorage
                → fetchUserData() → Show dashboard
```

### 5.2 Attendance Calculation Flow

```
User opens Attendance tab
    │
    ▼
Load ledger entries from state
    │
    ▼
For each subject:
    │
    ├── Count totalConducted (all entries)
    ├── Count totalAttended (Attended + Duty Leave)
    ├── Calculate realPercentage = attended/conducted × 100
    │
    ├── Apply skipSimulations[subject] (user-adjusted slider)
    │   simulatedConducted = totalConducted + simulatedSkips
    │   simulatedPercentage = attended/simulatedConducted × 100
    │
    ├── Calculate bunkRecovery:
    │   If ≥75%: canSkip = consecutive skips before dropping below 75%
    │   If <75%: mustAttend = consecutive attends needed to reach 75%
    │
    └── Generate trend sparkline from running percentage history

Overall Simulated Average:
    Sum(attended across all subjects) / Sum(conducted + skips across all subjects) × 100
    → Updates parent via onUpdateAttendance()
    → Persisted to DB via PUT /api/user/attendance
```

### 5.3 AI Chat Flow

```
User sends message
    │
    ▼
POST /api/chat { messages: [{role, content}] }
    │
    ▼
Check for GEMINI_API_KEY
    │
    ├── No API key → Return heuristic response (topic-matched)
    │
    └── API key present → Try gemini-2.5-flash
            │
            ├── Success → Return response
            │
            └── 503/429 error → Retry up to 3x (300ms, 660ms, 1452ms)
                    │
                    ├── Success → Return response
                    │
                    └── All retries fail → Try gemini-2.5-flash-lite
                            │
                            ├── Success → Return response
                            │
                            └── All models fail → Heuristic fallback
```

---

## 6. Code Model & Logic

### 6.1 Component Architecture

| Component | Role | State | Key Logic |
|-----------|------|-------|-----------|
| `App.tsx` | Root shell | 25+ state variables | Auth, routing, API orchestration, global state |
| `DashboardView` | Metrics overview | 6 local states | Subject mastery, weekly velocity, AI insights |
| `AttendanceView` | Attendance tracker | 8 local states | Metrics calculation, bunk calculator, batch logging |
| `ChatView` | AI chat UI | Input state | Message rendering, auto-scroll, loading states |
| `QuizView` | Quiz engine | 5 local states | Timer, scoring, question navigation |
| `PlannerView` | Task scheduler | 3 local states | Task CRUD, unscheduled targets |
| `LibraryView` | Resource browser | 2 local states | Preview panel, sync toggles |
| `LandingView` | Public promo | 7 local states | Quiz sandbox, contact form, tab navigation |

### 6.2 Key Algorithms

#### Bunk/Recovery Calculator (`calculateBunkRecovery`)

```typescript
function calculateBunkRecovery(attended: number, total: number) {
  if (total === 0) return { canSkip: 0, mustAttend: 0 };
  const currentPct = (attended / total) * 100;

  if (currentPct >= 75) {
    // Calculate consecutive skips before dropping below 75%
    let canSkip = 0;
    while ((attended / (total + canSkip + 1)) * 100 >= 75) {
      canSkip++;
    }
    return { canSkip, mustAttend: 0 };
  } else {
    // Calculate consecutive attends needed to reach 75%
    let mustAttend = 0;
    let testAttended = attended, testTotal = total;
    while ((testAttended / testTotal) * 100 < 75) {
      testAttended++; testTotal++; mustAttend++;
    }
    return { canSkip: 0, mustAttend };
  }
}
```

#### MiniSparkline SVG Generator

Computes a running percentage history from ledger entries, maps to SVG coordinates with min/max normalization, and renders a polyline with endpoint indicator.

#### AI Response Fallback Chain

Priority: Primary Model → Retry → Fallback Model → Retry → Heuristic Engine

The heuristic engine matches user prompts against keyword categories (calculus, quantum, automata, attendance, library) and returns pre-built markdown responses optimized for the VTU curriculum.

### 6.3 State Management Pattern

All state is managed via React hooks (no external state library):

- **Global state:** `useState` in `App.tsx`, passed down via props
- **Local state:** `useState` in individual components
- **Side effects:** `useEffect` for data fetching, timers, animations
- **Memoization:** `useCallback` for stable function references
- **Refs:** `useRef` for stale closure prevention and DOM access

### 6.4 Build Pipeline

```
Development:
  tsx server.ts → Express + Vite dev middleware → HMR

Production Build:
  1. vite build → dist/ (static frontend assets)
  2. esbuild → dist/server.mjs (server bundle, ESM format)
  
Production Run:
  node dist/server.mjs → Express serves static files + API
```

---

## 7. Database Schema

### Entity Relationship

```
users (1) ──────< (N) sessions
users (1) ──────< (N) tasks
users (1) ──────< (N) unscheduled_targets
users (1) ──────< (N) library_resources
users (1) ──────< (N) chat_messages
users (1) ──────< (N) attendance_ledger
users (1) ──────< (N) quiz_sessions
```

### Table Definitions

#### `users` — Core user accounts
| Column | Type | Default |
|--------|------|---------|
| `id` | SERIAL/INTEGER PK | Auto-increment |
| `email` | TEXT UNIQUE NOT NULL | — |
| `password_hash` | TEXT NOT NULL | — |
| `name` | TEXT NOT NULL | — |
| `badge` | TEXT | `'Apprentice Scholar'` |
| `avatar_url` | TEXT | `''` |
| `readiness_score` | INTEGER | `0` |
| `attendance_pct` | INTEGER | `0` |
| `created_at` | TEXT | `CURRENT_TIMESTAMP` |
| `updated_at` | TEXT | `CURRENT_TIMESTAMP` |

#### `sessions` — Server-side session tracking
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | TEXT PK | UUID |
| `user_id` | INTEGER | FK → users(id) CASCADE |
| `expires_at` | TEXT | 7-day expiry |
| `created_at` | TEXT | `CURRENT_TIMESTAMP` |

#### `tasks` — Scheduled study tasks
| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | UUID |
| `user_id` | INTEGER | FK → users(id) CASCADE |
| `subject` | TEXT | e.g., "Advanced Calculus" |
| `topic` | TEXT | e.g., "Taylor Series Expansion" |
| `day` | TEXT | Monday–Friday |
| `duration` | TEXT | e.g., "14:00 - 15:30" |
| `priority` | TEXT | High / Medium / Low |
| `completed` | INTEGER | 0 or 1 |

#### `unscheduled_targets` — Flexible study goals
| Column | Type |
|--------|------|
| `id` | TEXT PK |
| `user_id` | INTEGER FK |
| `subject` | TEXT |
| `topic` | TEXT |
| `estimated_hours` | INTEGER |

#### `library_resources` — Syllabus vault
| Column | Type |
|--------|------|
| `id` | TEXT PK |
| `user_id` | INTEGER FK |
| `title` | TEXT |
| `category` | TEXT (Mathematics / Computer Science / Engineering / Physics) |
| `file_size` | TEXT |
| `synced` | INTEGER (0/1) |
| `abstract` | TEXT (nullable) |

#### `chat_messages` — AI conversation history
| Column | Type |
|--------|------|
| `id` | TEXT PK |
| `user_id` | INTEGER FK |
| `role` | TEXT (user / assistant) |
| `content` | TEXT |
| `timestamp` | TEXT |

#### `attendance_ledger` — Attendance records
| Column | Type |
|--------|------|
| `id` | TEXT PK |
| `user_id` | INTEGER FK |
| `subject` | TEXT |
| `date` | TEXT (ISO date) |
| `status` | TEXT (Attended / Absent / Mass Bunk / Duty Leave) |

#### `quiz_sessions` — Quiz attempt records
| Column | Type |
|--------|------|
| `id` | TEXT PK |
| `user_id` | INTEGER FK |
| `type` | TEXT |
| `title` | TEXT |
| `questions` | TEXT (JSON) |
| `score` | INTEGER |
| `completed` | INTEGER |

### Indexes (7 total)

All indexed on `user_id` for efficient per-user queries:
`idx_tasks_user_id`, `idx_unscheduled_user_id`, `idx_library_user_id`, `idx_chat_user_id`, `idx_attendance_user_id`, `idx_quiz_user_id`, `idx_sessions_user_id`

---

## 8. API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account. Body: `{email, password, name}`. Returns: `{token, user}` |
| POST | `/api/auth/login` | No | Login. Body: `{email, password}`. Returns: `{token, user}` |
| POST | `/api/auth/logout` | Yes | Destroy session |
| GET | `/api/auth/me` | Yes | Get current user profile |
| PUT | `/api/auth/profile` | Yes | Update name/email |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | Yes | List all tasks |
| POST | `/api/tasks` | Yes | Create task. Body: `{subject, topic, day, duration, priority, completed}` |
| PUT | `/api/tasks/:id` | Yes | Toggle completion. Body: `{completed}` |
| DELETE | `/api/tasks/:id` | Yes | Delete task |

### Unscheduled Targets

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/unscheduled` | Yes | List targets |
| POST | `/api/unscheduled` | Yes | Create target. Body: `{subject, topic, estimatedHours}` |
| DELETE | `/api/unscheduled/:id` | Yes | Delete target |

### Library

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/library` | Yes | List resources |
| PUT | `/api/library/:id/sync` | Yes | Toggle sync. Body: `{synced}` |

### Chat

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/chat/messages` | Yes | Get chat history |
| POST | `/api/chat/messages` | Yes | Store message. Body: `{role, content, timestamp}` |
| POST | `/api/chat` | No | AI proxy. Body: `{messages: [{role, content}]}` |

### Attendance

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/attendance` | Yes | List records |
| POST | `/api/attendance` | Yes | Log entry. Body: `{subject, date, status}` |
| DELETE | `/api/attendance/:id` | Yes | Delete record |

### User Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/api/user/readiness` | Yes | Update score. Body: `{score}` |
| PUT | `/api/user/attendance` | Yes | Update percentage. Body: `{percentage}` |

**Total: 22 endpoints**

---

## 9. Authentication & Security

### Authentication Mechanism

- **JWT tokens** with 7-day expiry, containing `{userId, email, sessionId}`
- **Server-side sessions** stored in the `sessions` table, validated on every request
- **bcrypt password hashing** with 10 salt rounds
- **Bearer token** in `Authorization` header

### Auth Middleware Chain

1. Extract `Bearer` token from header
2. Verify JWT signature and extract payload
3. Look up session in database by `sessionId`
4. Check session `expires_at` against current time
5. Load full user object from `users` table
6. Attach to `req.user` for downstream handlers

### Token Lifecycle

```
Register/Login → Create session (7-day TTL) → Sign JWT → Store in localStorage
                                                              ↓
Page Load → Read token → Verify JWT → Check session in DB → Load user
                                                              ↓
Session expired → 401 response → Clear token + cache → Redirect to login
```

### Caching Strategy

- **User profile** cached in `localStorage` under `aegis_user_cache`
- On backend failure, cached profile is restored instantly
- Retry logic: 3 attempts with 2s, 4s, 6s backoff before falling back to cache

---

## 10. Security Assessment

### Vulnerabilities

| Severity | Issue | Description | Mitigation |
|----------|-------|-------------|------------|
| **High** | Hardcoded JWT secret fallback | `JWT_SECRET` defaults to a known string if not set | `render.yaml` now auto-generates JWT_SECRET; set explicitly in production |
| **High** | CORS wildcard (`*`) | `Access-Control-Allow-Origin: *` allows any origin | Restrict to actual domain in production |
| **Medium** | No rate limiting | Login/register endpoints have no rate limiting | Add `express-rate-limit` middleware |
| **Medium** | No email validation beyond `@` check | Weak email format validation | Use a proper email validation library |
| **Medium** | No password complexity rules | Only minimum 6-character requirement | Add uppercase, number, special character requirements |
| **Medium** | No session cleanup mechanism | Expired sessions accumulate in DB forever | Add cron job to purge expired sessions |
| **Low** | `SELECT *` in login query | Fetches all columns including `password_hash` | Select only needed columns |
| **Low** | No CSRF protection | Relies on Bearer token (not cookies) for auth | Acceptable for API-only architecture |
| **Low** | Duplicate `express.json()` middleware | Body parser runs twice per request | Remove from router, keep in main server |

### Strengths

| Aspect | Implementation |
|--------|----------------|
| **Password hashing** | bcrypt with 10 salt rounds — industry standard |
| **Session validation** | DB-backed sessions with expiry checks on every request |
| **JWT + Session hybrid** | Tokens provide stateless auth; sessions enable server-side revocation |
| **Graceful degradation** | App works offline with cached data when backend is unavailable |
| **Retry logic** | Exponential backoff prevents thundering herd on cold starts |
| **Input parameterization** | All SQL queries use parameterized queries — no SQL injection |
| **Async error handling** | `asyncHandler` wrapper prevents unhandled promise rejections |

---

## 11. Strengths & Limitations

### Strengths

1. **Unified workspace** — consolidates 7+ academic tools into one application
2. **Offline resilience** — localStorage caching, heuristic fallbacks, retry logic
3. **Dual database engine** — transparent PostgreSQL/SQLite switching
4. **VTU-specific features** — attendance thresholds, curriculum-aligned content
5. **Interactive 3D** — WebGL-style math visualizations in the browser
6. **AI integration** — Gemini-powered chat with intelligent fallback chain
7. **Responsive design** — Tailwind CSS with mobile-optimized layouts
8. **Auto-deploy** — GitHub push triggers Render deployment automatically

### Limitations

1. **No real-time collaboration** — single-user per account, no shared workspaces
2. **No file upload** — library resources are metadata-only, no actual file storage
3. **No email verification** — accounts are created without email confirmation
4. **No password reset** — no forgot password flow
5. **No data export** — no CSV/PDF export of attendance or study data
6. **No push notifications** — no browser notifications for task deadlines
7. **SQLite limitations** — local dev uses SQLite which doesn't support concurrent writes
8. **No test suite** — no unit tests, integration tests, or E2E tests
9. **No CI/CD pipeline** — no automated testing before deployment
10. **No monitoring** — no error tracking (Sentry) or analytics

---

## 12. Strategic Roadmap

### Phase 1: Stability & Security (Immediate)

| Priority | Task | Impact |
|----------|------|--------|
| P0 | Add rate limiting to auth endpoints | Prevent brute-force attacks |
| P0 | Set explicit JWT_SECRET in production | Eliminate hardcoded secret vulnerability |
| P0 | Restrict CORS to production domain | Prevent unauthorized cross-origin requests |
| P1 | Add email verification on registration | Verify user identity |
| P1 | Implement password reset flow | Account recovery |
| P1 | Add session cleanup cron job | Database hygiene |

### Phase 2: Core Enhancements (Short-term)

| Priority | Task | Impact |
|----------|------|--------|
| P1 | Add unit tests (Vitest) | Code reliability |
| P1 | Add data export (CSV/PDF) | User productivity |
| P1 | Implement file upload for library | Real resource management |
| P2 | Add push notifications | Task deadline reminders |
| P2 | Add dark/light theme toggle | Accessibility |
| P2 | Implement infinite scroll for chat | Better UX for long conversations |

### Phase 3: Advanced Features (Medium-term)

| Priority | Task | Impact |
|----------|------|--------|
| P2 | Real-time collaboration (WebSocket) | Group study sessions |
| P2 | AI-powered study plan generator | Personalized learning paths |
| P2 | Integration with Google Calendar | Schedule synchronization |
| P3 | Mobile app (React Native) | Mobile-first experience |
| P3 | Advanced analytics dashboard | Data-driven insights |
| P3 | Multi-language support | Accessibility |

### Phase 4: Scale & Enterprise (Long-term)

| Priority | Task | Impact |
|----------|------|--------|
| P3 | College-wide deployment mode | Institutional adoption |
| P3 | Admin dashboard for faculty | Oversight capabilities |
| P3 | LMS integration (Moodle, Canvas) | Ecosystem compatibility |
| P3 | API rate limiting & quotas | Scalability |
| P3 | CDN for static assets | Performance |

---

## 13. Implementation Plan

### Immediate Actions (Week 1-2)

1. **Security hardening**
   - Add `express-rate-limit` for auth endpoints
   - Set `JWT_SECRET` via environment variable
   - Configure CORS for production domain only
   - Add helmet.js for HTTP security headers

2. **Testing foundation**
   - Set up Vitest for unit testing
   - Write tests for auth flows (register, login, logout)
   - Write tests for attendance calculation logic
   - Add CI/CD pipeline with GitHub Actions

3. **Data persistence**
   - Verify PostgreSQL connection on Render
   - Add database migration scripts
   - Implement session cleanup cron

### Short-term Actions (Week 3-6)

1. **User experience**
   - Add email verification flow
   - Implement password reset
   - Add data export functionality
   - Improve error messages and loading states

2. **Core features**
   - Add file upload for library resources
   - Implement push notifications
   - Add dark/light theme toggle
   - Improve mobile responsiveness

3. **Code quality**
   - Enable TypeScript strict mode
   - Fix all lint warnings
   - Add ESLint configuration
   - Implement code review process

### Medium-term Actions (Month 2-4)

1. **Advanced features**
   - Real-time collaboration via WebSocket
   - AI study plan generator
   - Google Calendar integration
   - Advanced analytics

2. **Performance**
   - Code splitting for lazy-loaded routes
   - Image optimization
   - CDN integration
   - Database query optimization

3. **Monitoring**
   - Add Sentry for error tracking
   - Add Vercel Analytics or similar
   - Implement health check endpoints
   - Add logging infrastructure

---

## 14. Immediate Next Steps

### For the Developer

1. **Set environment variables on Render:**
   ```
   GEMINI_API_KEY=your_key_here
   JWT_SECRET=auto-generated
   DATABASE_URL=auto-linked
   ```

2. **Run locally:**
   ```bash
   npm install
   npm run dev
   ```

3. **Deploy:**
   ```bash
   git push origin main
   ```

### For Contributors

1. Read the codebase structure in `src/`
2. Run `npm run lint` to check types
3. Run `npm run build` to verify production build
4. Follow existing code conventions (Tailwind classes, React hooks patterns)

### For Institutional Adoption

1. Contact the developer at lohithraj9090@gmail.com
2. Review the security assessment in Section 10
3. Plan a pilot deployment for a single department
4. Gather feedback and iterate

---

## Appendix A: File Structure

```
aegis-academics/
├── server.ts                    # Express server + AI chat endpoint
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── render.yaml                  # Render deployment config
├── Dockerfile                   # Container deployment
├── .dockerignore                # Docker build exclusions
├── index.html                   # SPA entry point
├── src/
│   ├── main.tsx                 # React root mount
│   ├── App.tsx                  # Root component, state, routing
│   ├── index.css                # Global styles, fonts, scrollbar
│   ├── types.ts                 # TypeScript interfaces
│   ├── data.ts                  # Default data and quiz questions
│   ├── components/
│   │   ├── LandingView.tsx      # Public promo page
│   │   ├── LoginView.tsx        # Login form
│   │   ├── RegistrationView.tsx # Registration form
│   │   ├── DashboardView.tsx    # Main dashboard
│   │   ├── DashboardContainer.tsx # Dashboard wrapper
│   │   ├── AttendanceView.tsx   # Attendance tracker
│   │   ├── PlannerView.tsx      # Study planner
│   │   ├── LibraryView.tsx      # Library resources
│   │   ├── QuizView.tsx         # Quiz engine
│   │   ├── ChatView.tsx         # AI chat interface
│   │   ├── QuantumCore3D.tsx    # 3D visualization
│   │   ├── Tilt3D.tsx           # 3D tilt hover effect
│   │   ├── SmoothCursor.tsx     # Custom cursor
│   │   └── ScrollReveal.tsx     # Scroll animations
│   └── server/
│       ├── db.ts                # Database engine (PG + SQLite)
│       ├── routes.ts            # API route handlers
│       ├── auth.ts              # JWT auth utilities
│       └── seed.ts              # Database seeding
├── dist/                        # Production build output
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.css          # Compiled CSS
│   │   └── index-*.js           # Compiled JS
│   └── server.mjs               # Bundled server
└── aegis.db                     # SQLite database (local dev only)
```

---

## Appendix B: Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | No | `null` | Google Gemini API key for AI chat |
| `JWT_SECRET` | Yes | Hardcoded fallback | Secret for signing JWT tokens |
| `DATABASE_URL` | No | SQLite fallback | PostgreSQL connection string |
| `PORT` | No | `3000` | Server listening port |
| `NODE_ENV` | No | `production` | Environment mode |

---

## Appendix C: Default Seed Data

### Demo Accounts

| Email | Password | Name | Badge |
|-------|----------|------|-------|
| lohith.rc@aegis.edu | student123 | Lohith R C | Sovereign Scholar |
| priya.s@aegis.edu | student123 | Priya Sharma | Sage Practitioner |
| rahul.k@aegis.edu | student123 | Rahul Kumar | Apprentice Scholar |

### Subjects Tracked

1. Advanced Calculus (MA-301)
2. Fluid Dynamics (ME-302)
3. Quantum Computing (CS-303)
4. Neural Networks (CS-304)
5. Formal Automata (CS-305)

---

*Documentation generated for Aegis Academics v1.0.0 — Built by Lohith R C, KIT Tiptur CSE*
