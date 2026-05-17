# Divyakala LMS — Project Memory

This file is the living memory for the Divyakala LMS project. Every Claude Code session and every future Claude conversation should read this first. Update it after every major decision or build session.

Last updated: May 17, 2026 (session 25 — auth fixed, onboarding, admin CRM, mock students seeded)

---

## Project Overview

A full-stack LMS for Drdha Vrata Gorrick (Divyakala), a traditionally trained Shilpa Shastra artist based in Manipal. He teaches sacred Indian devotional art (drawing, iconography, Talamana proportions). The LMS has a student side and an admin/creator side.

**Current phase:** Demo build — making the UI prototype actually functional enough to impress Drdha and win a contract. Once he says yes, we go into a proper 1-week production build.

**Business context:** Dev (the builder) is pitching this to Drdha for ₹15-20K. The demo is the sales artifact. Drdha will use the demo alone (no one walking him through it), so it must be self-explanatory and polished. Sending via Vercel link + Loom video.

---

## Tech Stack (locked)

- **Frontend:** React 19 + Vite 8
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router DOM 7
- **Icons:** lucide-react
- **Canvas:** @tldraw/tldraw 5.0 (in lesson player Canvas tab)
- **Backend:** Supabase (database + auth + storage + real-time)
- **Hosting:** Vercel
- **Font:** Poppins everywhere (the app shifted from the original Cormorant/Crimson brief to match the LMS screenshot aesthetic — compact, warm, refined)

---

## Repository

Location: `D:\AI projects\Divyakala\shortcourse-deploy-worktree\`
**App files are at the worktree root** — `src/`, `public/`, `package.json`, `index.html` are all at the root, not inside `Codex prototype/`. Vercel root directory must be blank (not set to a subfolder).

Git: **all work goes directly on `main` branch** — no PRs, no feature branches, push straight to `main`.

Key files:
- `src/App.jsx` — currently monolithic, contains all routing + pages + components. Do NOT refactor until after the demo is shipped and Drdha says yes.
- `src/lib/supabase.js` — single Supabase client, initialized once. Never re-initialize.
- `src/index.css` — global styles, Poppins import, root font size 13px
- `tailwind.config.js` — Divyakala color tokens
- `public/art/` — Drdha's artwork assets (webp)
- `public/logo.webp` — Divyakala wordmark
- `.env.local.txt` — local only, gitignored, holds SUPABASE_SERVICE_ROLE_KEY for admin scripts
- `seed-users.js` — local only, gitignored, one-time seed script for mock students

---

## Design System (implemented)

Colors:
- Background: `#F5ECD2`
- Surface: `#FFFFFF`
- Warm surface: `#FBF6E9`
- Primary text: `#2A1F18`
- Muted text: `#6B5D4A`
- Soft text: `#9A8B72`
- Sidebar chrome: `#2A1F18`
- Primary ochre: `#C9952A`
- Primary hover: `#B07F1F`
- Primary soft: `#F4DFA0`
- Accent terracotta: `#D87E5D`
- Border: `#E5D7B3`
- Success: `#5C8A4F`
- Error: `#B5482D`

Density: compact. Sidebar ~216px. Root font 13px. Small card padding. Pill-shaped buttons.

---

## Content Architecture (locked)

The core content model is:

```
Card → Session → Course → Playlist
```

### Card (atomic content unit)
Reusable building blocks. Can be attached to any session in any course.

Types: `video | image | text | file | assignment`

Fields: id, type, title, description, assetUrl (Supabase Storage), thumbnailUrl, duration, status, createdBy, createdAt, updatedAt

### Session (named group within a course)
First-class entity. NOT just a card attribute.

Fields: id, courseId, title, position, isPreview (session 1 = free preview before enrollment)

### SessionCard (junction — links cards to sessions with roles)
Fields: id, sessionId, cardId, role, position

Roles: `main_video | notes | resource | assignment`

How it maps to the student lesson player:
- `main_video` → video in the Overview tab
- `notes` → Notes companion panel in Overview
- `resource` → Resources tab
- `assignment` → Assignment tab prompt

### Course
Status values: `draft | coming_soon | published`
- draft → hidden from student browse
- coming_soon → visible with "Notify me" button, no enroll
- published → fully available

### Playlist
Ordered collections of courses. For learning paths, cohorts, themed journeys.
⏳ DEFERRED to v2 — UI exists but not wired.

### Submission status values
`awaiting_review | reviewed | approved | needs_resubmission`

---

## Admin Course Builder Flow (locked — Option A: Session-first)

1. Create cards in the Card Library (upload files to Supabase Storage)
2. Create a course (title, price, description, thumbnail, status)
3. Add named sessions to the course (Session 1, Session 2, etc.) in order
4. For each session: pick cards from the library and assign roles (main_video, notes, resource, assignment)
5. Publish the course → appears in student Browse

⏳ DEFERRED to v2 — Option B (drag-and-drop card library where admin drags cards into session columns, roles auto-assigned by card type). More visual, better UX. Build post-contract.

---

## The 6 Cross-Side Loops (what must work for the demo)

