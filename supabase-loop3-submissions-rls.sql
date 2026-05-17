-- Loop 3/4 RLS patch for assignment submissions.
-- Run this in Supabase SQL Editor.

alter table public.submissions enable row level security;

drop policy if exists "Students can create own submissions" on public.submissions;
drop policy if exists "Students can read own submissions" on public.submissions;
drop policy if exists "Admins can read all submissions" on public.submissions;
drop policy if exists "Admins can review submissions" on public.submissions;

create policy "Students can create own submissions"
on public.submissions
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Students can read own submissions"
on public.submissions
for select
to authenticated
using (user_id = auth.uid());

create policy "Admins can read all submissions"
on public.submissions
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Admins can review submissions"
on public.submissions
for update
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

-- Needed if the storage upload itself fails with an RLS message.
-- The app stores files at: {userId}/{courseId}/{sessionId}/{timestamp}-{fileName}
drop policy if exists "Students can upload own submission files" on storage.objects;
drop policy if exists "Students can read own submission files" on storage.objects;

create policy "Students can upload own submission files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'submissions'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Students can read own submission files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'submissions'
  and (storage.foldername(name))[1] = auth.uid()::text
);
