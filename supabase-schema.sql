-- ============================================================
--  UDAAN CARE — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── USERS (doctors, admin, staff) ──
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('ADMIN','DOCTOR','PARENT')),
  phone         TEXT,
  photo         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── PATIENTS ──
CREATE TABLE IF NOT EXISTS patients (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unique_id          TEXT UNIQUE NOT NULL,
  name               TEXT NOT NULL,
  dob                DATE,
  gender             TEXT CHECK (gender IN ('M','F','Other')),
  photo              TEXT,
  diagnoses          TEXT[] DEFAULT '{}',
  guardian_name      TEXT NOT NULL,
  guardian_phone     TEXT NOT NULL,
  guardian_email     TEXT,
  guardian_pin       TEXT NOT NULL,
  assigned_doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status             TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','COMPLETED','ON_HOLD')),
  notes              TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── THERAPY SESSIONS ──
CREATE TABLE IF NOT EXISTS sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id       TEXT NOT NULL,
  date            DATE NOT NULL,
  duration_mins   INTEGER DEFAULT 45,
  type            TEXT DEFAULT 'CLINIC' CHECK (type IN ('CLINIC','ONLINE')),
  notes           TEXT,
  goals_addressed TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── THERAPY GOALS ──
CREATE TABLE IF NOT EXISTS goals (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id  UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  achieved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── BOOKINGS ──
CREATE TABLE IF NOT EXISTS bookings (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id     UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id      TEXT NOT NULL,
  datetime       TIMESTAMPTZ NOT NULL,
  type           TEXT DEFAULT 'CLINIC' CHECK (type IN ('CLINIC','ONLINE')),
  status         TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONFIRMED','COMPLETED','CANCELLED')),
  payment_status TEXT DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID','PAID')),
  amount         INTEGER DEFAULT 599,
  zoom_link      TEXT,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── BLOG POSTS ──
CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  cover_image  TEXT,
  category     TEXT DEFAULT 'Occupational Therapy',
  excerpt      TEXT,
  published    BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  author_id    TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── SITE CONTENT (CMS key-value store) ──
CREATE TABLE IF NOT EXISTS site_content (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes for performance ──
CREATE INDEX IF NOT EXISTS idx_sessions_patient   ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_goals_patient      ON goals(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_patient   ON bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_datetime  ON bookings(datetime);
CREATE INDEX IF NOT EXISTS idx_blog_slug          ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published     ON blog_posts(published);

-- ── Row Level Security (RLS) — DISABLE for service role access ──
-- Our server uses the service_role key which bypasses RLS automatically.
-- Enable these if you later add Supabase Auth for direct client access.
ALTER TABLE users        DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients     DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions     DISABLE ROW LEVEL SECURITY;
ALTER TABLE goals        DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings     DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts   DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;

-- ── Seed default admin (password: admin123) ──
-- bcrypt hash of "admin123" with salt 10
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@udaancare.in',
  '$2b$10$K7K2rj.kbdCfgDWOGfPIme5a.b1lXO4QlJOLRz8PKd0gJEJwDV9Bm',
  'Admin',
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Done! Your database is ready.
