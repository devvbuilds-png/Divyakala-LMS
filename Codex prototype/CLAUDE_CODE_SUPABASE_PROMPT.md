# Claude Code Prompt — Divyakala LMS Supabase Integration

## Context

You are continuing work on an existing React + Vite + Tailwind LMS prototype called `divyakala-lms`. The prototype already has a fully built UI for both the student-side and admin-side. Currently nothing persists — all data is mocked in `src/App.jsx` and JSON files.

**Your job:** Wire the existing UI to Supabase so the demo actually works end-to-end for a client presentation.

Read `claude.md` in the project root first. It is the source of truth for all decisions. If something conflicts between `claude.md` and the existing code, follow `claude.md`.

---

## Step 0: Read these files before writing a single line of code

1. `claude.md` — all locked decisions, data model, what to build, what to defer
2. `src/App.jsx` — understand the existing component structure before touching anything
3. `src/data/*.json` — understand existing mock data shapes

Do not rename, move, or restructure components unless explicitly told to. `App.jsx` stays as one file for now. Modularization is deferred (noted in `claude.md`).

---

## Step 1: Supabase setup

### 1a. Install Supabase client

```bash
npm install @supabase/supabase-js
```

### 1b. Create `src/lib/supabase.js`

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 1c. Create `.env.local`

```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Tell the developer: these values come from the Supabase dashboard → Project Settings → API. They must be filled in before the app will work.

Also create `.env.example` with the same keys but empty values so the repo is self-documenting.

### 1d. Run this SQL in the Supabase SQL editor

Tell the developer to open the Supabase dashboard → SQL Editor and run the following schema exactly as written:

```sql
-- Profiles (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users primary key,
  name text,
  email text,
  role text default 'student',
  country text,
  phone text,
  created_at timestamptz default now(),
  last_seen_at timestamptz
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Cards
create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  description text,
  content text,
  asset_url text,
  thumbnail_url text,
  duration_seconds int,
  status text default 'draft',
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Courses
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  price int default 0,
  currency text default 'INR',
  duration_label text,
  level text default 'Beginner-friendly',
  status text default 'draft',
  thumbnail_url text,
  certificate_enabled boolean default true,
  instructor_id uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sessions
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  position int not null,
  is_preview boolean default false,
  video_url text, -- YouTube/Vimeo/direct URL pasted by admin (card library deferred to v2)
  created_at timestamptz default now()
);

-- SessionCards
create table if not exists session_cards (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  card_id uuid references cards(id),
  role text not null,
  position int default 0
);

-- Enrollments
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  course_id uuid references courses(id),
  progress float default 0,
  last_session_id uuid references sessions(id),
  last_timestamp int default 0,
  status text default 'active',
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique(user_id, course_id)
);

-- Submissions
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  course_id uuid references courses(id),
  session_id uuid references sessions(id),
  file_url text,
  status text default 'awaiting_review',
  submitted_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewer_id uuid references profiles(id),
  feedback_text text,
  feedback_audio_url text,
  annotated_file_url text
);

-- Workshops
create table if not exists workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz,
  duration_minutes int default 60,
  registration_url text,
  replay_url text,
  thumbnail_url text,
  status text default 'upcoming'
);

-- Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  type text,
  title text,
  body text,
  read boolean default false,
  href text,
  created_at timestamptz default now()
);

-- RLS: enable on all tables
alter table profiles enable row level security;
alter table cards enable row level security;
alter table courses enable row level security;
alter table sessions enable row level security;
alter table session_cards enable row level security;
alter table enrollments enable row level security;
alter table submissions enable row level security;
alter table workshops enable row level security;
alter table notifications enable row level security;

-- RLS policies (permissive for demo — tighten in production)
-- Students can read published courses, their own enrollments/submissions/notifications
-- Admins (role = 'admin') can read/write everything

