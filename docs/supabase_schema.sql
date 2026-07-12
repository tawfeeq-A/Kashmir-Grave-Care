-- =========================================================================
-- GRAVE CARE KASHMIR - COMPLETE SUPABASE SQL SCHEMA AND SEED SCRIPT
-- =========================================================================

-- Enable pgcrypto for password/PIN hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main' CHECK (id = 'main'),
    brand_name TEXT NOT NULL DEFAULT 'Grave Care Kashmir',
    whatsapp_number TEXT NOT NULL DEFAULT '917006830501',
    whatsapp_message TEXT DEFAULT '',
    instagram_profile_url TEXT DEFAULT '',
    facebook_profile_url TEXT DEFAULT '',
    hero_title TEXT NOT NULL DEFAULT 'Your Family''s Resting Place, Maintained with Dignity.',
    hero_subtitle TEXT NOT NULL DEFAULT 'We clean, align, and restore graves for families who want to keep resting places in proper condition. Our work spans across Srinagar and local qabristans.',
    cta_title TEXT NOT NULL DEFAULT 'Let us care for their resting place.',
    cta_text TEXT NOT NULL DEFAULT 'Send us a message. We will listen to your wishes and carefully coordinate every detail to bring you comfort.',
    content_json JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. WORK GALLERY MEDIA TABLE
CREATE TABLE IF NOT EXISTS work_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_url TEXT NOT NULL,
    storage_path TEXT,
    file_type TEXT NOT NULL DEFAULT 'image',
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CONTACT SUBMISSIONS TABLE (LEADS)
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package TEXT,
    frequency TEXT,
    deceased_name TEXT NOT NULL,
    deceased_year TEXT,
    cemetery TEXT,
    landmarks TEXT,
    applicant_name TEXT NOT NULL,
    relationship TEXT,
    email TEXT,
    phone TEXT,
    country TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. NEWSLETTER SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RECOVERY PINS TABLE
CREATE TABLE IF NOT EXISTS recovery_pins (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    pin_hash TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

-- ---------- 1. Enable RLS on every table ----------
alter table public.site_settings            enable row level security;
alter table public.work_media               enable row level security;
alter table public.contact_submissions      enable row level security;
alter table public.newsletter_subscriptions enable row level security;
alter table public.recovery_pins            enable row level security;

-- ---------- 2. site_settings ----------
-- Public can read the single settings row; only authenticated admins can change it.
drop policy if exists "site_settings public read"  on public.site_settings;
drop policy if exists "site_settings admin write"  on public.site_settings;

create policy "site_settings public read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "site_settings admin write"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

-- ---------- 3. work_media ----------
-- Public can read gallery media; only admins can insert/update/delete.
drop policy if exists "work_media public read" on public.work_media;
drop policy if exists "work_media admin write" on public.work_media;

create policy "work_media public read"
  on public.work_media for select
  to anon, authenticated
  using (true);

create policy "work_media admin write"
  on public.work_media for all
  to authenticated
  using (true)
  with check (true);

-- ---------- 4. contact_submissions ----------
-- Public can submit the booking form (INSERT only).
-- Only authenticated admins can read submissions. No public SELECT/UPDATE/DELETE.
drop policy if exists "contact insert anon"  on public.contact_submissions;
drop policy if exists "contact read admin"   on public.contact_submissions;

create policy "contact insert anon"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

create policy "contact read admin"
  on public.contact_submissions for select
  to authenticated
  using (true);

-- ---------- 5. newsletter_subscriptions ----------
-- Public can subscribe (INSERT only). Only admins can read the list.
drop policy if exists "newsletter insert anon" on public.newsletter_subscriptions;
drop policy if exists "newsletter read admin"  on public.newsletter_subscriptions;

create policy "newsletter insert anon"
  on public.newsletter_subscriptions for insert
  to anon, authenticated
  with check (true);

create policy "newsletter read admin"
  on public.newsletter_subscriptions for select
  to authenticated
  using (true);


-- =========================================================================
-- DATABASE FUNCTIONS / RPC
-- =========================================================================

CREATE OR REPLACE FUNCTION verify_recovery_pin(pin TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
DECLARE
  is_valid BOOLEAN;
BEGIN
  SELECT (pin_hash = crypt(pin, pin_hash) OR pin_hash = pin) INTO is_valid
  FROM recovery_pins
  WHERE id = 1;
  RETURN COALESCE(is_valid, FALSE);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_recovery_pin(old_pin TEXT, new_pin TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
DECLARE
  pin_valid BOOLEAN;
BEGIN
  SELECT verify_recovery_pin(old_pin) INTO pin_valid;
  IF NOT pin_valid THEN
    RETURN FALSE;
  END IF;
  UPDATE recovery_pins
  SET pin_hash = crypt(new_pin, gen_salt('bf')),
      updated_at = NOW()
  WHERE id = 1;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =========================================================================
-- SEED DATA INITIALIZATION
-- =========================================================================

INSERT INTO site_settings (id, brand_name, whatsapp_number, hero_title, hero_subtitle, cta_title, cta_text, content_json)
VALUES (
  'main',
  'Grave Care Kashmir',
  '917006830501',
  'Your family''s resting place. Kept clean and cared for.',
  'Our team cleans, aligns, and restores graves for families who cannot always visit. Local workers do every job by hand, with respect. Message us on WhatsApp to begin.',
  'Our local team restores graves. Message us to start.',
  'Send a WhatsApp message. Our local team confirms every detail by call before work starts.',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed default Recovery PIN (change '1234' immediately after first run)
INSERT INTO recovery_pins (id, pin_hash)
VALUES (1, crypt('1234', gen_salt('bf')))
ON CONFLICT (id) DO NOTHING;
