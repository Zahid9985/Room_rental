# SS Room Rentals

A simplified full-stack room-discovery website for a middleman-operated rental business.

Public customers only browse rooms, open a room details modal, view rooms on a map, and contact the business on WhatsApp. Customers do not register, log in, book online, pay online, or see private property-owner information.

## Product Shape

Public routes:

- `/` - Home catalogue with room cards, search, and simple filters
- `/map` - Dynamic property map using database coordinates
- `/contact` - Business/middleman contact information

Admin routes:

- `/admin/login`
- `/admin/dashboard`
- `/admin/properties`
- `/admin/properties/new`
- `/admin/properties/:id/edit`
- `/admin/enquiries`
- `/admin/settings`

## Architecture

```text
room_rental_app/
  frontend/      React + Vite customer website and admin panel
  backend/       Node.js + Express REST API
  backend/prisma PostgreSQL schema, migration, and seed data
```

Backend flow:

```text
Route -> Controller -> Service -> Prisma/PostgreSQL
```

## Stack

- Frontend: React, Vite, TypeScript, React Router, Leaflet, lucide-react
- Backend: Node.js, Express, Helmet, CORS, rate limiting, JWT, bcrypt
- Database: PostgreSQL
- ORM: Prisma
- Maps: Leaflet with OpenStreetMap
- Images: local upload paths in development; no image binaries are stored in PostgreSQL

## Important Business Rule

The property owner’s private contact details are admin-only. Public property APIs serialize only customer-safe listing data. WhatsApp messages go to the configured business/middleman number from settings.

## Environment

Copy the example files:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Backend:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/room_rental_app?schema=public"
JWT_SECRET="replace-with-a-minimum-32-character-secret"
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
UPLOAD_DIR="uploads"
```

Frontend:

```env
VITE_API_BASE_URL="http://localhost:4000/api"
```

## Install

```powershell
npm install
npm run prisma:generate
```

## Database Setup

Create the PostgreSQL database, then run:

```powershell
npm run prisma:migrate -w backend -- --name init
npm run seed
```

An initial SQL migration is included at `backend/prisma/migrations/20260811120000_init/migration.sql`.

Development admin credentials after seeding:

```text
Email: admin@ssrooms.local
Password: Admin@12345
```

## Run Locally

```powershell
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:4000/api/health`
- Admin login: `http://localhost:5173/admin/login`

## Build

```powershell
npm run build
```

## Public API

- `GET /api/properties`
- `GET /api/properties/nearby`
- `GET /api/properties/:slug`
- `GET /api/property-types`
- `GET /api/amenities`
- `GET /api/settings/public`
- `POST /api/enquiries` for lightweight WhatsApp/contact tracking

## Admin API

- `POST /api/admin/auth/login`
- `GET /api/admin/dashboard`
- `GET /api/admin/properties`
- `POST /api/admin/properties`
- `GET /api/admin/properties/:id`
- `PUT /api/admin/properties/:id`
- `DELETE /api/admin/properties/:id`
- `GET /api/admin/enquiries`
- `PATCH /api/admin/enquiries/:id/status`
- `GET /api/admin/settings`
- `PUT /api/admin/settings`

Owner records and visit APIs remain backend/admin-only support capabilities; they are not exposed in the customer UI.
