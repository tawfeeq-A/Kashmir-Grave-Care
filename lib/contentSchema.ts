export interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'textarea';
  defaultValue?: string;
}

export interface ContentGroup {
  id: string;
  title: string;
  fields: ContentField[];
}

export const contentSchema: ContentGroup[] = [
  {
    id: "home_hero_intro",
    title: "Home Page - Hero Intro",
    fields: [
      { key: "eyebrow", label: "Intro Heading", type: "text", defaultValue: "Distance should never mean neglect." },
      { key: "heroWhatsappButton", label: "WhatsApp Button Text", type: "text", defaultValue: "Chat on WhatsApp" },
      { key: "heroWorkButton", label: "Work Button Text", type: "text", defaultValue: "See our work" },
    ]
  },
  {
    id: "home_hero",
    title: "Home Page - Hero Float Cards",
    fields: [
      { key: "floatOneTitle", label: "Float Card 1 Title", type: "text", defaultValue: "" },
      { key: "floatOneText", label: "Float Card 1 Text", type: "text", defaultValue: "" },
      { key: "floatTwoTitle", label: "Float Card 2 Title", type: "text", defaultValue: "" },
      { key: "floatTwoText", label: "Float Card 2 Text", type: "text", defaultValue: "" },
      { key: "floatThreeTitle", label: "Float Card 3 Title", type: "text", defaultValue: "" },
      { key: "floatThreeText", label: "Float Card 3 Text", type: "text", defaultValue: "" },
    ]
  },
  {
    id: "home_services",
    title: "Home Page - Services Preview",
    fields: [
      { key: "servicesTag", label: "Section Tag (Pill)", type: "text", defaultValue: "Our services" },
      { key: "servicesHeading", label: "Section Heading", type: "text", defaultValue: "What we do." },
      { key: "servicesSubtext", label: "Section Subtext", type: "textarea", defaultValue: "Every job starts with a WhatsApp message. We confirm details by call before any work begins." },
      { key: "serviceOneTitle", label: "Service 1 Title", type: "text", defaultValue: "Gentle Routine Care" },
      { key: "serviceOneText", label: "Service 1 Description", type: "textarea", defaultValue: "Ongoing, tender maintenance ensuring your loved one's resting place is always neat, clear of weeds, and thoughtfully preserved." },
      { key: "serviceTwoTitle", label: "Service 2 Title", type: "text", defaultValue: "Complete Restoration" },
      { key: "serviceTwoText", label: "Service 2 Description", type: "textarea", defaultValue: "A respectful overhaul for weathered graves, featuring deep marble cleaning, stain removal, and re-inking of faded calligraphy." },
      { key: "serviceThreeTitle", label: "Service 3 Title", type: "text", defaultValue: "Spiritual Visitations" },
      { key: "serviceThreeText", label: "Service 3 Description", type: "textarea", defaultValue: "Honoring their memory on special dates with thorough cleaning, Quran recitation by a local Qari, and live video presence." },
    ]
  },
  {
    id: "home_before_after",
    title: "Home Page - Before/After Restoration",
    fields: [
      { key: "beforeAfterTag", label: "Section Tag (Pill)", type: "text", defaultValue: "High Standards of Restoration" },
      { key: "beforeAfterHeading", label: "Section Heading", type: "text", defaultValue: "See the Care and Detail in Our Work" },
      { key: "beforeAfterText", label: "Section Description", type: "textarea", defaultValue: "Weathering in Kashmir's winters can cause marble staining, moss growth, and name engraving decay. Our professional team performs delicate chemical-free cleaning, re-painting of Arabic and Persian calligraphies, and complete landscaping." },
      { key: "beforeAfterBullet1", label: "Bullet Point 1", type: "text", defaultValue: "Delicate stain removal from premium marble" },
      { key: "beforeAfterBullet2", label: "Bullet Point 2", type: "text", defaultValue: "Weed extraction & maintaining neat local climate-ready grass" },
      { key: "beforeAfterBullet3", label: "Bullet Point 3", type: "text", defaultValue: "Calligraphy re-inking (Gold, Black, or White paint)" },
      { key: "beforeAfterLink", label: "Link Text", type: "text", defaultValue: "Explore our packages" },
      { key: "sliderBeforeLabel", label: "Before Image Label", type: "text", defaultValue: "Before Care (Weathered & Overgrown)" },
      { key: "sliderAfterLabel", label: "After Image Label", type: "text", defaultValue: "After Care (Restored, Green & Clean)" },
    ]
  },
  {
    id: "home_steps",
    title: "Home Page - How It Works",
    fields: [
      { key: "processTag", label: "Process Tag (Pill)", type: "text", defaultValue: "Process" },
      { key: "howItWorksHeading", label: "Section Heading", type: "text", defaultValue: "Our Journey of Care" },
      { key: "howItWorksSub", label: "Section Subtext", type: "textarea", defaultValue: "We handle every request as if we were caring for our own family." },
      { key: "stepOneTitle", label: "Step 1 Title", type: "text", defaultValue: "Initial Consultation" },
      { key: "stepOneText", label: "Step 1 Text", type: "textarea", defaultValue: "Contact us via WhatsApp. Share the location and current condition of the grave." },
      { key: "stepTwoTitle", label: "Step 2 Title", type: "text", defaultValue: "Assessment & Quote" },
      { key: "stepTwoText", label: "Step 2 Text", type: "textarea", defaultValue: "We visit the site, take initial photos, and provide a transparent, no-obligation quote." },
      { key: "stepThreeTitle", label: "Step 3 Title", type: "text", defaultValue: "Care & Maintenance" },
      { key: "stepThreeText", label: "Step 3 Text", type: "textarea", defaultValue: "Our team performs the requested services with the utmost respect and Islamic adab." },
      { key: "stepFourTitle", label: "Step 4 Title", type: "text", defaultValue: "Detailed Reporting" },
      { key: "stepFourText", label: "Step 4 Text", type: "textarea", defaultValue: "You receive high-quality before and after photos/videos of the completed work." },
    ]
  },
  {
    id: "home_eco",
    title: "Home Page - Eco-Ethical Section",
    fields: [
      { key: "ecoTag", label: "Section Tag (Pill)", type: "text", defaultValue: "Eco-Conscious & Ethical Custodianship" },
      { key: "ecoHeading", label: "Section Heading", type: "text", defaultValue: "Our Eco-Ethical Preservation Policy" },
      { key: "ecoText1", label: "Paragraph 1", type: "textarea", defaultValue: "We believe in respecting both the memory of the deceased and the pristine environment of Kashmir. We never use harsh chemical weedkillers that harm local soils and water tables." },
      { key: "ecoText2", label: "Paragraph 2", type: "textarea", defaultValue: "Instead, we employ local Kashmiri caretakers and gardeners, providing them with a fair, family-supporting wage. We prioritize keeping the grave clean and well-maintained while respecting the local graveyard aesthetics." },
      { key: "ecoLearnMore", label: "Learn More Button Text", type: "text", defaultValue: "Learn about our values" },
      { key: "ecoCard1Title", label: "Value Card 1 Title", type: "text", defaultValue: "Fair wages for caretakers" },
      { key: "ecoCard1Text", label: "Value Card 1 Description", type: "text", defaultValue: "Directly supporting Kashmiri local caretakers and gardeners with dignified, fair compensation." },
      { key: "ecoCard2Title", label: "Value Card 2 Title", type: "text", defaultValue: "Organic horticulture" },
      { key: "ecoCard2Text", label: "Value Card 2 Description", type: "text", defaultValue: "Using manure and organic soil enrichment, protecting local cemetery ecosystems." },
      { key: "ecoCard3Title", label: "Value Card 3 Title", type: "text", defaultValue: "Respectful Appearance" },
      { key: "ecoCard3Text", label: "Value Card 3 Description", type: "text", defaultValue: "Maintaining clean surroundings, preserving the traditional forest cemetery appearance." },
      { key: "ecoCard4Title", label: "Value Card 4 Title", type: "text", defaultValue: "GPS & Transparent reporting" },
      { key: "ecoCard4Text", label: "Value Card 4 Description", type: "text", defaultValue: "Every session is geo-tagged and detailed before-after photos are stored in reports." },
    ]
  },
  {
    id: "global_cta",
    title: "Global Call to Action",
    fields: [
      { key: "cta_button_text", label: "CTA WhatsApp Button Text", type: "text", defaultValue: "Start WhatsApp Chat" },
      { key: "ctaServicesButton", label: "CTA Services Button Text", type: "text", defaultValue: "View Services & Packages" },
      { key: "ctaFooterNote", label: "CTA Footer Note", type: "text", defaultValue: "Dedicated customer support and photo reports with every service session" },
    ]
  },
  {
    id: "about_hero",
    title: "About Page - Hero & Story",
    fields: [
      { key: "aboutHeroTag", label: "Hero Tag (Pill)", type: "text", defaultValue: "Connecting Families" },
      { key: "aboutHeroTitle", label: "Hero Title", type: "text", defaultValue: "Our Story: Preserving Heritage & Dignity" },
      { key: "aboutHeroText1", label: "Hero Paragraph 1", type: "textarea", defaultValue: "Our cemeteries have stood for centuries as silent sentinels of remembrance. They represent our history, our families, and our deeply held respect for those who came before us." },
      { key: "aboutHeroText2", label: "Hero Paragraph 2", type: "textarea", defaultValue: "Grave Care Kashmir was founded by a group of passionate locals in Srinagar who recognized a growing challenge: as more Kashmiri families moved abroad to build lives in the Gulf, North America, and Europe, their ancestral graves in Srinagar, Sopore, Anantnag, and local village graveyards became increasingly neglected due to distance." },
      { key: "aboutHeroText3", label: "Hero Paragraph 3", type: "textarea", defaultValue: "Our service is built to be a bridge of filial duty and love. We combine traditional respect with modern communication so that distance never weakens your connection to your ancestors." },
    ]
  },
  {
    id: "about_pillars",
    title: "About Page - Three Pillars",
    fields: [
      { key: "aboutHeading", label: "Pillars Heading", type: "text", defaultValue: "Our Story of Compassion" },
      { key: "aboutSubHeading", label: "Pillars Subtext", type: "textarea", defaultValue: "Caring for those who have departed, comforting those who remain." },
      { key: "pillar1Title", label: "Pillar 1 Title", type: "text", defaultValue: "Respect (Adab)" },
      { key: "pillar1Text", label: "Pillar 1 Text", type: "textarea", defaultValue: "Every action we take in the graveyard is performed with the utmost respect, following Islamic guidelines for visiting and maintaining resting places." },
      { key: "pillar2Title", label: "Pillar 2 Title", type: "text", defaultValue: "Transparency" },
      { key: "pillar2Text", label: "Pillar 2 Text", type: "textarea", defaultValue: "We provide clear, honest packages and comprehensive photo/video reports so you know exactly what care was provided." },
      { key: "pillar3Title", label: "Pillar 3 Title", type: "text", defaultValue: "Excellence (Ihsan)" },
      { key: "pillar3Text", label: "Pillar 3 Text", type: "textarea", defaultValue: "From removing the smallest weeds to restoring intricate marble calligraphy, we perform our work to the highest possible standard." },
    ]
  },
  {
    id: "about_story",
    title: "About Page - History & Heritage",
    fields: [
      { key: "aboutOurStoryTag", label: "Heritage Tag (Pill)", type: "text", defaultValue: "Heritage" },
      { key: "aboutOurStoryHeading", label: "Heritage Heading", type: "text", defaultValue: "Serving Across Kashmir" },
      { key: "aboutOurStoryText1", label: "Heritage Paragraph 1", type: "textarea", defaultValue: "Grave Care Kashmir began with a simple, deeply personal realization. Many families, separated by oceans and borders, carry a quiet heartache knowing they cannot regularly visit or maintain the resting places of their loved ones in Kashmir." },
      { key: "aboutOurStoryText2", label: "Heritage Paragraph 2", type: "textarea", defaultValue: "We understand that tending to a grave is an act of profound love. When distance prevents you from being there, we step in to fulfill that duty. We treat every resting place with the utmost reverence, as if it belonged to our own family." },
      { key: "aboutOurStoryText3", label: "Heritage Paragraph 3", type: "textarea", defaultValue: "Our mission is not just maintenance; it is providing peace of mind. We want you to feel connected, knowing that your loved one's memory is honored in a beautiful, well-cared-for space." },
      { key: "aboutCemeteriesHeading", label: "Cemeteries List Heading", type: "text", defaultValue: "Srinagar Cemeteries We Regularly Serve" },
      { key: "cemetery1Name", label: "Cemetery 1 Name", type: "text", defaultValue: "Malkhah Cemetery (Rainawari / Eidgah)" },
      { key: "cemetery1Tag", label: "Cemetery 1 Tag", type: "text", defaultValue: "Srinagar's Largest" },
      { key: "cemetery2Name", label: "Cemetery 2 Name", type: "text", defaultValue: "Hazratbal Shrine Graveyard" },
      { key: "cemetery2Tag", label: "Cemetery 2 Tag", type: "text", defaultValue: "Serene Lakeside" },
      { key: "cemetery3Name", label: "Cemetery 3 Name", type: "text", defaultValue: "Naqshband Sahib Cemetery" },
      { key: "cemetery3Tag", label: "Cemetery 3 Tag", type: "text", defaultValue: "Heritage Site" },
    ]
  },
  {
    id: "services_header",
    title: "Services Page - Header",
    fields: [
      { key: "servicesPageTag", label: "Top Pill Tag", type: "text", defaultValue: "Transparent Care Services" },
      { key: "servicesPageHeading", label: "Main Heading", type: "text", defaultValue: "Our Maintenance & Restoration Services" },
      { key: "servicesPageSubtext", label: "Subtext", type: "textarea", defaultValue: "We offer flexible packages and specialized custom treatments to fit your family's needs. Each package is tailored to the grave's size, location, and condition." },
    ]
  },
  {
    id: "services_pkg1",
    title: "Services - Package 1 (Standard)",
    fields: [
      { key: "pkg1Name", label: "Package Name", type: "text", defaultValue: "Gentle Routine Care" },
      { key: "pkg1Tag", label: "Tagline", type: "text", defaultValue: "Ongoing respect & general maintenance" },
      { key: "pkg1Desc", label: "Description", type: "textarea", defaultValue: "Ideal for maintaining neatness, keeping the grass trimmed, and routine cleanliness on a regular schedule to honor their resting place." },
      { key: "pkg1Feature1", label: "Feature 1", type: "text", defaultValue: "Bi-monthly gentle weeding and debris sweeping" },
      { key: "pkg1Feature2", label: "Feature 2", type: "text", defaultValue: "Grass trimming to maintain neat surroundings" },
      { key: "pkg1Feature3", label: "Feature 3", type: "text", defaultValue: "Loving cleaning of the headstone" },
      { key: "pkg1Feature4", label: "Feature 4", type: "text", defaultValue: "Heartfelt before-and-after photo reports" },
      { key: "pkg1Feature5", label: "Feature 5", type: "text", defaultValue: "GPS-tagged grave location pinning" },
      { key: "pkg1Cta", label: "Button Text", type: "text", defaultValue: "Inquire about Gentle Care" },
    ]
  },
  {
    id: "services_pkg2",
    title: "Services - Package 2 (Premium / Recommended)",
    fields: [
      { key: "pkg2Name", label: "Package Name", type: "text", defaultValue: "Loving Restoration" },
      { key: "pkg2Tag", label: "Tagline", type: "text", defaultValue: "Deep cleaning & engraving revival" },
      { key: "pkg2Desc", label: "Description", type: "textarea", defaultValue: "A complete, respectful overhaul for graves that are weathered, stained, or have faded inscriptions over the years." },
      { key: "pkg2Feature1", label: "Feature 1", type: "text", defaultValue: "All features in Gentle Routine Care" },
      { key: "pkg2Feature2", label: "Feature 2", type: "text", defaultValue: "Marble and limestone gentle washing" },
      { key: "pkg2Feature3", label: "Feature 3", type: "text", defaultValue: "Chemical-free moss & stain extraction" },
      { key: "pkg2Feature4", label: "Feature 4", type: "text", defaultValue: "Calligraphy engraving re-inking (Gold/Black)" },
      { key: "pkg2Feature5", label: "Feature 5", type: "text", defaultValue: "Careful soil leveling and structural check" },
      { key: "pkg2Feature6", label: "Feature 6", type: "text", defaultValue: "Annual structural stability inspection" },
      { key: "pkg2Cta", label: "Button Text", type: "text", defaultValue: "Inquire about Restoration" },
    ]
  },
  {
    id: "services_pkg3",
    title: "Services - Package 3 (Spiritual)",
    fields: [
      { key: "pkg3Name", label: "Package Name", type: "text", defaultValue: "Heartfelt Visitations" },
      { key: "pkg3Tag", label: "Tagline", type: "text", defaultValue: "Spiritual honoring & upkeep" },
      { key: "pkg3Desc", label: "Description", type: "textarea", defaultValue: "Focused on spiritual remembrance, ensuring you can be virtually present to honor your loved one on special anniversaries." },
      { key: "pkg3Feature1", label: "Feature 1", type: "text", defaultValue: "Thorough cleaning before significant dates" },
      { key: "pkg3Feature2", label: "Feature 2", type: "text", defaultValue: "Recitation of Holy Quran / Dua-e-Fatiha by a local Qari" },
      { key: "pkg3Feature3", label: "Feature 3", type: "text", defaultValue: "Live video link allowing you to be present during prayers" },
      { key: "pkg3Feature4", label: "Feature 4", type: "text", defaultValue: "Dedicated photo and video reports" },
      { key: "pkg3Feature5", label: "Feature 5", type: "text", defaultValue: "Providing comfort across the miles" },
      { key: "pkg3Cta", label: "Button Text", type: "text", defaultValue: "Inquire about Visitations" },
    ]
  },
  {
    id: "services_custom",
    title: "Services - Custom Requests",
    fields: [
      { key: "customReqTag", label: "Top Pill Tag", type: "text", defaultValue: "Bespoke Requests" },
      { key: "customReqHeading", label: "Section Heading", type: "text", defaultValue: "Specialized Add-ons & Custom Care" },
      { key: "customReqDesc", label: "Section Description", type: "textarea", defaultValue: "Every resting place is unique. If you have specific requirements not covered in our standard packages, we are more than happy to accommodate them." },
      { key: "customReq1", label: "Custom Service 1", type: "text", defaultValue: "Specific Commemorative Arrangements" },
      { key: "customReq2", label: "Custom Service 2", type: "text", defaultValue: "Gravel Refilling (White marble chips or red stone gravel)" },
      { key: "customReq3", label: "Custom Service 3", type: "text", defaultValue: "Additional Calligraphy detailing (per inscription)" },
      { key: "customReq4", label: "Custom Service 4", type: "text", defaultValue: "Structural stone joint repair / Mortar patching" },
      { key: "customReq5", label: "Custom Service 5", type: "text", defaultValue: "Sufi Shrine Ziyarat Tribute (Prayers on their behalf at shrines)" },
    ]
  },
  {
    id: "services_work",
    title: "Services - Work Media Gallery",
    fields: [
      { key: "workGalleryHeading", label: "Gallery Heading", type: "text", defaultValue: "See Our Work" },
      { key: "workGalleryDesc", label: "Gallery Description", type: "textarea", defaultValue: "Browse through our recent maintenance and restoration projects across Kashmir. We take pride in the visible difference our respectful care brings to these resting places." },
    ]
  },
  {
    id: "work_page",
    title: "Work Page",
    fields: [
      { key: "workTag", label: "Page Tag (Pill)", type: "text", defaultValue: "Our work" },
      { key: "workHeading", label: "Page Heading", type: "text", defaultValue: "Browse our work on Instagram and Facebook." },
      { key: "workSubtext", label: "Page Subtext", type: "textarea", defaultValue: "Browse before-and-after photos of our cleaning, alignment, and restoration work. Latest jobs are shared on our social platforms." },
    ]
  },
  {
    id: "contact_page",
    title: "Contact / Booking Page",
    fields: [
      { key: "contactHeading", label: "Page Heading", type: "text", defaultValue: "Caretaker Request Portal" },
      { key: "contactSubtext", label: "Page Subtext", type: "textarea", defaultValue: "Provide details below. Our Srinagar coordinator will inspect the grave site and prepare a visual proposal." },
      { key: "bookingCemetery1", label: "Cemetery Option 1", type: "text", defaultValue: "Malkhah Cemetery, Srinagar" },
      { key: "bookingCemetery2", label: "Cemetery Option 2", type: "text", defaultValue: "Hazratbal Shrine Graveyard" },
      { key: "bookingCemetery3", label: "Cemetery Option 3", type: "text", defaultValue: "Sheikh-ul-Alam Cemetery, Budgam" },
      { key: "bookingCemetery4", label: "Cemetery Option 4", type: "text", defaultValue: "Naqshband Sahib Cemetery, Srinagar" },
    ]
  },
  {
    id: "global_footer",
    title: "Global - Footer & Misc",
    fields: [
      { key: "footerDesc", label: "Footer Brand Description", type: "textarea", defaultValue: "Dignified grave maintenance for families across Srinagar and local qabristans. We support families and diaspora around the world in keeping the resting places of their loved ones clean, green, and beautifully preserved." },
      { key: "footerCopyright", label: "Copyright Text", type: "text", defaultValue: "" },
      { key: "displayEmail", label: "Display Email Address", type: "text", defaultValue: "support@gravecarekashmir.com" },
      { key: "displayAddress", label: "Display Address", type: "text", defaultValue: "Srinagar, Jammu & Kashmir, 190001" },
      { key: "newsletterHeading", label: "Newsletter Section Heading", type: "text", defaultValue: "Diaspora Updates" },
      { key: "newsletterText", label: "Newsletter Section Text", type: "textarea", defaultValue: "Subscribe to receive updates regarding cemetery conditions, seasonal plantation schedules, and community graveyard support projects in Kashmir." },
      { key: "seoTitle", label: "Global SEO Title", type: "text", defaultValue: "Grave Care Kashmir | Grave Maintenance in Srinagar" },
      { key: "seoDescription", label: "Global SEO Description", type: "textarea", defaultValue: "Professional grave maintenance in Srinagar. We clean, align, restore and maintain graves with care. Contact us on WhatsApp to start." },
    ]
  }
];

/** Helper: get the default value for a content key from the schema */
export function getContentDefault(key: string): string {
  for (const group of contentSchema) {
    for (const field of group.fields) {
      if (field.key === key && field.defaultValue) {
        return field.defaultValue;
      }
    }
  }
  return '';
}
