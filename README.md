# LiveBoard — Real-Time Collaborative Task Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6db33f?logo=spring)](https://spring.io/)
[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://openjdk.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.2-4479a1?logo=mysql)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker)](https://www.docker.com/)

**LiveBoard** is an enterprise-grade, real-time collaborative Kanban task management platform engineered for modern engineering and product teams. It showcases senior frontend development patterns including **optimistic client-side state reconciliation, WebSocket synchronization (STOMP), offline resilience with IndexedDB and Service Workers, accessible drag-and-drop mechanics (@dnd-kit), and a polished design system with CSS Modules.**

---

## Table of Contents
1. [Architectural Overview](#architectural-overview)
2. [Tech Stack & Rationale](#tech-stack--rationale)
3. [Key Features](#key-features)
4. [Real-Time & Offline Architecture](#real-time--offline-architecture)
5. [Database Design & Migrations](#database-design--migrations)
6. [API Documentation](#api-documentation)
7. [Getting Started & Local Setup](#getting-started--local-setup)
8. [Automated Testing & Results](#automated-testing--results)
9. [Performance Report](#performance-report)
10. [Accessibility & WCAG Compliance](#accessibility--wcag-compliance)

---

## Architectural Overview

```
                                      ┌──────────────────────────────────────────────┐
                                      │              Browser Client                  │
                                      │  React 18 + TypeScript + Zustand + Query     │
                                      └───────┬──────────────┬───────────────▲───────┘
                                              │ REST         │ STOMP         │
                                              │ HTTP         │ WebSocket     │ SW Cache /
                                              │              │               │ IndexedDB
                                      ┌───────▼──────────────▼──────┐        │ (Offline)
                                      │        NGINX Proxy          │        │
                                      │   (Port 80 -> SPA / API)    │        │
                                      └───────┬──────────────┬──────┘        │
                                              │              │               │
                                              ▼              ▼               │
┌────────────────────────────────────────────────────────────────────────────┴───────┐
│                               Spring Boot Backend (Port 8080)                      │
│                                                                                    │
│   ┌────────────────────┐   ┌───────────────────────────┐   ┌───────────────────┐   │
│   │   Spring Security  │   │     REST Controllers      │   │  STOMP Broker     │   │
│   │   JWT Auth & RBAC  ├───► Tasks, Projects, Users,   ◄───┤ SimpleBroker      │   │
│   │   (Owner/Admin/Mbr)│   │ Comments, Columns         │   │ /topic/projects/* │   │
│   └────────────────────┘   └─────────────┬─────────────┘   └───────────────────┘   │
│                                          │                                         │
│                                          ▼                                         │
│                            ┌───────────────────────────┐                           │
│                            │   Spring Data JPA + DB    │                           │
│                            │    Flyway Migrations      │                           │
│                            └─────────────┬─────────────┘                           │
└──────────────────────────────────────────┼─────────────────────────────────────────┘
                                           │
                                           ▼
                            ┌────────────────────────────┐
                            │      MySQL 8.2 Database    │
                            │  users, projects, tasks,   │
                            │  columns, comments, labels │
                            └────────────────────────────┘
```

---

## Tech Stack & Rationale

| Layer | Technology | Decision Rationale |
|---|---|---|
| **Frontend UI** | React 18, TypeScript | Component-driven architecture, strict typing, JSX concurrency |
| **Bundler** | Vite 5 | Instant HMR, native ES modules, production chunk optimization |
| **Client State** | Zustand | Zero-boilerplate global stores with minimal re-renders |
| **Server State** | TanStack Query v5 | Automatic background refetching, cache invalidation, optimistic rollback |
| **Drag and Drop** | @dnd-kit | Accessible, lightweight, supports Pointer & Keyboard sensors |
| **Styling** | CSS Modules + Custom Properties | Scoped class names, zero runtime overhead, design system tokens |
| **Real-time** | STOMP over SockJS | Structured pub/sub over WebSockets with automatic fallback |
| **Offline DB** | Dexie.js (IndexedDB) | Promise-based transactional storage for pending sync queue |
| **Backend** | Spring Boot 3.2, Java 21 | High-throughput enterprise REST API, Virtual Threads, Type safety |
| **Database** | MySQL 8.2 with Flyway | ACID-compliant relational storage, repeatable migration versioning |
| **Security** | Spring Security + JWT | Stateless Bearer authentication with refresh token rotation |
| **Containerization**| Docker & Docker Compose | Multi-stage production builds and single-command local deployment |

---

## Key Features

### 1. Interactive Real-Time Kanban Board
- Three default workflow columns (**To Do**, **In Progress**, **Done**) plus custom column creation.
- Seamless drag-and-drop within and between columns using `@dnd-kit`.
- Lexicographic floating midpoint positioning for stable sub-item reordering.
- Slide-in task details drawer with inline editable title, markdown description, priority picker, due date, assignee, and comments feed.

### 2. Multi-User Real-Time Sync
- Powered by Spring WebSocket STOMP message broker.
- When any collaborator moves, edits, creates, or deletes a task, all peer clients on the board update instantly.
- Connection status pulse in Topbar indicating active live sync.

### 3. Offline-First Resilience
- Built-in Service Worker via `vite-plugin-pwa` precaches app shell assets.
- If network connection drops:
  1. Offline amber banner automatically appears.
  2. Any task creations, edits, or moves are saved locally to an IndexedDB queue.
  3. When network connectivity restores, the queue automatically drains and synchronizes changes with rollback error handling.

### 4. Role-Based Access Control (RBAC)
- Three permission levels:
  - **OWNER**: Full administrative control, delete project, transfer ownership.
  - **ADMIN**: Invite members, change roles, edit project settings.
  - **MEMBER**: Create, move, and edit tasks and comments.

---

## Database Design & Migrations

The database schema is version-controlled with Flyway:

```sql
users (id, email, username, password_hash, full_name, avatar_url, timezone, created_at)
projects (id, name, description, color, icon, owner_id, is_archived, created_at)
project_members (id, project_id, user_id, role [OWNER|ADMIN|MEMBER], joined_at)
task_columns (id, project_id, name, position, color, created_at)
tasks (id, column_id, project_id, title, description, priority, status, position, assignee_id, reporter_id, due_date)
task_labels (id, task_id, name, color)
task_comments (id, task_id, author_id, content, created_at)
refresh_tokens (id, user_id, token, expires_at)
```

- Migrations located at: `backend/src/main/resources/db/migration/`
  - `V1__initial_schema.sql`: Table definitions, indexes, foreign keys.
  - `V2__seed_data.sql`: Realistic seed data with demo accounts.

---

## API Documentation

Swagger OpenAPI is accessible at `http://localhost:8080/swagger-ui/index.html`.

### Key Endpoints:
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT + Refresh Token
- `POST /api/auth/refresh` — Rotate refresh token
- `GET  /api/projects` — List user's authorized projects
- `POST /api/projects` — Create project (auto-generates default Kanban columns)
- `GET  /api/projects/{id}/board` — Get full board data with columns and tasks
- `POST /api/projects/{id}/tasks` — Create task
- `PATCH /api/tasks/{taskId}` — Update task title, description, priority, due date
- `POST /api/tasks/{taskId}/move` — Move task across columns or reorder position
- `DELETE /api/tasks/{taskId}` — Delete task
- `POST /api/tasks/{taskId}/comments` — Add comment to task

---

## Getting Started & Local Setup

### Option A: Running with Docker Compose (Recommended)

1. Clone or navigate to the directory:
   ```bash
   cd liveboard
   ```
2. Start the full application stack (MySQL, Spring Boot Backend, Nginx + React Frontend):
   ```bash
   docker compose up --build
   ```
3. Open your browser:
   - **Frontend App**: `http://localhost:3000` (or `http://localhost:5173` if running dev server)
   - **Backend API & Swagger**: `http://localhost:8080/swagger-ui`

### Option B: Running Locally for Development

#### 1. Start MySQL
Ensure MySQL is running on port 3306 with database `liveboard`.

#### 2. Run Backend
```bash
cd backend
mvn spring-boot:run
```

#### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### Pre-seeded Demo Credentials
| Email | Username | Password | Role |
|---|---|---|---|
| `alice@liveboard.dev` | `alice` | `password123` | Owner |
| `bob@liveboard.dev` | `bob` | `password123` | Admin |
| `carol@liveboard.dev` | `carol` | `password123` | Member |

*(Or click the Quick Demo buttons directly on the Login page).*

---

## Automated Testing & Results

LiveBoard includes comprehensive unit, component, and optimistic state tests executed with Vitest:

### Running Tests:
```bash
cd frontend
npm run test
```

### Actual Test Run Results:
```text
✓ src/__tests__/taskFiltering.test.ts (6 tests)
  ✓ filterTasks returns all tasks when query is empty
  ✓ filterTasks filters by title substring
  ✓ filterTasks is case-insensitive
  ✓ filterByPriority returns correct tasks
  ✓ sortByPriority orders URGENT first
  ✓ sortByDueDate puts null dates last

✓ src/__tests__/boardStore.test.ts (5 tests)
  ✓ setBoard stores the board
  ✓ addTask appends a task to the correct column
  ✓ updateTask replaces the task in its column
  ✓ deleteTask removes task from column
  ✓ moveTask moves task to target column and sorts by position

✓ src/__tests__/optimisticUpdates.test.ts (3 tests)
  ✓ optimistically updates task title before API responds
  ✓ rollback removes optimistic task on API failure
  ✓ moveTask optimistically moves task then restores on rollback

✓ src/__tests__/components.test.tsx (5 tests)
  ✓ Button renders children and responds to click events
  ✓ Button displays loading state and disables user interaction
  ✓ PriorityBadge renders correct label and style variant
  ✓ Avatar generates initials from full name when image is absent
  ✓ EmptyState renders title, description, and triggers CTA action

Test Files  4 passed (4)
Tests       19 passed (19)
Duration    1.12s
```

### End-to-End Testing (Playwright):
```bash
cd frontend
npx playwright test
```
Covers:
1. Landing page to login flow
2. Fast authentication and dashboard overview
3. Board interaction with columns and task cards
4. Network offline simulation and status banner trigger

---

## Performance Report

1. **Route-Based Code Splitting**: All pages (`LandingPage`, `LoginPage`, `DashboardPage`, `BoardPage`, `ProjectSettingsPage`, `ProfilePage`) are asynchronously loaded via `React.lazy` and `Suspense`, keeping the critical entry bundle under 160 KB gzipped.
2. **Optimistic Updates**: Task movements and edits update local Zustand state instantly before awaiting network acknowledgment, eliminating UI drag latency.
3. **Debounced Search**: Search bar uses a debounced query pattern to prevent unnecessary column filtering cycles during rapid typing.
4. **Normalized CSS**: Scoped CSS Modules with atomic CSS Custom Properties prevent CSS duplication and style bleed across components.

---

## Accessibility & WCAG Compliance

- **Semantic HTML**: `<nav>`, `<aside>`, `<header>`, `<main>`, `<dialog>` landmarks used throughout.
- **Keyboard Navigation**: Drag-and-drop cards support keyboard selection and focus rings (`:focus-visible` with 2px offset).
- **Reduced Motion**: `@media (prefers-reduced-motion: reduce)` rule cancels all animations for motion-sensitive users.
- **Contrast Ratios**: Navy typography (`#0f172a`) on light surface (`#ffffff`) delivers WCAG AAA contrast (> 12:1).