create policy "Public courses readable" on courses for select using (status = 'published');
create policy "Admin full access to courses" on courses for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Published sessions readable" on sessions for select using (
  exists (select 1 from courses where id = sessions.course_id and status = 'published')
);
create policy "Admin full access to sessions" on sessions for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Session cards readable for enrolled" on session_cards for select using (true);
create policy "Admin full access to session_cards" on session_cards for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Cards readable" on cards for select using (true);
create policy "Admin full access to cards" on cards for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Own enrollments" on enrollments for all using (user_id = auth.uid());
create policy "Admin see all enrollments" on enrollments for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Own submissions" on submissions for all using (user_id = auth.uid());
create policy "Admin see all submissions" on submissions for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Workshops readable" on workshops for select using (true);
create policy "Admin full access to workshops" on workshops for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Own notifications" on notifications for all using (user_id = auth.uid());
create policy "Admin full access to notifications" on notifications for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Own profile" on profiles for all using (id = auth.uid());
create policy "Admin see all profiles" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
```

Also tell the developer to create storage buckets manually in Supabase dashboard → Storage:
- `submissions` (private) — for student drawing uploads
- `thumbnails` (public) — for course cover images

Do NOT create a `cards` bucket today. Card file upload is deferred to v2.

---

## Step 2: Admin auth

**What exists:** Admin login at `/admin/auth` using localStorage key `divyakala-admin-auth`. Accepts any credentials.

**What to build:** Replace with Supabase email+password auth.

The admin account must be created manually by the developer in Supabase dashboard → Authentication → Users:
- Email: `drdha@divyakala.com`
- Password: chosen by developer, set manually
- After creating the user, run this in SQL editor to give them admin role:
  ```sql
  update profiles set role = 'admin' where email = 'drdha@divyakala.com';
  ```

In the admin auth component:
```js
// Sign in
const { error } = await supabase.auth.signInWithPassword({ email, password })
if (error) show error message
else navigate('/admin')

// Sign out
await supabase.auth.signOut()
navigate('/admin/auth')

// Check if admin
const { data: { user } } = await supabase.auth.getUser()
const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
if (profile.role !== 'admin') redirect to /admin/auth
```

Remove all references to `localStorage.setItem('divyakala-admin-auth', ...)`. The admin protected wrapper should now check Supabase session + admin role, not localStorage.

---

## Step 3: Student auth

**What exists:** Student auth using email OTP mock. Any OTP works. Sets `localStorage.setItem('divyakala-auth', 'true')`.

**What to build:** Real Supabase email OTP.

In Supabase dashboard → Authentication → Email Templates, make sure OTP is enabled.

Replace sign-in flow:
```js
// Step 1: Enter email → send OTP
const { error } = await supabase.auth.signInWithOtp({ email })
if (error) show error, else show OTP input

// Step 2: Enter OTP → verify
const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' })
if (error) show error, else navigate('/learning')
```

Replace sign-up flow:
```js
// Sign up creates auth user + triggers profile creation via the DB trigger
const { error } = await supabase.auth.signUp({
  email,
  password: Math.random().toString(36), // passwordless — student uses OTP only
  options: { data: { name: `${firstName} ${lastName}` } }
})
```

Remove all `localStorage.setItem('divyakala-auth', ...)`. Protected student routes check `supabase.auth.getSession()`.

Add a shared `useAuth` hook:
```js
// src/hooks/useAuth.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

After auth is working, add an **"Admin Studio →" link** in the student top bar:
- Only renders if the current user's profile `role === 'admin'`
- Hidden for regular students
- Links to `/admin`
- Style: small pill button, ochre border, ochre text, sits in the top bar right side next to the notification bell

Also verify the existing **"Student view"** link in the admin shell correctly links to `/learning` and works.

---

## Step 4: Loop 1 — Course publishing (admin → student Browse)

**Admin side (AdminCourses):**

Replace mock course list with real Supabase query:
```js
const { data: courses } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
```

Make the "Create course" form actually insert. The form includes a thumbnail image upload (single image file → Supabase `thumbnails` bucket):

