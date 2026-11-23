# Divyakala LMS

A full-stack learning platform for sacred Indian devotional art, built for Divyakala.

**Live demo:** [divyakala-lms.vercel.app](https://divyakala-lms.vercel.app)

## What it is / why I built it

Divyakala is the practice of Drdha Vrata Gorrick, a traditionally trained Shilpa Shastra artist based in Manipal who teaches devotional drawing, iconography and Talamana proportions. Teaching this kind of art online is more than uploading videos: students need to practise, submit their drawings, and get the teacher's corrections back, while the teacher needs one place to run courses, cohorts and student admissions.

This LMS has two sides. Students browse courses, follow lessons, draw alongside them and submit their work. The admin studio lets the teacher publish courses, review submissions with annotations and voice notes, and manage long-course enrollments. Feedback reaches the student in real time. The UI is built around the artist's own artwork, with a warm, compact design that suits devotional art rather than generic SaaS.

## Features

**Student side**
- Sign up with email and password, or sign in with an email OTP / magic link (Supabase Auth)
- Onboarding form (background, motivation, portfolio) before reaching the dashboard
- My Learning: resume card, enrolled courses with progress, and a polaroid-style practice journal of past submissions
- Browse short and long courses; long courses have a full detail page (structure, timeline, FAQ, instructor) and a "Request Enrollment" flow
- Lesson player with video, Notes / Reference companion panel, and a tldraw **Canvas** for quick practice beside the lesson
- Assignment upload, with review status and feedback updating live via Supabase real-time
- Notifications and an editable profile

**Admin studio**
- Course builder for short courses (sessions, video URLs, draft / coming soon / published status)
- Long-course module and session planner, including upcoming (date, time, Zoom link) and concluded (recording URL) sessions
- Long-course management: create cohorts, accept or reject enrollment requests, assign cohort and batch
- Assignment review: annotate the student's drawing, record a voice note, and set status (reviewed, approved, needs resubmission)
- Students CRM: search and filter students, view onboarding details, and track admission and fee status
- Dashboard showing submissions that need attention

Some areas are UI-only for now: Card Library, Playlists, Live Workshops and the full Practice Journal page still use placeholder or mock data.

## Tech stack

- React 19 + Vite 8
- Tailwind CSS 3.4 (custom Divyakala tokens, Poppins)
- React Router 7
- Supabase: Postgres, Auth, Storage, Realtime, RLS
- tldraw (practice canvas in the lesson player)
- lucide-react icons
- Hosted on Vercel

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase project values
npm run dev
```

Environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The Supabase schema changes this app depends on are in the `supabase-*.sql` files at the repo root. Run them in the Supabase SQL Editor (for example `supabase-long-course-management.sql` before trying long-course approvals).

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Docs

- [Client pitch](docs/pitch.html): the proposal page for Divyakala
- [System architecture](docs/architecture.html): architecture reference with component costs
- [`Design System.md`](Design%20System.md): colours, typography and component rules
- [`Wireframes.md`](Wireframes.md): screen-by-screen layout of the current prototype

## Project structure

```
src/
  App.jsx           # routing, auth context, all student and admin pages (one large file for the demo phase)
  lib/supabase.js   # single Supabase client
  data/             # JSON seed/mock data (courses, workshops, journal entries, ...)
  index.css         # global styles, Poppins import
public/
  art/              # Drdha's artwork used across the app
  logo.webp
New folder/         # source artwork images from the artist
supabase-*.sql      # schema and RLS migrations to run in Supabase
docs/               # pitch and architecture pages
```

## Status

Working demo: the core loops (course publishing, lesson content, assignment submission and real-time review) run on Supabase. A production build and refactor of `App.jsx` come next.
