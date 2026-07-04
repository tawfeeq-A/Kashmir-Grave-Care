export interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'textarea';
}

export interface ContentGroup {
  id: string;
  title: string;
  fields: ContentField[];
}

export const contentSchema: ContentGroup[] = [
  {
    id: "home_hero",
    title: "Home Page - Hero Section",
    fields: [
      { key: "floatOneTitle", label: "Float Card 1 Title", type: "text" },
      { key: "floatOneText", label: "Float Card 1 Text", type: "text" },
      { key: "floatTwoTitle", label: "Float Card 2 Title", type: "text" },
      { key: "floatTwoText", label: "Float Card 2 Text", type: "text" },
      { key: "floatThreeTitle", label: "Float Card 3 Title", type: "text" },
      { key: "floatThreeText", label: "Float Card 3 Text", type: "text" },
    ]
  },
  {
    id: "home_services",
    title: "Home Page - Services Preview",
    fields: [
      { key: "servicesHeading", label: "Section Heading", type: "text" },
      { key: "servicesSubtext", label: "Section Subtext", type: "textarea" },
      { key: "serviceOneTitle", label: "Service 1 Title", type: "text" },
      { key: "serviceOneText", label: "Service 1 Description", type: "textarea" },
      { key: "serviceTwoTitle", label: "Service 2 Title", type: "text" },
      { key: "serviceTwoText", label: "Service 2 Description", type: "textarea" },
      { key: "serviceThreeTitle", label: "Service 3 Title", type: "text" },
      { key: "serviceThreeText", label: "Service 3 Description", type: "textarea" },
    ]
  },
  {
    id: "home_steps",
    title: "Home Page - How It Works",
    fields: [
      { key: "howItWorksHeading", label: "Section Heading", type: "text" },
      { key: "howItWorksSub", label: "Section Subtext", type: "textarea" },
      { key: "processTag", label: "Process Tag (Pill)", type: "text" },
      { key: "stepOneTitle", label: "Step 1 Title", type: "text" },
      { key: "stepOneText", label: "Step 1 Text", type: "textarea" },
      { key: "stepTwoTitle", label: "Step 2 Title", type: "text" },
      { key: "stepTwoText", label: "Step 2 Text", type: "textarea" },
      { key: "stepThreeTitle", label: "Step 3 Title", type: "text" },
      { key: "stepThreeText", label: "Step 3 Text", type: "textarea" },
      { key: "stepFourTitle", label: "Step 4 Title", type: "text" },
      { key: "stepFourText", label: "Step 4 Text", type: "textarea" },
    ]
  },
  {
    id: "home_slider",
    title: "Home Page - Before/After Slider",
    fields: [
      { key: "sliderBeforeLabel", label: "Before Image Label", type: "text" },
      { key: "sliderAfterLabel", label: "After Image Label", type: "text" },
    ]
  },
  {
    id: "global_cta",
    title: "Global Call to Action",
    fields: [
      { key: "cta_button_text", label: "CTA Button Text", type: "text" },
    ]
  },
  {
    id: "about_hero",
    title: "About Page - Hero & Story",
    fields: [
      { key: "aboutHeroTitle", label: "Hero Title", type: "text" },
      { key: "aboutHeroText1", label: "Hero Paragraph 1", type: "textarea" },
      { key: "aboutHeroText2", label: "Hero Paragraph 2", type: "textarea" },
      { key: "aboutHeroText3", label: "Hero Paragraph 3", type: "textarea" },
      { key: "aboutHeading", label: "Pillars Heading", type: "text" },
      { key: "aboutSubHeading", label: "Pillars Subtext", type: "textarea" },
    ]
  },
  {
    id: "about_pillars",
    title: "About Page - Three Pillars",
    fields: [
      { key: "pillar1Title", label: "Pillar 1 Title", type: "text" },
      { key: "pillar1Text", label: "Pillar 1 Text", type: "textarea" },
      { key: "pillar2Title", label: "Pillar 2 Title", type: "text" },
      { key: "pillar2Text", label: "Pillar 2 Text", type: "textarea" },
      { key: "pillar3Title", label: "Pillar 3 Title", type: "text" },
      { key: "pillar3Text", label: "Pillar 3 Text", type: "textarea" },
    ]
  },
  {
    id: "about_story",
    title: "About Page - History & Heritage",
    fields: [
      { key: "aboutOurStoryHeading", label: "Heritage Heading", type: "text" },
      { key: "aboutOurStoryText1", label: "Heritage Paragraph 1", type: "textarea" },
      { key: "aboutOurStoryText2", label: "Heritage Paragraph 2", type: "textarea" },
      { key: "aboutOurStoryText3", label: "Heritage Paragraph 3", type: "textarea" },
      { key: "aboutCemeteriesHeading", label: "Cemeteries List Heading", type: "text" },
      { key: "aboutCemeteriesNote", label: "Cemeteries Note (Italic)", type: "textarea" },
    ]
  },
  {
    id: "services_header",
    title: "Services Page - Header",
    fields: [
      { key: "servicesPageTag", label: "Top Pill Tag", type: "text" },
      { key: "servicesPageHeading", label: "Main Heading", type: "text" },
      { key: "servicesPageSubtext", label: "Subtext", type: "textarea" },
    ]
  },
  {
    id: "services_pkg1",
    title: "Services - Package 1 (Standard)",
    fields: [
      { key: "pkg1Name", label: "Package Name", type: "text" },
      { key: "pkg1Tag", label: "Tagline", type: "text" },
      { key: "pkg1Desc", label: "Description", type: "textarea" },
      { key: "pkg1Feature1", label: "Feature 1", type: "text" },
      { key: "pkg1Feature2", label: "Feature 2", type: "text" },
      { key: "pkg1Feature3", label: "Feature 3", type: "text" },
      { key: "pkg1Feature4", label: "Feature 4", type: "text" },
      { key: "pkg1Feature5", label: "Feature 5", type: "text" },
      { key: "pkg1Cta", label: "Button Text", type: "text" },
    ]
  },
  {
    id: "services_pkg2",
    title: "Services - Package 2 (Premium)",
    fields: [
      { key: "pkg2Name", label: "Package Name", type: "text" },
      { key: "pkg2Tag", label: "Tagline", type: "text" },
      { key: "pkg2Desc", label: "Description", type: "textarea" },
      { key: "pkg2Feature1", label: "Feature 1", type: "text" },
      { key: "pkg2Feature2", label: "Feature 2", type: "text" },
      { key: "pkg2Feature3", label: "Feature 3", type: "text" },
      { key: "pkg2Feature4", label: "Feature 4", type: "text" },
      { key: "pkg2Feature5", label: "Feature 5", type: "text" },
      { key: "pkg2Feature6", label: "Feature 6", type: "text" },
      { key: "pkg2Cta", label: "Button Text", type: "text" },
    ]
  },
  {
    id: "services_pkg3",
    title: "Services - Package 3 (Spiritual)",
    fields: [
      { key: "pkg3Name", label: "Package Name", type: "text" },
      { key: "pkg3Tag", label: "Tagline", type: "text" },
      { key: "pkg3Desc", label: "Description", type: "textarea" },
      { key: "pkg3Feature1", label: "Feature 1", type: "text" },
      { key: "pkg3Feature2", label: "Feature 2", type: "text" },
      { key: "pkg3Feature3", label: "Feature 3", type: "text" },
      { key: "pkg3Feature4", label: "Feature 4", type: "text" },
      { key: "pkg3Feature5", label: "Feature 5", type: "text" },
      { key: "pkg3Cta", label: "Button Text", type: "text" },
    ]
  },
  {
    id: "services_custom",
    title: "Services - Custom Requests",
    fields: [
      { key: "customReqTag", label: "Top Pill Tag", type: "text" },
      { key: "customReqHeading", label: "Section Heading", type: "text" },
      { key: "customReqDesc", label: "Section Description", type: "textarea" },
      { key: "customReq1", label: "Custom Service 1", type: "text" },
      { key: "customReq2", label: "Custom Service 2", type: "text" },
      { key: "customReq3", label: "Custom Service 3", type: "text" },
      { key: "customReq4", label: "Custom Service 4", type: "text" },
      { key: "customReq5", label: "Custom Service 5", type: "text" },
    ]
  },
  {
    id: "services_work",
    title: "Services - Work Media Gallery",
    fields: [
      { key: "workGalleryHeading", label: "Gallery Heading", type: "text" },
      { key: "workGalleryDesc", label: "Gallery Description", type: "textarea" },
    ]
  },
  {
    id: "global_footer",
    title: "Global - Footer & Misc",
    fields: [
      { key: "footerDesc", label: "Footer Brand Description", type: "textarea" },
      { key: "footerCopyright", label: "Copyright Text", type: "text" },
      { key: "seoTitle", label: "Global SEO Title", type: "text" },
      { key: "seoDescription", label: "Global SEO Description", type: "textarea" },
    ]
  }
];
