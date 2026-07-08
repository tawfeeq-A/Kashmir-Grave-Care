-- ============================================================
--  Grave Care Kashmir — Supabase Row Level Security (RLS)
-- ============================================================
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor).
--  It locks down the public anon key so anonymous visitors can
--  ONLY do what the site needs, and nothing more.
--
--  Model:
--   - site_settings / work_media : anon can READ, only admins can WRITE
--   - contact_submissions        : anon can INSERT (submit form), CANNOT read
--   - newsletter_subscriptions   : anon can INSERT (subscribe), CANNOT read
--   - Reads of submissions/subscribers require an authenticated admin.
--
--  "authenticated" = a user logged in via Supabase Auth (the admin
--  panel email/password login). Anonymous visitors are "anon".
-- ============================================================

-- ---------- 1. Enable RLS on every table ----------
alter table public.site_settings            enable row level security;
alter table public.work_media               enable row level security;
alter table public.contact_submissions      enable row level security;
alter table public.newsletter_subscriptions enable row level security;

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

-- ============================================================
--  OPTIONAL HARDENING (recommended)
-- ============================================================
-- Prevent duplicate newsletter signups (also stops trivial spam floods
-- of the same address). Adjust the column name if yours differs.
-- create unique index if not exists newsletter_email_unique
--   on public.newsletter_subscriptions (lower(email));

-- The Recovery-PIN RPC functions (verify_recovery_pin / update_recovery_pin)
-- should be SECURITY DEFINER and must NOT expose the stored PIN. Verify they
-- only return a boolean. Never store the PIN in a table readable by anon.

-- ============================================================
--  HOW TO VERIFY
-- ============================================================
--  1. In the SQL editor run:  select * from contact_submissions;
--     as the anon role it should return zero rows / permission denied.
--  2. From the live site, submit the contact form — it should still succeed.
--  3. Log into the admin panel (email/password) and confirm you can read data.
