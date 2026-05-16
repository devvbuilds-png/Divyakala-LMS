> This file has moved to /docs/claude.md as part of the documentation restructure.
> It remains the living decisions log. Update it after every session.

# Divyakala LMS — Project Memory

This file is the living memory for the Divyakala LMS project. Every Claude Code session and every future Claude conversation should read this first. Update it after every major decision or build session.

Last updated: 2026-05-16 (docs folder scaffolded, Supabase verified, context management session)

---

## Project Overview

A full-stack LMS for Drdha Vrata Gorrick (Divyakala), a traditionally trained Shilpa Shastra artist based in Manipal. He teaches sacred Indian devotional art (drawing, iconography, Talamana proportions). The LMS has a student side and an admin/creator side.

**Current phase:** Structural prototype. Demo to Drdha on Sunday May 17, 2026. Core student/admin demo loop is wired to Supabase. App is still monolithic and not production-hardened.

**Business context:** Dev (the builder) showed a first demo last Sunday — went well. Drdha requested structural upgrades (long courses/batches). Follow-up meeting Sunday May 17. This is the pitch for a real paid production contract.

---

## Current State Snapshot (May 16, 2026)

### What is done
- Supabase client at `src/lib/supabase.js`; `.env.local` and `.env.example` exist.
- Student auth: Supabase email OTP. Signup captures first name, last name, country, phone, upserts `profiles`.
- Admin auth: Supabase email/password, checks `profiles.role === 'admin'`.
- Schema uses `profiles` (not `users`). Any older text saying `users` is historical.
- Admin Courses: real CRUD, thumbnail upload, status cycling, dedicated course editor with sessions.
- Course editor: sessions with direct `video_url`, reference/resource uploads, preview, delete, re-numbering.
- Student Browse: real courses, filters drafts out, shows published + coming_soon.
- Course Detail: real course/sessions, enrollment creation, lesson player entry.
- My Learning: real enrollments/courses/sessions, progress, resume links.
- Lesson Player: real session data, YouTube/Vimeo/direct video, completion progress, progress-based locking.
- Assignment upload: files to private `submissions` bucket, signed URLs in `submissions` table.
- Admin Assignments: real submissions, joins course/session, fetches profiles, realtime subscription.
- Admin review: text feedback, status changes, image annotation overlay, voice notes to `feedback-audio`.
- Notifications: real Supabase rows, unread count, mark-all-read, click-to-navigate, realtime refresh.
- Student feedback modal: real submission data, annotation, voice audio.
- Journal preview on My Learning: real submissions.
- Admin Students: real enrollments/profiles/courses grouped by student.
- Admin Dashboard: real awaiting-review submissions for attention card.
- Admin Settings / Demo Guide: Load demo / Clear all controls.
- `npm run build` passes (large chunk warning from tldraw is expected).

### Supabase status (verified May 16)
- All tables present: cards, courses, enrollments, notifications, profiles, session_cards, sessions, submissions, workshops.
- Realtime publications configured: `supabase_realtime` has 2 tables with INSERT/UPDATE/DELETE enabled (submissions + notifications).
- 6 courses in DB including real ones (Drawing Divine Forms — Srinivasa, Talamana) and test junk (Wassupppp, wassupp, Vishnu, Ganesha) — clean up before demo.
- DB region: ap-southeast-2 (Sydney).
- No new tables needed until batches/long courses feature is built.

### What remains
- `App.jsx` is monolithic — do NOT refactor during demo.
- Card Library, Playlists, Workshops: Coming Soon pages only.
- Full Practice Journal: still mock data.
- Lesson notes/assignment prompts: still from `getLessonContent()` mocks.
- Payment, long-course batches, CRM, Bunny video, Sentry, backups: not built.
- Supabase realtime may need manual enable in dashboard before live demo.

### Sunday demo priority
The showpiece for Sunday is **long courses + batches** — showing Drdha that the platform can handle his cohort-based teaching model. This is Track A work.

---

## Tech Stack (locked)

- **Frontend:** React + Vite (React 19 in package.json)
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Icons:** lucide-react
- **Canvas:** @tldraw/tldraw (lesson player)
- **Backend:** Supabase (database + auth + storage + real-time)
- **Hosting:** Vercel
- **Font:** Poppins everywhere, 13px root

---

## Design System (implemented)

Colors: Background #F5ECD2, Surface #FFFFFF, Warm surface #FBF6E9, Primary text #2A1F18, Muted #6B5D4A, Soft #9A8B72, Chrome #2A1F18, Ochre #C9952A, Hover #B07F1F, Soft ochre #F4DFA0, Terracotta #D87E5D, Border #E5D7B3, Success #5C8A4F, Error #B5482D.

Density: compact. Sidebar ~216px. Root font 13px. Pill-shaped buttons.

---

## Content Architecture

```
Card -> Session -> Course -> Playlist
```

For the demo, sessions use direct `video_url` instead of the Card/SessionCard junction flow. Card Library is deferred.

---

## Key Files

- `src/App.jsx` — monolithic, all routing + pages + components
- `src/lib/supabase.js` — single Supabase client
- `src/data/*.json` — mock seed data
- `src/index.css` — global styles, Poppins, 13px root
- `tailwind.config.js` — color tokens
- `public/art/` — artwork assets
- `public/logo.webp` — wordmark

---

## Docs folder structure scaffolded

As of this session, the `/docs` folder is the single source of truth:
- `docs/README.md` — how to use the docs
- `docs/handoff/HANDOFF.md` — master onboarding
- `docs/claude.md` — this file (living log)
- `docs/decisions/` — ADRs
- `docs/flows/` — student and admin flows (placeholders)
- `docs/schema/current-schema.sql` — full DB schema
- `docs/schema/migrations/` — numbered migration history
- `docs/runbook/` — ops docs (placeholders)

---

## Notes for Claude Code (always follow these)

- Do NOT refactor App.jsx during the demo build
- Do NOT add drag-and-drop ordering
- Do NOT add Discussion tab to lesson player
- Supabase client: initialize once in `src/lib/supabase.js`, import everywhere
- Keep Poppins font everywhere
- Keep all colors within the existing Tailwind token system
- Empty states must have warm copy + CTA
- Every route change must scroll to top