```js
// Upload thumbnail first if provided
let thumbnail_url = null
if (thumbnailFile) {
  const path = `${Date.now()}-${thumbnailFile.name}`
  await supabase.storage.from('thumbnails').upload(path, thumbnailFile)
  const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(path)
  thumbnail_url = publicUrl
}

const { data, error } = await supabase.from('courses').insert({
  title, description, price: parseInt(price) * 100, // store in paise
  level, duration_label, status, thumbnail_url
}).select().single()
```

Make status change (draft → coming_soon → published) actually update:
```js
await supabase.from('courses').update({ status: newStatus }).eq('id', courseId)
```

**Student side (BrowseCourses):**

Replace mock courses array with:
```js
const { data: courses } = await supabase
  .from('courses')
  .select('*')
  .in('status', ['published', 'coming_soon'])
  .order('created_at', { ascending: false })
```

Render: published courses normally, coming_soon courses with "Notify me" button. Draft courses hidden.

---

## Step 5: Loop 2 — Session content via URL (simplified, card library deferred to v2)

**Do not wire AdminCards or the card library today.** Leave AdminCards as visual-only.

Instead, extend the course builder in AdminCourses with a simple session management panel.

### Admin course builder: sessions with video URL

After a course is created, show a session management panel below the course form:

**Session management UI:**
- Input: session title + video URL field (label: "Video URL — paste YouTube, Vimeo, or direct link") + "Add session" button
- Ordered list of existing sessions showing: position number, title, video URL (truncated), delete button
- No card library modal. No role assignment. Just title + URL per session.

On "Add session":
```js
await supabase.from('sessions').insert({
  course_id: course.id,
  title: sessionTitle,
  video_url: videoUrl,
  position: existingSessions.length + 1,
  is_preview: existingSessions.length === 0 // first session is always free preview
})
```

### Student lesson player: load video from session

When a session is selected, fetch the session's `video_url` directly:
```js
const { data: session } = await supabase
  .from('sessions')
  .select('*')
  .eq('id', sessionId)
  .single()

// video_url is either a YouTube embed URL, Vimeo embed URL, or direct .mp4 URL
```

In the video area:
- If `video_url` contains `youtube.com` or `youtu.be` → render as `<iframe>` with YouTube embed URL
- If `video_url` contains `vimeo.com` → render as `<iframe>` with Vimeo embed URL  
- Otherwise → render as `<video src={session.video_url} controls />`
- If no `video_url` → show existing clean empty state placeholder

Notes, Resources, and Assignment content remain as existing mock data for today (from `getLessonContent()`). Do not wire these to Supabase yet.

---

## Step 6: Loop 3 — Student assignment upload

In the Assignment tab of the lesson player:

```js
async function submitAssignment(file, sessionId, courseId) {
  const userId = (await supabase.auth.getUser()).data.user.id
  const path = `${userId}/${courseId}/${sessionId}/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('submissions')
    .upload(path, file)

  if (uploadError) throw uploadError

  // Get a signed URL (private bucket)
  const { data: { signedUrl } } = await supabase.storage
    .from('submissions')
    .createSignedUrl(path, 60 * 60 * 24 * 30) // 30-day URL

  await supabase.from('submissions').insert({
    user_id: userId,
    course_id: courseId,
    session_id: sessionId,
    file_url: signedUrl,
    status: 'awaiting_review'
  })
}
```

After submission, refresh the submissions list for that session. Show the new submission card with "Awaiting review" badge.

---

## Step 7: Loop 4 — Admin reviews submission → student sees feedback

**Admin Assignments page:**

Replace mock submissions with:
```js
const { data: submissions } = await supabase
  .from('submissions')
  .select('*, student:profiles(name, email), course:courses(title), session:sessions(title)')
  .order('submitted_at', { ascending: false })
```

Open review: clicking "Review" on a submission card opens a review modal with:
- The submitted file (image displayed full width, PDF linked)
- Text feedback input (textarea)
- Status selector: Reviewed | Approved | Needs Resubmission
- "Save review" button

On save:
```js
await supabase.from('submissions').update({
  status: selectedStatus,
  feedback_text: feedbackText,
  reviewed_at: new Date().toISOString(),
  reviewer_id: (await supabase.auth.getUser()).data.user.id
}).eq('id', submissionId)

