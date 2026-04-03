# BlogNest

BlogNest is a full-stack blogging platform built with Next.js and MongoDB, designed for a modern community-driven blogging experience with seamless content management.

## Tech Stack

- Next.js (App Router + API Routes)
- MongoDB + Mongoose
- Tailwind CSS
- JWT Authentication

## Features

- User authentication (register, login, logout)
- Role-based access (first user becomes admin)
- Admin post management (create, edit, delete)
- Blog categories and tags
- Cover image upload
- Public blog listing and search
- Comment system for authenticated users
- Admin dashboard for managing posts and comments


## Project Structure

- `app/api` - backend API routes
- `app/blog` - public blog pages
- `app/dashboard` - admin pages
- `components` - reusable UI components
- `models` - Mongoose models
- `lib` - DB and auth helpers
- `utils` - shared constants/utilities

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set values:
- `MONGODB_URI`
- `JWT_SECRET`

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/posts`
- `POST /api/posts` (admin)
- `GET /api/posts/:id`
- `PUT /api/posts/:id` (admin)
- `DELETE /api/posts/:id` (admin)
- `POST /api/posts/:id/comments` (authenticated user)
- `DELETE /api/comments/:id` (admin)
- `POST /api/upload` (admin, image upload)

## Production Notes

- Use a strong random `JWT_SECRET`
- Use managed MongoDB in production
- Run behind HTTPS for secure cookies
- Add rate limiting and CSRF hardening for stricter security

# BlogNest
BlogNest is a full-stack content management system built with Next.js and MongoDB, designed for a modern, community-driven blogging experience with high-end Indigo aesthetics and seamless content management.

