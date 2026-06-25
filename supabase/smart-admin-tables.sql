-- ══════════════════════════════════════════════════════════
-- Run this SQL in Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════

-- 1. LEADS table
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  email text,
  source text not null default 'website',
  service_interest text,
  message text,
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. DOCTOR AVAILABILITY table (single row)
create table if not exists doctor_availability (
  id uuid primary key default gen_random_uuid(),
  working_days integer[] not null default '{1,2,3,4,5,6}',
  start_time text not null default '10:00',
  end_time text not null default '19:00',
  break_start text,
  break_end text,
  session_duration_mins integer not null default 45,
  buffer_mins integer not null default 10,
  updated_at timestamptz not null default now()
);

-- 3. BLOCKED DATES table
create table if not exists blocked_dates (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  reason text,
  created_at timestamptz not null default now()
);

-- 4. Add zoom_link + source to bookings if not already there
alter table bookings add column if not exists zoom_link text;
alter table bookings add column if not exists source text default 'website';
alter table bookings add column if not exists whatsapp_sent boolean default false;
alter table bookings add column if not exists reminder_sent boolean default false;

-- 5. Insert default availability (Dr. Prasoon's schedule)
insert into doctor_availability
  (working_days, start_time, end_time, break_start, break_end, session_duration_mins, buffer_mins)
values
  ('{1,2,3,4,5,6}', '10:00', '19:00', '13:00', '14:00', 45, 10)
on conflict do nothing;

-- 6. RLS — disable for service role (already handled by our server client)
alter table leads disable row level security;
alter table doctor_availability disable row level security;
alter table blocked_dates disable row level security;
