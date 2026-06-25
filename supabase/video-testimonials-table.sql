-- ── Video Testimonials Table ─────────────────────────────────────────────────
-- Run this in Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS video_testimonials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name   TEXT NOT NULL,
  child_age     TEXT,
  location      TEXT,
  caption       TEXT,
  video_url     TEXT NOT NULL,
  thumbnail_url TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast public fetch
CREATE INDEX IF NOT EXISTS idx_video_testimonials_active
  ON video_testimonials (is_active, sort_order);

-- Row Level Security (same pattern as other tables)
ALTER TABLE video_testimonials ENABLE ROW LEVEL SECURITY;

-- Public can read active testimonials
CREATE POLICY "Public read active testimonials"
  ON video_testimonials FOR SELECT
  USING (is_active = true);

-- Service role (admin) can do everything
CREATE POLICY "Admin full access testimonials"
  ON video_testimonials FOR ALL
  USING (true)
  WITH CHECK (true);
