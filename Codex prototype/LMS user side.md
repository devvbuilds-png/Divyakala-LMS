# Divyakala LMS User Side - Current Build Context

This file is the handoff context for the current Codex-built user-side LMS prototype. Use it to transfer project state to Claude Code or another coding agent without needing the whole conversation history.

## Project Location

- Prototype folder: `D:\AI projects\Divyakala\Codex prototype\divyakala-lms`
- Framework: React + Vite
- Styling: Tailwind CSS
- Routing: React Router
- Icons: `lucide-react`
- Drawing canvas: `@tldraw/tldraw`
- Auth/backend/payment: mocked only

## Current Status

The app builds and lints successfully.

```powershell
npm run lint
npm run build
```

Expected warning: Vite reports a large bundle because `@tldraw/tldraw` is bundled into the lesson player. This is acceptable for the prototype.

## Current Design Direction

The original brief asked for a highly serif, fine-art-monograph direction. During iteration, the UI was changed to match the provided LMS screenshot more closely.

Current direction:

- Compact, clean, warm, refined LMS interface.
- Font is `Poppins` everywhere, including headings, body, buttons, nav, and cards.
- Avoid large, theatrical display typography.
- Keep the UI elegant, dense, and calm rather than oversized or "in your face."
- Cream/warm-white surfaces with ochre accents and warm brown text/chrome.
- Main UI should feel closer to the screenshot's visual density than the first editorial concept.

Current font import:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
```

The app uses a smaller root scale:

```css
:root {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
}
```

## Visual System

Colors:

- Background: `#F5ECD2`
- Surface: `#FFFFFF`
- Warm surface: `#FBF6E9`
- Primary text: `#2A1F18`
- Muted text: `#6B5D4A`
- Soft text: `#9A8B72`
- Chrome/sidebar: `#2A1F18`
- Primary ochre: `#C9952A`
- Primary hover: `#B07F1F`
- Primary soft: `#F4DFA0`
- Accent terracotta: `#D87E5D`
- Border: `#E5D7B3`
- Success: `#5C8A4F`
- Error: `#B5482D`

Density:

- Sidebar width is compact: app shell uses about `216px`; lesson session sidebar uses about `208px`.
- Top bars are compact.
- Cards use smaller padding than the original brief.
- Buttons are pill-shaped but compact.
- Avoid huge headings except where absolutely necessary.

## Assets

Current local artwork assets copied into:

```text
public/art/
```

Files:

- `AhobhilaDarshan_Blk_18x24_Light_Fin-3.webp`
- `DrdhaVG_Nataraja_Pencil+on+Paper_74x55cm_2017.webp`
- `DVGorrick_Murugan_web-1.webp`
- `DVGorrick_Panchamukha+Shiva_2019.webp`
- `DVGorrick_Purnaghatam_web.webp`
- `Ganesha.webp`

Logo:

```text
public/logo.webp
```

Video files are not present. Areas that need video clearly say `Insert a video file here` and show paths like:

```text
/public/videos/session-3.mp4
/public/videos/srinivasa-course-trailer.mp4
```

Do not replace video placeholders with stock content.

## Architecture

The implementation is currently mostly in:

```text
src/App.jsx
src/index.css
tailwind.config.js
src/data/*.json
```

It is intentionally simple for prototype speed. There is no backend and no real auth. Mock data exists partly inline in `App.jsx` and partly in JSON under `src/data`.

Important utility/state decisions:

- Auth uses `localStorage` key `divyakala-auth`.
- Protected routes redirect to `/auth/sign-in`.
- Route changes scroll to top via `ScrollToTop`.
- No Redux/Zustand. Local component state only.
- `getLessonContent(sessionId, sessionNumber, sessionTitle)` provides per-session mock lesson content for Overview, Assignment, Resources, Notes, and feedback.

## Routes

- `/` redirects based on mock auth.
- `/auth/sign-in`
- `/auth/sign-up`
- `/learning`
- `/browse`
- `/workshops`
- `/courses/:courseId`
- `/courses/:courseId/lesson/:sessionId`
- `/journal`
- `/courses/:courseId/certificate`

