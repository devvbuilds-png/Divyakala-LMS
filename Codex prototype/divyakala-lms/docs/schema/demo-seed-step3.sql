-- Sunday demo seed for short courses, one long course, batches, modules, sessions, and CRM rows.
-- Run this in Supabase SQL Editor after migrations 005 and 006.
-- This script intentionally keeps real courses and removes only prior seed rows that it owns.

do $$
declare
  v_instructor_id uuid;
  v_srinivasa_id uuid;
  v_ganesha_id uuid;
  v_talamana_id uuid;
  v_vishnu_id uuid;
  v_long_course_id uuid;
  v_term_group_id uuid;
  v_batch_a_id uuid;
  v_batch_b_id uuid;
  v_module_id uuid;
  v_demo_student_id uuid;
  v_demo_day timestamptz := '2026-05-17 07:00:00+05:30';
  v_short_session_id uuid;
begin
  select id, instructor_id
  into v_srinivasa_id, v_instructor_id
  from public.courses
  where title = 'Drawing Divine Forms — Srinivasa'
  limit 1;

  if v_instructor_id is null then
    select id into v_instructor_id
    from public.profiles
    where role = 'admin'
    limit 1;
  end if;

  update public.courses
  set
    course_type = 'short',
    status = 'published',
    duration_label = coalesce(duration_label, '6 sessions · ~5 hours'),
    session_count = coalesce(session_count, 6),
    level = coalesce(level, 'Beginner'),
    thumbnail_url = coalesce(thumbnail_url, '/art/AhobhilaDarshan_Blk_18x24_Light_Fin-3.webp')
  where id = v_srinivasa_id;

  update public.sessions
  set video_url = case position
    when 1 then 'https://www.youtube.com/watch?v=v9eoeYgDVQ0'
    when 2 then 'https://www.youtube.com/watch?v=X_6MtUFW8cA'
    when 3 then 'https://www.youtube.com/watch?v=8zLqV0XW8Dk'
    when 4 then 'https://www.youtube.com/watch?v=DA6MKbQH8Zc'
    when 5 then 'https://www.youtube.com/watch?v=9No-FiEInLA'
    when 6 then 'https://www.youtube.com/watch?v=xR2nLkK4ZzE'
    else video_url
  end
  where course_id = v_srinivasa_id;

  select id into v_ganesha_id
  from public.courses
  where title in ('Drawing Divine Forms — Ganesha', 'Ganesha')
  order by case when title = 'Drawing Divine Forms — Ganesha' then 0 else 1 end
  limit 1;

  if v_ganesha_id is null then
    insert into public.courses (
      title, instructor_id, price, currency, duration_label, session_count, level, status,
      thumbnail_url, description, course_type, certificate_enabled
    )
    values (
      'Drawing Divine Forms — Ganesha', v_instructor_id, 150000, 'INR', '3 sessions', 3,
      'Foundations', 'published', '/art/Ganesha.webp',
      'A compact study of Ganesha iconography, sacred proportion, and the gentle discipline of beginning from the central axis.',
      'short', true
    )
    returning id into v_ganesha_id;
  else
    update public.courses
    set
      title = 'Drawing Divine Forms — Ganesha',
      instructor_id = coalesce(instructor_id, v_instructor_id),
      price = 150000,
      currency = 'INR',
      duration_label = '3 sessions',
      session_count = 3,
      level = 'Foundations',
      status = 'published',
      thumbnail_url = '/art/Ganesha.webp',
      description = 'A compact study of Ganesha iconography, sacred proportion, and the gentle discipline of beginning from the central axis.',
      course_type = 'short',
      certificate_enabled = true
    where id = v_ganesha_id;
  end if;

  update public.enrollments
  set last_session_id = null
  where course_id = v_ganesha_id;

  update public.submissions
  set session_id = null
  where course_id = v_ganesha_id;

  delete from public.sessions where course_id = v_ganesha_id;
  insert into public.sessions (course_id, title, video_url, position, is_preview)
  values
    (v_ganesha_id, 'Ganesha: Axis, Gesture, and Presence', 'https://www.youtube.com/watch?v=v9eoeYgDVQ0', 1, true),
    (v_ganesha_id, 'Constructing the Head and Trunk', 'https://www.youtube.com/watch?v=X_6MtUFW8cA', 2, false),
    (v_ganesha_id, 'Ornament, Hands, and Final Refinement', 'https://www.youtube.com/watch?v=8zLqV0XW8Dk', 3, false);

  delete from public.enrollments
  where course_id in (
    select id from public.courses
    where title in ('Talamana — Sacred Proportions', 'Iconography of Vishnu Forms')
  );
  delete from public.sessions
  where course_id in (
    select id from public.courses
    where title in ('Talamana — Sacred Proportions', 'Iconography of Vishnu Forms')
  );
  delete from public.courses
  where title in ('Talamana — Sacred Proportions', 'Iconography of Vishnu Forms');

  insert into public.courses (
    title, instructor_id, price, currency, duration_label, session_count, level, status,
    thumbnail_url, description, course_type, certificate_enabled
  )
  values (
    'Talamana — Sacred Proportions', v_instructor_id, 210000, 'INR', '4 sessions', 4,
    'Intermediate', 'published', '/art/DrdhaVG_Nataraja_Pencil+on+Paper_74x55cm_2017.webp',
    'A measured introduction to tala units, grids, and the proportional discipline behind sacred Indian form.',
    'short', true
  )
  returning id into v_talamana_id;

  insert into public.sessions (course_id, title, video_url, position, is_preview)
  values
    (v_talamana_id, 'The Tala as Unit of Measure', 'https://www.youtube.com/watch?v=X_6MtUFW8cA', 1, true),
    (v_talamana_id, 'Building the Eight-Part Grid', 'https://www.youtube.com/watch?v=v9eoeYgDVQ0', 2, false),
    (v_talamana_id, 'Shoulder, Torso, and Limb Ratios', 'https://www.youtube.com/watch?v=DA6MKbQH8Zc', 3, false),
    (v_talamana_id, 'Checking Proportion with Stillness', 'https://www.youtube.com/watch?v=9No-FiEInLA', 4, false);

  insert into public.courses (
    title, instructor_id, price, currency, duration_label, session_count, level, status,
    thumbnail_url, description, course_type, certificate_enabled
  )
  values (
    'Iconography of Vishnu Forms', v_instructor_id, 240000, 'INR', '4 sessions', 4,
    'Intermediate', 'published', '/art/AhobhilaDarshan_Blk_18x24_Light_Fin-3.webp',
    'A focused recorded course on Vishnu iconography, attributes, mudras, and devotional line quality.',
    'short', true
  )
  returning id into v_vishnu_id;

  insert into public.sessions (course_id, title, video_url, position, is_preview)
  values
    (v_vishnu_id, 'Reading Vishnu Iconographic Attributes', 'https://www.youtube.com/watch?v=v9eoeYgDVQ0', 1, true),
    (v_vishnu_id, 'Conch, Chakra, Gada, and Lotus Placement', 'https://www.youtube.com/watch?v=X_6MtUFW8cA', 2, false),
    (v_vishnu_id, 'Composure in the Standing Form', 'https://www.youtube.com/watch?v=8zLqV0XW8Dk', 3, false),
    (v_vishnu_id, 'Line Refinement and Ornament Restraint', 'https://www.youtube.com/watch?v=DA6MKbQH8Zc', 4, false);

  delete from public.batch_enrollments
  where batch_id in (
    select b.id
    from public.batches b
    join public.term_groups tg on tg.id = b.term_group_id
    join public.courses c on c.id = tg.course_id
    where c.title = 'Drawing Divine Forms — The Two-Year Path'
  );
  delete from public.term_groups
  where course_id in (
    select id from public.courses where title = 'Drawing Divine Forms — The Two-Year Path'
  );

  select id into v_long_course_id
  from public.courses
  where title = 'Drawing Divine Forms — The Two-Year Path'
  limit 1;

  if v_long_course_id is null then
    insert into public.courses (
      title, instructor_id, price, currency, duration_label, session_count, level, status,
      thumbnail_url, description, course_type, certificate_enabled
    )
    values (
      'Drawing Divine Forms — The Two-Year Path', v_instructor_id, 0, 'INR',
      '2-year live cohort program', null, 'Long course', 'published',
      '/art/DVGorrick_Panchamukha+Shiva_2019.webp',
      'A live cohort path in Shilpa Shastra, taught batch-wise through modules, live classes, recordings, and guided practice.',
      'long', true
    )
    returning id into v_long_course_id;
  else
    update public.courses
    set
      instructor_id = coalesce(instructor_id, v_instructor_id),
      price = 0,
      currency = 'INR',
      duration_label = '2-year live cohort program',
      session_count = null,
      level = 'Long course',
      status = 'published',
      thumbnail_url = '/art/DVGorrick_Panchamukha+Shiva_2019.webp',
      description = 'A live cohort path in Shilpa Shastra, taught batch-wise through modules, live classes, recordings, and guided practice.',
      course_type = 'long',
      certificate_enabled = true
    where id = v_long_course_id;
  end if;

  insert into public.term_groups (course_id, name, start_date, status)
  values (v_long_course_id, 'October 2024', '2024-10-06', 'active')
  returning id into v_term_group_id;

  insert into public.batches (term_group_id, name, schedule_note, seats, status)
  values (v_term_group_id, 'Batch A', 'Fridays 7:00 AM IST', 20, 'active')
  returning id into v_batch_a_id;

  insert into public.batches (term_group_id, name, schedule_note, seats, status)
  values (v_term_group_id, 'Batch B', 'Sundays 6:00 PM IST', 20, 'active')
  returning id into v_batch_b_id;

  foreach v_module_id in array array[]::uuid[] loop
  end loop;

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_a_id, 1, 'Foundations of Sacred Geometry') returning id into v_module_id;
  insert into public.batch_sessions (module_id, title, scheduled_at, zoom_link, recording_url, status)
  values
    (v_module_id, 'Opening the Grid: Axis and Mandala', '2026-05-01 07:00:00+05:30', 'https://zoom.us/j/7100000001', 'https://www.youtube.com/watch?v=v9eoeYgDVQ0', 'recorded'),
    (v_module_id, 'Geometry of the Seated Form', '2026-05-08 07:00:00+05:30', 'https://zoom.us/j/7100000002', 'https://www.youtube.com/watch?v=X_6MtUFW8cA', 'recorded');

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_a_id, 2, 'Talamana Proportions') returning id into v_module_id;
  insert into public.batch_sessions (module_id, title, scheduled_at, zoom_link, recording_url, status)
  values
    (v_module_id, 'Eight Tala Construction Review', '2026-05-15 07:00:00+05:30', 'https://zoom.us/j/7100000003', 'https://www.youtube.com/watch?v=8zLqV0XW8Dk', 'recorded'),
    (v_module_id, 'Live Class: Shoulder Line and Torso Ratios', v_demo_day, 'https://zoom.us/j/7100000004', null, 'live');

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_a_id, 3, 'Iconography of Vishnu Forms') returning id into v_module_id;
  insert into public.batch_sessions (module_id, title, scheduled_at, zoom_link, recording_url, status)
  values
    (v_module_id, 'Attributes: Shankha and Chakra Placement', '2026-05-22 07:00:00+05:30', 'https://zoom.us/j/7100000005', null, 'upcoming');

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_a_id, 4, 'Mudra, Ornament, and Gesture') returning id into v_module_id;
  insert into public.batch_sessions (module_id, title, scheduled_at, zoom_link, recording_url, status)
  values
    (v_module_id, 'Mudra Geometry and Hand Proportions', '2026-05-29 07:00:00+05:30', 'https://zoom.us/j/7100000006', null, 'upcoming');

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_a_id, 5, 'Face, Crown, and Expression') returning id into v_module_id;
  insert into public.batch_sessions (module_id, title, scheduled_at, zoom_link, recording_url, status)
  values
    (v_module_id, 'Crown Construction and Facial Stillness', '2026-06-05 07:00:00+05:30', 'https://zoom.us/j/7100000007', null, 'upcoming');

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_a_id, 6, 'Final Drawing and Review') returning id into v_module_id;

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_b_id, 1, 'Foundations of Sacred Geometry') returning id into v_module_id;
  insert into public.batch_sessions (module_id, title, scheduled_at, zoom_link, recording_url, status)
  values
    (v_module_id, 'Opening the Grid: Axis and Mandala', '2026-05-03 18:00:00+05:30', 'https://zoom.us/j/7200000001', 'https://www.youtube.com/watch?v=v9eoeYgDVQ0', 'recorded'),
    (v_module_id, 'Geometry of the Standing Form', '2026-05-10 18:00:00+05:30', 'https://zoom.us/j/7200000002', 'https://www.youtube.com/watch?v=X_6MtUFW8cA', 'recorded');

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_b_id, 2, 'Talamana Proportions') returning id into v_module_id;
  insert into public.batch_sessions (module_id, title, scheduled_at, zoom_link, recording_url, status)
  values
    (v_module_id, 'Live Class: Eight Tala Construction Review', v_demo_day + interval '11 hours', 'https://zoom.us/j/7200000003', null, 'live');

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_b_id, 3, 'Iconography of Vishnu Forms') returning id into v_module_id;
  insert into public.batch_sessions (module_id, title, scheduled_at, zoom_link, recording_url, status)
  values
    (v_module_id, 'Attributes: Shankha and Chakra Placement', '2026-05-24 18:00:00+05:30', 'https://zoom.us/j/7200000004', null, 'upcoming');

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_b_id, 4, 'Mudra, Ornament, and Gesture') returning id into v_module_id;
  insert into public.batch_sessions (module_id, title, scheduled_at, zoom_link, recording_url, status)
  values
    (v_module_id, 'Mudra Geometry and Hand Proportions', '2026-05-31 18:00:00+05:30', 'https://zoom.us/j/7200000005', null, 'upcoming');

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_b_id, 5, 'Face, Crown, and Expression') returning id into v_module_id;
  insert into public.batch_sessions (module_id, title, scheduled_at, zoom_link, recording_url, status)
  values
    (v_module_id, 'Crown Construction and Facial Stillness', '2026-06-07 18:00:00+05:30', 'https://zoom.us/j/7200000006', null, 'upcoming');

  insert into public.batch_modules (batch_id, module_number, title)
  values (v_batch_b_id, 6, 'Final Drawing and Review') returning id into v_module_id;

  create temporary table if not exists step3_demo_student_seed (
    ord int,
    full_name text,
    country text,
    phone text,
    age_group text,
    artist_background text,
    why_shilpa_shastra text,
    portfolio_url text,
    admission_status text,
    fee_status text,
    currency text,
    payment_notes text
  ) on commit drop;

  truncate table step3_demo_student_seed;
  insert into step3_demo_student_seed values
    (1, 'Ananya Rao', 'India', '+91 98765 43001', '19–30', 'Fine arts graduate with a daily graphite practice.', 'I want to understand sacred form through discipline rather than copying images.', 'https://portfolio.example/ananya', 'enrolled', 'paid', 'INR', 'Paid first term by UPI.'),
    (2, 'Mira Krishnan', 'India', '+91 98765 43002', 'Above 30', 'Temple mural enthusiast returning to drawing after many years.', 'The devotional grammar of icons feels like the missing structure in my practice.', 'https://portfolio.example/mira', 'enrolled', 'pending', 'INR', 'Invoice sent for October term.'),
    (3, 'Arjun Mehta', 'India', '+91 98765 43003', '19–30', 'Self-taught illustrator interested in classical Indian visual systems.', 'I want to move from stylized deity art toward canonical proportion.', null, 'prospect', 'pending', 'INR', 'Discovery call completed.'),
    (4, 'Leela Iyer', 'United States', '+1 415 555 0104', 'Above 30', 'Yoga teacher who sketches altar images for personal practice.', 'Shilpa Shastra connects my practice of drawing with worship and attention.', 'https://portfolio.example/leela', 'enrolled', 'paid', 'USD', 'Paid international term fee by Stripe.'),
    (5, 'Kabir Sen', 'India', '+91 98765 43005', 'Under 19', 'Young student with strong pencil fundamentals.', 'I want to learn the traditional way before developing my own style.', null, 'prospect', 'pending', 'INR', 'Parent requested weekend batch.'),
    (6, 'Nandini Sharma', 'Canada', '+1 604 555 0106', '19–30', 'Digital artist learning hand-drawn sacred construction.', 'The measured approach feels grounding and spiritually serious.', 'https://portfolio.example/nandini', 'enrolled', 'pending', 'USD', 'Will pay before next module.'),
    (7, 'Rohan Kulkarni', 'India', '+91 98765 43007', 'Above 30', 'Architect with interest in temple proportion and vastu drawings.', 'I want to study how sacred measurement becomes visible form.', null, 'discontinued', 'pending', 'INR', 'Paused after orientation; may join later intake.'),
    (8, 'Sofia Narayanan', 'United Kingdom', '+44 20 5555 0108', '19–30', 'Watercolor artist studying devotional line work.', 'I want a patient foundation for drawing deities respectfully.', 'https://portfolio.example/sofia', 'enrolled', 'paid', 'USD', 'Paid full first module.');

  create temporary table if not exists step3_available_students (
    ord int,
    id uuid,
    email text
  ) on commit drop;

  truncate table step3_available_students;
  insert into step3_available_students (ord, id, email)
  select
    row_number() over (order by u.created_at asc) as ord,
    u.id,
    u.email
  from auth.users u
  left join public.profiles p on p.id = u.id
  where coalesce(p.role, 'student') <> 'admin'
  order by u.created_at asc
  limit 8;

  insert into public.profiles (
    id, email, name, role, country, phone, age_group, artist_background,
    why_shilpa_shastra, portfolio_url, admission_status, fee_status, currency, payment_notes
  )
  select
    s.id,
    coalesce(s.email, lower(replace(seed.full_name, ' ', '.')) || '@example.com'),
    seed.full_name,
    'student',
    seed.country,
    seed.phone,
    seed.age_group,
    seed.artist_background,
    seed.why_shilpa_shastra,
    seed.portfolio_url,
    seed.admission_status,
    seed.fee_status,
    seed.currency,
    seed.payment_notes
  from step3_available_students s
  join step3_demo_student_seed seed on seed.ord = s.ord
  on conflict (id) do update
  set
    email = excluded.email,
    name = excluded.name,
    role = excluded.role,
    country = excluded.country,
    phone = excluded.phone,
    age_group = excluded.age_group,
    artist_background = excluded.artist_background,
    why_shilpa_shastra = excluded.why_shilpa_shastra,
    portfolio_url = excluded.portfolio_url,
    admission_status = excluded.admission_status,
    fee_status = excluded.fee_status,
    currency = excluded.currency,
    payment_notes = excluded.payment_notes;

  delete from public.batch_enrollments
  where student_id in (select id from step3_available_students);

  insert into public.batch_enrollments (batch_id, student_id)
  select
    case when ord in (1, 2, 3, 4) then v_batch_a_id else v_batch_b_id end,
    id
  from step3_available_students
  on conflict (batch_id, student_id) do nothing;

  select id into v_demo_student_id
  from step3_available_students
  order by ord
  limit 1;

  if v_demo_student_id is not null then
    select id into v_short_session_id
    from public.sessions
    where course_id = v_srinivasa_id
    order by position
    offset 1
    limit 1;

    delete from public.enrollments
    where user_id = v_demo_student_id
      and course_id in (v_srinivasa_id, v_ganesha_id, v_talamana_id, v_vishnu_id);

    insert into public.enrollments (user_id, course_id, progress, last_session_id, status)
    values (v_demo_student_id, v_srinivasa_id, 33, v_short_session_id, 'active');
  end if;
