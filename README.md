# Sporgates Frontend

Web application for **Sporgates** — a sports event platform focused on the **Supply → Event → Sponsorship → ROI** loop. Users discover items (facilities, services, products), organize events, and sponsors fund them.

---

## MVP Refocus (April 2026)

> The frontend is being stripped down to only support the MVP core loop.
> All social features (Feed, Stories, Messaging, Jobs, Community) are **frozen** — no new development.

### Route & Page Classification

| Route / Feature | Status | MVP Role |
|----------------|--------|----------|
| `(auth)/*` — signin, signup | **CORE** | Keep as-is |
| `activities/*` — list, detail | **CORE — EXTEND** | Event detail needs items, anchors, budget |
| `items/*` *(NEW)* | **CORE — NEW** | Unified supply listing + detail + create |
| `business/` — dashboard | **CORE — EXTEND** | MVP metrics only |
| `business/create-activity-steps` | **CORE — EXTEND** | Add item picker + anchors + budget |
| `business/create-campaign` *(NEW)* | **CORE — NEW** | Simplified sponsorship campaign |
| `business/campaign-dashboard` *(NEW)* | **CORE — NEW** | Campaign + event matching |
| `notifications/` | **CORE** | Keep as-is |
| `settings/` | **CORE** | Keep as-is |
| `profile/` | **CORE** | Keep as-is |
| `explore/` | **CORE — SIMPLIFY** | Show Events + Items only |
| `facilities/` | MIGRATE | Data → unified Items | 
| `services/` | MIGRATE | Data → unified Items |
| `marketplace/` | MIGRATE | Data → unified Items |
| `jobs/` | **FROZEN** | No development |
| `community/` | **FROZEN** | No development |
| `messages/` | **FROZEN** | No development |
| Feed / Stories / Posts | **FROZEN** | No development |
| `people/` | **FROZEN** | No development |

### Navigation (MVP Only)

**User mode sidebar:** Events · Items · Notifications · Settings

**Business mode sidebar:** Dashboard · My Events · My Items · My Campaigns · Profile

### Rules for All Developers

1. **Do NOT build features for FROZEN routes** — no PRs accepted
2. **Remove social providers** from `layout.tsx` — PostModal, StoryModal, StoryReply
3. **Remove social links** from sidebar and bottom nav
4. **All new code must follow** [fullstack-standards.md](../fullstack-standards.md) — no `useEffect` fetching, use API service layer
5. **Funding is simulated** — no payment UI needed, just status badges

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI:** React 18, [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/) (shadcn-style components)
- **Data:** [SWR](https://swr.vercel.app/) for server state, Axios for API calls
- **Forms & validation:** React Hook Form, Zod
- **Realtime:** WebSocket (STOMP/SockJS) for messaging and notifications
- **Maps:** Leaflet (react-leaflet); optional Mapbox for activity creation (see docs)
- **Testing:** Vitest (unit), Playwright (e2e)

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- Running **Sporgates backend** (Spring Boot) for full functionality — default: `http://localhost:8080/api`

## Quick Start

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev
```

For production build and run:

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env` or `.env.local` in the project root. All client-side config uses the `NEXT_PUBLIC_` prefix.

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (used for REST and WebSocket origin) | `http://localhost:8080/api` |

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

For production or staging, set this to your deployed API URL (e.g. `https://api.sporgates.com/api`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Production build |
| `npm start` | Run production server (after `build`) |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest unit tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run test:e2e:ui` | Playwright with UI |

## Project Structure

```
Sporgates-frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes: signin, signup, forgot-password, etc.
│   ├── (main)/             # Main app (sidebar, top bar, auth guard)
│   │   ├── explore/        # Explore
│   │   ├── activities/     # Activities list & detail
│   │   ├── facilities/     # Facilities list & detail
│   │   ├── services/       # Services list & detail
│   │   ├── marketplace/    # Marketplace & products
│   │   ├── businesses/     # Businesses list, detail, portfolio
│   │   ├── jobs/           # Jobs list & detail
│   │   ├── community/      # Community & squads
│   │   ├── messages/       # Messages & conversations
│   │   ├── notifications/  # Notifications
│   │   ├── profile/        # User profile & enhanced
│   │   ├── people/         # Person (user) detail
│   │   ├── settings/       # User settings
│   │   └── business/       # Business dashboard (activities, resources, team, etc.)
│   ├── landing/            # Marketing landing page
│   └── layout.tsx         # Root layout
├── components/
│   ├── sporgates/          # Feature components (pages, cards, sidebars, modals)
│   ├── landing/            # Landing page sections
│   └── ui/                 # Reusable UI primitives (shadcn-style)
├── lib/
│   ├── api.ts              # Axios client, auth interceptors
│   ├── constants.ts        # App constants, public routes, API defaults
│   ├── route-map.ts        # PageRoute → URL mapping, useAppRouter
│   ├── navigation.ts       # PageRoute types
│   ├── services/           # API service modules (auth, user, activities, bookings, etc.)
│   ├── hooks/              # Custom hooks
│   ├── business-context.tsx # Active business (organizer mode)
│   ├── cart-context.tsx    # Cart state (marketplace)
│   ├── post-modal-context.tsx
│   ├── messaging-ws.ts     # WebSocket for messages
│   └── utils.ts
├── middleware.ts           # Domain-based routing (landing vs app), auth cookie check
├── public/
└── e2e/                    # Playwright specs
```

## Routing & Auth

- **Landing:** On `www.sporgates.com` / `sporgates.com`, `/` serves the marketing landing. On `app.sporgates.com` or `localhost`, `/` shows landing when not logged in and app home when logged in (middleware uses cookie `auth_logged_in`).
- **App routes:** Under `app/(main)/` — most require authentication. Public routes (signin, signup, landing, etc.) are listed in `lib/constants.ts` (`PUBLIC_ROUTES`).
- **Navigation:** Centralized in `lib/route-map.ts` and `lib/navigation.ts`; use `useAppRouter().navigate(page, id)` for type-safe navigation.

## Main Features

- **Feed & social:** Home feed, posts, comments, likes, post modal, stories
- **Explore:** Activities, facilities, services, marketplace, businesses, jobs
- **Profile:** User profile, followers/following (modal), enhanced profile, settings
- **People:** View other users’ profiles (person detail) with feed, activity, achievements tabs
- **Messages:** Conversations, real-time messaging (WebSocket), conversation list
- **Community:** Squads, squad detail, squad profile, dashboard
- **Business dashboard:** Activities (create/edit), resources (facilities, products, services), team, bookings, analytics, campaigns, jobs — with business switcher and context

## Running with Docker

A `Dockerfile` and `docker-compose.yml` are provided. Set `NEXT_PUBLIC_API_URL` to your backend URL (e.g. host-relative URL when using Docker Compose with a backend service).

```bash
# Build (pass API URL for Next.js build-time env)
docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080/api -t sporgates-frontend .

# Or use docker-compose (env in .env or export NEXT_PUBLIC_API_URL)
docker-compose up --build
```

## Testing

- **Unit:** `npm test` (Vitest). Place tests next to code or in `__tests__`.
- **E2E:** `npm run test:e2e` (Playwright). Config and specs live in the project root / `e2e`. Ensure backend is running if tests hit the API.

## License

Proprietary — Sporgates.
