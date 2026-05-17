alter table enrollments
  add column if not exists cohort_name text,
  add column if not exists batch_name text,
  add column if not exists requested_at timestamptz default now(),
  add column if not exists decision_at timestamptz;

create index if not exists enrollments_course_status_idx
  on enrollments(course_id, status);

create table if not exists long_course_cohorts (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  name text not null,
  starts_label text,
  created_at timestamptz default now(),
  unique(course_id, name)
);

create index if not exists long_course_cohorts_course_id_idx
  on long_course_cohorts(course_id);
