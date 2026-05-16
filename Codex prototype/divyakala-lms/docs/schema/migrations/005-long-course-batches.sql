-- Long-course term groups and batch structure for the Sunday demo.
-- Run this in Supabase SQL Editor.

alter table public.courses
add column if not exists course_type text not null default 'short';

create table if not exists public.term_groups (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id),
  name text not null,
  start_date date,
  status text not null default 'active',
  created_at timestamptz default now()
);

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  term_group_id uuid references public.term_groups(id) on delete cascade,
  name text not null,
  schedule_note text,
  seats int,
  status text not null default 'active',
  created_at timestamptz default now()
);

create table if not exists public.batch_modules (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.batches(id) on delete cascade,
  module_number int not null,
  title text not null,
  created_at timestamptz default now()
);

create table if not exists public.batch_sessions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.batch_modules(id) on delete cascade,
  title text not null,
  scheduled_at timestamptz,
  zoom_link text,
  recording_url text,
  status text not null default 'upcoming',
  created_at timestamptz default now()
);

create table if not exists public.batch_enrollments (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.batches(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  enrolled_at timestamptz default now(),
  unique (batch_id, student_id)
);

alter table public.term_groups enable row level security;
alter table public.batches enable row level security;
alter table public.batch_modules enable row level security;
alter table public.batch_sessions enable row level security;
alter table public.batch_enrollments enable row level security;

drop policy if exists "Authenticated users can read term groups" on public.term_groups;
drop policy if exists "Admins can manage term groups" on public.term_groups;
drop policy if exists "Authenticated users can read batches" on public.batches;
drop policy if exists "Admins can manage batches" on public.batches;
drop policy if exists "Authenticated users can read batch modules" on public.batch_modules;
drop policy if exists "Admins can manage batch modules" on public.batch_modules;
drop policy if exists "Authenticated users can read batch sessions" on public.batch_sessions;
drop policy if exists "Admins can manage batch sessions" on public.batch_sessions;
drop policy if exists "Students can read own batch enrollments" on public.batch_enrollments;
drop policy if exists "Admins can manage batch enrollments" on public.batch_enrollments;

create policy "Authenticated users can read term groups"
on public.term_groups
for select
to authenticated
using (true);

create policy "Admins can manage term groups"
on public.term_groups
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Authenticated users can read batches"
on public.batches
for select
to authenticated
using (true);

create policy "Admins can manage batches"
on public.batches
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Authenticated users can read batch modules"
on public.batch_modules
for select
to authenticated
using (true);

create policy "Admins can manage batch modules"
on public.batch_modules
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Authenticated users can read batch sessions"
on public.batch_sessions
for select
to authenticated
using (true);

create policy "Admins can manage batch sessions"
on public.batch_sessions
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Students can read own batch enrollments"
on public.batch_enrollments
for select
to authenticated
using (student_id = auth.uid());

create policy "Admins can manage batch enrollments"
on public.batch_enrollments
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
