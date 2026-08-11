# SS Room Rentals

A full-stack room rental discovery and lead-management MVP for Berhampore, West Bengal.

The product helps public users find verified rooms, PGs, and rental properties near their current location. The business owner acts as the middleman: owners do not log in for V1, while the admin manages properties, owners, enquiries, scheduled visits, and contact settings.

## Architecture

```text
room_rental_app/
  frontend/      React + Vite public website and admin panel
  backend/       Node.js + Express REST API
  backend/prisma PostgreSQL schema and seed data
```

Backend request flow:

```text
Route -> Controller -> Service -> Prisma/PostgreSQL
```

Frontend structure:

```text
src/
  api/          Axios clients and API types
  components/   reusable cards, filters, map, modal, states
  context/      auth and toast providers
  hooks/        geolocation and saved-property storage
  layouts/      public and admin shells
  pages/        public and admin routes
  styles/       responsive dark UI system
```

## Technology

- Frontend: React, Vite, React Router, React Hook Form, Leaflet, lucide-react
- Backend: Node.js, Express, Helmet, CORS, rate limiting, JWT, bcrypt
- Database: PostgreSQL
- ORM: Prisma
- Maps: Leaflet with OpenStreetMap
- Uploads: local `backend/uploads` in development with a storage abstraction path

## Assumptions

- V1 has only public users and admin users.
- Public users do not need accounts.
- Owner data is admin-only and is not exposed through public APIs.
- Nearby search uses Haversine distance with a bounding-box prefilter; the schema can move to PostGIS later.
- Local file upload storage is used for development. Production should move uploaded images to Cloudinary, S3, or equivalent object storage.

## Prerequisites

- Node.js 22+
- npm 11+
- PostgreSQL running locally or a hosted PostgreSQL database

## Environment

Copy the examples before running the app:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Backend variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/room_rental_app?schema=public"
JWT_SECRET="replace-with-a-minimum-32-character-secret"
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
UPLOAD_DIR="uploads"
```

Frontend variable:

```env
VITE_API_BASE_URL="http://localhost:4000/api"
```

## Install

```bash
npm install
npm run prisma:generate
```

## Database Setup

Create the PostgreSQL database, then run:

```bash
npm run prisma:migrate -w backend -- --name init
npm run seed
```

An initial generated SQL migration is also included at `backend/prisma/migrations/20260811120000_init/migration.sql`.

Development admin credentials after seeding:

```text
Email: admin@ssrooms.local
Password: Admin@12345
```

## Run Locally

```bash
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000/api/health`
- Admin: `http://localhost:5173/admin/login`

## Build

```bash
npm run build
```

## Public API Overview

- `GET /api/properties`
- `GET /api/properties/featured`
- `GET /api/properties/nearby?lat=24.0988&lng=88.2679&radius=5`
- `GET /api/properties/:slug`
- `GET /api/property-types`
- `GET /api/amenities`
- `POST /api/enquiries`
- `GET /api/settings/public`

## Admin API Overview

- `POST /api/admin/auth/login`
- `GET /api/admin/dashboard`
- `GET /api/admin/properties`
- `POST /api/admin/properties`
- `GET /api/admin/properties/:id`
- `PUT /api/admin/properties/:id`
- `DELETE /api/admin/properties/:id`
- `GET /api/admin/enquiries`
- `PATCH /api/admin/enquiries/:id/status`
- Owner CRUD under `/api/admin/owners`
- Visit CRUD under `/api/admin/visits`
- Settings under `/api/admin/settings`

## Production Notes

- Use a strong `JWT_SECRET`.
- Restrict `FRONTEND_URL` to the deployed frontend origin.
- Put PostgreSQL behind backups and connection pooling.
- Move uploads from local disk to object storage.
- Add PostGIS when listings grow enough to require database-native geospatial queries.
- Run migrations in CI/CD before releasing backend changes.
