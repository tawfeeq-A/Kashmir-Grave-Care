import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import ImageBeforeAfter from "@/components/ImageBeforeAfter";
import ScrollReveal from "@/components/ScrollReveal";
import SVGPathTimeline from "@/components/SVGPathTimeline";
import AnimatedCounters from "@/components/AnimatedCounters";
import HorizontalScrollSlider from "@/components/HorizontalScrollSlider";
import Scroll3DTilt from "@/components/Scroll3DTilt";
import { useSite } from "@/context/SiteContext";
import {
  ShieldCheck, Calendar, Sparkles, Leaf, ArrowRight, Star,
  MessageSquare, HeartHandshake, CheckCircle, Heart, Camera,
  MapPin, Phone,
} from "lucide-react";

export default function Home() {
  const { settings } = useSite();
  const content = settings?.content_json || {};

  const services = [
    {
      title: content.serviceOneTitle || "Gentle Routine Care",
      desc: content.serviceOneText || "Ongoing, tender maintenance ensuring your loved one's resting place is always neat, clear of weeds, and thoughtfully preserved.",
      icon: <Leaf className="h-5 w-5" />,
    },
    {
      title: content.serviceTwoTitle || "Complete Restoration",
      desc: content.serviceTwoText || "A respectful overhaul for weathered graves, featuring deep marble cleaning, stain removal, and re-inking of faded calligraphy.",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      title: content.serviceThreeTitle || "Spiritual Visitations",
      desc: content.serviceThreeText || "Honoring their memory on special dates with thorough cleaning, Quran recitation by a local Qari, and live video presence.",
      icon: <HeartHandshake className="h-5 w-5" />,
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
      desc: content.ecoCard1Text || "Directly supporting Kashmiri local caretakers and gardeners with dignified, fair compensation.",
      imageSrc: "/images/eco_caretaker_wages.webp",
    },
    {
      num: "02",
      title: content.ecoCard2Title || "Organic horticulture",
      desc: content.ecoCard2Text || "Using manure and organic soil enrichment, protecting local cemetery ecosystems.",
      imageSrc: "/images/eco_organic_soil.webp",
    },
    {
      num: "03",
      title: content.ecoCard3Title || "Respectful Appearance",
      desc: content.ecoCard3Text || "Maintaining clean surroundings, preserving the traditional forest cemetery appearance.",
      imageSrc: "/images/eco_cemetery_heritage.webp",
    },
    {
      num: "04",
      title: content.ecoCard4Title || "GPS & Transparent reporting",
      desc: content.ecoCard4Text || "Every session is geo-tagged and detailed before-after photos are stored in reports.",
      imageSrc: "/images/eco_gps_reporting.webp",
    },
  ];

  const counterData = [
    { value: 150, suffix: "+", label: content.stat1Label || "Graves Maintained", desc: content.stat1Desc || "Across Kashmir" },
    { value: 98, suffix: "%", label: content.stat2Label || "Family Satisfaction", desc: content.stat2Desc || "Verified reports" },
    { value: 12, suffix: "+", label: content.stat3Label || "Cemeteries Served", desc: content.stat3Desc || "Srinagar & beyond" },
    { value: 500, suffix: "+", label: content.stat4Label || "Photo Reports Sent", desc: content.stat4Desc || "To families worldwide" },
  ];

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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden">
        <HeroGeometric
          title1={title1}
          title2={title2}
          actions={
            <>
              <a
                href={`https://wa.me/${(settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings?.whatsapp_message || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-primary btn-sheen w-full sm:w-auto px-7 py-3.5 text-sm"
              >
                <MessageSquare className="h-4 w-4 mr-2" /> {content.heroWhatsappButton || "Chat on WhatsApp"}
              </a>
              <Link
                href="/services"
                className="btn-base btn-secondary w-full sm:w-auto px-7 py-3.5 text-sm"
              >
                {content.ctaServicesButton || "View Services"}
              </Link>
            </>
          }
        />
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          EMOTIONAL INTRO — Split layout with image
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative bg-background/95 md:bg-background/80 md:backdrop-blur-md overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Image with layered depth */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto lg:mx-0">
                {/* Decorative accent glow behind image */}
                <div className="absolute -inset-6 bg-gradient-to-br from-primary/12 via-transparent to-accent/12 rounded-[2.75rem] blur-3xl" />
                {/* Layered depth frame — offset card reads as tactile depth */}
                <div className="absolute -bottom-3 -left-3 hidden sm:block w-full h-full rounded-[2rem] bg-secondary/50 border border-border/40 -z-10" aria-hidden="true" />
                <div className="relative aspect-[4/3] sm:aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-[2rem] border border-border/60 shadow-premium ring-1 ring-black/5">
                  <Image
                    src="/images/kashmir-cemetery.png"
                    alt="Kashmir cemetery with white marble graves under Chinar trees"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
                {/* Floating stat card */}
                <div className="glass-card shadow-premium absolute -bottom-4 right-2 sm:right-4 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Serving</p>
                      <p className="text-xs sm:text-sm font-bold text-foreground">12+ Cemeteries</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right — Text content */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                <h2 className="text-[1.75rem] sm:text-3xl lg:text-[2.75rem] font-bold font-serif text-foreground leading-[1.12] tracking-tight text-balance">
                  {content.eyebrow || "Distance should never mean neglect."}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0 text-pretty">
                  {settings?.hero_subtitle || "For families across the world who carry the quiet ache of being far from their loved ones' resting places, we are your trusted hands in Kashmir."}
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                  <a
                    href={`https://wa.me/${(settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings?.whatsapp_message || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-base btn-primary btn-sheen px-7 py-3.5 text-sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" /> {content.heroWhatsappButton || "Chat on WhatsApp"}
                  </a>
                  <Link
                    href="/work"
                    className="btn-base btn-secondary px-7 py-3.5 text-sm"
                  >
                    <Camera className="h-4 w-4 mr-2" /> {content.heroWorkButton || "See our work"}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SERVICES — Stacked cards with visual variety
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 sm:py-24 lg:py-32 bg-secondary/20 border-y border-border/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mb-10 sm:mb-16 text-center sm:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> {content.servicesTag || "Our services"}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {content.servicesHeading || "What we do."}
              </h2>
              <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
                {content.servicesSubtext || "Every job starts with a WhatsApp message. We confirm details by call before any work begins."}
              </p>
            </div>
          </ScrollReveal>

          {/* Service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
            {services.map((srv, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
                <div className="premium-card group relative rounded-2xl border border-border/60 p-6 sm:p-8 transition-all duration-500 hover:border-primary/30 h-full bg-background/90 md:bg-background/70 md:backdrop-blur-md">
                  {/* Icon */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary border border-primary/15 mb-5 sm:mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500">
                    {srv.icon}
                  </div>
                  {/* Content */}
                  <h3 className="text-base sm:text-lg font-bold text-foreground font-serif mb-2 sm:mb-3">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Inline CTA */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-12 flex justify-center">
              <Link
                href="/services"
                className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 group gap-2"
              >
                View all service packages
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BEFORE / AFTER — Visual proof
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 sm:py-24 lg:py-32 bg-background/95 md:bg-background/80 md:backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
            <ScrollReveal direction="up" className="lg:col-span-5 space-y-5 sm:space-y-7">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                <Sparkles className="h-3 w-3 mr-1.5" /> {content.beforeAfterTag || "Real Results"}
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl leading-tight">
                {content.beforeAfterHeading || "See the Care and Detail in Our Work"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {content.beforeAfterText || "Weathering in Kashmir's harsh winters causes marble staining, moss growth, and name engraving decay. Our team performs delicate chemical-free cleaning, calligraphy re-painting, and complete landscaping."}
              </p>
              <div className="space-y-3 pt-2">
                {[
                  content.beforeAfterBullet1 || "Delicate stain removal from premium marble",
                  content.beforeAfterBullet2 || "Weed extraction & maintaining neat local climate-ready grass",
                  content.beforeAfterBullet3 || "Calligraphy re-inking (Gold, Black, or White paint)",
                ].map((bullet, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-sm">
                    <span className="h-5 w-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    <span className="text-foreground">{bullet}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Link
                  href="/services"
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 group"
                >
                  {content.beforeAfterLink || "Explore our services"}
                  <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2} className="lg:col-span-7">
              <Scroll3DTilt maxTilt={5}>
                <div className="bg-background p-3 rounded-2xl border border-border shadow-xl shadow-black/5">
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PROCESS TIMELINE
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SVGPathTimeline
        nodes={steps}
        sectionTag={content.processTag || "Process"}
        tagIcon={<Calendar className="h-3.5 w-3.5 mr-1" />}
        sectionTitle={content.howItWorksHeading || "Our Journey of Care"}
        sectionSubtitle={content.howItWorksSub || "We handle every request as if we were caring for our own family."}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STATS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AnimatedCounters
        counters={counterData}
        sectionTag={content.statsTag || "Our Impact"}
        tagIcon={<Star className="h-3.5 w-3.5 mr-1" />}
        sectionTitle={content.statsHeading || "Trusted by Families Worldwide"}
        sectionSubtitle={content.statsSubtitle || "Numbers that reflect our commitment to dignified care and transparency."}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ECO VALUES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FINAL CTA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section data-dock-dark className="relative py-20 sm:py-28 lg:py-36 bg-primary text-primary-foreground overflow-hidden">
        {/* Subtle grain to kill banding + add tactile richness */}
        <div className="grain-overlay" />
        {/* Layered background for depth */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_50%_50%,#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.03] blur-[120px] pointer-events-none" />

        <ScrollReveal direction="up">
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="font-serif text-3xl font-bold sm:text-5xl tracking-tight leading-[1.15]">
              {settings?.cta_title || "Let us care for their resting place."}
            </h2>
            <p className="max-w-xl mx-auto text-primary-foreground/75 text-base sm:text-lg leading-relaxed">
              {settings?.cta_text || "Send us a message. We will listen to your wishes and carefully coordinate every detail to bring you comfort."}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href={`https://wa.me/${(settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings?.whatsapp_message || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-sheen w-full sm:w-auto px-8 py-4 text-base text-primary bg-white shadow-lg shadow-black/10 hover:bg-zinc-50 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Phone className="h-4 w-4 mr-2" />
                {content.cta_button_text || "Start WhatsApp Chat"}
              </a>
              <Link
                href="/services"
                className="btn-base w-full sm:w-auto px-8 py-4 text-base text-primary-foreground/90 bg-white/10 hover:bg-white/15 hover:-translate-y-0.5 border border-white/15"
              >
                {content.ctaServicesButton || "View Services & Packages"}
              </Link>
            </div>
            <p className="text-xs text-primary-foreground/40 flex justify-center items-center gap-2 pt-4">
              <Heart className="h-3 w-3" />
              <span>{content.ctaFooterNote || "Dedicated customer support and photo reports with every service"}</span>
            </p>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
