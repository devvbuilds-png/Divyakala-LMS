# Divyakala LMS — Sunday Demo Build Plan

> **How to use this file:** Each STEP below is a self-contained Claude Code prompt. Copy one STEP at a time into Claude Code, let it finish, verify it, then move to the next. Do not skip ahead. Do not paste two steps at once.
>
> **Before every Claude Code session, the first thing you paste is STEP 0.**
>
> Last updated: 2026-05-16 — Sunday demo scope locked. Two-level hierarchy (Term Group → Batch).

---

## What we are building (the whole picture)

Tomorrow's demo proves to Drdha that the platform handles his **long-course cohort model** — not just the short YouTube courses that already work.

Three things get demoed:

1. **Long courses** — admin creates a term group, creates batches inside it, schedules per-batch live sessions, attaches recordings. Students see their batch, join live, watch recordings of missed classes.
2. **Onboarding → Student CRM** — the new signup form replaces the Google Form → Notion copy-paste. Signup writes straight into a CRM that admin can view.
3. **Unified My Learning** — students see both short and long courses cleanly separated.

Everything is wired to Supabase but **not production-hardened**. Live streaming is Zoom (a link), recordings are Bunny.net URLs pasted in by hand. That is the honest story we tell Drdha and it is also how real cohort platforms work.

---

## The hierarchy (LOCKED — matches Drdha's Notion exactly)

```
Term Group (the intake — when the 2-year program starts)
   │   e.g. "October 2024", "February 2023"
   │
   ├── Batch (a time-slot group within the term — same curriculum, different timing & students)
   │     e.g. Batch A = Friday 7 AM,  Batch B = Sunday 6 PM
   │     │
   │     ├── Module (×6 — generally, but flexible)
   │     │     │
   │     │     └── Live Session  →  Recording
   │     │           (count varies per batch — typically 6–8, can be more or fewer.
   │     │            NEVER hardcode the count.)
   │     │
   │     └── enrolled Students
   │
   └── Batch B ...
```

**Key facts:**

- A **Term Group** contains one or more **Batches**.
- A **Batch** = same curriculum and same intake as its term group, but its own class timing and its own students.
- A **student belongs to exactly one Batch.**
- **Modules and Sessions are per-batch.** Batch A's Friday classes and Batch B's Sunday classes are separate live events with separate recordings. The 6-module curriculum shape is shared in spirit, but each batch has its own module/session rows.
- **Session count is not fixed.** Typically 6–8 per module-area but it varies by batch. The admin adds as many sessions as a batch actually needs. Do not hardcode 6, 7, or 8 anywhere.

A long **Course** is the syllabus template. A **Term Group** is one intake of that course. A **Batch** is one time-slot cohort of students inside that intake.

**Correction locked May 16:** modules are shared syllabus chapters for the term group, not duplicated per batch. Sessions are the per-batch live classes. Batch A and Batch B move through the same module list at different pace, so the UI and schema should use `term_modules` for shared modules and `batch_sessions` with `batch_id` + `term_module_id` for actual classes.

---

## The live session flow (LOCKED — this is the pitch answer)

```
Live class runs on Zoom  (per batch — Batch A and Batch B meet separately)
        ↓  (Zoom auto-records to cloud)
Recording uploaded to Bunny.net
        ↓  (Bunny gives a playback URL)
URL pasted into that batch's session in the LMS admin
        ↓
Student watches the recording inside the LMS
```

For the demo: no real Zoom API, no real Bunny upload. Admin pastes a Zoom link and (later) pastes a Bunny/YouTube URL by hand. The flow is real; the automation is v2.

---

## Onboarding vs CRM — field split (LOCKED, from Drdha's Notion)

**New user fills at signup (keep it light — one short form, no payment):**

- First Name
- Last Name
- Email *(already captured by auth)*
- Phone
- Location / Country
- Age Group *(dropdown: Under 19 / 19–30 / Above 30)*
- Artist Background & Experience *(short free text)*
- Why Shilpa Shastra? *(short free text)*
- Portfolio link *(optional)*

