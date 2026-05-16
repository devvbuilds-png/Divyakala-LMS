# Divyakala LMS — Project Handoff

> **Purpose of this file:** Single onboarding document for any new chat session (Claude, Claude Code, or Codex). Read this first to understand the entire project state. This is the "start here" file.
>
> **Last updated:** May 2026
> **Status:** Transitioning from demo -> real production project.

---

## 1. What This Project Is

A Learning Management System (LMS) for **Drdha Vrata Gorrick**, a traditionally trained Shilpa Shastra artist based in Manipal, Karnataka. He teaches traditional Indian devotional art (sacred iconography, deity drawing, Talamana proportion systems).

**Builder:** Dev Saxena — freelance developer, Manipal.
**Commercial context:** Started as a 15-20K demo engagement. Now becoming a real, paid production build. Scope and pricing for the production phase to be negotiated after the Sunday meeting.

**The opportunity:** Drdha currently runs his teaching operation across Squarespace (marketing site), a weak existing LMS ("Zupaloop" — barely used), Zoom (live classes), and Notion (student tracking). He wants all of this consolidated into one real platform. ~100 existing students from past cohorts. Growing.

---

## 2. Current State

### What exists
- A React + Vite + Tailwind prototype (`divyakala-lms`), built across Codex and Claude Code sessions.
- Two sides: student-facing and admin-facing. Full UI built for both.
- Supabase integration started: real auth (email OTP for students, email/password for admin), real database, real file storage for assignment submissions.
- Deployed/deployable to Vercel.
- A working demo was shown to Drdha on Sunday (the previous Sunday). It went well enough that he requested structural feature upgrades and a follow-up meeting.

### What works
- Student auth (Supabase email OTP)
- Admin auth (Supabase email/password, fixed credential)
- Course publishing (admin creates course -> student sees in Browse)
- Sessions with video URL (admin pastes YouTube/Vimeo/direct URL per session)
- Assignment submission (student uploads -> Supabase storage -> admin queue)
- Admin review + text feedback -> student sees it
- Workshop publishing
- Demo seed/reset buttons in admin settings

### What's mocked / not real yet
- Card library (AdminCards) — visual only
- Voice note feedback, annotation drawing — UI mocked
- Notifications, Practice Journal, lesson unlocking — mock data
- Payment — not built
- Real user onboarding / CRM — not built
- User migration from existing system — not done

### Known structural weaknesses (the reason for the foundation rebuild)
- Auth flow is basic and considered "broken" for real use on both sides.
- No proper user data model / CRM — student records are thin.
- `App.jsx` is one large monolithic file (deferred refactor).
- No real course model for live/cohort-based teaching (the big gap — see Section 4).
- No payment, no monitoring, no backups.

---

## 3. The Stack — Locked Decisions

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React 18 + Vite | Existing |
| Styling | Tailwind CSS, Poppins font, 13px root, compact density | Existing, locked |
| Routing | React Router | Existing |
| Database | Supabase (Postgres) | Scales fine to tens of thousands of users |
| Auth | Supabase Auth | Email OTP (student), email/password (admin) |
| File storage (images, PDFs, submissions) | Supabase Storage | 500MB free tier, $25/mo Pro when needed |
| Video hosting | **Bunny.net (Bunny Stream)** | NOT Supabase — video does not belong in Supabase storage |
| Hosting/deploy | Vercel | Serves the React app only; backend is Supabase |
| Domain | divyakala domain (post-launch) | DNS points at Vercel — 30-min task, not a foundation concern |
| Payment | Razorpay (INR) + Stripe (foreign students) | Post-Sunday, not in demo |
| Error monitoring | Sentry (free tier) | To be added in foundation phase |
| Icons | lucide-react | Existing |
| Drawing canvas | @tldraw/tldraw | Lesson player practice canvas |

