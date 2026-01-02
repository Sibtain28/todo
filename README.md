# Professional Task Management System

A full-stack Task Management application built with **Node.js, Express, Prisma, React, and TailwindCSS**.
This project features secure authentication, role-based access control, and a modern Kanban-style dashboard.

## 🚀 Features

-   **Authentication**: Secure Register/Login with JWT & Bcrypt.
-   **Task Management**: Create, Read, Update, Delete (CRUD) tasks.
-   **Kanban Board**: Drag-and-drop style columns (To Do, In Progress, Done).
-   **Priorities**: Low, Medium, High priority indicators.
-   **User Privacy**: Users can only manage their own tasks.
-   **Premium UI**: Glassmorphism design, Dark Mode, and responsive layout.

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express.js, SQLite (Dev), Prisma ORM.
-   **Frontend**: React, Vite, TailwindCSS v4, Lucide Icons, Axios.

## 📦 Installation & Setup

### 1. clone the Repository
\`\`\`bash
git clone https://github.com/Sibtain28/todo.git
cd todo
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
npx prisma generate
npx prisma db push
npm start
\`\`\`
*Server runs on Port 8000*

### 3. Frontend Setup
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`
*Client runs on Port 5173*

## 🔑 Default Configuration
-   **Server Port**: 8000
-   **Client Port**: 5173
-   **Database**: SQLite (`server/dev.db`)

## 📝 API Documentation
See `server/src/routes` for full route definitions.
-   `POST /auth/register`
-   `POST /auth/login`
-   `GET/POST/PUT/DELETE /tasks`