**Admin fills later in the CRM (NOT shown to the new user):**

- Admission Status *(Prospect / Enrolled / Discontinued)*
- Batch *(which batch the student is placed in — implies their term group)*
- Fee Status *(Paid / Pending)*
- Currency *(USD / INR)*
- Payment notes *(free text — gateway, dates, term-wise info all collapsed into one notes field for the demo)*

The CRM record = student-filled fields **+** admin-filled fields, merged into one view. **Pitch line:** "The Google Form and the Notion copy-paste are gone. Signup writes straight into your CRM — you only fill the payment and batch columns."

---

## My Learning layout (LOCKED)

```
┌─────────────────────────────────────────┐
│  [ My Program ]   [ My Courses ]   ← two pills (tab switcher) at top
├─────────────────────────────────────────┤
│  CONTINUE LEARNING                        │
│  ┌───────────┐  ┌───────────┐            │
│  │ long-crs  │  │ short-crs │  ← active item from EACH track,
│  │ "Batch"   │  │           │     each clearly tagged Long / Short.
│  └───────────┘  └───────────┘     A track with nothing active just
│                                    doesn't show a card here.
├─────────────────────────────────────────┤
│  (selected tab's full content below)      │
│  My Program tab → the student's batch     │
│  My Courses tab → all short courses       │
└─────────────────────────────────────────┘
```

Browse Courses keeps the same experience it has now, just shows both course types.

---

## What we are NOT building for Sunday (say these out loud in the pitch as deliberate)

- Real Zoom API integration — just a link
- Real Bunny.net upload pipeline — paste URL by hand
- Payment / Razorpay — admin sets Fee Status manually
- Lesson-unlock logic for long courses — all sessions visible
- App.jsx refactor — stays monolithic
- Migration of the ~97 existing Notion students — v1 production work
- Card Library, Playlists, full Practice Journal — already deferred, stays deferred

---

## Database changes — full picture

Five new tables. The seed step (STEP 3) also purges test junk. Nothing existing is destructively altered — `courses` only gets one new column.

```sql
-- term_groups: an intake of a long course
term_groups (
  id          uuid pk default gen_random_uuid(),
  course_id   uuid references courses(id),    -- the long-course syllabus
  name        text not null,                  -- "October 2024"
  start_date  date,
  status      text default 'active',           -- upcoming / active / closed
  created_at  timestamptz default now()
)

-- batches: a time-slot cohort of students inside a term group
batches (
  id             uuid pk default gen_random_uuid(),
  term_group_id  uuid references term_groups(id) on delete cascade,
  name           text not null,                -- "Batch A"
  schedule_note  text,                          -- "Fridays 7:00 AM IST"
  seats          int,
  status         text default 'active',          -- upcoming / active / closed
  created_at     timestamptz default now()
)

-- batch_modules: the modules inside a batch (per-batch)
batch_modules (
  id             uuid pk default gen_random_uuid(),
  batch_id       uuid references batches(id) on delete cascade,
  module_number  int not null,
  title          text not null,
  created_at     timestamptz default now()
)

-- batch_sessions: the live sessions inside a module (count varies — never hardcoded)
batch_sessions (
  id             uuid pk default gen_random_uuid(),
  module_id      uuid references batch_modules(id) on delete cascade,
  title          text not null,
  scheduled_at   timestamptz,
  zoom_link      text,
  recording_url  text,                          -- Bunny / YouTube URL, null until recorded
  status         text default 'upcoming',        -- upcoming / live / recorded
  created_at     timestamptz default now()
)

-- batch_enrollments: which student is in which batch (a student is in exactly one)
batch_enrollments (
  id            uuid pk default gen_random_uuid(),
  batch_id      uuid references batches(id) on delete cascade,
  student_id    uuid references profiles(id) on delete cascade,
  enrolled_at   timestamptz default now(),
  unique (batch_id, student_id)
)
```

