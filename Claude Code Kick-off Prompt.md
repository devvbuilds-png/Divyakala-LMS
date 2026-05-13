# Claude Code Kick-off Prompt

Use this prompt when handing the current Divyakala LMS user-side prototype to Claude Code.

Before starting, read:

1. `LMS user side.md`
2. `Design System.md`
3. `Wireframes.md`

`LMS user side.md` is the most important context file because it records what has already been built and the decisions made during iteration.

---PROMPT START---

You are working on the user-side Divyakala LMS prototype for Drdha Vrata Gorrick. This is a sales/demo artifact, not a production LMS. The goal is a polished, compact, warm learning interface that demonstrates how Drdha's art courses, lessons, assignments, feedback, resources, journal, workshops, and certificate could work.

## Current Project

The current Codex prototype exists at:

```text
Codex prototype/divyakala-lms
```

It is a React + Vite + Tailwind app with React Router, Lucide icons, and `@tldraw/tldraw`.

Run:

```powershell
npm install
npm run dev
npm run lint
npm run build
```

The build currently passes. A Vite chunk-size warning is expected because `tldraw` is bundled.

## Source of Truth

Read these files before changing UI:

1. `LMS user side.md`
2. `Design System.md`
3. `Wireframes.md`

The original design direction changed during iteration. Do not use the old serif-heavy Cormorant/Crimson direction. The current product uses Poppins everywhere and is intentionally more compact, closer to the provided LMS screenshot.

## Current Design Rules

- Use Poppins everywhere.
- Keep the interface compact, calm, and elegant.
- Avoid huge headings and oversized cards.
- Use cream/warm-white surfaces, warm borders, ochre active states, and brown text/chrome.
- Do not use stock photos.
- Use local Drdha artwork from `public/art`.
- If video is missing, show explicit placeholders: `Insert a video file here` and the intended `/public/videos/...mp4` path.

## Existing Routes

- `/`
- `/auth/sign-in`
- `/auth/sign-up`
- `/learning`
- `/browse`
- `/workshops`
- `/courses/:courseId`
- `/courses/:courseId/lesson/:sessionId`
- `/journal`
- `/courses/:courseId/certificate`

Mock auth uses `localStorage` key:

```text
divyakala-auth
```

## Lesson Player Decisions

The lesson player has been redesigned and should not be reverted.

Current layout:

- One rounded top learning bar.
- Course sessions sidebar below the top bar.
- Main tabs: Overview, Assignment, Resources.
- No Discussion tab.
- Overview: video + same-height companion panel + lesson overview.
- Companion tabs: Notes, Reference, Canvas.
- Canvas uses `Tldraw`.
- Assignment: centered assignment panel only, no sidebar.
- Resources: centered resources panel only, no sidebar.
- Sessions are clickable.
- Locked sessions show a locked screen.
- Assignment, resources, notes, and feedback are session-specific via `getLessonContent(...)`.

## Important Behaviors

- Every route change should scroll to top.
- My Learning Continue opens lesson player.
- Browse Courses opens course detail.
- Locked sessions are clickable and explain why they are locked.
- Course-session sidebar should open/close smoothly.
- Do not add extra lesson-player bars or duplicate course sections.

## Assets

Existing:

```text
public/logo.webp
public/art/*.webp
```

Missing:

```text
public/videos/*.mp4
```

Keep placeholders until real video files are provided.

## Code Notes

Most implementation is currently in `src/App.jsx`. This is okay for prototype speed. If refactoring, do it carefully and preserve behavior.

Mock JSON files exist in `src/data`, but some active mock data is still inline in `App.jsx`.

## Definition of Done For Future Changes

- Preserve compact Poppins design.
- Preserve all routes.
- Preserve session-specific lesson tabs.
- Run `npm run lint`.
- Run `npm run build`.
- Do not introduce stale serif typography or oversized UI.

---PROMPT END---

## Manual QA Checklist

1. Sign in.
2. Go to My Learning.
3. Continue into lesson player.
4. Switch Session 1, 2, 3.
5. Confirm Overview, Assignment, Resources change per session.
6. Click locked Sessions 4-6 and confirm locked screen.
7. Open Notes, Reference, Canvas in Overview.
8. Open reviewed feedback modal.
9. Check Browse, Course Detail, Workshops, Journal, Certificate.
10. Run lint/build.

