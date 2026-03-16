# Otterbrook Recruitment Client Portal

A Next.js 14 client portal for Otterbrook, a recruitment firm. Admin staff manage clients, mandates, and candidate pipelines. Client companies log in to track their open roles and candidate progress.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Prisma** with SQLite
- **NextAuth.js v4** (credentials provider)
- **bcryptjs** for password hashing

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

The `.env` file is pre-configured for local development:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="otterbrook-super-secret-key-change-in-production-32chars"
NEXTAUTH_URL="http://localhost:3000"
```

For production, change `NEXTAUTH_SECRET` to a strong random string.

### 3. Set up the database

Push the Prisma schema to create the SQLite database:

```bash
npm run db:push
```

### 4. Seed the database

```bash
npm run db:seed
```

This creates:

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@otterbrook.com     | admin123   |
| Client (TechCorp) | client@techcorp.com | client123 |
| Client (GrowthCo) | client@growthco.com | client123 |

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Admin (admin@otterbrook.com)

- **`/admin`** — Dashboard overview with stats and recent activity
- **`/admin/companies`** — List all client companies; create new ones
- **`/admin/companies/[id]`** — View company details and their mandates
- **`/admin/mandates`** — List all mandates across all companies
- **`/admin/mandates/new`** — Create a new mandate (select company, title, description, location, salary, status)
- **`/admin/mandates/[id]`** — Mandate detail: view pipeline, add candidates, update stages and notes
- **`/admin/candidates`** — List all candidates with their active roles
- **`/admin/candidates/new`** — Create a new candidate profile

### Client (e.g. client@techcorp.com)

- **`/dashboard`** — Overview of all mandates with candidate counts per stage
- **`/mandates/[id]`** — Mandate detail: job info, pipeline overview bar, candidates grouped by stage

## Project Structure

```
src/
  app/
    layout.tsx               # Root layout with SessionProvider
    page.tsx                 # Redirects to /dashboard or /admin
    login/page.tsx           # Login form
    dashboard/
      layout.tsx             # Client layout (sidebar + auth guard)
      page.tsx               # Client dashboard
    mandates/
      layout.tsx             # Layout for mandate detail pages
      [id]/page.tsx          # Mandate detail (client view)
    admin/
      layout.tsx             # Admin layout (sidebar + auth guard)
      page.tsx               # Admin overview
      companies/...          # Company management
      mandates/...           # Mandate management
      candidates/...         # Candidate management
    api/
      auth/[...nextauth]/    # NextAuth handler
      admin/                 # Admin API routes
  components/
    Sidebar.tsx              # Navigation sidebar
    StageBadge.tsx           # Coloured stage pill badge
    StatusBadge.tsx          # Coloured status pill badge
    CandidateCard.tsx        # Candidate list item
    MandateCard.tsx          # Mandate list item with stage summary
  lib/
    auth.ts                  # NextAuth options
    prisma.ts                # Prisma client singleton
    utils.ts                 # Stage/status formatting helpers
  types/
    next-auth.d.ts           # Extended session types
```

## Candidate Stages

| Stage            | Description                     |
|------------------|---------------------------------|
| Sourced          | Identified, not yet contacted   |
| Screening        | Initial call / first interview  |
| Submitted        | CV submitted to client          |
| Client Interview | Client-side interview underway  |
| Offer            | Offer extended                  |
| Placed           | Accepted and placed             |
| Rejected         | Not proceeding                  |

## Scripts

| Command          | Description                              |
|------------------|------------------------------------------|
| `npm run dev`    | Start development server                 |
| `npm run build`  | Build for production                     |
| `npm run start`  | Start production server                  |
| `npm run db:push`| Push Prisma schema to database           |
| `npm run db:seed`| Seed database with sample data           |
| `npm run db:studio` | Open Prisma Studio                    |