Also: the `profiles` table gets CRM columns (STEP 2). The `courses` table gets `course_type text default 'short'` (`short` / `long`) to tell the two tracks apart.

**Correction migration 007:** the production-facing demo model now adds `term_modules`
as shared syllabus chapters and links `batch_sessions` to both `batch_id` and
`term_module_id`. `batch_modules` remains as legacy scaffold from Step 1/3, but new
UI should use `term_modules`.

**Status semantics correction:** `recorded` means the session has a playback recording,
not merely that the live class happened. A past class without recording is concluded.
`live` should be treated as a derived display state for today's scheduled Zoom class,
not a permanent admin-selected tracker value.

---

## BUILD ORDER (the steps)

| Step | What | Risk |
|------|------|------|
| 0 | Context primer — paste at start of every CC session | none |
| 1 | DB migration — 5 tables + course_type column | low |
| 2 | DB migration — CRM columns on profiles | low |
| 3 | Purge test junk + seed clean believable data (short + long) | low |
| 4 | Admin: Term Group + Batch creation & list | medium |
| 5 | Admin: Module + session scheduling inside a batch | medium |
| 6 | Admin: enroll students into a batch + mark session recorded | medium |
| 7 | Admin: Student CRM view (merged fields) | medium |
| 8 | Student: onboarding form (the new signup fields) | medium |
| 9 | Student: My Learning — two pills + Continue Learning | medium |
| 10 | Student: Batch dashboard (modules, sessions, live banner) | medium |
| 11 | Student: recorded session playback | low |
| 12 | Pre-demo smoke test | low |
| — | HTML pitch deck (separate, build anytime) | none |

Seed (STEP 3) comes EARLY on purpose: every screen after it is built and tested against clean, believable data instead of test junk.

Do steps in order. Each one is below as a ready-to-paste prompt.

---

# STEP 0 — Context primer

> Paste this FIRST in every new Claude Code session before any build step.

```
Read docs/claude.md first — it is the source of truth for all locked decisions.
Then read src/App.jsx to understand the existing structure, and src/lib/supabase.js.

Context for this work: we are building the Sunday demo for long courses, onboarding,
and the student CRM. The long-course hierarchy is TWO levels:
  Term Group  →  Batch  →  Module  →  Live Session  →  Recording
A Term Group is an intake (e.g. "October 2024"). A Batch is a time-slot cohort inside
it (e.g. "Batch A — Friday 7 AM"). A student belongs to exactly one Batch. Modules and
sessions are PER-BATCH. Session count per batch VARIES (typically 6–8) — never hardcode it.

Follow these rules without exception:
- Do NOT refactor App.jsx. It stays monolithic.
- Do NOT add drag-and-drop anywhere.
- Do NOT touch existing short-course tables or flows.
- Do NOT hardcode session or module counts — they are dynamic.
- Use the existing Supabase client in src/lib/supabase.js — never create a second one.
- Keep Poppins font, 13px root, and the existing Tailwind color tokens. No new colors.
- Every empty state needs warm copy + a CTA.
- Every route change scrolls to top.

Acknowledge you have read claude.md and App.jsx, then wait for the build step.

IMPORTANT correction after Step 3: modules are shared syllabus chapters (`term_modules`)
at the term-group level. Sessions are per-batch classes (`batch_sessions`) and should
carry `batch_id` + `term_module_id`. Do not build new UI around legacy `batch_modules`.
```

---

# STEP 1 — DB migration: term group / batch tables

