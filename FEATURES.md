# Micdrop — Feature Summary

## Core Product

**AI Pitch Analysis** — The primary feature. User records audio, it's sent to the FastAPI backend which runs it through Hume AI (emotion/prosody analysis) then a Groq LLM (DeepSeek) that scores the pitch on **tone, fluency, clarity, and confidence** (0–100 each). Two pages implement this:
- `/practice` — full session with a selected persona responding to the user's pitch
- `/ai-voice` — standalone recording + analysis interface with a collapsible metrics sidebar

## Investor Personas

`/personas` — Three hardcoded AI investor archetypes the user can practice against:
- **Coach Mike** — Adaptive difficulty, pitch coach
- **Dave Rodriguez** — Beginner-friendly angel investor
- **Sarah Chen** — Tech VC / corporate customer

Users can also create a custom persona via a dialog form (UI only, not persisted). Personas are selected and passed to `/practice?persona=<key>`.

## Dashboard (`/dashboard`)

Post-login home screen. Fetches mock stats from the backend (`/dashboard` endpoint). Shows:
- Welcome greeting (username from email)
- Quick action buttons: Start Practice, Choose Persona, View Performance, Payments
- Recent sessions (mock data)

## Session Feedback (`/feedback`)

Post-session debrief with mock data. Shows:
- Overall score + category breakdown (content, delivery, structure, engagement)
- Key metrics: words per minute, filler word count, pause frequency, confidence level
- Transcript with per-turn sentiment analysis
- Strengths and improvements per category
- Tabs: Overview / Transcript / Improvement Tips

## Performance Tracking (`/performance`)

Historical analytics view (mock data). Shows:
- Streak, total sessions, total practice time, average/best scores
- Weekly progress chart (via Recharts)
- Category trend lines (content, delivery, structure, engagement)
- Session history table with per-session category scores
- Time-range filter (Last Week / Last Month / Last 3 Months)
- Weekly and monthly goal progress

## Onboarding (`/onboarding`)

4-step guided intro for new users:
1. Welcome
2. Feature overview
3. Goal selection (Investor Pitch / Sales Pitch / Product Demo / General)
4. CTA to first session

## Payments (`/payments`)

Base L2 blockchain payments for premium access:
- Wallet connection (MetaMask, Coinbase Wallet) via `ethers` v6
- Three tiers: single session (0.01 ETH), monthly (0.05 ETH), yearly (0.5 ETH)
- Transaction verified on-chain via `POST /api/verify-payment`
- Payment history from Supabase `payments` table

## Authentication

- Google OAuth via Supabase Auth
- Login (`/login`, `/auth/login`) and signup (`/signup`, `/auth/signup`) pages
- Session managed by Next.js middleware; protected routes redirect to login

## Landing Page (`/`)

Public marketing page with hero copy, three feature callouts (Practice, Score, Improve), and a testimonial carousel.

---

**Note:** `/dashboard`, `/feedback`, and `/performance` currently render hardcoded mock data. The live data path exists (`PitchSessionService`, `usePitchSessions` hook, `pitch_sessions` table) but is not yet wired into these views.
