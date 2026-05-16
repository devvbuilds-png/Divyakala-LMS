-- Fallback patch if the main Loop 4 SQL already mostly ran.
-- This only adds the delete policies needed for replacing old review notifications/audio.

drop policy if exists "Admins can replace feedback notifications" on public.notifications;
drop policy if exists "Admins can delete feedback audio" on storage.objects;

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
