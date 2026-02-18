# 🌙 Ramadan Tracker

A full-stack Ramadan fasting tracker built with **Next.js 16**, **Tailwind CSS v4**, **Neon Postgres**, and **NextAuth.js v5**.

Track your daily fasting, view JAKIM prayer times for Malaysian zones, and monitor your Ramadan progress — all in a beautiful Ramadan Night theme.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4)
![Postgres](https://img.shields.io/badge/Neon-Postgres-00E599)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Authentication** — Register & login with email/password (NextAuth.js v5 + bcrypt)
- **Fasting Calendar** — Interactive 30-day Ramadan 1447H calendar with one-click toggle
- **Prayer Times** — Live JAKIM prayer times via `api.waktusolat.app` for 50+ Malaysian zones
- **Progress Tracking** — Visual progress bar and daily stats
- **Ramadan Night Theme** — Deep emerald & gold colour scheme

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Database | Neon Postgres (serverless driver) |
| Auth | NextAuth.js v5 (beta) with Credentials |
| Prayer API | JAKIM e-Solat via api.waktusolat.app |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) Postgres database
- (Optional) A [Vercel](https://vercel.com) account for deployment

### 1. Clone & install

```bash
git clone <your-repo-url> ramadan-tracker
cd ramadan-tracker
npm install
```

### 2. Set up the database

1. Create a new Neon project at [console.neon.tech](https://console.neon.tech)
2. Open the **SQL Editor** and paste the contents of `schema.sql`
3. Run the SQL to create the `users` and `fasting_logs` tables

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon Postgres connection string |
| `AUTH_SECRET` | Random secret for NextAuth (run `npx auth secret`) |
| `AUTH_URL` | `http://localhost:3000` for local dev |
| `NEXT_PUBLIC_DEFAULT_ZONE` | Default JAKIM zone code (e.g. `SGR01`) |

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — register an account and start tracking!

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   ├── fasting/route.ts              # Fasting log CRUD
│   │   ├── prayer/route.ts               # Prayer times proxy
│   │   └── register/route.ts             # User registration
│   ├── login/page.tsx                    # Login page
│   ├── register/page.tsx                 # Registration page
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx                          # Dashboard (auth-gated)
│   └── globals.css                       # Ramadan Night theme
├── components/
│   ├── Navbar.tsx                        # Navigation bar
│   ├── PrayerTimes.tsx                   # Prayer times display
│   ├── Providers.tsx                     # SessionProvider wrapper
│   └── RamadanCalendar.tsx               # Fasting calendar
└── lib/
    ├── auth.ts                           # NextAuth configuration
    ├── db.ts                             # Neon database connection
    ├── prayer.ts                         # JAKIM API + zone list
    └── ramadan.ts                        # Ramadan date helpers
```

## Deploy to Vercel

1. Push your repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add the environment variables in the Vercel dashboard:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_URL` → your production URL (e.g. `https://ramadan-tracker.vercel.app`)
   - `NEXT_PUBLIC_DEFAULT_ZONE`
4. Deploy — Vercel auto-detects Next.js

## License

MIT