```
Create a new SQL migration that adds long-course support. Do not modify existing
tables except to add ONE column to `courses`.

1. Add column to existing `courses` table:
   - course_type text not null default 'short'   (values: 'short' or 'long')

2. Create five new tables exactly as below:

   term_groups (
     id uuid primary key default gen_random_uuid(),
     course_id uuid references courses(id),
     name text not null,
     start_date date,
     status text not null default 'active',
     created_at timestamptz default now()
   )

   batches (
     id uuid primary key default gen_random_uuid(),
     term_group_id uuid references term_groups(id) on delete cascade,
     name text not null,
     schedule_note text,
     seats int,
     status text not null default 'active',
     created_at timestamptz default now()
   )

   batch_modules (
     id uuid primary key default gen_random_uuid(),
     batch_id uuid references batches(id) on delete cascade,
     module_number int not null,
     title text not null,
     created_at timestamptz default now()
   )

   batch_sessions (
     id uuid primary key default gen_random_uuid(),
     module_id uuid references batch_modules(id) on delete cascade,
     title text not null,
     scheduled_at timestamptz,
     zoom_link text,
     recording_url text,
     status text not null default 'upcoming',
     created_at timestamptz default now()
   )

   batch_enrollments (
     id uuid primary key default gen_random_uuid(),
     batch_id uuid references batches(id) on delete cascade,
     student_id uuid references profiles(id) on delete cascade,
     enrolled_at timestamptz default now(),
     unique (batch_id, student_id)
   )

3. Enable Row Level Security on all five new tables. Policies:
   - term_groups, batches, batch_modules, batch_sessions: any authenticated user can
     SELECT; only profiles.role = 'admin' can INSERT/UPDATE/DELETE.
   - batch_enrollments: a student can SELECT their own rows; admin can do everything.

4. Save the migration file in docs/schema/migrations/ with the next number in sequence.
   Also update docs/schema/current-schema.sql to include these tables.

Give me the SQL to run in the Supabase SQL editor. Do not run it yourself.
After I confirm it ran, update docs/claude.md noting the five new tables now exist.
```

**After this step:** run the SQL in the Supabase dashboard yourself, confirm no errors, then tell CC it succeeded.

---

# STEP 2 — DB migration: CRM columns on profiles

```
Add CRM columns to the existing `profiles` table. Do not drop or rename anything.

Add these columns (all nullable):
  - age_group text
  - artist_background text
  - why_shilpa_shastra text
  - portfolio_url text
  - admission_status text default 'prospect'   (prospect / enrolled / discontinued)
  - fee_status text default 'pending'          (pending / paid)
  - currency text                              (USD / INR)
  - payment_notes text

first_name, last_name, phone, country already exist — do not re-add them.

Save the migration in docs/schema/migrations/ with the next number, and update
docs/schema/current-schema.sql.

Give me the SQL to run in the Supabase SQL editor. Do not run it yourself.
After I confirm, update docs/claude.md.
```

**After this step:** run the SQL, confirm, tell CC.

---

# STEP 3 — Purge test junk + seed clean demo data

> This runs BEFORE the UI is built so every later screen is developed and tested
> against believable data. The purge is approval-gated — CC must list before deleting.

