alter table public.courses
  add column if not exists course_structure_summary text,
  add column if not exists how_learning_works text,
  add column if not exists timeline_commitment text,
  add column if not exists instructor_title text,
  add column if not exists instructor_bio text;
