# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: pnpm (version 10.15.0)

- **Frontend dev server**: `pnpm dev`
- **Frontend build**: `pnpm build`
- **Type checking**: `pnpm type-check`
- **Linting**: `pnpm lint`

**Backend** (Python, `uv` package manager — run from `backend/`):
- **Start backend**: `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
- **Install deps**: `uv sync`
- **Run tests**: `pytest` (after `uv sync --group dev`)

## Architecture Overview

This is a **two-service application**:
1. **Next.js frontend** (root) — App Router, TypeScript, Tailwind CSS v4, Supabase Auth
2. **FastAPI backend** (`backend/`) — Python 3.13, Hume AI emotion analysis, Groq LLM scoring

### Core Pitch Analysis Pipeline

The primary feature is pitch practice with AI feedback:
1. User records audio in `components/ui/voice-recorder.tsx`
2. Frontend sends audio blob to `NEXT_PUBLIC_BACKEND_URL/analyze-pitch` via `lib/services/pitch-api.ts`
3. Backend (`backend/main.py`) runs the audio through two steps in sequence:
   - `hume_service.py`: Hume AI prosody/emotion analysis
   - `scoring_service.py`: Groq LLM (`deepseek-r1-distill-llama-70b`) scores tone, fluency, clarity, confidence (0–100 each)
4. Response is transformed in `lib/pitch-analysis.ts` and displayed as `PitchMetrics` (`lib/types/pitch.ts`)

### Authentication Flow

- Supabase Auth with Google OAuth via `middleware.ts` → `lib/supabase/middleware.ts`
- Server components use `lib/supabase/server.ts`; client components use `lib/supabase/client.ts`
- Backend protected routes use `Depends(verify_supabase_jwt)` from `backend/auth.py`
- `components/auth/require-auth.tsx` guards client-side routes

### Key Library Files

- `lib/services/pitch-api.ts` — `PitchAnalysisService` class (singleton `pitchAnalysisService`); handles upload, retry (3×), timeout (60s)
- `lib/pitch-analysis.ts` — transforms raw backend response → `PitchMetrics`; validation and error parsing
- `lib/audio-utils.ts` — `createAudioFormData()`, `validateAudioBlob()`, `sendAudioToAI()`
- `lib/supabase/pitch-sessions.ts` — `PitchSessionService` class; CRUD for saved sessions
- `hooks/use-pitch-sessions.ts` — React hook wrapping `PitchSessionService`
- `hooks/use-auth.ts` — auth state hook

### Investor Personas

Hardcoded in `app/practice/page.tsx`: "Sarah Chen" (VC), "Dave Rodriguez" (Angel), "Mike Dropp" (Coach). Selected via `?persona=<key>` query param from `app/personas/page.tsx`.

### Payments (Base L2)

- `components/payments/` — `WalletConnector`, `PaymentButton`, `PaymentFlow`
- `lib/web3-config.ts` — network config (Base Sepolia dev / Base mainnet prod)
- `app/api/verify-payment/route.ts` — verifies tx hash on-chain, records to `payments` table
- Uses `ethers` v6; wallet connection via browser injected provider

### Database Tables

- `profiles` — user info linked to `auth.users`
- `pitch_sessions` — recordings, scores, feedback, Vercel Blob URLs
- `user_goals` — progress tracking
- `payments` — tx hashes, payment types, confirmation status (RLS enabled)

Schema migrations in `supabase/migrations/`; initial schema in `scripts/001_create_database_schema.sql`.

### Mock Data

`/dashboard`, `/feedback`, and `/performance` pages currently render hardcoded mock data — they are **not** wired to Supabase. The live data infrastructure exists (`PitchSessionService` in `lib/supabase/pitch-sessions.ts`, `usePitchSessions` hook) but is unused by those pages.

### Next.js API Routes

- `POST /api/audio/upload` — uploads audio to Vercel Blob storage
- `POST /api/verify-payment` — blockchain tx verification

## Build Configuration

TypeScript `ignoreBuildErrors: true` and ESLint `ignoreDuringBuilds: true` are set in `next.config.mjs` — type errors won't break CI.

## Environment Variables

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `NEXT_PUBLIC_BASE_RECEIVER_ADDRESS`
- `NEXT_PUBLIC_BACKEND_URL` (defaults to `http://localhost:8000`)

**Backend** (`.env` in `backend/`):
- `SUPABASE_JWT_SECRET`
- `SUPABASE_PROJECT_ID`
- `HUME_API_KEY`
- `GROQ_API_KEY`
