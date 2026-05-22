# SERAPH.GG — Heaven Burns Red Global Resource Hub

A community fan site for Heaven Burns Red (Global) built with Next.js 15,
Tailwind CSS, and Supabase.

---

## Pages

| Route             | Description                                      |
|-------------------|--------------------------------------------------|
| `/`               | Home — hero, event strip, Memoria preview        |
| `/memoria`        | Memoria DB — filterable database                 |
| `/events`         | Event tracker with countdowns                    |
| `/guides`         | Beginner & advanced guides                       |
| `/units`          | Character grid                                   |
| `/units/[id]`     | Unit profile — Memorias, Socialization, Recoll.  |
| `/squads`         | Community squad showcase + submit form           |

---

## Tech Stack

- **Next.js 15** — App Router, TypeScript
- **Tailwind CSS** — HBR design tokens (dark, crimson, silver)
- **Supabase** — PostgreSQL + Row Level Security + Storage
- **Zustand** — client-side state (filters, cart-style squad builder)
- **Lucide React** — icons
- **date-fns** — event countdown formatting

---

## Setup — Step by Step

### 1. Clone and install

```bash
git clone <your-repo>
cd seraph-gg
npm install
```

### 2. Create a Supabase project

1. Go to https://app.supabase.com and create a new project
2. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
# Then fill in your Supabase values
```

### 4. Run the database migration

In Supabase dashboard → **SQL Editor**, paste and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates all 9 tables, enums, RLS policies, indexes, and the
`increment_upvote` RPC function.

### 5. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 6. Deploy to Vercel

```bash
npm install -g vercel
vercel
# Add your env vars in Vercel dashboard → Settings → Environment Variables
```

---

## Database Tables

| Table           | Purpose                                          |
|-----------------|--------------------------------------------------|
| `units`         | All playable characters                          |
| `memorias`      | All Memoria cards with skill descriptions        |
| `unit_memorias` | Which Memorias work best for which unit + tier   |
| `socializations`| Bond episodes per unit with unlock conditions    |
| `recollections` | Recollection scenes per unit with unlock info    |
| `events`        | Game events with status, rewards, dates          |
| `squads`        | Community-submitted squad builds                 |
| `squad_slots`   | 5 unit slots per squad with Memoria per slot     |
| `guides`        | Beginner and advanced guide articles             |

---

## Adding Content (Admin)

All content is managed directly in Supabase Table Editor or via SQL.
No CMS needed — use Supabase's built-in dashboard.

For units: insert rows into `units`, then insert related rows into
`memorias`, `unit_memorias`, `socializations`, and `recollections`.

For events: insert into `events` with `status = 'upcoming'` then
update to `'live'` when the event starts.

---

## Folder Structure

```
seraph-gg/
├── app/
│   ├── layout.tsx          # Root layout + Navbar
│   ├── page.tsx            # Home
│   ├── memoria/page.tsx    # Memoria DB
│   ├── events/page.tsx     # Event tracker
│   ├── guides/page.tsx     # Guides
│   ├── units/
│   │   ├── page.tsx        # Unit grid
│   │   └── [id]/page.tsx   # Unit profile
│   └── squads/page.tsx     # Squad showcase
├── components/
│   ├── layout/
│   │   └── Navbar.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── SectionLabel.tsx
│       └── FilterButton.tsx
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # cn() helper
├── types/
│   └── database.ts         # Full TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── tailwind.config.ts      # HBR design tokens
├── .env.local.example      # Env template
└── README.md
```
