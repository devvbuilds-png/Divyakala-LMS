alter table enrollments
  add column if not exists cohort_name text,
  add column if not exists batch_name text,
  add column if not exists requested_at timestamptz default now(),
  add column if not exists decision_at timestamptz;

create index if not exists enrollments_course_status_idx
  on enrollments(course_id, status);

