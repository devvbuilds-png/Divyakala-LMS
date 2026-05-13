# LMS Admin Side

## Purpose

This document is the context handoff for the Divyakala LMS admin side built inside the existing React prototype.

The student-side LMS was already present as a mocked Vite/React app. Before making large changes to the student side, the admin side was added so content, courses, assignments, workshops, students, and publishing rules can be managed from a dedicated studio interface.

The admin is intentionally built as a mock/prototype control room, matching the current student LMS architecture. It does not use a backend yet. Data is currently hardcoded in `src/App.jsx`, consistent with the rest of the prototype.

## Project Location

App root:

```text
D:\AI projects\Divyakala\Codex prototype\divyakala-lms
```

Primary file changed:

```text
D:\AI projects\Divyakala\Codex prototype\divyakala-lms\src\App.jsx
```

Handoff file:

```text
D:\AI projects\Divyakala\LMS admin side.md
```

## Current App Stack

- Vite
- React
- React Router
- Tailwind CSS
- Lucide React icons
- `@tldraw/tldraw` already used by the student lesson player
- Mocked localStorage auth
- Mocked hardcoded data in `src/App.jsx`

## Admin Entry Decision

The admin side uses a separate admin route and separate mock auth key instead of sharing the student auth flow.

Reasoning:

- Student and admin experiences have different mental models.
- Admin should not land inside student LMS navigation.
- It keeps the prototype simple while making future role-based auth easy.
- The current app has no backend, so a separate localStorage key is enough for now.

Admin routes:

```text
/admin/auth
/admin
/admin/cards
/admin/courses
/admin/playlists
/admin/assignments
/admin/students
/admin/workshops
/admin/settings
```

Student routes remain unchanged:

```text
/auth/sign-in
/auth/sign-up
/learning
/browse
/workshops
/courses/:courseId
/courses/:courseId/lesson/:sessionId
/journal
/courses/:courseId/certificate
```

## Auth Implementation

Student auth already existed:

```js
localStorage.getItem('divyakala-auth') === 'true'
```

Admin auth was added:

```js
localStorage.getItem('divyakala-admin-auth') === 'true'
```

Admin sign-in accepts any email/passcode for the demo. On submit:

```js
localStorage.setItem('divyakala-admin-auth', 'true')
navigate('/admin')
```

Protected admin wrapper:

```js
function AdminProtected({ children }) {
  return isAdminAuthed() ? children : <Navigate to="/admin/auth" replace />
}
```

## High-Level Architecture Decision

The admin content model is:

```text
Cards -> Courses -> Playlists
```

This is the core admin-side decision.

### Cards

Cards are atomic content blocks. They can represent:

- Video
- Image
- Text
- File/resource
- Assignment prompt later
- Downloadable references later
- Quiz/checklist later

Cards are reusable and can be attached to courses.

### Courses

Courses are ordered collections of cards. In the student LMS, they map to:

- Browse course cards
- Course detail pages
- Lesson/session lists
- Lesson player content
- Resources
- Assignment prompts
- Completion/certificate rules

### Playlists

Playlists are ordered collections of courses. They are planned as guided learning paths, cohorts, replay libraries, or themed journeys.

Examples:

- Beginner Devotional Drawing Path
- Iconography Intensive
- Live Workshop Replays

## New Mock Admin Data

The following mock arrays were added in `src/App.jsx`.

### `adminCards`

Represents reusable learning content.

Current examples:

- `Srinivasa Session 1: Foundations`
- `Talamana eight-division grid`
- `Materials and practice brief`
- `Srinivasa reference PDF`

Fields:

```js
{
  id,
  type,
  title,
  course,
  status,
  duration,
  asset,
  updated
}
```

### `adminPlaylists`

Represents collections of courses.

Fields:

```js
{
  title,
  courses,
  students,
  status
}
```

### `adminSubmissions`

Represents assignment submissions requiring review.

Fields:

```js
{
  student,
  course,
  assignment,
  status,
  submitted,
  file
}
```

### `adminStudents`

Represents student progress data.

Fields:

```js
{
  name,
  email,
  progress,
  enrolled,
  lastSeen
}
```

## Admin UI Shell

The admin has its own shell component:

```js
AdminShell
```

It mirrors the student shell aesthetic but uses admin navigation.

Admin sidebar items:

