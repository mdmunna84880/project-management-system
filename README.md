# Advanced Project & Task Management System

## Project Overview

A robust, full-stack Project and Task Management System built with the MERN stack. This application allows users to create projects, invite members, assign and manage tasks, and track project progress through a centralized dashboard. It features role-based access control (Admin, Project Owner, Project Member), real-time notifications, optimistic UI updates, and comprehensive task filtering, searching, and pagination.

## Technologies Used

**Frontend:**
- React (Vite)
- Redux Toolkit (RTK) & RTK Query
- React Router v7
- Tailwind CSS v4 & Next Themes (Dark Mode)
- React Hook Form & Zod (Validation)
- React Toastify (Notifications)
- React Icons

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs (Authentication)
- Zod (Schema Validation)

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd project_management_system
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure your environment variables (see below) in `backend/.env`.
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Configure your environment variables (see below) in `frontend/.env`.
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` and the backend will run on `http://localhost:5000`.

---

## Environment Variables

Please refer to `.env.example` in both the `frontend` and `backend` directories.

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project_management_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```env
VITE_NODE_ENV=development
VITE_LOCAL_URL=http://localhost:5000/api
VITE_PROD_URL=https://your-production-url.com/api
```

---

## Database Design

The application uses MongoDB with Mongoose schemas designed for scalability and clear relational boundaries. 

- **User**: Stores authentication credentials, name, and role (`ADMIN`, `USER`).
- **Project**: Contains project metadata (name, description, status, dates) and references the `Owner` (User ID).
- **ProjectMember**: A pivot collection mapping `User` IDs to `Project` IDs with specific roles (`OWNER`, `MEMBER`). This allows many-to-many relationships without bloating the Project document.
- **Task**: Contains task details, status, priority, and due dates. References both the `Project` it belongs to and the `User` it is assigned to. Overdue status is calculated dynamically via Mongoose virtuals.
- **Notification**: Tracks user notifications (read/unread status) triggered by events like task assignments or project additions.

---

## Authentication Approach

Authentication is handled via **JSON Web Tokens (JWT)** passed via **HTTP-only Cookies**. 

1. **Login/Register**: Upon successful login or registration, the backend signs a JWT with the user's ID and sets it as an `HttpOnly`, `Secure` (in production) cookie.
2. **Persistence**: The frontend makes an `/api/auth/me` call on initialization to re-hydrate the user state from the cookie without exposing the token to client-side JavaScript (preventing XSS).
3. **Authorization**: Backend middleware extracts the token from the cookie, verifies it, and attaches the user object to the request. Specific controllers enforce Role-Based Access Control (RBAC) by verifying if the user is an Admin, a Project Owner, or a standard Member.

---

## State Management Approach

State is carefully segregated based on its lifecycle and scope using **Redux Toolkit** and **Local React State**.

| State Type | Handled By | Justification |
|------------|------------|---------------|
| **Server State** | `RTK Query` | Tasks, Projects, Members, and Notifications are all managed by RTK Query. It provides out-of-the-box caching, de-duplication, automatic re-fetching on mutations (`invalidatesTags`), and simplifies Optimistic UI updates. |
| **Auth State** | `Redux Slice` | The current authenticated user and role are stored in an `authSlice`. This state is needed globally across the app (Header, ProtectedRoutes, Sidebars, API configuration). |
| **Form State** | `React Hook Form` | Form inputs, validation errors, and dirtiness are kept local to the form components. Putting this in Redux causes unnecessary global re-renders and boilerplate. |
| **UI State** | `useState` / URL | Modal visibility, mobile menus, and local component toggles use `useState`. Search queries, pagination, and filters are stored in the **URL Search Params** to ensure deep-linkability and browser history compatibility. |

---

## Important Design Decisions

1. **Dynamic Overdue Calculation**: Overdue tasks are determined dynamically (comparing `dueDate` to `Date.now()`) instead of a static database flag. This prevents stale data and eliminates the need for cron jobs.
2. **Optimistic UI Updates**: Updating task statuses locally before the server responds provides a snappy, app-like feel. RTK Query's `onQueryStarted` lifecycle handles rollbacks if the network fails.
3. **Debounced API Searching**: The task search input implements a custom `useDebounce` hook (400ms delay) to prevent overwhelming the API on every keystroke.
4. **URL-Driven Filtering**: Pagination, sorting, and filtering state are synced to the URL. If a user refreshes the page or shares a link, their exact filter configuration is preserved.
5. **Tailwind CSS v4 + Next Themes**: Utilized the latest Tailwind release with native CSS variables for a seamlessly integrated dark mode toggle.

---

## Known Limitations

- **File Attachments & Comments**: Task-level file attachments and threaded comments are not currently implemented, though the database schemas are structured to support them in future iterations.
- **Refresh Tokens**: Currently uses a single long-lived JWT in HTTP-only cookies. Implementing short-lived access tokens paired with refresh tokens would improve security in highly sensitive environments.
- **WebSocket / Real-Time**: Notifications are polled (every 60 seconds) rather than pushed via WebSockets (e.g., Socket.io). This keeps the infrastructure simple but introduces a slight delay in multi-user collaboration visibility.
