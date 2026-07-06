-- BOOTCAMPS & REGISTRATIONS
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.bootcamps (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    event_type TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    cover_image_url TEXT,
    category TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    platform TEXT NOT NULL,
    meeting_link TEXT,
    price_inr INTEGER NOT NULL DEFAULT 0,
    price_usd INTEGER NOT NULL DEFAULT 0,
    early_bird_inr INTEGER,
    early_bird_usd INTEGER,
    early_bird_deadline TIMESTAMP WITH TIME ZONE,
    is_free BOOLEAN NOT NULL DEFAULT false,
    total_seats INTEGER NOT NULL DEFAULT 50,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT false,
    co_host_name TEXT,
    co_host_email TEXT,
    revenue_split_percent INTEGER NOT NULL DEFAULT 0,
    what_is_included JSONB,
    who_is_it_for TEXT,
    learning_outcomes JSONB,
    agenda TEXT,
    faqs JSONB,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.bootcamp_registrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    bootcamp_id TEXT NOT NULL REFERENCES public.bootcamps(id) ON DELETE CASCADE,
    parent_name TEXT NOT NULL,
    child_name TEXT,
    child_age INTEGER,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT,
    reason_for_joining TEXT,
    currency TEXT NOT NULL DEFAULT 'INR',
    amount_paid INTEGER NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'PENDING',
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT UNIQUE,
    webhook_verified BOOLEAN NOT NULL DEFAULT false,
    is_waitlisted BOOLEAN NOT NULL DEFAULT false,
    attended BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.bootcamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bootcamp_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published bootcamps
CREATE POLICY "Allow public read access to published bootcamps" 
ON public.bootcamps FOR SELECT 
USING (is_published = true AND deleted_at IS NULL);

-- Allow public insert to registrations (via API)
-- Note: In this project, the Next.js API routes use the Service Role key to bypass RLS,
-- but we create basic policies just in case.
CREATE POLICY "Allow public inserts to bootcamp registrations" 
ON public.bootcamp_registrations FOR INSERT 
WITH CHECK (true);