```
Two jobs: clean the database of test junk, then seed clean, believable demo data for
BOTH tracks (short courses and one long course). Do nothing destructive without
showing me the list first.

PART A — purge test junk:
1. Query and show me ALL current courses with their names, course_type, and status.
   Identify obvious test junk (names like "Wassupppp", "wassupp", "Vishnu",
   "Ganesha", and anything similar). KEEP genuine courses such as
   "Drawing Divine Forms — Srinivasa" and "Talamana". KEEP my admin login profile.
2. Show me the proposed delete list and WAIT for my approval before deleting anything.
3. After I approve, delete only the approved junk rows.

PART B — seed short courses:
- Ensure 3–4 believable short courses exist with course_type = 'short', authentic
  Shilpa Shastra titles, thumbnails if easy, status 'published'. Each with a few
  sessions that have working video URLs. If genuine short courses already exist and
  look fine, keep them and only top up to a believable count.

PART C — seed ONE long course as a full term group with two batches:
1. Ensure one course exists with course_type = 'long', e.g.
   "Drawing Divine Forms — The Two-Year Path". Create it if missing.
2. Create one term_group: name "October 2024", a start_date, status 'active',
   linked to that long course.
3. Inside it create TWO batches:
     - "Batch A" — schedule_note "Fridays 7:00 AM IST", seats 20, status 'active'
     - "Batch B" — schedule_note "Sundays 6:00 PM IST", seats 20, status 'active'
4. For EACH batch, create ~6 modules with authentic Shilpa Shastra curriculum titles
   (Foundations of Sacred Geometry, Talamana Proportions, Iconography of Vishnu Forms,
   etc.). Modules are per-batch — create separate rows for each batch.
5. For EACH batch, create live sessions across the modules. DO NOT hardcode the count
   — make Batch A and Batch B have DIFFERENT session counts on purpose (e.g. Batch A
   ~7 sessions, Batch B ~6) to prove the system handles variable counts. For each batch:
     - 2–3 PAST sessions with a working YouTube art/drawing video as recording_url,
       status 'recorded'.
     - 1 session dated TODAY with a zoom_link, status 'live' — so the "Live Today"
       banner appears in the demo. (Tell me the date you used so I can bump it if the
       demo slips.)
     - the rest FUTURE, status 'upcoming', with zoom_links.
6. Create 6–8 demo student profiles with realistic names and FULL onboarding fields
   filled (age_group, artist_background, why_shilpa_shastra, portfolio_url). Vary
   admission_status and fee_status so the CRM looks alive. Enroll them across the two
   batches via batch_enrollments — some in Batch A, some in Batch B.
7. The primary demo student account (the one I will log in as) must be enrolled in
   ONE batch AND have at least one short-course enrollment, so My Learning shows
   content in both pills.

Update docs/claude.md with what was purged and what was seeded.
```

**After this step:** verify in the app/DB that the data looks believable before building screens on top of it.

---

# STEP 4 — Admin: Term Group + Batch creation & list

```
Build the admin long-course management area. This is where Drdha runs intakes.

Add a new admin nav item "Term Groups" (use an existing lucide icon — Layers or Calendar).

The Term Groups page has:
1. A list of all term groups as cards. Each card shows: name, linked long-course name,
   start_date, status, and a count of batches inside it. Clicking a card opens the
   Term Group detail page.
2. A "Create Term Group" button → form with:
   - Term group name (text, e.g. "October 2024")
   - Course (dropdown — only courses where course_type = 'long')
   - Start date (date picker)
   Status defaults to 'active'. Insert into term_groups.

Term Group detail page:
- Header: term group name, course, start_date, status.
- A list of its batches as cards. Each batch card shows: name, schedule_note, seats,
  status, enrolled student count. Clicking a batch card opens the Batch detail page
  (built in STEP 5).
- A "Create Batch" button → form with:
   - Batch name (text, e.g. "Batch A")
   - Schedule note (text, e.g. "Fridays 7:00 AM IST")
   - Seats (number)
  Status defaults to 'active'. Insert into batches with this term_group_id.

If there are no long-type courses, show a warm empty state telling the admin to first
create a course and mark it as a long course.

ALSO: in the existing admin Course editor, add a control to set course_type
('short' or 'long') — a simple toggle or dropdown, default 'short', persisted to
courses.course_type.

Use existing Supabase client, existing Tailwind tokens, Poppins. Follow STEP 0 rules.
Update docs/claude.md when done.
```

---

# STEP 5 — Admin: Module + session scheduling inside a batch

