# Deployment Guide

This project is currently configured for **Local Development** using SQLite.
To deploy it to production (e.g., Vercel, Render, Railway), follow these steps.

## 1. Database Migration (SQLite -> PostgreSQL)

SQLite is not suitable for most serverless static deployments because the file is lost on restart.
Use **Neon Tech** (Free Interface) or **Supabase** to get a PostgreSQL URL.

1.  Get your `DATABASE_URL` (e.g., `postgres://user:pass@host/dbname`).
2.  Update `server/prisma/schema.prisma`:
    \`\`\`prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    \`\`\`
3.  Delete `server/migrations` folder and `dev.db`.
4.  Run `npx prisma migrate dev --name init`.

## 2. Deploy Backend (Render/Railway)

1.  Push your code to GitHub.
2.  Create a new Web Service on Render.
3.  Connect your GitHub repo.
4.  **Root Directory**: `server`
5.  **Build Command**: `npm install && npx prisma generate`
6.  **Start Command**: `node index.js`
7.  **Environment Variables**:
    -   `DATABASE_URL`: Your Postgres URL.
    -   `JWT_SECRET`: A strong secret.
    -   `PORT`: 8000

## 3. Deploy Frontend (Vercel/Netlify)

1.  Create a new Project on Vercel.
2.  Connect your GitHub repo.
3.  **Root Directory**: `client`
4.  **Build Command**: `npm run build`
5.  **Output Directory**: `dist`
6.  **Environment Variables**:
    -   Create a file `.env.production` in `client` or set in Vercel.
    -   `VITE_API_URL`: The URL of your deployed Backend (e.g., `https://my-api.onrender.com`).
7.  Update `client/src/api/axios.js` to use `import.meta.env.VITE_API_URL || 'http://localhost:8000'`.

## 4. Final Polish
Ensure your Backend CORS configuration allows your Vercel frontend domain.
\`\`\`javascript
const allowedOrigins = ['https://my-frontend.vercel.app'];
// ... configure CORS to check allowedOrigins
\`\`\`
