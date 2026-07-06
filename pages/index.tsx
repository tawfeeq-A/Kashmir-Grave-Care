import React from "react";
import Head from "next/head";
import Link from "next/link";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import ImageBeforeAfter from "@/components/ImageBeforeAfter";
import OrbitalHero from "@/components/OrbitalHero";
import ScrollReveal from "@/components/ScrollReveal";
import SVGPathTimeline from "@/components/SVGPathTimeline";
import HoverFocusGrid from "@/components/HoverFocusGrid";
import AnimatedCounters from "@/components/AnimatedCounters";
import HorizontalScrollSlider from "@/components/HorizontalScrollSlider";
import Scroll3DTilt from "@/components/Scroll3DTilt";
import { useSite } from "@/context/SiteContext";
import {
  ShieldCheck, Calendar, Sparkles, Leaf, ArrowRight, Star,
  MessageSquare, Sprout, Axe, Ruler, BrickWall, HelpingHand,
  HeartHandshake, CheckCircle, Heart, Eye, MapPin, Users,
} from "lucide-react";

export default function Home() {
  const { settings } = useSite();
  const content = settings?.content_json || {};

  const services = [
    {
      title: content.serviceOneTitle || "Gentle Routine Care",
      desc: content.serviceOneText || "Ongoing, tender maintenance ensuring your loved one's resting place is always neat, clear of weeds, and thoughtfully preserved.",
      icon: <Leaf className="h-6 w-6" />,
    },
    {
      title: content.serviceTwoTitle || "Complete Restoration",
      desc: content.serviceTwoText || "A respectful overhaul for weathered graves, featuring deep marble cleaning, stain removal, and re-inking of faded calligraphy.",
      icon: <CheckCircle className="h-6 w-6" />,
    },
    {
      title: content.serviceThreeTitle || "Spiritual Visitations",
      desc: content.serviceThreeText || "Honoring their memory on special dates with thorough cleaning, Quran recitation by a local Qari, and live video presence.",
      icon: <HeartHandshake className="h-6 w-6" />,
    },
  ];

  const steps = [
    { num: "1", title: content.stepOneTitle || "Initial Consultation", desc: content.stepOneText || "Contact us via WhatsApp. Share the location and current condition of the grave." },
    { num: "2", title: content.stepTwoTitle || "Assessment & Quote", desc: content.stepTwoText || "We visit the site, take initial photos, and provide a transparent, no-obligation quote." },
    { num: "3", title: content.stepThreeTitle || "Care & Maintenance", desc: content.stepThreeText || "Our team performs the requested services with the utmost respect and Islamic adab." },
    { num: "4", title: content.stepFourTitle || "Detailed Reporting", desc: content.stepFourText || "You receive high-quality before and after photos/videos of the completed work." },
  ];

  const ecoCards = [
    {
      num: "01",
      title: content.ecoCard1Title || "Fair wages for caretakers",
      desc: content.ecoCard1Text || "Directly supporting Kashmiri local labor with dignified and fair compensation.",
      imageSrc: "/images/eco_caretaker_wages.png",
    },
    {
      num: "02",
      title: content.ecoCard2Title || "Organic horticulture",
      desc: content.ecoCard2Text || "Using manure and organic soil enrichment, protecting local cemetery ecosystems.",
      imageSrc: "/images/eco_organic_soil.png",
    },
    {
      num: "03",
      title: content.ecoCard3Title || "Respectful Appearance",
      desc: content.ecoCard3Text || "Maintaining clean surroundings, preserving the traditional forest cemetery appearance.",
      imageSrc: "/images/eco_cemetery_heritage.png",
    },
    {
      num: "04",
      title: content.ecoCard4Title || "GPS & Transparent reporting",
      desc: content.ecoCard4Text || "Every session is geo-tagged and detailed before-after photos are stored in reports.",
      imageSrc: "/images/eco_gps_reporting.png",
    },
  ];

  const counterData = [
    {
      value: 150,
      suffix: "+",
      label: content.stat1Label || "Graves Maintained",
      desc: content.stat1Desc || "Across Kashmir",
    },
    {
      value: 98,
      suffix: "%",
      label: content.stat2Label || "Family Satisfaction",
      desc: content.stat2Desc || "Verified reports",
    },
    {
      value: 12,
      suffix: "+",
      label: content.stat3Label || "Cemeteries Served",
      desc: content.stat3Desc || "Srinagar & beyond",
    },
    {
      value: 500,
      suffix: "+",
      label: content.stat4Label || "Photo Reports Sent",
      desc: content.stat4Desc || "To families worldwide",
    },
  ];

  // Split title on the first comma to prevent dropping text if there are multiple commas
  let title1 = "Your Family's Resting Place,";
  let title2 = "Maintained with Dignity.";
  if (settings?.hero_title) {
    const commaIndex = settings.hero_title.indexOf(",");
    if (commaIndex !== -1) {
      title1 = settings.hero_title.substring(0, commaIndex + 1);
      title2 = settings.hero_title.substring(commaIndex + 1).trim();
    } else {
      title1 = settings.hero_title;
      title2 = "";
    }
  }

  return (
    <>
      <Head>
        <title>{content.seoTitle || "Grave Care Kashmir | Grave Maintenance in Srinagar"}</title>
        <meta
          name="description"
          content={content.seoDescription || "Professional grave maintenance in Srinagar. We clean, align, restore and maintain graves with care. Contact us on WhatsApp to start."}
        />
      </Head>

      {/* ━━━ Hero Section with Geometric Shapes ━━━ */}
      <section className="relative overflow-hidden">
        <HeroGeometric
          title1={title1}
          title2={title2}
        />

        {/* Intro & Orbital Block */}
        <div className="bg-background py-16 lg:py-24 border-b border-border/40 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <ScrollReveal direction="up" delay={0.1}>
                <div className="space-y-6 text-center lg:text-left">
                  <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
                    {content.eyebrow || "Grave maintenance done with care and precision."}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {settings?.hero_subtitle || "We clean, align, and restore graves for families who want to keep resting places in proper condition. Our work spans across Srinagar and local qabristans."}
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                    <a
                      href={`https://wa.me/${(settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings?.whatsapp_message || "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <MessageSquare className="h-4.5 w-4.5 mr-2" /> {content.heroWhatsappButton || "Chat on WhatsApp"}
                    </a>
                    <Link
                      href="/work"
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/15 rounded-xl transition-all border border-primary/20 hover:-translate-y-0.5"
                    >
                      {content.heroWorkButton || "See our work"}
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.3}>
                <div className="relative flex justify-center w-full">
                  <OrbitalHero />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Services — Hover Focus Grid ━━━ */}
      <HoverFocusGrid
        tiles={services.map((srv, idx) => ({
          num: String(idx + 1).padStart(2, "0"),
          title: srv.title,
          desc: srv.desc,
          icon: srv.icon,
        }))}
        sectionTag={content.servicesTag || "Our services"}
        tagIcon={<ShieldCheck className="h-3.5 w-3.5 mr-1" />}
        sectionTitle={content.servicesHeading || "What we do."}
        sectionSubtitle={content.servicesSubtext || "Every job starts with a WhatsApp message. We confirm details by call before any work begins."}
      />
      <section className="py-20 bg-background border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <ScrollReveal direction="left" className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                <Sparkles className="h-3 w-3 mr-1.5" /> {content.beforeAfterTag || "High Standards of Restoration"}
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.beforeAfterHeading || "See the Care and Detail in Our Work"}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {content.beforeAfterText || "Weathering in Kashmir's winters can cause marble staining, moss growth, and name engraving decay. Our professional team performs delicate chemical-free cleaning, re-painting of Arabic and Persian calligraphies, and complete landscaping."}
              </p>
              <div className="space-y-3">
                {[
                  content.beforeAfterBullet1 || "Delicate stain removal from premium marble",
                  content.beforeAfterBullet2 || "Weed extraction & maintaining neat local climate-ready grass",
                  content.beforeAfterBullet3 || "Calligraphy re-inking (Gold, Black, or White paint)",
                ].map((bullet, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-sm">
                    <span className="h-5 w-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                    <span className="text-foreground">{bullet}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 group"
                >
                  {content.beforeAfterLink || "Explore pricing packages"}
                  <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2} className="lg:col-span-7">
              <Scroll3DTilt maxTilt={8}>
                <div className="bg-background p-4 rounded-3xl border border-border shadow-sm">
                  <ImageBeforeAfter
                    beforeImage="/images/grave-before-final.jpg"
                    afterImage="/images/grave-after-final.jpg"
                    beforeLabel={content.sliderBeforeLabel}
                    afterLabel={content.sliderAfterLabel}
                  />
                </div>
              </Scroll3DTilt>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ━━━ How it Works — SVG Path Timeline ━━━ */}
      <SVGPathTimeline
        nodes={steps}
        sectionTag={content.processTag || "Process"}
        tagIcon={<Calendar className="h-3.5 w-3.5 mr-1" />}
        sectionTitle={content.howItWorksHeading || "Our Journey of Care"}
        sectionSubtitle={content.howItWorksSub || "We handle every request as if we were caring for our own family."}
      />

      {/* ━━━ Animated Stats Counters ━━━ */}
      <AnimatedCounters
        counters={counterData}
        sectionTag={content.statsTag || "Our Impact"}
        tagIcon={<Star className="h-3.5 w-3.5 mr-1" />}
        sectionTitle={content.statsHeading || "Trusted by Families Worldwide"}
        sectionSubtitle={content.statsSubtitle || "Numbers that reflect our commitment to dignified care and transparency."}
      />

      {/* ━━━ Eco Values — Horizontal Scroll Slider ━━━ */}
      <HorizontalScrollSlider
        slides={ecoCards.map((card) => ({
          num: card.num,
          title: card.title,
          desc: card.desc,
          imageSrc: card.imageSrc,
        }))}
        sectionTag={content.ecoTag || "Eco-Conscious & Ethical Custodianship"}
        tagIcon={<Leaf className="h-3.5 w-3.5 mr-1" />}
        sectionTitle={content.ecoHeading || "Our Eco-Ethical Preservation Policy"}
      />
      <section className="relative py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        {/* Animated decorative rings */}
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full border border-white/10 animate-spinSlow pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full border border-white/5 animate-spinSlow pointer-events-none" style={{ animationDirection: "reverse" }} />

        <ScrollReveal direction="up">
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold sm:text-5xl tracking-tight leading-tight">
              {settings?.cta_title || "Let us care for their resting place."}
            </h2>
            <p className="max-w-2xl mx-auto text-primary-foreground/80 md:text-lg text-sm">
              {settings?.cta_text || "Send us a message. We will listen to your wishes and carefully coordinate every detail to bring you comfort."}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href={`https://wa.me/${(settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings?.whatsapp_message || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary bg-white hover:bg-zinc-100 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {content.cta_button_text || "Start WhatsApp Chat"}
              </a>
              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-xl transition-all border border-primary-foreground/20"
              >
                {content.ctaServicesButton || "View Services & Packages"}
              </Link>
            </div>
            <div className="text-xs text-primary-foreground/60 flex justify-center items-center gap-2 pt-2">
              <HeartHandshake className="h-4 w-4" />
              <span>{content.ctaFooterNote || "Dedicated customer support and photo reports with every service session"}</span>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}