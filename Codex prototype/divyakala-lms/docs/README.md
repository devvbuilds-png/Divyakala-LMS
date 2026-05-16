# Divyakala LMS — Documentation

This `/docs` folder is the **single source of truth** for the Divyakala LMS project. It is read and maintained by multiple AI coding agents (Claude Code, Codex) and by Dev.

The purpose: as the system grows complex, these docs let anyone — human or AI — understand the current state, trace past decisions, and find where something went wrong when a bug appears.

---

## Start Here

If you are a new session (AI or human), read in this order:
1. `handoff/HANDOFF.md` — full project context. The "start here" file.
2. `claude.md` — living log of all locked decisions, high-signal.
3. Whatever subfolder is relevant to your current task.

---

## Folder Structure

```
docs/
  README.md              <- this file
  claude.md              <- living decisions log; update after every session
  handoff/
    HANDOFF.md           <- master onboarding doc; full project context
  decisions/             <- one file per major architectural decision (ADR style)
    000-template.md      <- copy this to create a new decision record
  flows/                 <- user-facing and admin-facing flows
    student-flow.md
    admin-flow.md
  schema/
    current-schema.sql   <- the current full DB schema, always kept in sync
    migrations/          <- every schema change, numbered sequentially
  runbook/               <- operational docs (populated post-launch)
    backups.md
    incidents.md
```

---

## Rules for Maintaining These Docs

**Every AI session must:**
1. Read `HANDOFF.md` and `claude.md` before starting work.
2. Update `claude.md` before ending the session — add new decisions, mark items done, note new deferrals.
3. If a major architectural decision was made, create a new file in `decisions/` using `000-template.md`.
4. If the database schema changed, add a numbered migration to `schema/migrations/` AND update `schema/current-schema.sql`.
5. If a user or admin flow changed, update the relevant file in `flows/`.

**Decision records (`decisions/`):**
- One decision per file, numbered: `001-supabase-postgres.md`, `002-bunny-video.md`, etc.
- Use the template. Keep it short: context, decision, why, alternatives rejected.
- Never delete a decision record. If a decision is reversed, write a new record that supersedes it and link back.

**Schema (`schema/`):**
- `current-schema.sql` is always the complete, current truth.
- `migrations/` is the history — every change, numbered, never deleted.
- A new session should be able to recreate the database from `current-schema.sql` alone.

**claude.md vs HANDOFF.md:**
- `HANDOFF.md` = stable onboarding context. Changes rarely. The big picture.
- `claude.md` = fast-moving decisions log. Changes every session. The running record.

---

## Why This Matters

This project will grow into a real platform with thousands of users, payments, video infrastructure, and an existing userbase migrated in. When something breaks in a system that large, the difference between a 10-minute fix and a 2-day nightmare is whether the decisions and changes were written down.

Treat these docs as part of the build, not paperwork.