end $$;

select
  'Step 3 seed summary' as label,
  (select count(*) from public.courses where course_type = 'short' and status = 'published') as published_short_courses,
  (select count(*) from public.courses where course_type = 'long') as long_courses,
  (select count(*) from public.term_groups tg join public.courses c on c.id = tg.course_id where c.title = 'Drawing Divine Forms — The Two-Year Path') as term_groups,
  (select count(*) from public.batches b join public.term_groups tg on tg.id = b.term_group_id join public.courses c on c.id = tg.course_id where c.title = 'Drawing Divine Forms — The Two-Year Path') as batches,
  (select count(*) from public.batch_modules bm join public.batches b on b.id = bm.batch_id join public.term_groups tg on tg.id = b.term_group_id join public.courses c on c.id = tg.course_id where c.title = 'Drawing Divine Forms — The Two-Year Path') as batch_modules,
  (select count(*) from public.batch_sessions bs join public.batch_modules bm on bm.id = bs.module_id join public.batches b on b.id = bm.batch_id join public.term_groups tg on tg.id = b.term_group_id join public.courses c on c.id = tg.course_id where c.title = 'Drawing Divine Forms — The Two-Year Path') as batch_sessions,
  (select count(*) from public.batch_enrollments be join public.batches b on b.id = be.batch_id join public.term_groups tg on tg.id = b.term_group_id join public.courses c on c.id = tg.course_id where c.title = 'Drawing Divine Forms — The Two-Year Path') as batch_enrollments,
  'Live sessions seeded for 2026-05-17 IST' as live_demo_date_note;