```
Build the Batch Detail page (opened by clicking a batch card from STEP 4).

The page shows the batch header (name, its term group, schedule_note, seats, status)
and TWO sections: Modules and Students. Build the Modules section in this step.

Modules section:
- Lists this batch's modules ordered by module_number. For each module show its
  title and module_number, and the live sessions inside it.
- "Add Module" button → form with module_number and title. Insert into batch_modules
  with this batch_id.
- Inside each module, list its batch_sessions ordered by scheduled_at. Each session
  row shows: title, scheduled_at (formatted), status badge, and whether a zoom_link
  and recording_url are set.
- "Add Session" button on each module → form with:
    - title
    - scheduled_at (date + time picker)
    - zoom_link (text, optional)
  status defaults to 'upcoming'. Insert into batch_sessions.
- Each session row has an "Edit" action to update title, scheduled_at, zoom_link,
  and status (upcoming / live / recorded).

CORRECTION: implement the above against the corrected schema. Use `term_modules`
as the shared module list for the term group. Insert new modules into `term_modules`
with `term_group_id`. Insert sessions into `batch_sessions` with both this batch's
`batch_id` and the selected `term_module_id`. Do not build new UI around legacy
`batch_modules`.

The number of sessions per module is fully dynamic — admin adds as many as needed.
Never assume or display a fixed expected count. Do not build recording-URL entry
here — that's STEP 6. No drag-and-drop; ordering is by module_number and scheduled_at.

Use existing Supabase client, Tailwind tokens, Poppins. Follow STEP 0 rules.
Update docs/claude.md when done.
```

---

# STEP 6 — Admin: enroll students + mark session recorded

```
Two additions to the Batch Detail page from STEP 5.

A) Students section on the Batch Detail page:
   - Lists students enrolled in this batch (join batch_enrollments → profiles),
     showing name, email, phone.
   - "Enroll Student" button opens a picker: search/select from existing profiles
     where role is not 'admin'. On select, insert into batch_enrollments (respect the
     unique constraint — handle the duplicate case gracefully). Note: a student should
     be in only one batch — if they're already in another batch, warn before enrolling.
   - Each enrolled student row has a "Remove" action that deletes the batch_enrollment
     row (allowed — it's an enrollment record, not content; show a small confirm).

B) Recording URL on sessions:
   - In the session Edit form (from STEP 5), add a recording_url text field. When an
     admin pastes a Bunny.net or YouTube URL and saves, store it in
     batch_sessions.recording_url and, if status was 'upcoming' or 'live', suggest
     setting status to 'recorded'.
   - A session with a recording_url is what students watch later.

Use existing Supabase client, Tailwind tokens, Poppins. Follow STEP 0 rules.
Update docs/claude.md when done.
```

---

# STEP 7 — Admin: Student CRM view

```
Build the Student CRM. This replaces Drdha's Google Form → Notion workflow.

There is an existing admin "Students" page that groups enrollments by student.
Either extend it or add a new "Student CRM" admin page — your call, but keep it
consistent with existing admin pages.

The CRM is a table of all profiles where role is not 'admin'. Columns:
  - Name (first + last)
  - Email
  - Phone
  - Location / country
  - Age group
  - Admission status (badge: prospect / enrolled / discontinued)
  - Fee status (badge: pending / paid)
  - Batch they are enrolled in (from batch_enrollments → batches → term_groups,
    show as "Batch A — October 2024")

Clicking a row opens a detail panel/drawer showing ALL fields, including the
student-filled ones (artist_background, why_shilpa_shastra, portfolio_url) and the
admin-editable ones. Admin can edit, in the detail panel:
  - admission_status
  - fee_status
  - currency
  - payment_notes
and save back to the profiles row.

Add a simple text search (name/email) and a filter by admission_status.
The student-filled identity fields are READ-ONLY in the CRM (they came from onboarding).

Use existing Supabase client, Tailwind tokens, Poppins. Follow STEP 0 rules.
Update docs/claude.md when done.
```

---

# STEP 8 — Student: onboarding form