// Create notification for the student
await supabase.from('notifications').insert({
  user_id: submission.user_id,
  type: 'feedback',
  title: 'Drdha reviewed your submission',
  body: `Your work for ${submission.session.title} has been reviewed.`,
  href: `/courses/${submission.course_id}/lesson/${submission.session_id}`
})
```

**Student Assignment tab:**

Fetch submissions for the current session:
```js
const { data: submissions } = await supabase
  .from('submissions')
  .select('*')
  .eq('session_id', sessionId)
  .eq('user_id', currentUser.id)
  .order('submitted_at', { ascending: false })
```

Show each submission with its real status badge. If status is `reviewed` or `approved`, show "View feedback" button.

Feedback modal shows:
- The submitted image (`file_url`)
- `feedback_text` from the review
- Voice note bar (still mocked — show static waveform, play button does nothing)
- Annotated image (still mocked — show the pre-prepared overlay image from `/public/art/feedback-mock.jpg`)

Do not remove the mocked voice note and annotation UI. They are intentional demo polish, clearly mocked, deferred to v2.

---

## Step 8: Loop 5 — Workshop publishing (admin → student)

**Admin Workshops:**

Replace mock data with:
```js
const { data: workshops } = await supabase.from('workshops').select('*').order('starts_at')
```

Make "Create workshop" form insert:
```js
await supabase.from('workshops').insert({
  title,
  description,
  starts_at: new Date(`${date}T${time}:00+05:30`).toISOString(),
  duration_minutes: 60,
  replay_url: replayPath || null,
  status: 'upcoming'
})
```

**Student Workshops page:**

Replace mock data with:
```js
const now = new Date().toISOString()

const { data: upcomingWorkshops } = await supabase
  .from('workshops')
  .select('*')
  .gte('starts_at', now)
  .order('starts_at')

const { data: pastWorkshops } = await supabase
  .from('workshops')
  .select('*')
  .lt('starts_at', now)
  .not('replay_url', 'is', null)
  .order('starts_at', { ascending: false })
