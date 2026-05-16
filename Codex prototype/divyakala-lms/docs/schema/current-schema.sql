-- Divyakala LMS — Current Database Schema
-- This file is the single source of truth for the database structure.
-- Any schema change must: (1) be added as a numbered migration in migrations/,
-- and (2) be reflected here.
-- Last updated: 2026-05-16

-- NOTE: The deployed Supabase schema uses "profiles" (not "users").
-- The table below reflects what is actually deployed.

-- Profiles (extends Supabase auth.users)
create table profiles (
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
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Courses
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  instructor_id uuid references profiles(id),
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
  reference_url text,
  reference_name text,
  resource_url text,
  resource_name text,
  created_at timestamptz default now()
);

-- SessionCards (junction — links cards to sessions with roles)
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
  user_id uuid references profiles(id),
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
  user_id uuid references profiles(id),
  course_id uuid references courses(id),
  session_id uuid references sessions(id),
  card_id uuid references cards(id),
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
  user_id uuid references profiles(id),
  type text,
  title text,
  body text,
  read boolean default false,
  href text,
  created_at timestamptz default now()
);

-- TODO: verify against live Supabase project for any columns added
-- via the migration SQL files (session reference/resource columns,
-- RLS policies, storage bucket configurations).
-- The following SQL files in the repo contain additional setup:
--   supabase-session-reference-resources.sql
--   supabase-loop3-submissions-rls.sql
--   supabase-loop4-review-rls.sql
--   supabase-loop4-delete-policy-only.sql