```
Build the student onboarding form. This is the new-user flow that replaces the
Google Form. Auth (Supabase email OTP signup) already exists and already captures
first name, last name, country, phone into profiles.

We are EXTENDING the signup flow: after a new user verifies their email and their
profile row is created, route them to a one-page "Complete your profile" onboarding
screen BEFORE they land on My Learning. Existing users who already have a complete
profile skip this.

The onboarding screen collects (and upserts into profiles):
  - Age group (dropdown: Under 19 / 19–30 / Above 30)
  - Artist background & experience (multiline text)
  - Why Shilpa Shastra? (multiline text)
  - Portfolio link (text, optional, can be left blank)

Phone and country are already collected — if they are empty on the profile, include
them here too; otherwise don't repeat them. Keep the form short and warm — this is a
devotional art school, not a tax form. One screen, friendly copy, single "Finish"
button. On finish, route to My Learning.

Decision for the demo: a brand-new user has admission_status 'prospect' and is NOT
auto-enrolled into any batch or course. That's correct — placing a student into a
batch is an admin action (STEP 6). Pitch story: signup fills the CRM, admin then
places them into a batch.

Use existing Supabase client, Tailwind tokens, Poppins. Follow STEP 0 rules.
Update docs/claude.md when done.
```

---

# STEP 9 — Student: My Learning with two pills

```
Rework the student My Learning page to handle both short and long courses.

Layout, top to bottom:

1. Two pill tabs at the very top: "My Program" and "My Courses".
   - "My Program" = long course (the student's batch enrollment).
   - "My Courses" = short courses (existing enrollments table).
   Pills must be visually distinct and obviously tappable. Default to "My Program"
   if the student has a batch enrollment, otherwise "My Courses".

2. A "Continue Learning" section directly below the pills. This is CROSS-track and
   ignores which pill is selected. It shows at most two cards:
   - the student's current/active long-course item (their batch — next upcoming or
     most recent session), tagged "Long Course".
   - the student's current/active short-course item (resume point), tagged
     "Short Course".
   If a track has nothing active, that card simply doesn't appear. If both are empty,
   show a warm empty state with a "Browse Courses" CTA.

3. Below that, the selected pill's full content:
   - My Program tab → the student's batch shown as a card linking to the Batch
     Dashboard (STEP 10). (A student is in one batch; if somehow none, warm empty state.)
   - My Courses tab → the existing short-course list, unchanged in behavior.

Reuse existing short-course My Learning logic for the My Courses tab — do not rewrite
working code. Long-course data: batch_enrollments → batches → term_groups, and
term_modules + batch_sessions filtered by the student's batch_id.

Use existing Supabase client, Tailwind tokens, Poppins. Follow STEP 0 rules.
Update docs/claude.md when done.
```

---

# STEP 10 — Student: Batch dashboard

```
Build the student-facing Batch Dashboard, opened from the batch card in My Program.

The page shows, for the batch the student is enrolled in:

1. Header: batch name and schedule_note, the term group name, the course name,
   start date, status. (e.g. "Batch A — Fridays 7 AM · October 2024 intake")

2. A "Live Today" banner — IF any batch_session in this batch has scheduled_at on
   today's date. The banner shows the session title, time, and a "Join Live" button
   that opens the session's zoom_link in a new tab. If no session is today, no banner.

3. Modules list (term_modules ordered by module_number). Under each shared module,
   show this student's batch_sessions ordered by scheduled_at. Each session row shows:
   - title and scheduled date/time
   - a status indicator: upcoming / live / recorded
   - if status is 'live', or a zoom_link exists and the session is today → "Join Live"
   - if recording_url is set → "Watch Recording" → goes to playback (STEP 11)
   - if upcoming with no recording → just show the scheduled time, no button

All sessions are visible — no lock logic for the demo. The module and session counts
are whatever exists in the data — never assume a fixed number. A student should
instantly see what's next and what they can re-watch.

Use existing Supabase client, Tailwind tokens, Poppins. Follow STEP 0 rules.
Update docs/claude.md when done.
```

---

# STEP 11 — Student: recorded session playback

