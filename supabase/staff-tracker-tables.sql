-- ══════════════════════════════════════════════════════════
-- Staff Activity Tracker — Franchise-Ready Tables
-- Run this in Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════

-- 1. BRANCHES (clinic locations — franchise-ready)
create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null default 'Katni',
  address text,
  phone text,
  manager_id uuid references users(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Add branch_id to users (which branch each staff belongs to)
alter table users add column if not exists branch_id uuid references branches(id) on delete set null;
alter table users add column if not exists employee_id text;
alter table users add column if not exists designation text;  -- "Occupational Therapist", "Receptionist", etc.
alter table users add column if not exists join_date date;
alter table users add column if not exists is_active boolean default true;

-- 3. STAFF ATTENDANCE (daily attendance record)
create table if not exists staff_attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  branch_id uuid references branches(id) on delete set null,
  date date not null,
  clock_in timestamptz,
  clock_out timestamptz,
  status text not null default 'absent',  -- 'present','absent','half_day','leave','holiday'
  leave_type text,                         -- 'CL','SL','PL','WO' (casual/sick/privilege/week off)
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, date)
);

-- 4. STAFF ACTIVITIES (what they did each day — the activity log)
create table if not exists staff_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  branch_id uuid references branches(id) on delete set null,
  date date not null,
  activity_type text not null default 'other',
  -- types: patient_session, parent_counselling, documentation,
  --        meeting, break, admin_work, home_visit, training,
  --        lead_followup, report, other
  patient_id uuid references patients(id) on delete set null,
  title text not null,
  duration_mins integer default 0,
  notes text,
  start_time timestamptz,
  created_at timestamptz not null default now()
);

-- 5. LEAVE REQUESTS
create table if not exists leave_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  from_date date not null,
  to_date date not null,
  leave_type text not null default 'CL',  -- CL, SL, PL, WO
  reason text,
  status text not null default 'pending',  -- pending, approved, rejected
  approved_by uuid references users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

-- 6. Seed the default branch (Katni Clinic)
insert into branches (name, city, address, phone)
values ('Katni Clinic', 'Katni', 'Sai Kripa First Floor, Garg Chowraha, Pathak Gali, Near Rama Pharma, Over Bridge Road, Katni, MP 483501', '+91 83497 64084')
on conflict do nothing;

-- 7. Disable RLS for service-role access
alter table branches disable row level security;
alter table staff_attendance disable row level security;
alter table staff_activities disable row level security;
alter table leave_requests disable row level security;