## Built Screens

### Auth

- Two-column layout.
- Artwork left, auth form right.
- Sign-in and sign-up variants.
- OTP step shown after first submit.
- Any OTP signs in and sets `localStorage`.

### App Shell

- Compact warm-brown sidebar.
- Nav: My Learning, Browse Courses, Live Workshops.
- Compact top bar.
- Notifications dropdown exists.
- Sidebar collapse exists.

### My Learning

- Continue your practice card.
- Resume opens lesson player, not course detail.
- View course opens course detail.
- Workshop banner.
- Enrolled courses.
- Journal preview.

### Browse Courses

- Compact filter/search row.
- Course cards with real local artwork.
- Clicking available course opens course detail.
- Coming-soon courses show Notify me.

### Live Workshops

- Next-up hero.
- Upcoming workshops list.
- Past replays with video placeholders.

### Course Detail

- Asymmetric hero.
- Trailer/Description toggle.
- Trailer area says where to insert video.
- About section, accordion info, curriculum, gallery, testimonials, instructor, CTA.

### Lesson Player

This screen has been heavily revised from the original brief.

Current UX:

- One rounded top learning bar across the whole lesson layout.
- Top learning bar includes lesson title, main tabs, and close button.
- Main tabs are only:
  - `Overview`
  - `Assignment`
  - `Resources`
- No Discussion tab.
- Course sessions are in a left sidebar below the same top bar.
- Course sessions sidebar has a left-arrow close button.
- If closed, a small icon button in the top learning bar reopens it.
- Open/close animation uses width/opacity/translate transitions.
- Session rows are clickable.
- Sessions 1-3 are accessible in the prototype.
- Sessions 4-6 are locked but clickable; clicking shows a locked lesson screen telling the user to finish the previous video.
- `Overview` shows video + companion panel + brief overview.
- Companion panel sits beside the video and matches video height.
- Companion tabs:
  - Notes
  - Reference
  - Canvas
- Canvas uses `Tldraw`.
- `Assignment` is a centered panel, not a two-column layout.
- `Resources` is a centered list of uploaded/downloadable resources, no sidebar.
- Assignment and Resources content are session-specific.

### Assignment/Feedback

- Assignment upload area is mocked.
- Submissions are session-specific.
- Reviewed submissions can open feedback modal.
- Feedback modal shows original vs annotated mock with red SVG marks.
- Voice note waveform is mocked.

### Practice Journal

- Timeline/polaroid-style cards.
- Uses local artwork.

### Certificate

- Ornate certificate page with warm gold border.
- Mock student name: Dev Saxena.

## Session-Specific Lesson Data

Current session-specific content lives in `getLessonContent(...)`.

For each session, it controls:

- `focus`
- `assignment`
- `resources`
- `submissions`
- `notes`

If adding more sessions or making locked sessions available, extend this function or move it into structured JSON later.

## Important UX Decisions From Iteration

- Every route change must scroll to top.
- Font must be Poppins everywhere.
- UI should be compact and screenshot-aligned.
- My Learning `Continue Learning` goes to the lesson player.
- Course detail should primarily be entered through Browse Courses.
- Video placeholders must explicitly say where to insert a video file.
- Do not add unnecessary sidebars in Assignment or Resources tabs.
- Keep lesson-player controls minimal.
- Notes/Reference/Canvas belongs only to Overview and optionally Resources if specifically requested later, but currently it appears in Overview only.

## Known Follow-Up Improvements

- Split `App.jsx` into pages/components if continuing beyond prototype.
- Move inline mock data into `src/data`.
- Code-split `@tldraw/tldraw` to reduce bundle warning.
- Improve mobile behavior for the lesson player.
- Add actual video files under `public/videos`.
- Add more Drdha artwork assets.
- Replace mocked upload/feedback with real file flow only if moving beyond sales demo.