```
Build recorded-session playback for batch sessions.

When a student clicks "Watch Recording" on a batch_session (from STEP 10), open a
player view that plays batch_sessions.recording_url.

Reuse the EXISTING lesson player component if practical — it already handles
YouTube / Vimeo / direct video URLs. The only difference is the data source: here
it's a batch_session, not a short-course session. Pass the recording_url and the
session title into the player.

Do NOT add: completion tracking, progress bars, locking, the tldraw canvas, or a
discussion tab for batch recordings. Keep it a clean video view with the session
title and a back button to the Batch Dashboard.

If recording_url is empty, this view should not be reachable — guard against it.

Use existing Supabase client, Tailwind tokens, Poppins. Follow STEP 0 rules.
Update docs/claude.md when done.
```

---

# STEP 12 — Pre-demo smoke test

```
Final pre-demo pass. No new features.

1. Confirm Supabase Realtime is enabled (submissions + notifications) — claude.md
   notes it may need a manual toggle in the dashboard.

2. Run `npm run build` — confirm it passes (the tldraw chunk-size warning is expected
   and fine).

3. Confirm the seeded "Live Today" session is dated for the actual demo day. If the
   demo date has moved, tell me which row to update and the SQL to do it.

4. Walk through and report the status of this full demo script:
   a. New user signs up → onboarding form → lands on My Learning.
   b. My Learning shows two pills; Continue Learning shows both a long and short item.
   c. Open the batch → modules and sessions visible → "Live Today" banner shows.
   d. "Watch Recording" on a past session → video plays.
   e. Admin logs in → Term Groups → open term group → see two batches.
   f. Open a batch → modules, sessions, students all show. Batch A and Batch B have
      different session counts (proves variable counts work).
   g. Admin opens Student CRM → sees a new signup → can edit fee/admission status.
   h. Admin edits a session → pastes a recording URL → student side shows it.

   For each step report PASS or FAIL with the reason. Fix any FAILs.

Update docs/claude.md with the final demo-ready state.
```

---

# THE PITCH DECK (separate deliverable)

Build this as a single self-contained **HTML file** — opens in any browser, no PowerPoint. Build it whenever; it doesn't depend on the code being finished. When you're ready, start a fresh chat and say "build the deck" — I'll need ~20 minutes and these inputs:

- Confirm the demo got through STEP 12 (so the deck claims match reality)
- Any specific number Drdha cares about (student count — Notion shows ~97 — pricing, timeline)
- Whether Drdha sees the deck before or after the live demo

**Deck outline (7 slides):**

1. **Where you are today** — old LMS does short courses only; long courses run on Zoom and are tracked by hand in a Google Form + Notion. Pain: no recordings for students who miss class, no batch management, manual data entry.
2. **The two-track platform** — Short Courses (already live) + Long Courses (new). One LMS, one student login.
3. **How a long course is structured** — Course → Term Group → Batches → Modules → Live Sessions → Recordings. The 2-year path, visualized. Make the point that batches are different timings of the same intake.
4. **The live session flow** — Zoom → Bunny.net → LMS. Honest about what's automated now vs. v1.
5. **Onboarding replaces the Google Form** — signup writes straight into the Student CRM. Show the field flow.
6. **What Drdha can do** — create intakes, run batches, schedule sessions, attach recordings, see every student in the CRM.
7. **Roadmap** — what's demo-ready today (this list) vs. what production v1 adds (real Zoom/Bunny automation, payments, migrating the ~97 existing students, hardening). End with the ask.

---

## Quick reference — copy order

```
Session start  → STEP 0
Then           → STEP 1 → run SQL → STEP 2 → run SQL
Then           → STEP 3   (purge + seed — verify the data looks good)
Then           → STEP 4 → 5 → 6 → 7    (admin side)
Then           → STEP 8 → 9 → 10 → 11  (student side)
Then           → STEP 12
Deck           → fresh chat, anytime
```

If a step fails or behaves oddly, fix it before moving on. Do not stack steps.
