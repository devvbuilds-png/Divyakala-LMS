# ADR-003: Shared Term Modules for Long Courses

**Status:** Accepted
**Date:** 2026-05-16
**Decided by:** Dev + Codex session

---

## Context

The Sunday demo initially seeded modules per batch because the first prompt described `Batch -> Module -> Session`. Dev clarified the real teaching model: Drdha teaches the same syllabus to each batch, but each batch moves through that syllabus at a different pace and may need a different number of live classes.

## Decision

Long-course modules are shared syllabus chapters at the term-group level. Batch sessions are the per-batch live classes and each session maps to one shared module.

The corrected model is:

```
Course -> Term Group -> Term Modules
                    -> Batches -> Batch Sessions -> Recordings
```

Implementation:

- Add `term_modules` with `term_group_id`, `module_number`, and `title`.
- Add `batch_sessions.batch_id`.
- Add `batch_sessions.term_module_id`.
- Keep `batch_modules` as legacy scaffold for now because it already exists from the first migration and seed; new UI should not be built around it.

## Why

This mirrors Drdha's actual operation. Batch A and Batch B are not separate syllabi; they are different student groups moving through the same syllabus. Only live-session pacing and recordings differ.

## Alternatives Rejected

- **Modules per batch** - duplicates the syllabus, makes updates harder, and incorrectly suggests each batch has a different curriculum.
- **Sessions directly under batch only** - loses the syllabus chapter organization students and admin need for navigation.

## Consequences

Admin screens should create and list shared modules at the term-group level, then schedule batch sessions against those modules. Student screens should show shared modules and the current student's batch sessions under each module.

Legacy `batch_modules` rows may remain until a later cleanup migration. Avoid relying on them for new features.

## Related

- `docs/schema/migrations/007-shared-term-modules.sql`
- `docs/schema/current-schema.sql`
- `docs/claude.md`