- Dashboard
- Cards
- Courses
- Playlists
- Assignments
- Students
- Workshops
- Settings

Admin shell details:

- Fixed left sidebar
- Collapsible desktop sidebar
- Mobile hamburger behavior
- Top bar with page title
- “Student view” link back to `/learning`
- Admin sign-out button
- Admin avatar/profile block

The sidebar uses the same warm Divyakala chrome styling as the student LMS.

## Built Admin Screens

### 1. Admin Auth

Component:

```js
AdminAuth
```

Route:

```text
/admin/auth
```

Features:

- Dedicated admin sign-in screen
- Uses Divyakala logo
- Uses artwork panel on desktop
- Any demo credentials accepted
- Links back to student LMS sign-in

Purpose:

Creates a clear separation between student and admin mode.

### 2. Admin Dashboard

Component:

```js
AdminDashboard
```

Route:

```text
/admin
```

Features:

- Stats cards:
  - Published cards
  - Courses
  - Pending reviews
  - Active students
- Publishing flow explanation:
  - Cards
  - Courses
  - Playlists
- “Needs attention” submission list
- Current student-side connection map

The dashboard explicitly documents what the admin must control in the student LMS:

- Browse catalog
- Lesson player
- Assignments
- Workshops

### 3. Card Library

Component:

```js
AdminCards
```

Route:

```text
/admin/cards
```

Features:

- Create card form
- Card type segmented grid:
  - Video
  - Image
  - Text
  - File
- Fields:
  - Card title
  - Attach to course
  - Asset URL or upload path
  - Lesson notes/description
- Card library grid
- Search input placeholder
- Each card displays:
  - Type icon
  - Status badge
  - Title
  - Course
  - Asset path
  - Preview/edit/delete icon buttons

Decision:

Cards are not restricted to video. This was important because the requested model explicitly mentioned videos, images, text files, etc.

### 4. Course Builder

Component:

```js
AdminCourses
```

Route:

```text
/admin/courses
```

Features:

- Create course form
- Fields:
  - Course title
  - Price
  - Duration
  - Level
  - Status
  - Description
- “Build with cards” selector
- Existing course admin cards using current student-side `courses`
- Each course card shows:
  - Artwork
  - Title
  - Live/coming soon badge
  - Session/duration metadata
  - Progress-style publishing readiness bar
  - Edit and Preview buttons

Decision:

Courses are built from selected card IDs in prototype state. This demonstrates the future relationship even before a backend schema exists.

### 5. Playlist Builder

Component:

```js
AdminPlaylists
```

Route:

```text
/admin/playlists
```

Features:

- Create playlist form
- Playlist title
- Audience selector
- Course checkboxes
- Existing playlists list
- Displays course count, student count, status, and manual order note

Decision:

Playlists are not just tags. They are explicit ordered course collections that can later power learning paths, cohorts, or themed libraries.

### 6. Assignment Review

Component:

```js
AdminAssignments
```

Route:

```text
/admin/assignments
```

Features:

- Assignment queue heading
- Review next button
- Export CSV button
- Submission cards
- Each submission includes:
  - Artwork/submission preview
  - Student name
  - Assignment title
  - Status badge
  - Course metadata
  - Open review button
  - Voice note button

Connection to student LMS:

Student assignment flow already has:

- Upload area
- Submissions
- Feedback modal
- Annotation mock
- Voice note mock
- Approved/reviewed/awaiting feedback states

The admin assignment queue is the admin-side counterpart of that student assignment experience.

### 7. Students

Component:

```js
AdminStudents
```

Route:

```text
/admin/students
```

Features:

- Student list
- Add student button
- Student name/email
- Number of enrolled courses
- Average progress bar
- Open button

Future connection:

This should eventually control enrollments, certificates, individual progress, support interventions, and cohort membership.

### 8. Workshops

Component:

```js
AdminWorkshops
```

Route:

```text
/admin/workshops
```

Features:

- Create workshop form
- Workshop title
- Date
- Time
- Replay video path
- Workshop calendar list using existing student-side workshop cards

Connection to student LMS:

This maps directly to:

- `/workshops`
- Upcoming workshops
- Past replay cards
- Calendar/registration copy
- Notifications later

### 9. Settings

Component:

```js
AdminSettings
```

Route:

```text
/admin/settings
```

Features:

