-- Per-session reference/resource uploads for the lesson player.
-- Run this in Supabase SQL Editor before using the new session upload fields.

alter table public.sessions
add column if not exists reference_url text,
add column if not exists reference_name text,
add column if not exists resource_url text,
add column if not exists resource_name text;

insert into storage.buckets (id, name, "public")
values ('cards', 'cards', false)
on conflict (id) do nothing;

drop policy if exists "Admins can upload session assets" on storage.objects;
drop policy if exists "Authenticated can read session assets" on storage.objects;

create policy "Admins can upload session assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'cards'
  and (storage.foldername(name))[1] = 'sessions'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Authenticated can read session assets"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'cards'
  and (storage.foldername(name))[1] = 'sessions'
);
