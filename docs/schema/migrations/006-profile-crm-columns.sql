-- Student onboarding and CRM columns for the Sunday demo.
-- Run this in Supabase SQL Editor.

alter table public.profiles
add column if not exists age_group text,
add column if not exists artist_background text,
add column if not exists why_shilpa_shastra text,
add column if not exists portfolio_url text,
add column if not exists admission_status text default 'prospect',
add column if not exists fee_status text default 'pending',
add column if not exists currency text,
add column if not exists payment_notes text;