- Student LMS connection rules:
  - Auto-publish course to Browse Courses after approval
  - Unlock next lesson only after assignment review
  - Issue certificate after final assignment approval
- Roles invite form:
  - Instructor email
  - Role selector
- Role planning note:
  - Owner
  - Instructor
  - Reviewer
  - Content editor
  - Support

Decision:

Settings were included because an admin side needs platform rules, not only content CRUD.

## Shared Helper Components Added

The admin side added several helper components inside `App.jsx`.

```js
AdminShell
AdminNavItem
AdminAuth
AdminDashboard
StatCard
FlowTile
AdminContentMap
AdminCards
AdminCard
AdminCourses
CourseAdminCard
AdminPlaylists
AdminAssignments
SubmissionCard
AdminStudents
AdminWorkshops
AdminSettings
AdminEditor
IconButton
ReviewRow
```

Existing student helper components reused:

```js
Input
Button
Badge
Progress
SectionTitle
ArtPanel
WorkshopCard
```

## Visual/Aesthetic Decisions

The admin side intentionally keeps the same Divyakala aesthetic:

- Cream background
- Warm brown chrome sidebar
- Ochre action color
- Same card borders and warm surfaces
- Same logo and art usage
- Same rounded card language as the current prototype
- Same serif-like/Poppins typography currently used by the app

The design system document specifies Cormorant/Crimson, but the actual implemented app currently uses Poppins in Tailwind and CSS. The admin follows the implemented app rather than introducing a mixed type system.

## Current Validation

Commands run successfully:

```bash
npm run lint
npm run build
```

Build warning:

Vite reports a large chunk warning. This already makes sense because the existing app includes heavier dependencies such as `@tldraw/tldraw`. The build still succeeds.

Dev server was started at:

```text
http://127.0.0.1:5174
```

Smoke checks returned HTTP 200:

```text
/admin
/admin/auth
```

## Current Limitations

The admin side is still a prototype.

Important limitations:

- No backend.
- No database.
- No real file upload.
- No real video storage.
- No real role permissions.
- No persistent CRUD beyond mock local state in a few UI interactions.
- No real assignment review editor yet.
- No real annotation drawing/upload workflow on admin side.
- No real student enrollment management.
- No search/filter logic beyond placeholders.
- No drag-and-drop ordering yet.
- No notification publishing backend.
- No API contract yet.

## Future Backend/Data Model Plan

When moving beyond prototype, split mock data into real models.

Recommended entities:

### User

Fields:

- id
- name
- email
- role
- status
- createdAt
- lastSeenAt

Roles:

- student
- owner
- instructor
- reviewer
- content_editor
- support

### Card

Fields:

- id
- type
- title
- description
- content
- assetUrl
- thumbnailUrl
- duration
- status
- createdBy
- updatedBy
- createdAt
- updatedAt

Types:

- video
- image
- text
- file
- assignment
- resource
- quiz/checklist later

### Course

Fields:

- id
- title
- slug
- instructorId
- price
- currency
- durationLabel
- level
- status
- available
- thumbnailCardId
- description
- certificateEnabled
- previewCardId
- createdAt
- updatedAt

### CourseCard

Join table for ordered cards inside a course.

Fields:

- id
- courseId
- cardId
- sectionId/sessionId
- position
- unlockRule
- isPreview
- requiredForCompletion

### Playlist

Fields:

- id
- title
- slug
- description
- audience
- status
- createdAt
- updatedAt

### PlaylistCourse

Join table for ordered courses inside playlists.

Fields:

- id
- playlistId
- courseId
- position

### Enrollment

Fields:

- id
- userId
- courseId
- progress
- lastCardId
- lastTimestamp
- status
- enrolledAt
- completedAt

### Submission

Fields:

- id
- userId
- courseId
- cardId/assignmentId
- fileUrl
- status
- submittedAt
- reviewedAt
- reviewerId
- feedbackText
- feedbackAudioUrl
- annotatedFileUrl

Statuses:

- awaiting_review
- reviewed
- approved
- needs_resubmission

### Workshop

Fields:

- id
- title
- description
- startsAt
- durationMinutes
- registrationUrl
- replayUrl
- thumbnailUrl
- status

### Notification

Fields:

- id
- userId
- type
- title
- body
- read
- href
- createdAt

## Future Frontend Plan

