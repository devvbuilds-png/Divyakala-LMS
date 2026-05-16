# Admin Flow

## Working Admin Areas

1. Admin signs in at `/admin/auth`.
2. Dashboard summarizes the current demo loops.
3. Courses lets admin create and edit recorded or long-course shells. The course editor includes `course_type` (`short` / `long`).
4. Term Groups lets admin manage long-course intakes:
   - Open `/admin/term-groups`.
   - Create a term group by choosing a long course, naming the intake, and setting a start date.
   - Open a term group to see its long course, start date, status, and batches.
   - Create batches with name, schedule note, and seats.
   - Batch cards show status, seats, and enrolled student count.
   - Open a batch to manage the shared syllabus modules and this batch's live sessions.
   - Add shared modules to `term_modules`.
   - Add live sessions under each module for the current batch; sessions store title, scheduled date/time, Zoom link, and status.
   - Use the Zoom link for the actual live class. A separate recording URL is added after class in Step 6.
   - `Recorded` means recording available. Past classes without recordings are concluded. `Live` is derived from today's scheduled class, not a durable manual status.
   - Paste a recording URL into a session after the class. The session becomes recorded and later student playback uses that URL.
   - Enroll students into a batch from existing non-admin profiles. If a student is already in another batch, admin is warned and can move them. Removing a student deletes only the batch enrollment.
5. Assignments lets admin review student submissions and leave feedback.
6. Students opens the Student CRM:
   - See all non-admin profiles in a compact CRM table.
   - Search by name/email and filter by admission status.
   - Review phone, location/country, age group, admission status, fee status, and long-course batch placement.
   - See latest CRM activity, including long-course interest or short-course enrollment notes captured from student course actions.
   - Batch placement is read from `batch_enrollments -> batches -> term_groups` and displayed as `Batch A — October 2024`.
   - Click a student row to open the detail drawer.
   - Student-filled fields are read-only: name, email, phone, country, age group, artist background, why Shilpa Shastra, and portfolio URL.
   - Admin can edit and save `admission_status`, `fee_status`, `currency`, and `payment_notes` back to `profiles`.

## Correct Long-Course Model

Long-course modules are shared syllabus chapters at the term-group level (`term_modules`). Batch sessions are the actual live classes and should be created per batch in `batch_sessions` with `batch_id` and `term_module_id`.

The `/admin/batches/:batchId` route now supports module/session scheduling, student enrollment management, and recording URL entry.
