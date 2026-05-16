> This file has moved to /docs/claude.md as part of the documentation restructure.
> It remains the living decisions log. Update it after every session.

# Divyakala LMS — Project Memory

This file is the living memory for the Divyakala LMS project. Every Claude Code session and every future Claude conversation should read this first. Update it after every major decision or build session.

Last updated: 2026-05-17 (demo loop routing polish)

---

## Project Overview

A full-stack LMS for Drdha Vrata Gorrick (Divyakala), a traditionally trained Shilpa Shastra artist based in Manipal. He teaches sacred Indian devotional art (drawing, iconography, Talamana proportions). The LMS has a student side and an admin/creator side.

**Current phase:** Structural prototype. Demo to Drdha on Sunday May 17, 2026. Core student/admin demo loop is wired to Supabase. App is still monolithic and not production-hardened.

**Business context:** Dev (the builder) showed a first demo last Sunday — went well. Drdha requested structural upgrades (long courses/batches). Follow-up meeting Sunday May 17. This is the pitch for a real paid production contract.

---

## Current State Snapshot (May 16, 2026)

### What is done
- Supabase client at `src/lib/supabase.js`; `.env.local` and `.env.example` exist.
- Student auth: Supabase email OTP. Signup captures first name, last name, country, phone, upserts `profiles`, then routes incomplete student profiles through `/onboarding`.
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
- Step 1 Sunday demo long-course schema applied in Supabase: `courses.course_type` plus `term_groups`, `batches`, `batch_modules`, `batch_sessions`, and `batch_enrollments`.
- RLS enabled for the five new long-course tables. Authenticated users can read term groups/batches/modules/sessions; admins can manage them. Students can read their own batch enrollment rows; admins can manage batch enrollments.
- Step 2 Sunday demo CRM schema applied in Supabase: `profiles` now has onboarding/CRM columns `age_group`, `artist_background`, `why_shilpa_shastra`, `portfolio_url`, `admission_status`, `fee_status`, `currency`, and `payment_notes`.
- Step 3 Sunday demo data seeded in Supabase. Current seed summary after correction: 4 published short courses, 1 long course, 1 term group (`October 2024`), 2 batches (`Batch A`, `Batch B`), 6 shared term modules, 13 batch-specific sessions, and 1 batch enrollment. Live demo sessions are dated 2026-05-17 IST.
- Long-course module model corrected on May 16: modules are shared syllabus chapters for a term group (`term_modules`), while sessions are per-batch live classes (`batch_sessions.batch_id`) mapped to a shared module (`batch_sessions.term_module_id`). `batch_modules` remains as legacy scaffold from the first migration/seed but new UI should not build around it.
- Test junk cleanup: `wassupp`/`Wassupppp` course rows were purged by SQL editor before seeding. `Ganesha` was kept and polished into a believable short course.
- Step 4 admin UI built: new `Term Groups` admin nav item, term group list, create term group form, term group detail page, create batch form, batch cards with enrollment counts, and a temporary batch detail placeholder route for Step 5.
- Existing admin Course editor now has a `course_type` selector (`short` / `long`) persisted to `courses.course_type`; admin course cards show Short/Long badges.
- Step 5 admin Batch Detail built at `/admin/batches/:batchId`: header with batch/intake/course details, shared `term_modules` list, add-module form, per-module add-session form, and session editing for title, scheduled date/time, Zoom link, and status. Sessions are written to `batch_sessions` with `batch_id` + `term_module_id`; recording URL entry is intentionally deferred to Step 6.
- Step 5 status semantics corrected: `recorded` means a recording is available, not merely that a live class happened. Past sessions without recordings display as `concluded`. `live` is a derived display state for sessions scheduled today with a Zoom link, not a durable admin-selected status.
- Step 6 admin Batch Detail additions built: Students section lists enrolled students, searchable student picker enrolls existing non-admin profiles, warns/moves students who are already in another batch, and remove action deletes only the `batch_enrollments` row. Session edit now includes `recording_url`; adding a recording URL marks the stored session status as `recorded` and the computed badge shows Recording available.
- Step 7 admin Student CRM built at `/admin/students`: table lists all non-admin `profiles` with name, email, phone, location/country, age group, admission and fee badges, and long-course batch placement from `batch_enrollments -> batches -> term_groups` displayed like `Batch A — October 2024`. Search by name/email and admission-status filter are included. Row click opens a side detail panel with read-only student-filled fields and editable admin fields (`admission_status`, `fee_status`, `currency`, `payment_notes`) saved back to `profiles`.
- Step 8 student onboarding built at `/onboarding`: incomplete student profiles are routed to a one-page "Complete your profile" form before My Learning. It collects age group, artist background, why Shilpa Shastra, optional portfolio URL, and only asks for phone/country if missing. Saving upserts these fields into `profiles`; brand-new users remain `admission_status = prospect` and are not auto-enrolled into courses or batches.
- Step 9 student My Learning reworked: top pill tabs split `My Program` (long-course batch enrollment) and `My Courses` (existing short-course enrollments). Continue Learning is cross-track and can show one long-course batch card plus one short-course resume card. Long-course data uses `batch_enrollments -> batches -> term_groups -> term_modules` plus `batch_sessions`; it does not build around legacy `batch_modules`.
- Course Detail enrollment behavior clarified: short courses still create rows in `enrollments`, update `profiles.admission_status = enrolled`, and add a CRM payment note. Long courses no longer create short-course `enrollments`; their CTA is `Request Batch Placement`, which records interest in `profiles.payment_notes` and keeps the student as a prospect until admin places them into a batch via `batch_enrollments`.
- Step 10 student Batch Dashboard built at `/program/batches/:batchId`: checks the current user's `batch_enrollments` row before showing the page, then displays course/intake/batch header, module/session list from `term_modules` + `batch_sessions`, derived status badges (`upcoming`, `live`, `concluded`, `recorded`), Zoom links for upcoming/live sessions, and recording links when `recording_url` exists.
- Demo loop polish: the student shell now includes the `/program/batches/:batchId` inner route, so My Program's Batch Dashboard link renders correctly inside the app chrome. Admin Student CRM table now includes a `CRM activity` column showing latest long-course interest or short-course enrollment from `profiles.payment_notes`.
- Admin Dashboard and Demo Guide copy updated to foreground the actual Sunday loop: Courses, Term Groups, Assignments, and Student CRM.
- Long-course request CTA copy now returns students to `My Learning` after interest is recorded, avoiding implying they have a batch before admin placement.
- Realtime publications configured: `supabase_realtime` has 2 tables with INSERT/UPDATE/DELETE enabled (submissions + notifications).
- Current seeded course set has 4 published short courses and 1 long course. The `wassupp` test junk was removed before seeding.
- DB region: ap-southeast-2 (Sydney).
- Next step: final demo polish and smoke test the full long-course loop.

### What remains
- `App.jsx` is monolithic — do NOT refactor during demo.
- Card Library, Playlists, Workshops: Coming Soon pages only.
- Full Practice Journal: still mock data.
- Lesson notes/assignment prompts: still from `getLessonContent()` mocks.
- Payment, Bunny video pipeline, Sentry, backups: not built.
- Supabase realtime may need manual enable in dashboard before live demo.

### Sunday demo priority
The showpiece for Sunday is **long courses + batches** — showing Drdha that the platform can handle his cohort-based teaching model. This is Track A work.

---

### Corrected long-course hierarchy (locked May 16)

The correct model is:

```
Course -> Term Group -> Shared Modules (syllabus chapters)
                    -> Batches -> Batch Sessions -> Recordings
```

- A long course is the syllabus template.
- A term group is an intake of that course.
- Modules are shared syllabus chapters for that term group.
- Batches are time-slot cohorts inside the term group.
- Sessions are the actual live classes for a batch. Session counts and pacing vary by batch.
- A session belongs to one batch and maps to one shared module.
- A session has two links with different meanings: `zoom_link` for the live class, `recording_url` for the post-class recording.
- A past session can be concluded without being recorded.
- Do not treat modules as per-batch in new UI work.

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