Recommended next work:

1. Split `src/App.jsx` into modules.
   - `src/data/mockCourses.js`
   - `src/data/mockAdmin.js`
   - `src/components/common/*`
   - `src/admin/*`
   - `src/student/*`

2. Create a proper admin layout folder.
   - `src/admin/AdminShell.jsx`
   - `src/admin/AdminAuth.jsx`
   - `src/admin/pages/AdminDashboard.jsx`
   - `src/admin/pages/AdminCards.jsx`
   - etc.

3. Add persistent mock storage.
   - Use localStorage for created cards/courses/playlists.
   - Keep seed data as defaults.

4. Add real card creation behavior.
   - Create card
   - Edit card
   - Delete card
   - Filter by type/status/course

5. Add drag-and-drop ordering.
   - Course cards ordering
   - Playlist course ordering
   - Session grouping

6. Build assignment review modal.
   - Student submission preview
   - Annotation canvas or overlay
   - Text feedback
   - Voice note placeholder/upload
   - Approve/request resubmission buttons

7. Add student profile admin page.
   - Enrollments
   - Progress timeline
   - Submissions
   - Certificates
   - Notes/support flags

8. Add workshop creation/editing.
   - Schedule
   - Replay publishing
   - Registration state
   - Student notifications

9. Connect admin publishing states to student UI.
   - Published courses appear in Browse
   - Draft courses stay hidden
   - Coming soon courses show notify button
   - Published workshop replays appear in Past Workshops

10. Replace mock auth with real role-based auth.

## Suggested API Surface Later

When a backend is introduced, likely API routes:

```text
GET    /api/admin/cards
POST   /api/admin/cards
PATCH  /api/admin/cards/:id
DELETE /api/admin/cards/:id

GET    /api/admin/courses
POST   /api/admin/courses
PATCH  /api/admin/courses/:id
POST   /api/admin/courses/:id/cards
PATCH  /api/admin/courses/:id/cards/order

GET    /api/admin/playlists
POST   /api/admin/playlists
PATCH  /api/admin/playlists/:id
PATCH  /api/admin/playlists/:id/courses/order

GET    /api/admin/submissions
GET    /api/admin/submissions/:id
POST   /api/admin/submissions/:id/review

GET    /api/admin/students
GET    /api/admin/students/:id
PATCH  /api/admin/students/:id/enrollments

GET    /api/admin/workshops
POST   /api/admin/workshops
PATCH  /api/admin/workshops/:id
```

## Open Product Questions

These were not blocked during the prototype, but should be answered before production:

- Should admins and students share one login screen with role detection, or stay separate?
- Should instructors only see their own courses/submissions?
- Do cards belong globally to the studio, or only to one instructor?
- Can one card be reused across multiple courses?
- Are playlists public catalog items or assigned privately to cohorts?
- Do assignments unlock lessons, certificates, or both?
- Should a course be session-based, card-based, or both?
- Should video be hosted by the platform, Vimeo, YouTube unlisted, or another provider?
- Should feedback annotations be image overlays, vector layers, or flattened generated files?
- Is voice feedback recorded in browser, uploaded as audio, or linked externally?

## Developer Notes

The admin side is currently appended inside `src/App.jsx` after the existing student LMS code. This was the fastest way to preserve the prototype and avoid moving too much at once.

Before serious expansion, refactor is strongly recommended. `App.jsx` is now large and mixes:

- Routing
- Mock data
- Student pages
- Admin pages
- Shared components

The safest next step is modularization before adding more logic.

## Quick Start

From the app root:

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/admin
```

If port `5173` is busy, Vite may use another port.

Admin demo login:

```text
Any email
Any passcode
```

Student LMS:

```text
http://127.0.0.1:5173/learning
```

Student demo login:

```text
Any email
OTP flow accepts the demo progression
```

## Summary

The admin side now exists as a separate protected studio inside the current Divyakala LMS prototype. It establishes the main content architecture:

```text
Cards -> Courses -> Playlists
```

It also adds the operational areas required for the student LMS to function as a real learning platform:

- Content/card management
- Course creation
- Playlist creation
- Assignment review
- Student progress
- Workshop scheduling
- LMS rules/settings

The work is prototype-complete for navigation and visual structure, and ready for the next phase: modularization, real CRUD behavior, assignment review depth, and backend/API integration.
