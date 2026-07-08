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

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_pins ENABLE ROW LEVEL SECURITY;

-- Site Settings Policies
DROP POLICY IF EXISTS "Allow public read on site_settings" ON site_settings;
CREATE POLICY "Allow public read on site_settings"
ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated update on site_settings" ON site_settings;
CREATE POLICY "Allow authenticated update on site_settings"
ON site_settings FOR UPDATE TO authenticated USING (true);

-- Work Media Policies
DROP POLICY IF EXISTS "Allow public read on work_media" ON work_media;
CREATE POLICY "Allow public read on work_media"
ON work_media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert on work_media" ON work_media;
CREATE POLICY "Allow authenticated insert on work_media"
ON work_media FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete on work_media" ON work_media;
CREATE POLICY "Allow authenticated delete on work_media"
ON work_media FOR DELETE TO authenticated USING (true);

-- Contact Submissions Policies
DROP POLICY IF EXISTS "Allow public insert on contact_submissions" ON contact_submissions;
CREATE POLICY "Allow public insert on contact_submissions"
ON contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read on contact_submissions" ON contact_submissions;
CREATE POLICY "Allow authenticated read on contact_submissions"
ON contact_submissions FOR SELECT TO authenticated USING (true);

-- Newsletter Policies
DROP POLICY IF EXISTS "Allow public insert on newsletter_subscriptions" ON newsletter_subscriptions;
CREATE POLICY "Allow public insert on newsletter_subscriptions"
ON newsletter_subscriptions FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read on newsletter_subscriptions" ON newsletter_subscriptions;
CREATE POLICY "Allow authenticated read on newsletter_subscriptions"
ON newsletter_subscriptions FOR SELECT TO authenticated USING (true);

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
  $tag$Your Family's Resting Place, Maintained with Dignity.$tag$,
  $tag$We clean, align, and restore graves for families who want to keep resting places in proper condition. Our work spans across Srinagar and qabristans.$tag$,
  $tag$Let us care for their resting place.$tag$,
  $tag$Send us a message. We will listen to your wishes and carefully coordinate every detail to bring you comfort.$tag$,
  $json$
  {
    "eyebrow": "Grave maintenance done with care and precision.",
    "heroWhatsappButton": "Chat on WhatsApp",
    "heroWorkButton": "See our work",
    "servicesTag": "Our services",
    "servicesHeading": "What we do.",
    "servicesSubtext": "Every job starts with a WhatsApp message. We confirm details by call before any work begins.",
    "serviceOneTitle": "Gentle Routine Care",
    "serviceOneText": "Ongoing, tender maintenance ensuring your loved one's resting place is always neat, clear of weeds, and thoughtfully preserved.",
    "serviceTwoTitle": "Complete Restoration",
    "serviceTwoText": "A respectful overhaul for weathered graves, featuring deep marble cleaning, stain removal, and re-inking of faded calligraphy.",
    "serviceThreeTitle": "Spiritual Visitations",
    "serviceThreeText": "Honoring their memory on special dates with thorough cleaning, Quran recitation by a local Qari, and live video presence.",
    "beforeAfterTag": "High Standards of Restoration",
    "beforeAfterHeading": "See the Care and Detail in Our Work",
    "beforeAfterText": "Weathering in Kashmir's winters can cause marble staining, moss growth, and name engraving decay. Our professional team performs delicate chemical-free cleaning, re-painting of Arabic and Persian calligraphies, and complete landscaping.",
    "beforeAfterBullet1": "Delicate stain removal from premium marble",
    "beforeAfterBullet2": "Weed extraction & maintaining neat local climate-ready grass",
    "beforeAfterBullet3": "Calligraphy re-inking (Gold, Black, or White paint)",
    "beforeAfterLink": "Explore pricing packages",
    "sliderBeforeLabel": "Before Care (Weathered & Overgrown)",
    "sliderAfterLabel": "After Care (Restored, Green & Clean)",
    "processTag": "Process",
    "howItWorksHeading": "Our Journey of Care",
    "howItWorksSub": "We handle every request as if we were caring for our own family.",
    "stepOneTitle": "Initial Consultation",
    "stepOneText": "Contact us via WhatsApp. Share the location and current condition of the grave.",
    "stepTwoTitle": "Assessment & Quote",
    "stepTwoText": "We visit the site, take initial photos, and provide a transparent, no-obligation quote.",
    "stepThreeTitle": "Care & Maintenance",
    "stepThreeText": "Our team performs the requested services with the utmost respect and Islamic adab.",
    "stepFourTitle": "Detailed Reporting",
    "stepFourText": "You receive high-quality before and after photos/videos of the completed work.",
    "ecoTag": "Eco-Conscious & Ethical Custodianship",
    "ecoHeading": "Our Eco-Ethical Preservation Policy",
    "ecoText1": "We believe in respecting both the memory of the deceased and the pristine environment of Kashmir. We never use harsh chemical weedkillers that harm local soils and water tables.",
    "ecoText2": "Instead, we employ local Kashmiri caretakers and gardeners, providing them with a fair, family-supporting wage. We prioritize keeping the grave clean and well-maintained while respecting the local graveyard aesthetics.",
    "ecoLearnMore": "Learn about our values",
    "ecoCard1Title": "Fair wages for caretakers",
    "ecoCard1Text": "Directly supporting Kashmiri local labor with dignified and fair compensation.",
    "ecoCard2Title": "Organic horticulture",
    "ecoCard2Text": "Using manure and organic soil enrichment, protecting local cemetery ecosystems.",
    "ecoCard3Title": "Respectful Appearance",
    "ecoCard3Text": "Maintaining clean surroundings, preserving the traditional forest cemetery appearance.",
    "ecoCard4Title": "GPS & Transparent reporting",
    "ecoCard4Text": "Every session is geo-tagged and detailed before-after photos are stored in reports.",
    "cta_button_text": "Start WhatsApp Chat",
    "ctaServicesButton": "View Services & Packages",
    "ctaFooterNote": "Dedicated customer support and photo reports with every service session",
    "aboutHeroTag": "Connecting Families",
    "aboutHeroTitle": "Our Story: Preserving Heritage & Dignity",
    "aboutHeroText1": "Our cemeteries have stood for centuries as silent sentinels of remembrance. They represent our history, our families, and our deeply held respect for those who came before us.",
    "aboutHeroText2": "Grave Care Kashmir was founded by a group of passionate locals in Srinagar who recognized a growing challenge: as more Kashmiri families moved abroad to build lives in the Gulf, North America, and Europe, their ancestral graves in Srinagar, Sopore, Anantnag, and local village graveyards became increasingly neglected due to distance.",
    "aboutHeroText3": "Our service is built to be a bridge of filial duty and love. We combine traditional respect with modern communication so that distance never weakens your connection to your ancestors.",
    "aboutHeading": "Our Story of Compassion",
    "aboutSubHeading": "Caring for those who have departed, comforting those who remain.",
    "pillar1Title": "Respect (Adab)",
    "pillar1Text": "Every action we take in the graveyard is performed with the utmost respect, following Islamic guidelines for visiting and maintaining resting places.",
    "pillar2Title": "Transparency",
    "pillar2Text": "We provide clear, honest pricing and comprehensive photo/video reports so you know exactly what care was provided.",
    "pillar3Title": "Excellence (Ihsan)",
    "pillar3Text": "From removing the smallest weeds to restoring intricate marble calligraphy, we perform our work to the highest possible standard.",
    "aboutOurStoryTag": "Heritage",
    "aboutOurStoryHeading": "Serving Across Kashmir",
    "aboutOurStoryText1": "Grave Care Kashmir began with a simple, deeply personal realization. Many families, separated by oceans and borders, carry a quiet heartache knowing they cannot regularly visit or maintain the resting places of their loved ones in Kashmir.",
    "aboutOurStoryText2": "We understand that tending to a grave is an act of profound love. When distance prevents you from being there, we step in to fulfill that duty. We treat every resting place with the utmost reverence, as if it belonged to our own family.",
    "aboutOurStoryText3": "Our mission is not just maintenance; it is providing peace of mind. We want you to feel connected, knowing that your loved one's memory is honored in a beautiful, well-cared-for space.",
    "aboutCemeteriesHeading": "Srinagar Cemeteries We Regularly Serve",
    "cemetery1Name": "Malkhah Cemetery (Rainawari / Eidgah)",
    "cemetery1Tag": "Srinagar's Largest",
    "cemetery2Name": "Hazratbal Shrine Graveyard",
    "cemetery2Tag": "Serene Lakeside",
    "cemetery3Name": "Naqshband Sahib Cemetery",
    "cemetery3Tag": "Heritage Site",
    "servicesPageTag": "Transparent Care Services",
    "servicesPageHeading": "Our Maintenance & Restoration Services",
    "servicesPageSubtext": "We offer flexible programs and specialized custom treatments to fit your family's needs. Pricing varies based on grave size, location, and condition.",
    "pkg1Name": "Gentle Routine Care",
    "pkg1Tag": "Ongoing respect & general maintenance",
    "pkg1Desc": "Ideal for maintaining neatness, keeping the grass trimmed, and routine cleanliness on a regular schedule to honor their resting place.",
    "pkg1Feature1": "Bi-monthly gentle weeding and debris sweeping",
    "pkg1Feature2": "Grass trimming to maintain neat surroundings",
    "pkg1Feature3": "Loving cleaning of the headstone",
    "pkg1Feature4": "Heartfelt before-and-after photo reports",
    "pkg1Feature5": "GPS-tagged grave location pinning",
    "pkg1Cta": "Inquire about Gentle Care",
    "pkg2Name": "Loving Restoration",
    "pkg2Tag": "Deep cleaning & engraving revival",
    "pkg2Desc": "A complete, respectful overhaul for graves that are weathered, stained, or have faded inscriptions over the years.",
    "pkg2Feature1": "All features in Gentle Routine Care",
    "pkg2Feature2": "Marble and limestone gentle washing",
    "pkg2Feature3": "Chemical-free moss & stain extraction",
    "pkg2Feature4": "Calligraphy engraving re-inking (Gold/Black)",
    "pkg2Feature5": "Careful soil leveling and structural check",
    "pkg2Feature6": "Annual structural stability inspection",
    "pkg2Cta": "Inquire about Restoration",
    "pkg3Name": "Heartfelt Visitations",
    "pkg3Tag": "Spiritual honoring & upkeep",
    "pkg3Desc": "Focused on spiritual remembrance, ensuring you can be virtually present to honor your loved one on special anniversaries.",
    "pkg3Feature1": "Thorough cleaning before significant dates",
    "pkg3Feature2": "Recitation of Holy Quran / Dua-e-Fatiha by a local Qari",
    "pkg3Feature3": "Live video link allowing you to be present during prayers",
    "pkg3Feature4": "Dedicated photo and video reports",
    "pkg3Feature5": "Providing comfort across the miles",
    "pkg3Cta": "Inquire about Visitations",
    "customReqTag": "Bespoke Requests",
    "customReqHeading": "Specialized Add-ons & Custom Care",
    "customReqDesc": "Every resting place is unique. If you have specific requirements not covered in our standard packages, we are more than happy to accommodate them.",
    "customReq1": "Specific Commemorative Arrangements",
    "customReq2": "Gravel Refilling (White marble chips or red stone gravel)",
    "customReq3": "Additional Calligraphy detailing (per inscription)",
    "customReq4": "Structural stone joint repair / Mortar patching",
    "customReq5": "Sufi Shrine Ziyarat Tribute (Prayers on their behalf at shrines)",
    "workGalleryHeading": "See Our Work",
    "workGalleryDesc": "Browse through our recent maintenance and restoration projects across Kashmir. We take pride in the visible difference our respectful care brings to these resting places.",
    "workTag": "Our work",
    "workHeading": "Browse our work on Instagram and Facebook.",
    "workSubtext": "Browse before-and-after photos of our cleaning, alignment, and restoration work. Latest jobs are shared on our social platforms.",
    "contactHeading": "Caretaker Request Portal",
    "contactSubtext": "Provide details below. Our Srinagar coordinator will inspect the grave site and prepare a visual proposal.",
    "bookingCemetery1": "Malkhah Cemetery, Srinagar",
    "bookingCemetery2": "Hazratbal Shrine Graveyard",
    "bookingCemetery3": "Sheikh-ul-Alam Cemetery, Budgam",
    "bookingCemetery4": "Naqshband Sahib Cemetery, Srinagar",
    "footerDesc": "Dignified grave maintenance for families across Srinagar and local qabristans. We support families and diaspora around the world in keeping the resting places of their loved ones clean, green, and beautifully preserved.",
    "footerCopyright": "© 2026 Grave Care Kashmir. All rights reserved.",
    "displayEmail": "support@gravecarekashmir.com",
    "displayAddress": "Srinagar, Jammu & Kashmir, 190001",
    "newsletterHeading": "Diaspora Updates",
    "newsletterText": "Subscribe to receive updates regarding cemetery conditions, seasonal plantation schedules, and community graveyard support projects in Kashmir.",
    "seoTitle": "Grave Care Kashmir | Grave Maintenance in Srinagar",
    "seoDescription": "Professional grave maintenance in Srinagar. We clean, align, restore and maintain graves with care. Contact us on WhatsApp to start."
  }
  $json$::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed default Recovery PIN (change '1234' immediately after first run)
INSERT INTO recovery_pins (id, pin_hash)
VALUES (1, crypt('1234', gen_salt('bf')))
ON CONFLICT (id) DO NOTHING;