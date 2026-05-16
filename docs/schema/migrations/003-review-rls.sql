-- Loop 4 RLS/realtime patch for admin reviews and student feedback updates.
-- Run this in Supabase SQL Editor after the Loop 3 submissions RLS patch.

alter table public.notifications enable row level security;

insert into storage.buckets (id, name, "public")
values ('feedback-audio', 'feedback-audio', false)
on conflict (id) do nothing;

drop policy if exists "Students can read own notifications" on public.notifications;
drop policy if exists "Students can mark own notifications read" on public.notifications;
drop policy if exists "Admins can create feedback notifications" on public.notifications;
drop policy if exists "Admins can replace feedback notifications" on public.notifications;
drop policy if exists "Admins can upload feedback audio" on storage.objects;
drop policy if exists "Admins can read feedback audio" on storage.objects;
drop policy if exists "Admins can delete feedback audio" on storage.objects;

create policy "Students can read own notifications"
on public.notifications
for select
to authenticated
using (user_id = auth.uid());

create policy "Students can mark own notifications read"
on public.notifications
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Admins can create feedback notifications"
on public.notifications
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Admins can replace feedback notifications"
on public.notifications
for delete
to authenticated
using (
  type = 'feedback'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Admins can upload feedback audio"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'feedback-audio'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Admins can read feedback audio"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'feedback-audio'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Admins can delete feedback audio"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'feedback-audio'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- Realtime note:
-- In Supabase Dashboard, go to Database > Replication and enable realtime
-- for public.submissions and public.notifications.
