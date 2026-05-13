# Divyakala LMS - Current Wireframes

This file reflects the current user-side LMS prototype after iteration. It supersedes the original serif/editorial wireframes where they conflict.

## App Shell

Authenticated screens use a compact left app sidebar and top bar.

Sidebar:

- Width: about `216px`.
- Collapsed width: about `64px`.
- Dark warm brown background.
- Logo at top.
- Navigation:
  - My Learning
  - Browse Courses
  - Live Workshops
- User block at bottom.
- Active state uses ochre.

Top bar:

- Compact height.
- Page title on left.
- Notifications and avatar on right.

Content:

- Max width around `980px`.
- Route changes scroll to top.

## Screen 1 - Auth

Routes:

- `/auth/sign-in`
- `/auth/sign-up`

Layout:

- Artwork panel on one side.
- Form panel on the other.
- Poppins typography.
- Mock OTP flow.
- Any valid-looking interaction can authenticate.
- Auth sets `localStorage` key `divyakala-auth` to `true`.

## Screen 2 - My Learning

Route:

- `/learning`

Content:

- Continue your practice hero card.
- Resume/Continue opens the lesson player, not the course detail page.
- View course opens course detail.
- Upcoming workshop banner.
- Enrolled course cards.
- Practice journal preview strip.

Important behavior:

- Course detail should mainly be reached from Browse Courses.
- My Learning is for continuing learning.

## Screen 3 - Browse Courses

Route:

- `/browse`

Content:

- Compact filter row.
- Search input.
- Course grid.
- Available courses open course detail.
- Coming-soon courses show Notify me.

Course card:

- Artwork thumbnail.
- Title.
- Instructor.
- Session/duration metadata.
- Price or Notify me.
- Compact button.

## Screen 4 - Live Workshops

Route:

- `/workshops`

Content:

- Next-up workshop hero.
- Upcoming workshops list.
- Past workshop replay cards.
- Replay cards use video placeholders where video files are needed.

## Screen 5 - Course Detail

Route:

- `/courses/:courseId`

Content:

- Course hero with title, badges, price, CTA.
- Trailer/Description toggle.
- Trailer uses explicit video placeholder.
- About this course.
- Course info accordions.
- Curriculum/session list.
- Student work gallery.
- Testimonials.
- Meet instructor.
- Final CTA.

Design:

- Compact Poppins layout.
- Avoid giant serif display title.

## Screen 6 - Lesson Player

Route:

- `/courses/:courseId/lesson/:sessionId`

This is the most customized screen.

### Overall Layout

- No standard app sidebar.
- Uses its own learning layout.
- One rounded top learning bar spans across the lesson layout.
- Below it:
  - Left: course sessions sidebar.
  - Right: active tab content.

### Top Learning Bar

Contains:

- If session sidebar is closed: small icon button to reopen.
- Small uppercase `Learning screen` label.
- Current session title.
- Main tabs:
  - Overview
  - Assignment
  - Resources
- Close button returning to course detail.

The top bar should feel like one contained rounded panel, not multiple stacked bars.

### Course Sessions Sidebar

- Warm rounded panel below the shared top bar.
- Left-arrow close button.
- Smooth open/close animation.
- Session rows are clickable.
- Completed sessions show check icon.
- Active session uses ochre highlight.
- Locked sessions show lock icon and muted text.
- Locked sessions are still clickable.
- Clicking locked sessions shows locked lesson state telling the student to finish the previous video.

Current prototype behavior:

- Sessions 1, 2, and 3 are accessible.
- Sessions 4, 5, and 6 are locked.

### Overview Tab

Contains:

- Video player placeholder.
- Companion panel aligned to the same height as the video.
- Brief lesson overview below.

Video placeholder must explicitly say:

```text
Insert a video file here
/public/videos/<session-id>.mp4
```

Companion panel tabs:

- Notes
- Reference
- Canvas

Notes:

- Session-specific timestamp notes.

Reference:

- Artwork/reference image for the session.

Canvas:

- `Tldraw` embedded practice area.

### Assignment Tab

Assignment is a centered panel. No sidebar.

Content is session-specific:

- Session label.
- Session-specific assignment prompt.
- Upload zone.
- Session-specific submissions.
- Reviewed submissions can open feedback modal.

### Resources Tab

Resources is a centered panel. No sidebar, no extra companion panel.

Content is session-specific:

- Session label.
- Session title resources.
- List of uploaded/downloadable files.

### Session-Specific Data

Session-specific content currently comes from `getLessonContent(...)` in `src/App.jsx`.

It controls:

- Overview focus.
- Assignment prompt.
- Resource filenames.
- Submissions.
- Notes.

## Screen 7 - Feedback Modal

Opened from reviewed submission in Assignment tab.

Content:

- Header uses current session number.
- Original submission and annotated submission.
- Annotation is mocked with red SVG marks.
- Voice note is mocked.
- Feedback text reflects current session title.

## Screen 8 - Practice Journal

Route:

- `/journal`

Content:

- Practice timeline.
- Polaroid-style cards.
- Artwork thumbnails.
- Feedback excerpts.

## Screen 9 - Certificate

Route:

- `/courses/:courseId/certificate`

Content:

- Certificate display.
- Student name.
- Course title.
- Drdha signature line.
- Download/share buttons.

## Mock Data

JSON files exist under:

```text
src/data/
```

The current prototype also has inline data in `src/App.jsx`. This is acceptable for prototype speed, but future refactors should move more data into JSON.

## Assets

Artwork:

```text
public/art/
```

Logo:

```text
public/logo.webp
```

Videos:

```text
public/videos/
```

Video files are not yet present. Use placeholders until actual videos are added.

## Build Priority From Here

If continuing from the current Codex prototype:

1. Preserve the compact Poppins visual system.
2. Polish lesson player mobile behavior.
3. Move inline mock data into `src/data`.
4. Add real video assets.
5. Add more real artwork.
6. Split `App.jsx` into components/pages only if needed.