```

Workshop card for upcoming: show date, time, description, "Register" button (links to `registration_url`).
Workshop card for past: show thumbnail, title, "Watch Replay" button (links to `replay_url`).

---

## Step 9: Loop 6 — Lesson unlocking

**SKIP for today's demo.** Keep the existing mock behavior (Sessions 1-3 accessible, 4-6 locked). Do not wire to Supabase. Deferred to v2.

---

## Step 10: Demo seed + reset (Admin Settings)

In AdminSettings, add two prominent buttons at the top:

### "Load demo data" button

When clicked, insert the following into Supabase (only if tables are empty — check first):

```js
async function seedDemoData() {
  // 1. Create the Srinivasa course
  const { data: course } = await supabase.from('courses').insert({
    title: 'Drawing Divine Forms — Srinivasa',
    slug: 'drawing-divine-forms-srinivasa',
    description: 'This specialized workshop focuses on depicting the sacred iconography of one of the most revered forms of Sri Vishnu — Srinivasa, also known as Balaji...',
    price: 1060000, // ₹10,600 in paise
    currency: 'INR',
    duration_label: '5 months 4 days',
    level: 'Beginner-friendly',
    status: 'published',
    thumbnail_url: '/art/AhobhilaDarshan_Blk_18x24_Light_Fin-3.webp',
    certificate_enabled: true
  }).select().single()

  // 2. Create 6 sessions
  const sessionTitles = [
    'Foundations of Shilpa Shastra',
    'The Talamana Grid',
    'Form Construction',
    'Ayudhas and Ornamentation',
    'Mudras and Symbolic Gestures',
    'Final Refinement and Completion'
  ]

  const sessions = await Promise.all(sessionTitles.map((title, i) =>
    supabase.from('sessions').insert({
      course_id: course.id,
      title,
      position: i + 1,
      is_preview: i === 0
    }).select().single().then(r => r.data)
  ))

  // 3. Create 2 upcoming workshops
  await supabase.from('workshops').insert([
    {
      title: 'Iconography Q&A: Mudras & Their Meanings',
      description: 'Bring your questions about hand gestures and their symbolism.',
      starts_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 60,
      status: 'upcoming'
    },
    {
      title: 'Live Painting Demo: Watercolor Techniques',
      description: 'Drdha demonstrates traditional watercolor methods for devotional painting.',
      starts_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 90,
      status: 'upcoming'
    }
  ])

  alert('Demo data loaded.')
}
```

### "Reset to empty" button

```js
async function resetDemo() {
  if (!confirm('This will delete all demo data. Are you sure?')) return

  // Delete in safe order (children before parents)
  await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('submissions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('enrollments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('session_cards').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('cards').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('workshops').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  alert('Reset complete. All demo data cleared.')
}
```

Both buttons should be prominent in Admin Settings with clear labels and warning text for reset.

---

## Step 11: Student side cleanup

Do these in one pass after all loops are wired. Items marked **TODAY** are required before sending the demo. Items marked **DEFER** can be skipped if time is tight.

1. **[TODAY] Certificate:** Replace hardcoded "Dev Saxena" with `profile.name` from Supabase auth user.

2. **[TODAY] Remove all "Insert video here" placeholder text.** Replace with a clean empty state: video player area with `bg-surface-warm`, a play icon, and "No video added yet" in muted text.

3. **[DEFER] Notifications bell:** Leave as existing static mocks for today. Wire to Supabase notifications table in v2.

4. **[DEFER] Practice Journal:** Leave as existing mock polaroid cards for today. Wire to real submissions in v2.

5. **[DEFER] My Learning "Continue" card:** Leave pointing to mock enrollment data for today. Wire to Supabase enrollments in v2.

---

## Step 12: Deploy to Vercel

After all loops are working locally:

1. `npm run build` — must succeed with no errors.
2. Push to GitHub.
3. Connect repo to Vercel.
4. Add environment variables in Vercel dashboard → Project Settings → Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Test every route on the live URL before sending to client.

Tell the developer: verify these routes work on the deployed URL:
- `/auth/sign-in` — student login
- `/learning` — student home (after signing in)
- `/browse` — course catalog
- `/workshops` — workshops page
- `/admin/auth` — admin login
- `/admin` — admin dashboard

---

## What NOT to do

- Do not refactor or restructure `App.jsx` into separate files. It is deferred — noted in `claude.md`.
- Do not wire AdminCards (card library). Leave it visual-only today. Card file upload is deferred to v2.
- Do not wire session_cards table. Sessions use `video_url` directly today.
- Do not add drag-and-drop. Deferred to v2.
- Do not wire voice note audio upload. Mocked in UI, deferred to v2.
- Do not wire annotation drawing. Mocked in UI, deferred to v2.
- Do not build playlists functionality. Visual only.
- Do not add search/filter logic. Placeholder inputs only.
- Do not wire lesson unlocking to Supabase. Keep existing mock behavior.
- Do not wire notifications bell to Supabase. Keep existing static mocks.
- Do not wire Practice Journal to Supabase. Keep existing mock polaroids.
- Do not change the visual design, fonts, colors, or component structure. It is locked.
- Do not replace the tldraw canvas with anything else.
- Do not add loading spinners that break the existing UI patterns — use subtle inline loading states (skeleton or muted text).

---

## Working approach

- Start with Step 1 (Supabase setup) and get auth working before touching any data queries.
- Test in browser after each step. Don't build 3 loops before testing 1.
- When a Supabase query returns unexpected results, `console.log` the full response including `error` — Supabase errors are descriptive.
- RLS (row level security) will block queries if auth is wrong. If data isn't loading, check if the user is signed in and if the RLS policy covers the query.
- The `submissions` bucket is private — always use signed URLs, not public URLs.
- The `thumbnails` bucket is public — use `getPublicUrl()`.
- Run `npm run lint` after each major step to catch issues early.
