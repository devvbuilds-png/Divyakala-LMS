# Student Flow

## Working Student Areas

1. Student signs up or signs in with Supabase email OTP at `/auth/sign-up` or `/auth/sign-in`.
2. Signup captures first name, last name, country, and phone into `profiles`.
3. New or incomplete student profiles are routed to `/onboarding` before My Learning:
   - Age group is required: Under 19 / 19–30 / Above 30.
   - Artist background and experience is required.
   - Why Shilpa Shastra is required.
   - Portfolio link is optional.
   - Country and phone are only shown if missing from the profile.
4. Finishing onboarding upserts the profile fields and routes to `/learning`.
5. New students remain `admission_status = prospect` and are not auto-enrolled into a course or batch.
6. Short-course enrollment creates a row in `enrollments`, marks the CRM profile as enrolled, and appears in My Courses.
7. Long-course course pages use `Request Batch Placement` instead of short-course enrollment:
   - The request updates the student CRM notes.
   - The student remains a prospect until admin places them into a batch.
   - No row is created in the legacy short-course `enrollments` table.
8. Admin places students into long-course batches from the admin batch detail screen.
9. Existing students with complete onboarding details skip `/onboarding` and land directly in My Learning.
10. My Learning has two pill tabs:
   - `My Program` shows the student's long-course batch placement.
   - `My Courses` shows the existing short-course enrollment list.
   - If the student has a batch enrollment, `My Program` is selected by default; otherwise `My Courses` is selected.
11. Continue Learning appears above the tab content and is cross-track:
   - Long-course card shows the student's batch and next upcoming or most recent live session.
   - Short-course card uses the existing short-course resume point.
   - If neither track has anything active, students see a warm empty state with a Browse Courses CTA.
12. Batch Dashboard at `/program/batches/:batchId`:
   - Opens only for students with a matching `batch_enrollments` row.
   - Shows course, term group, batch, schedule note, module count, session count, recording count, and next class.
   - Lists shared `term_modules` with this batch's `batch_sessions`.
   - Shows derived session status: upcoming, live, concluded, or recorded.
   - Shows Zoom links for upcoming/live sessions when `zoom_link` exists.
   - Shows recording links when `recording_url` exists.

## Demo Story

Signup fills the Student CRM. The admin then reviews the profile, confirms admission and fee status, and places the student into the correct long-course batch. Once placed, the student's My Program tab becomes the doorway into the long-course batch dashboard, where live sessions and recordings appear.