**Why this stack (the reasoning, so it isn't re-litigated):**
- Vercel never runs the backend. It serves static React. Supabase is the backend. Bunny serves video. Three services, each doing its job. This is a standard, proven SaaS architecture and handles thousands of users without issue.
- Supabase Postgres is not a bottleneck at this scale. The only thing Supabase is wrong for is video — hence Bunny.
- AWS/S3 raw was considered and rejected: cheaper per GB but expensive in engineering time (hand-building auth, signed URLs, transcoding, streaming). Not worth it for a solo builder at this scale.
- Estimated infra cost at scale (1000+ students): ~$35-60/month total. Drdha has agreed to cover subscription costs.

---

## 4. The Big Structural Change — Long Courses

This is the headline feature driving the foundation rebuild.

**What a "long course" is:**
- A multi-month (potentially ~2-year) cohort-based course taught via **live classes**.
- Runs **batch-wise** — a course has multiple batches (cohorts) over time.
- Each batch can have a **different number of sessions** (one batch might run 7 sessions, another 8 — same course).
- Live classes happen on a video platform (TBD — Zoom or alternative).
- After each live class, the **recording is stored in the LMS** so that batch's students can re-watch.
- Students belong to a batch. They see their batch's sessions and recordings.

**Correction locked May 16:** modules are shared syllabus chapters for a term group, not per-batch curriculum copies. Each batch has its own live sessions mapped to those shared modules. The session count and pacing can differ by batch because each group learns at a different pace.

**This is fundamentally different from the recorded courses already built.** Recorded courses = fixed content, self-paced. Long courses = live, cohort-based, batch-managed, recordings accumulate over time.

**Correct hierarchy:** Course -> Term Group -> shared Term Modules (syllabus chapters), plus Term Group -> Batches -> Batch Sessions -> Recordings. A batch session belongs to one batch and maps to one shared module.

**Implication:** the data model needs proper Term Group, Batch, shared Module, and Batch Session entities, and the course model must support two course types (recorded / long). This is the core of the foundation work.

---

## 5. The Student CRM

Drdha currently tracks ~100 students in a **Notion template**. The current admin "Students" tab is too thin. It needs to become a proper CRM — a spreadsheet-like view with rich per-student fields.

**Action item:** Dev to share the Notion template (screenshots or export). The CRM schema will be derived directly from how Drdha already structures student data, so migration is clean.

**Status:** Notion template not yet shared with the AI assistant. This is a blocker for the CRM build and the user migration plan.

---

## 6. Existing Users / Migration

- Drdha has **~100 existing students** from past cohorts (possibly more).
- They are NOT users in the current LMS — they're records in a Notion template.
- "Migration" means: importing those student records into the new CRM/database, and giving those students a way to access the new platform.
- Migration plan to be designed once the Notion template is reviewed.

---

## 7. Two-Track Plan

Because a full production-quality foundation cannot be built in the 2 days before the Sunday meeting, work splits into two tracks:

### Track A — Sunday Demo (pre-meeting)
- Goal: show Drdha a credible, sellable vision. Not feature-complete — architecturally convincing.
- Add the structural showpiece (long courses + batches) to the **current foundation** without a full refactor.
- Treat as a "structural prototype."
- Specific Sunday feature scope is defined by Dev in the dedicated build session (see Section 8).
- Do NOT touch auth refactor, user migration, or payment for Sunday.

### Track B — Real Foundation (post-Sunday, if Drdha commits)
The proper production build, executed over weeks once there's a paid contract:
- Auth refactor — proper roles, onboarding flow, both sides solid
- Proper user data model + CRM
- User migration from Notion
- Long course / batch model built properly into the schema
- Payment integration (Razorpay + Stripe)
- Video pipeline on Bunny.net
- Backups, error monitoring (Sentry), maintenance runbook
- `App.jsx` modularization
- Domain move to divyakala domain
- Foundation checklist to be produced at the start of Track B.

---

## 8. How We Work — Context & Documentation

This project uses a `/docs` folder in the repo as the single source of truth. Both Claude Code and Codex read and update it. See `docs/README.md` for the full structure and rules.

**The golden rule:** every significant decision, schema change, and flow gets written down in `/docs`. When a bug appears later in a complex system, these docs are how we backtrack and find where it went wrong.

**Key files:**
- `docs/handoff/HANDOFF.md` — this file. Start here.
- `docs/claude.md` — living decisions log, high-signal. Agents update after every session.
- `docs/decisions/` — one file per major architectural decision (ADR style).
- `docs/flows/` — student and admin flows.
- `docs/schema/` — current DB schema + numbered migrations.
- `docs/runbook/` — operational docs (post-launch).

**Working sessions:**
- This project is built across multiple AI sessions (Claude Code, Codex, Claude chat).
- Each session: read `HANDOFF.md` + `claude.md` first, do the work, update `claude.md` and relevant `/docs` files before ending.
- The actual building happens in dedicated Claude Code sessions. Planning/architecture happens in Claude chat.

---

## 9. Open Questions / Blockers

| # | Question | Needed for | Status |
|---|---|---|---|
| 1 | Notion student template — structure & fields | CRM schema, migration plan | Not yet shared |
| 2 | Exact student experience of a long course | Batch data model | Partially known (Section 4) |
| 3 | Live class platform — Zoom or alternative | Long course implementation | Not decided |
| 4 | Sunday demo feature scope | Track A build | Dev to define in build session |
| 5 | How recordings get from Zoom -> Bunny -> LMS | Video pipeline | Not designed |
| 6 | Production contract value & timeline | Commercial | Post-Sunday |
| 7 | Exact count of existing students (100+?) | Migration sizing | Approximate only |

---

## 10. Quick Facts Reference

- **Client:** Drdha Vrata Gorrick, Shilpa Shastra artist, Manipal
- **Builder:** Dev Saxena, Manipal
- **Repo:** `divyakala-lms` (React + Vite). Local path historically `D:\AI projects\Divyakala\Codex prototype\divyakala-lms`
- **Existing flagship course:** "Drawing Divine Forms — Srinivasa" — 6 recorded sessions, 10,600 INR
- **Marketing site:** divyakala.com (Squarespace)
- **Existing weak LMS:** referred to as "Zupaloop"
- **Existing students:** ~100, tracked in Notion
- **Infra target cost:** ~$35-60/month
- **Brand:** cream (#F5ECD2), ochre (#C9952A), warm brown chrome (#2A1F18), Poppins font, compact density
- **Next milestone:** Drdha meeting, Sunday May 17 2026
