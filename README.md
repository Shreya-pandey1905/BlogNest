# BlogNest (Next.js App Router)

Production-ready full-stack blog content management system built with:
- Next.js (App Router + API routes)
- MongoDB + Mongoose
- Tailwind CSS
- JWT authentication

## Features

- Authentication: register/login/logout with JWT cookie auth
- Roles: first registered user becomes `admin`; others are `user`
- Admin post management: create, edit, delete posts
- Post metadata: categories, tags, cover image upload
- Public blog: latest posts, listing page, category filter, search
- Comments: authenticated users can comment, admins can moderate/delete
- Admin dashboard: manage posts and comments from one place

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
