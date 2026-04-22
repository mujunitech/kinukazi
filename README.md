# Kinukazi

Kinukazi is a modern, mobile-first MVP for **real-time customer insight and idea validation**.
It connects brands with the public so companies can launch campaigns, collect structured feedback, rank ideas, and track sentiment in one place.

## Stack

- **Frontend:** Next.js (React, App Router)
- **Backend:** Next.js Route Handlers (Node runtime)
- **Database:** Lightweight JSON store (`data/db.json`) for MVP prototyping
- **Auth approach:** guest-first participation (optional account fields)
- **Deployment:** Vercel-ready

## Features implemented

### Company / Admin side
- Campaign creation with free/pro plans (free tier campaign limit enforced)
- Campaign metadata (title, description, country, date range)
- Question setup (multiple-choice and open-ended)
- Analytics dashboard with:
  - total participants
  - total responses
  - votes/engagement
  - top ideas
  - sentiment bars
- Campaign-level filtering support via API query params

### Public side
- Mobile-first campaign page with low-friction forms
- Submit feedback answers with optional age/location
- Submit ideas
- Upvote/downvote ideas
- Live participation counters
- Auto-ranked **Top 10 ideas** using votes + engagement + recency score
- Contributor points and global leaderboard

### Monetization foundations
- Plan flag on campaigns (`free`/`pro`)
- Free tier campaign cap (1 campaign) to drive upgrades
- Pro messaging in dashboard flow

## Local development

```bash
npm install
npm run dev
```

Visit:
- `/` public landing + campaign discovery
- `/company` company dashboard
- `/campaign/[id]` campaign interaction page
- `/leaderboard` top contributors

## API routes

- `GET/POST /api/campaigns`
- `GET/POST/PATCH /api/campaigns/:id/ideas`
- `GET/POST /api/campaigns/:id/responses`
- `GET /api/metrics?campaignId=...&location=...&ageGroup=...`
- `GET /api/leaderboard`

## Notes / next steps (Phase 2)

- Add JWT or Firebase Auth for company accounts
- Replace JSON file storage with PostgreSQL or Firestore
- Add AI sentiment and executive insight summaries
- Add exportable reports (CSV/PDF)
