-- Correct long-course module modeling.
-- Modules are shared syllabus chapters for a term group; sessions are per-batch classes.
-- Run this in Supabase SQL Editor after the Step 3 seed.

create table if not exists public.term_modules (
  id uuid primary key default gen_random_uuid(),
  term_group_id uuid references public.term_groups(id) on delete cascade,
  module_number int not null,
  title text not null,
  created_at timestamptz default now(),
  unique (term_group_id, module_number)
);

alter table public.batch_sessions
add column if not exists batch_id uuid references public.batches(id) on delete cascade,
add column if not exists term_module_id uuid references public.term_modules(id) on delete cascade;

alter table public.term_modules enable row level security;

drop policy if exists "Authenticated users can read term modules" on public.term_modules;
drop policy if exists "Admins can manage term modules" on public.term_modules;

create policy "Authenticated users can read term modules"
on public.term_modules
for select
to authenticated
using (true);

create policy "Admins can manage term modules"
on public.term_modules
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

insert into public.term_modules (term_group_id, module_number, title)
select distinct on (b.term_group_id, bm.module_number)
  b.term_group_id,
  bm.module_number,
  bm.title
from public.batch_modules bm
join public.batches b on b.id = bm.batch_id
order by b.term_group_id, bm.module_number, bm.created_at
on conflict (term_group_id, module_number) do update
set title = excluded.title;

update public.batch_sessions bs
set
  batch_id = bm.batch_id,
  term_module_id = tm.id
from public.batch_modules bm
join public.batches b on b.id = bm.batch_id
join public.term_modules tm
  on tm.term_group_id = b.term_group_id
 and tm.module_number = bm.module_number
where bs.module_id = bm.id;

select
  'Shared module correction summary' as label,
  (select count(*) from public.term_modules) as shared_term_modules,
  (select count(*) from public.batch_modules) as legacy_batch_modules,
  (select count(*) from public.batch_sessions where batch_id is not null and term_module_id is not null) as linked_batch_sessions;
