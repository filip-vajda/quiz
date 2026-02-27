# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server on http://localhost:3000
- `npm run build` — Production build
- `npm run preview` — Preview production build locally

No test runner or linter is configured.

## Architecture

Nuxt 4 SPA (`ssr: false`) for running a live pub quiz with a real-time leaderboard. UI is in Slovak. Uses `@nuxtjs/supabase` for persistence and real-time sync, plus BroadcastChannel for same-browser tab sync.

### Two-role design

- `/admin` — Quiz master dashboard: create quizzes, manage teams, enter scores per round, control leaderboard visibility and final reveal. URL carries `?quiz=<id>`.
- `/` (index) — Public leaderboard display: shows waiting screen, live scores, or dramatic final reveal. Audience opens `/?quiz=<id>`.
- `/history` — Browse and manage past quizzes (admin-facing).

### State flow

`useQuizStore` (singleton ref) is the central state. All mutations go through it and call `persist()` (localStorage). The admin page watches the quiz ref and debounce-pushes to Supabase via `useSupabaseSync`. The leaderboard page subscribes to Supabase Realtime postgres_changes for live updates.

### Key composables (`app/composables/`)

- `useQuizStore` — CRUD for quiz/teams/scores/display, localStorage persistence
- `useSupabaseSync` — Maps camelCase Quiz ↔ snake_case DB row, debounced upsert (150ms), Realtime subscription, fetch/delete
- `useLeaderboard` — Computed rankings with tie handling
- `useFinalReveal` — Dramatic last-to-first reveal logic with auto-reveal timer
- `useBroadcastSync` — BroadcastChannel for cross-tab sync within same browser
- `useQuizHistory` — Fetch/delete quiz summaries for the history page

### Types

`shared/types/quiz.ts` — All shared interfaces: `Quiz`, `Team`, `DisplayState`, `RankedTeam`, `QuizSummary`.

### Database

Single `quizzes` table in Supabase (schema in `supabase-schema.sql`). JSONB columns for teams, scores, and display state. Open RLS (no auth). Realtime enabled.

### Styling

Dark theme with CSS custom properties. No component library — hand-rolled UI components in `app/components/ui/`. Global styles in `app/assets/css/main.css` and `animations.css`. Google Fonts (Inter).

## Environment

Requires `SUPABASE_URL` and `SUPABASE_KEY` in `.env` (see `.env.example`).