**Loop 1: Course publishing (admin → student)**
Admin sets course status → "published" → appears in student Browse Courses.

**Loop 2: Card content in lesson player (admin → student)**
Admin attaches cards to sessions → student lesson player loads that content.

**Loop 3: Assignment submission (student → admin)**
Student uploads drawing → lands in /admin/assignments as "Awaiting review."

**Loop 4: Assignment review + feedback (admin → student)**
Admin writes feedback, sets status → student sees update in real-time via Supabase subscriptions.

**Loop 5: Workshop publishing (admin → student)** ⏳ DEFERRED to v2
Admin creates workshop → appears in student /workshops + notification fires.

**Loop 6: Lesson unlocking (rule-driven)** ⏳ DEFERRED to v2
Admin Settings toggle: "Unlock next lesson only after assignment approval." Basic progress-based locking already works for the demo; rule-driven approval gating is v2.

---

## Supabase Setup

### Auth
- Students: email OTP
- Admin: fixed credential — `drdha@divyakala.com` / password set in Supabase dashboard
- Role stored in `profiles` table: `student | admin`

### Storage Buckets
- `cards` — admin uploads (videos, images, PDFs)
- `submissions` — student drawing uploads
- `thumbnails` — course cover images
- `feedback-audio` — ⏳ DEFERRED to v2
- `avatars` — ⏳ DEFERRED to v2

### Real-time
Supabase real-time subscriptions on the `submissions` table. Admin reviews → student sees update instantly. Most impressive live moment in the demo.

---

## Demo States

Accessible from Admin Settings:

**Empty state (default):** No courses, students, or workshops. Shows Drdha the creation flow.

**Demo state:** "Load demo" button seeds 2 courses (Srinivasa published + Talamana coming soon), 6 sessions for Srinivasa, 1 enrollment at 33% progress (uses the logged-in admin user, not a hardcoded student), 2 reviewed submissions (1 approved with annotation, 1 needs_resubmission), and 2 notifications. No workshops are seeded — workshops are deferred to v2.

**Reset:** "Reset to empty" wipes all user-generated data.

---

## What to Show vs Hide in the Demo

### Must work (the 6 loops)
Course publishing, card upload, session+card assignment, student submission upload, admin review+feedback (real-time), workshop publish, lesson locking.

### Visual-only (not wired, labeled "coming soon" or left as UI)
- Playlists / Learning Paths
- Individual student profile deep-dive
- Export CSV
- Role invite form in Settings

### Clean up before sending
- Certificate: pull student name from real auth, not hardcoded "Dev Saxena"
- Notifications: pull from Supabase, not static mocks
- Journal: pull thumbnails from real submission data
- Remove all "Insert video here" placeholder text — replace with clean empty states
- Fix any obviously broken interactions

---

## Build Priority for Demo

1. ✅ Supabase project setup — schema, storage, auth
2. ✅ Replace mock auth with Supabase Auth (student OTP + admin password)
3. ✅ Card CRUD (admin Cards page) — no file upload, URL paste only (file upload deferred to v2)
4. ✅ Course CRUD + thumbnail upload (admin Courses page) — status cycle, publish/unpublish
5. ✅ Course publish → student Browse reflects it (Loop 1 complete)
6. ✅ Session builder via direct video URL → lesson player loads real session video (Loop 2 simplified for demo)
7. ✅ Student assignment upload to Supabase Storage (Loop 3)
8. ✅ Admin review → feedback → real-time student update (Loop 4)
9. ~~Workshop create/publish → student Workshops page (Loop 5)~~ — v2
10. ~~Lesson locking rule from Settings (Loop 6)~~ — v2
11. ✅ Demo seed + reset button (Admin Settings — loadDemoData + clearAllData implemented)
12. ⬜ Student-side cleanup (certificate, notifications, journal, CourseDetail, placeholders)
13. ✅ Deploy to Vercel (live — shortcourse-deploy-worktree branch)

---

## Decisions Deferred to v2 (post-contract)

