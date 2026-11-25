-- PRODUCTION STARTER SCHEMA ONLY.
-- Review and adapt security policies with a qualified developer before storing patient data.
create extension if not exists pgcrypto;

create table if not exists public.lab_tests (
  id text primary key,
  name text not null,
  category text not null,
  price_paise integer not null check (price_paise >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,
  patient_name text not null,
  patient_phone text not null,
  patient_email text,
  patient_age smallint,
  patient_gender text,
  visit_type text not null check (visit_type in ('Lab visit','Home collection')),
  address text,
  appointment_date date not null,
  slot_label text not null,
  payment_method text not null,
  payment_status text not null default 'Pending',
  booking_status text not null default 'Requested',
  total_paise integer not null check (total_paise >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.appointment_tests (
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  test_id text not null references public.lab_tests(id),
  test_name_snapshot text not null,
  price_paise_snapshot integer not null,
  primary key (appointment_id, test_id)
);

create table if not exists public.lab_reports (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  storage_object_path text not null,
  published_at timestamptz,
  uploaded_at timestamptz not null default now()
);

-- IMPORTANT:
-- Do not enable anonymous INSERT/SELECT access to patient tables without a
-- carefully designed server-side validation and abuse-prevention strategy.
-- Keep report files in a private storage bucket. Generate short-lived signed
-- URLs only after verifying the patient's identity.
-- Enforce slot uniqueness using a separate slot inventory table and a
-- transaction/locking function. A simple unique constraint on date + label
-- would incorrectly limit the entire lab to one appointment per time slot.