1. **Drag-and-drop card assignment (Option B)** — admin drags cards from left panel into session columns
2. ~~Voice note recording/upload~~ — moved into demo scope in session 10.
3. ~~Real annotation canvas~~ — moved into demo scope in session 10 as a lightweight SVG overlay drawing tool.
4. **Playlist / Learning Paths** — architecture ready, UI exists, not wired.
5. **Discussion tab in lesson player** — cut from demo entirely.
6. **Mobile optimization for lesson player** — desktop priority for demo.
7. **Drag-and-drop session and card ordering** — use numeric positions for demo.
8. **Multi-role access** (instructor, reviewer, content editor, support) — one admin role for demo.
9. **Individual student profile** — admin student list works, deep profile is visual-only.
10. **Code-split @tldraw/tldraw** — large bundle warning acceptable for demo.
11. **Refactor App.jsx** — do NOT refactor during demo. After contract: split into src/admin/*, src/student/*, src/components/common/*.
12. **Payment integration** (Razorpay/Stripe) — enrollment skips payment for demo.
13. **Auto-captions for videos** — add in v2.
14. **Export CSV from admin** — button disabled for demo.
15. **Custom admin notification broadcasts** — auto-generated by system events for demo, custom publish in v2.

---

## Supabase Schema

```sql
-- Users (extends Supabase auth.users)
create table users (
  id uuid references auth.users primary key,
  name text,
  email text,
  role text default 'student',
  country text,
  phone text,
  avatar_url text,
  created_at timestamptz default now(),
  last_seen_at timestamptz
);

-- Cards
create table cards (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  description text,
  asset_url text,
  thumbnail_url text,
  duration_seconds int,
  status text default 'draft',
  created_by uuid references users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Courses
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  instructor_id uuid references users(id),
  price int default 0,
  currency text default 'INR',
  duration_label text,
  session_count int,
  level text,
  status text default 'draft',
  thumbnail_url text,
  description text,
  trailer_url text,
  who_is_this_for text,
  materials_needed text,
  access_details text,
  certificate_enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sessions
create table sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  video_url text,
  position int not null,
  is_preview boolean default false,
  reference_url text,   -- added via supabase-session-reference-resources.sql
  reference_name text,
  resource_url text,
  resource_name text,
  created_at timestamptz default now()
);

-- SessionCards (junction)
create table session_cards (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  card_id uuid references cards(id),
  role text not null,
  position int default 0
);

-- Playlists
create table playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  audience text,
  status text default 'draft',
  created_at timestamptz default now()
);

-- PlaylistCourses (junction)
create table playlist_courses (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid references playlists(id) on delete cascade,
  course_id uuid references courses(id),
  position int default 0
);

-- Enrollments
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  course_id uuid references courses(id),
  progress float default 0,
  last_session_id uuid references sessions(id),
  last_timestamp int default 0,
  status text default 'active',
  enrolled_at timestamptz default now(),
  completed_at timestamptz
);

-- Submissions
create table submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  course_id uuid references courses(id),
  session_id uuid references sessions(id),
  card_id uuid references cards(id),
  file_url text,
  status text default 'awaiting_review',
  submitted_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewer_id uuid references users(id),
  feedback_text text,
  feedback_audio_url text,
  annotated_file_url text
);

-- Workshops
create table workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz,
  duration_minutes int,
  registration_url text,
  replay_url text,
  thumbnail_url text,
  status text default 'upcoming'
);

-- Notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  type text,
  title text,
  body text,
  read boolean default false,
  href text,
  created_at timestamptz default now()
);
```

---

## Open Questions (answer before v2 scoping)

1. Should admin and student share one login screen (role detection) or stay separate?
2. Should video be hosted in Supabase Storage or Vimeo/YouTube unlisted for large files?
3. Should assignments unlock the next session, or the certificate, or both?
4. Are playlists public catalog items or privately assigned to cohorts?
5. Can one card be reused across multiple courses? (Schema says yes — confirm UX.)
6. Should feedback annotations be image overlays, vector layers, or flattened files?

---

## Admin Credentials (demo)

- URL: `/admin/auth`
- Email: `drdha@divyakala.com`
- Password: set in Supabase dashboard (never hardcode in repo)

---

## What Has Been Built (through session 23)

### New files
- `src/lib/supabase.js` — single Supabase client, imported everywhere. Never re-initialize.
- `.env.local` — holds `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (gitignored)
- `.env.example` — same keys, empty values

### Auth (fully wired, no localStorage anywhere)
- `AuthContext` + `AuthProvider` + `useAuth()` hook live at the top of `App.jsx` (inline, not a separate file — do NOT move until post-contract refactor)
- `AuthProvider` listens to `supabase.auth.onAuthStateChange`, fetches `profiles` row, exposes `{ session, profile, loading }`
- `LoadingScreen` — warm branded loading state shown while session resolves
- `RootRedirect` — routes admin → `/admin`, unauthenticated → `/auth/sign-in`, incomplete student → `/onboarding`, complete student → `/learning`
- `isProfileComplete(profile)` — returns true if profile has country + phone + age_group + artist_background + why_shilpa_shastra. Used by RootRedirect to gate /onboarding redirect.
- `Protected` — async-aware session guard for student routes
- `AdminProtected` — checks session + `profile.role === 'admin'`
- **Student sign-up (session 25 final):** collects first name, last name, country, phone, email, password. Calls `supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: undefined } })` — no confirmation email triggered. Immediately calls `signInWithPassword({ email, password })` to log in. Upserts `profiles` with `id, email, name, country, phone, role: 'student', admission_status: 'prospect', fee_status: 'pending'`. Redirects to `/onboarding`.
- **Email confirmation is DISABLED in Supabase Dashboard** (Authentication → Providers → Email → "Confirm email" OFF). Required for sign-up to work without email.
- **Student sign-in primary path:** OTP magic link. `signInWithOtp({ email, options: { emailRedirectTo: 'https://divyakala-lms.vercel.app/auth/callback' } })`. OTP boxes are fully controlled with paste + auto-advance + backspace. `/auth/callback` route handled by `AuthCallback` component which calls `getSession()` then redirects to `/`.
- **Student sign-in password fallback:** "Sign in with password instead" toggle below OTP form. Shows email + password fields, calls `signInWithPassword`. Error: "No account found or wrong password. Please sign up first."
- Admin auth (`AdminAuth` component): `signInWithPassword`, checks `profile.role === 'admin'`, signs out immediately if not admin. Unchanged.
- Sign out in both Shell and AdminShell sidebars calls `supabase.auth.signOut()`
- Avatar and sidebar user name/email pull from real `profile` row
- "Admin Studio →" pill link appears in student top bar only when `profile.role === 'admin'`
- Student avatar buttons in both the sidebar footer and top bar open a real profile modal.
- Profile modal lets the student edit full name, country, and phone/WhatsApp; email is shown read-only.
- Saving the profile upserts `profiles` and refreshes `AuthContext.profile` immediately.

### Supabase schema actually deployed
The table names in the deployed schema use `profiles` (not `users`). Always use `profiles` when querying the user/role table. Key difference from the schema section below which says `users`.

### RLS policies in place
- `profiles`: own-row read/write + `create policy "Authenticated read profiles" on profiles for select to authenticated using (true)` (added to fix circular dependency)
- `storage.objects` (thumbnails bucket): `create policy "Authenticated upload thumbnails" on storage.objects for insert to authenticated with check (bucket_id = 'thumbnails')`
- Courses, sessions, cards, enrollments, submissions, workshops, notifications: policies as defined in schema section

### Student Onboarding (`/onboarding`) — added session 25
- Route: `/onboarding`, wrapped in `<Protected>` so only signed-in students see it
- Component: `StudentOnboarding`
- Only shows country/phone fields if the profile is missing them (they may have been set during sign-up)
- Required fields: age_group (dropdown: Under 19 / 19–30 / Above 30), artist_background (textarea), why_shilpa_shastra (textarea)
- Optional field: portfolio_url
- On save: upserts new columns into `profiles`, then `refreshProfile`, then redirects to `/learning`
- RootRedirect calls `isProfileComplete(profile)` after fetching profile; incomplete students are sent to `/onboarding` before reaching `/learning`

### New profiles columns — added session 25
Run this SQL in Supabase SQL Editor (idempotent, safe to re-run):
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age_group text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS artist_background text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS why_shilpa_shastra text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS admission_status text DEFAULT 'prospect';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fee_status text DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_notes text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
```

### Admin Students CRM (`/admin/students`) — added session 25
- Old `AdminStudents` component replaced by `AdminStudentsCRM`. Old component now just returns `<AdminStudentsCRM />` for compat.
- Data source: `SELECT * FROM profiles WHERE role != 'admin' ORDER BY created_at DESC` — reads students directly, not via enrollments join
- Table columns: Name, Email, Phone, Country, Age Group, Admission Status (badge), Fee Status (badge)
- Admission status badge colors: prospect → yellow, enrolled → green, discontinued → red
- Fee status badge colors: pending → yellow, paid → green
- Client-side search by name/email + admission status filter dropdown
- Empty state: "No students yet. Students appear here after completing onboarding."
- No-results state with "Clear filters" button
- Row click opens side detail panel (right-side sticky aside, 340px wide)
- Detail panel Section 1 (read-only): name, email, phone, country, age_group, portfolio_url (link), artist_background, why_shilpa_shastra
- Detail panel Section 2 (editable): admission_status dropdown, fee_status dropdown, payment_notes textarea, Save button — updates only these 3 fields in profiles
- `InfoRow` helper component renders a label+value pair, returns null if value is empty
- **Will be extended** in the next session when long courses and batches are added

### Mock students seeded — session 25
8 demo students created via `seed-users.js` (local script, gitignored). All use password `12345678`. All have full onboarding data so they land on `/learning` directly.

| Name | Email | Admission | Fee |
|---|---|---|---|
| Priya Sharma | priya.sharma@demo.com | enrolled | paid |
| Arjun Mehta | arjun.mehta@demo.com | enrolled | paid |
| Kavya Nair | kavya.nair@demo.com | prospect | pending |
| Rohan Das | rohan.das@demo.com | prospect | pending |
| Ananya Iyer | ananya.iyer@demo.com | enrolled | pending |
| Vikram Patel | vikram.patel@demo.com | enrolled | paid |
| Meera Joshi | meera.joshi@demo.com | prospect | pending |
| Aditya Kumar | aditya.kumar@demo.com | prospect | pending |

### Cards (admin `/admin/cards`)
- Admin Cards is currently a simple "Coming soon" page, not an active CRUD surface
- The page makes "Coming soon" the main message, includes one paragraph explaining the future Card Library, and links Drdha to Courses and Assignments as the working tabs
- For the demo, cards are deferred and sessions continue to use direct `video_url` fields in the Course Builder
- Old AdminCards CRUD code still exists after an early return in `App.jsx`; it is unreachable and should be removed in the cleanup pass
- `AdminEditor` component now wraps children in a real `<form>` and accepts `onSubmit` prop
- `IconButton` now accepts `onClick` prop

### Courses (admin `/admin/courses`)
- Loads all courses from `courses` table, newest-first
- `/admin/courses` is now the course list surface, not the main course creation form
- Course cards show thumbnail/art, title, status badge, duration, price, enrollment summary, Edit Course button, status cycle, and delete
- Course list now fetches `enrollments` + related `profiles` and groups them by `course_id`
- Course cards show compact enrollment summary: `No enrollments yet`, or `N enrolled` plus first two student names and `+N more`
- Admin course card thumbnails now use a fixed warm media area with `object-contain` for uploaded thumbnails so artwork is not cropped
- Create Course opens `/admin/courses/new`; existing course cards open `/admin/courses/:courseId`
- Legacy inline course creation/session-management JSX still exists behind `{false && ...}` inside `AdminCourses`; it is intentionally inactive and should be removed after the demo cleanup pass
- Create/edit form fields: title, price in rupees (stored as paise = rupees × 100), duration, number of sessions, level, status picker (draft/coming_soon/published), description, trailer URL, three FAQ/detail answers, thumbnail upload → `thumbnails` bucket → public URL stored in `thumbnail_url`
- Status cycle button: draft → coming_soon → published → draft, updates Supabase in place
- Delete removes from DB
- Empty state with warm copy
- Each course card now has an **Edit Course** entry point to a dedicated course editor screen at `/admin/courses/:courseId`

### Courses + Sessions admin flow
- Admin `/admin/courses` is now a **course list page** with existing courses plus a **Create Course** button
- Empty state now points into the same create flow
- Creating a course should happen on a dedicated screen first, then the admin continues editing that course on its own page
- Dedicated editor route: `/admin/courses/:courseId`
- Create route: `/admin/courses/new`, then redirects into `/admin/courses/:courseId` after saving
- The dedicated editor now contains:
  - core course fields
  - number of sessions
  - trailer URL
  - the three course-detail question answers
  - session management
- Course save runs in two passes:
  - base course fields save first
  - extra fields (`trailer_url`, FAQ answers, `session_count`) save through `saveExtendedCourseFields()`
- If the extra columns are missing in Supabase, the course shell still saves and the UI shows a warning that trailer/questions/session count need the newer columns
- Session management has been moved off the course list screen and into the dedicated course editor screen. There is no card library flow in this demo step.
- For each course, admin can add:
  - session title
  - `video_url` with label: "Video URL — paste YouTube, Vimeo, or direct link"
  - reference upload for the lesson player's Companion → Reference tab
  - resource upload for the lesson player's Resources tab
- Insert shape used:
  - `course_id`
  - `title`
  - `video_url`
  - `position = existingSessions.length + 1`
  - `is_preview = existingSessions.length === 0`
  - optional `reference_url`, `reference_name`, `resource_url`, `resource_name`
- Existing sessions render in order with position, title, truncated URL, preview badge on the first session, and delete action
- Existing sessions also show attached reference/resource file names when present
- Deleting a session re-numbers remaining sessions and reassigns the first one as preview
- Per-session reference/resource uploads require `supabase-session-reference-resources.sql` to be run in Supabase SQL Editor. It adds the four session columns and storage policies for the private `cards` bucket under `sessions/...`.

### Browse Courses (student `/browse`)
- Fetches all courses from Supabase, then filters client-side so drafts stay hidden while published + coming soon remain visible
- Status handling is now normalized so variants like `coming soon`, `coming-soon`, and `coming_soon` all behave the same
- `coming_soon` courses show "Coming Soon" badge + "Notify me" button (no enroll)
- Filter pills + search work client-side against real data
- Added explicit `Coming Soon` filter pill
- Empty state when no courses exist

### Course Detail + Lesson Player (simplified Loop 2 version)
- `CourseDetail` now fetches the real course by `courseId` plus ordered `sessions` from Supabase
- Student shell header now shows generic "Course Details" on `/courses/:courseId` instead of the old hardcoded "Browse / Drawing Divine Forms - Srinivasa"
- Free preview button now links to the real first preview session ID instead of hardcoded `session-1`
- `Enroll Now` is now wired for the demo:
  - checks whether the current user already has an enrollment for the course
  - inserts a row into `enrollments` with `user_id`, `course_id`, `progress = 0`, `last_session_id`, and `status = active`
  - redirects to the first preview/session lesson after enrollment
  - if already enrolled, the CTA becomes "Continue Learning" and routes straight to the first session
  - if Supabase/RLS blocks the insert, the course page shows the returned error inline
- Coming soon courses still show Notify Me, but notification capture is not wired yet
- Course detail currently routes through a separate `CourseDetailTabs` component, but the visible UI is no longer tabbed after Claude's redesign
- There is still an unreachable old `return (<div className="space-y-12">...)` block after the active `CourseDetailTabs` return; leave it alone during active UI iteration, but remove it in cleanup
- Course detail page was redesigned again after the tab experiment into a compact editorial layout:
  - full-width warm hero band with title, instructor, tags, price, CTAs, and trailer
  - body uses a desktop two-column layout: main content on the left, sticky enrollment card on the right
  - no active tab UI is currently visible despite `activeTab` state still existing in the component props
- Main body left column is stacked in this order: Overview/About, Curriculum, Instructor, FAQ
- Overview/About uses the course description plus inline facts for sessions, level, duration, and certificate
- Curriculum section is titled "Course sessions" and renders real Supabase sessions as compact numbered rows
- Preview sessions link to the lesson player with a small "Preview" pill; locked/enrolled sessions show a lock icon
- Instructor section uses an initials avatar, instructor name, role subtitle, current static bio, and portfolio link
- FAQ accordion remains in the course detail body and allows one item open at a time:
  - Who is this course for?
  - What materials do you need?
  - How long do I have access?
- Desktop sticky enrollment card includes thumbnail/art, price, primary CTA, preview CTA, and facts for Sessions, Level, Duration, Certificate, and Format
- `src/index.css` has small custom hover styles for `.preview-pill`, `.faq-row`, `.faq-label`, and `.faq-icon`
- Removed the hardcoded "What students are creating" and "What students say" sections for now
- Student-side session count now prefers `course.session_count` until real sessions are added
- `LessonPlayer` now loads real sessions for the selected course from Supabase
- When a session is selected, it fetches the session row directly from `sessions`
- `LessonPlayer` now loads the signed-in student's matching `enrollments` row for the course
- Sidebar course progress now displays real `enrollments.progress`
- Session completion is wired:
  - `Mark as Complete` updates the enrollment row with the next `progress`, `last_session_id`, `status`, and `completed_at`
  - save now refreshes/creates the learner's enrollment at click time if the lesson player opened without an already-loaded enrollment
  - update targets the row by `user_id + course_id` so stale local enrollment state does not block progress saving
  - completed-session count is derived with `Math.round((progress / 100) * sessionTotal)`; do not use `Math.floor`, because rounded stored percentages like 33% for 2/6 sessions would otherwise collapse back to 1 completed session
  - the locked-session "Mark previous as complete" action calls the same progress saver
  - completed sessions show check icons based on stored progress
  - after saving, the player advances to the next session when one exists
  - next unlocked session is derived from stored progress instead of the old fixed index rule
- Locked behavior is still intentionally simple for the demo: preview sessions stay accessible, enrolled students can access up through the next incomplete session, and later sessions show the locked state
- Lesson player no longer resets to Overview when switching sessions. If a student is on Assignment or Resources, switching sessions preserves that active tab.
- Lesson player Companion → Reference tab now reads `currentSession.reference_url` when present; images render inline and PDFs open via link. Falls back to the old mock Talamana art when no reference is uploaded.
- Lesson player Resources tab now reads `currentSession.resource_url` when present; the file appears as a linked resource card. Falls back to mock `getLessonContent().resources` when no resource is uploaded.
- Video rendering logic:
  - YouTube / youtu.be → `<iframe>` with normalized YouTube embed URL
  - Vimeo → `<iframe>` with normalized Vimeo embed URL
  - anything else → native `<video controls />`
  - missing `video_url` → clean "Video coming soon" empty state
- Assignment tab now uploads real student submissions to Supabase for Loop 3:
  - Uses the authenticated user ID from `supabase.auth.getUser()`
  - Uploads selected PNG/JPG/PDF files to private `submissions` bucket path: `{userId}/{courseId}/{sessionId}/{timestamp}-{fileName}`
  - Creates a 30-day signed URL and inserts into `submissions` with `user_id`, `course_id`, `session_id`, `file_url`, and `status = awaiting_review`
  - After upload, refreshes the submissions list for the current session
  - Current-session submissions are loaded from Supabase and displayed as cards with status badges, including "Awaiting review"
- Loop 3 requires the `submissions` table insert/select policies and `storage.objects` policies for the private `submissions` bucket. If upload/insert fails with "new row violates row-level security policy", run `supabase-loop3-submissions-rls.sql` from the repo root in Supabase SQL Editor.
- Loop 4 admin review is now wired:
  - `/admin/assignments` loads real rows from `submissions`, joins course/session titles, and fetches related `profiles` for student name/email
  - Assignment cards show the real submitted image/PDF state, real status badge, course/session context, and a Review button
  - Admin assignments queue subscribes to realtime `submissions` changes, so newly uploaded student work appears without page refresh when realtime is active
  - Review modal shows the submitted file full width; PDFs get an "Open PDF" link
  - Admin can save text feedback and set status to `reviewed`, `approved`, or `needs_resubmission`
  - Save updates `submissions.status`, `feedback_text`, `reviewed_at`, and `reviewer_id`
  - Save also inserts a `notifications` row for the student with type `feedback` and href back to the lesson
  - Re-reviewing the same submission is replacement-style:
    - Text feedback, status, annotation, and voice URL overwrite the same `submissions` row
    - Existing feedback notification for the same student/session href is deleted before inserting the fresh notification, so the student bell does not stack duplicates for the same reviewed work
    - If Drdha records a replacement voice note, the previous `feedback-audio` object is removed when its storage path can be resolved from the signed URL
  - Student notification bell now reads real Supabase `notifications` instead of the static mock array
  - Student notification bell shows unread count, real title/body/time, href navigation, and "Mark all as read"
  - Clicking a notification marks that notification as read before navigating
  - Student notification bell subscribes to realtime `notifications` changes for the current user, so Drdha's saved review appears without manual refresh when Supabase realtime is active
  - Student lesson player subscribes to realtime changes on `submissions` for the current user/session and refreshes the current session's submissions after admin review
  - Student feedback modal now opens from the real submission row and shows the real `file_url` + `feedback_text`
  - Admin review modal now supports real image annotations for non-PDF submissions:
    - Drdha draws red strokes directly over the submitted image
    - Annotation is saved as an SVG data URL in `submissions.annotated_file_url`
    - Student feedback modal displays the saved annotation overlay; old/mock overlay only remains as fallback
    - Important positioning rule: annotation coordinates are normalized against the actual rendered image rectangle, and the student feedback modal must display the overlay on the same natural image-aspect rectangle. Do not put saved annotations over a fixed-height `object-contain` canvas with extra blank space, or the marks will drift.
  - Admin review modal now supports real browser voice note recording:
    - Uses `navigator.mediaDevices.getUserMedia()` + `MediaRecorder`
    - Uploads recorded audio to private `feedback-audio` bucket
    - Saves a 30-day signed URL in `submissions.feedback_audio_url`
    - Student feedback modal plays the real audio when present; static waveform remains fallback only
- Loop 4 requires notification insert/read/update/delete policies, realtime publication for `submissions` + `notifications`, and storage insert/read/delete policies for private `feedback-audio`. If saving review fails on notification/audio RLS, bucket missing, or realtime does not refresh the student tab/bell, run `supabase-loop4-review-rls.sql` from the repo root in Supabase SQL Editor.
- Supabase realtime replication for `public.submissions` and `public.notifications` is intentionally skipped for now. Before final demo polish, enable it manually in Supabase Dashboard → Database → Replication so admin/student feedback updates appear without refresh.
- Notes / Resources / Assignment prompt text remain mock for now via `getLessonContent()` exactly as intended for this demo step

### Known App.jsx cleanup debt
- `App()` still contains a large commented-out course-detail tab experiment above the real router return. It is harmless because it is inside `/* ... */`, but should be deleted during cleanup.
- `CourseDetail()` has an active `return <CourseDetailTabs ... />` followed by an unreachable older stacked-layout return. It builds, but should be deleted once the new layout is accepted.
- `activeTab` state is currently unused by the visible course detail design because the UI is no longer tabbed.
- `AdminCards()` has unreachable old CRUD code after the new coming-soon return. Delete it during cleanup.
- `adminStudents` const (line ~255) is an old mock array — AdminStudents now reads real Supabase data. Remove it during cleanup.
- Legacy inline course creation JSX inside `AdminCourses` still exists behind `{false && ...}`. Remove it during cleanup.

### Admin Playlists
- `/admin/playlists` is currently a simple "Coming soon" page
- The page makes "Coming soon" the main message, includes one paragraph explaining future learning paths/playlists, and links Drdha to Courses and Assignments as the working tabs
- Playlist CRUD remains deferred to v2/post-contract

### Admin navigation/demo refinement
- Admin sidebar now groups working demo areas at the top:
  - Dashboard
  - Courses
  - Assignments
  - Students
  - Demo Controls (`/admin/settings`)
- Admin sidebar separates future modules below a "Coming soon" divider:
  - Cards
  - Playlists
  - Workshops
- `/admin/workshops` is now a Coming Soon page matching Cards and Playlists. Workshop CRUD UI was removed from the visible demo path because workshops are not wired yet.
- `/admin/settings` is the **Demo Controls** page with "Load demo" and "Clear all data" buttons. Load demo seeds 2 courses, 6 sessions, an enrollment at 33% progress, 2 reviewed submissions (approved + needs_resubmission), and 2 notifications. Clear all wipes all data created by the logged-in admin user.
- `/admin` dashboard was redesigned away from crowded fake metrics. It now starts with a full-screen warm greeting hero for Drdha, art decorations, CTA buttons to Demo Guide/Courses, and a down-arrow scroll cue.
- The hero no longer shows the floating "Demo path" text box. The right side uses a four-artwork cluster with no decorative outline circles.
- Below the dashboard hero, the content is intentionally sparse:
  - Needs attention card linking to the assignment review queue
  - Needs attention now reads real `submissions` with `status = awaiting_review` and shows a warm empty state if nothing needs review
  - Three demo-health cards for Courses, Reviews, and Students
  - "What this demo proves" map: publish learning, collect practice, give feedback
- Do not reintroduce the old "42 cards / 8 courses / 148 students" metric grid unless real analytics are wired later.

### CourseCard component
- Updated to handle both Supabase shape (`status`, `thumbnail_url`, `price` as int paise, `duration_label`) and legacy mock shape (`available` bool, `art` key, `price` string, `duration`)
- When rendered with progress, the card links to `lastSessionId` so "Continue Learning" resumes the student's saved enrollment state
- Price display: if `price` is an int, renders `₹${(price/100).toLocaleString('en-IN')}`

### My Learning
- `/learning` now reads real `enrollments` for the signed-in student from Supabase
- It fetches related `courses` and ordered `sessions`, then builds each learning card from the real enrollment row
- Newly created enrollment rows from Browse Courses now appear in My Learning
- The hero resume card uses the most recent enrollment, shows stored progress, and links to `last_session_id`
- Empty state sends students to Browse Courses
- If RLS blocks the read, the page shows the Supabase error inline
- `JournalPreview` below My Learning now reads real `submissions` for the signed-in student, newest-first, and preserves the polaroid-style horizontal visual journal
- Journal preview shows submitted image files directly, uses review feedback/status as the caption, and has a warm empty state before the student's first submission

### Admin Students
- `/admin/students` now renders `AdminStudentsCRM` (see session 25 section above for full spec)
- Old enrollment-grouped view is replaced — students come from `profiles` directly, not `enrollments` join
- The old `AdminStudents` wrapper component now just returns `<AdminStudentsCRM />` for route compat

### Still using mock data (not yet wired)
- `CourseDetail` still has a simple static instructor paragraph; this should become editable later
- `LessonPlayer` still uses `getLessonContent()` mock function for notes/resources/assignment prompt text only; video and student submissions now come from Supabase
- `LiveWorkshops` — still uses mock `workshops` array
- `AdminDashboard` no longer shows hardcoded fake metric stats; its Needs Attention card reads real awaiting-review submissions
- `AdminAssignments` now reads real `submissions`; the old `adminSubmissions` mock constant remains unused cleanup debt
- `Notifications` now reads real Supabase `notifications`; the old `notifications` mock constant remains unused cleanup debt
- `JournalPreview` on My Learning is real; the full `PracticeJournal` page still uses mock `journalEntries`
- `PracticeJournal` / `JournalPreview` — still uses mock `journalEntries`

---

## Notes for Claude Code (always follow these)

- Do NOT refactor App.jsx during the demo build
- Do NOT add drag-and-drop ordering — use numeric position fields
- Do NOT add Discussion tab to lesson player
- Voice note recording is now in demo scope inside Admin Assignments review modal; keep implementation lightweight and browser-native
- Annotation is now in demo scope inside Admin Assignments review modal; keep implementation as lightweight SVG overlay drawing, not full tldraw/canvas editing
- Supabase client: initialize once in `src/lib/supabase.js`, import everywhere
- Use Supabase real-time on `submissions` table for Loop 4
- File uploads: `supabase.storage.from('cards').upload(path, file)` for admin; `supabase.storage.from('submissions').upload(path, file)` for student
- For the simplified Loop 2 demo, sessions use a direct `video_url` on the `sessions` table instead of card/session-card wiring
- Current course editor assumes additional `courses` columns for:
  - `session_count`
  - `trailer_url`
  - `who_is_this_for`
  - `materials_needed`
  - `access_details`
- Course create/update now saves base fields first, then attempts the extra detail fields in a second pass so course creation does not completely fail if those newer columns have not been added yet
- SQL already needs to be run in Supabase for the columns above if they are not present. Without them, the course shell still creates, but those extended detail values will not persist.
- Keep Poppins font everywhere. Do not introduce other typefaces.
- Keep all colors within the existing Tailwind token system
- Empty states must have warm copy + CTA — never a sad icon and "No data found"
- Every route change must scroll to top (ScrollToTop already exists, keep it)
- All work goes directly on `main` branch — no PRs, no feature branches
- Service role key lives only in `.env.local.txt` locally — never commit, never put on Vercel
- `seed-users.js` is gitignored — re-run locally if demo data needs to be rebuilt

---

## Next Session — Long Courses + Batches

### What to build
1. **Long course type** — distinct from short courses. New `course_type` column on `courses` table: `short` (default) or `long`.
2. **Browse page** — shows both short and long course cards. Long course cards display a "Request Batch Placement" CTA instead of "Enroll Now".
3. **Batch interest capture** — clicking "Request Batch Placement" records the student's interest in `profiles.payment_notes` (or a new `batch_interest` column) and shows a confirmation message.
4. **Admin batch creation** — admin can create batches tied to a long course: batch name, start date, capacity, schedule description.
5. **Student enrollment into batches** — admin manually enrolls students into a batch from the CRM detail panel.
6. **CRM detail panel extension** — show enrolled short courses (from `enrollments`) and long course batch interest/enrollment in the same panel.

### Database additions needed (next session)
```sql
-- Add course type
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_type text DEFAULT 'short';

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  starts_at date,
  capacity int,
  schedule_description text,
  status text DEFAULT 'upcoming',
  created_at timestamptz DEFAULT now()
);

-- Batch enrollments
CREATE TABLE IF NOT EXISTS batch_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid REFERENCES batches(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  enrolled_at timestamptz DEFAULT now(),
  status text DEFAULT 'active'
);
```

### Reference implementation
The `codex/current-demo-source` branch has a reference implementation of batches (`StudentBatchDashboard`, `term_groups`, `batch_sessions`, `term_modules` tables). Read it for UI patterns but do NOT copy the schema directly — the tables above are the simplified version for this build.
