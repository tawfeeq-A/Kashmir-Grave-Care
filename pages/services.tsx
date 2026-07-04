import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Check, Info, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import WorkGallery from "@/components/WorkGallery";
import Scroll3DTilt from "@/components/Scroll3DTilt";

export default function Services() {
  const { settings } = useSite();
  const content = settings?.content_json || {};

  const packages = [
    {
      name: content.pkg1Name || "Gentle Routine Care",
      tagline: content.pkg1Tag || "Ongoing respect & general maintenance",
      description: content.pkg1Desc || "Ideal for maintaining neatness, keeping the grass trimmed, and routine cleanliness on a regular schedule to honor their resting place.",
      features: [
        content.pkg1Feature1 || "Bi-monthly gentle weeding and debris sweeping",
        content.pkg1Feature2 || "Grass trimming to maintain neat surroundings",
        content.pkg1Feature3 || "Loving cleaning of the headstone",
        content.pkg1Feature4 || "Heartfelt before-and-after photo reports",
        content.pkg1Feature5 || "GPS-tagged grave location pinning",
      ].filter(Boolean),
      ctaText: content.pkg1Cta || "Inquire about Gentle Care",
      popular: false,
    },
    {
      name: content.pkg2Name || "Loving Restoration",
      tagline: content.pkg2Tag || "Deep cleaning & engraving revival",
      description: content.pkg2Desc || "A complete, respectful overhaul for graves that are weathered, stained, or have faded inscriptions over the years.",
      features: [
        content.pkg2Feature1 || "All features in Gentle Routine Care",
        content.pkg2Feature2 || "Marble and limestone gentle washing",
        content.pkg2Feature3 || "Chemical-free moss & stain extraction",
        content.pkg2Feature4 || "Calligraphy engraving re-inking (Gold/Black)",
        content.pkg2Feature5 || "Careful soil leveling and structural check",
        content.pkg2Feature6 || "Annual structural stability inspection",
      ].filter(Boolean),
      ctaText: content.pkg2Cta || "Inquire about Restoration",
      popular: true,
    },
    {
      name: content.pkg3Name || "Heartfelt Visitations",
      tagline: content.pkg3Tag || "Spiritual honoring & upkeep",
      description: content.pkg3Desc || "Focused on spiritual remembrance, ensuring you can be virtually present to honor your loved one on special anniversaries.",
      features: [
        content.pkg3Feature1 || "Thorough cleaning before significant dates",
        content.pkg3Feature2 || "Recitation of Holy Quran / Dua-e-Fatiha by a local Qari",
        content.pkg3Feature3 || "Live video link allowing you to be present during prayers",
        content.pkg3Feature4 || "Dedicated photo and video reports",
        content.pkg3Feature5 || "Providing comfort across the miles",
      ].filter(Boolean),
      ctaText: content.pkg3Cta || "Inquire about Visitations",
      popular: false,
    },
  ];

  const customServicesList = [
    { name: content.customReq1 || "Specific Commemorative Arrangements" },
    { name: content.customReq2 || "Gravel Refilling (White marble chips or red stone gravel)" },
    { name: content.customReq3 || "Additional Calligraphy detailing (per inscription)" },
    { name: content.customReq4 || "Structural stone joint repair / Mortar patching" },
    { name: content.customReq5 || "Sufi Shrine Ziyarat Tribute (Prayers on their behalf at shrines)" },
  ].filter(s => s.name);

  return (
    <>
      <Head>
        <title>{content.seoTitle || "Services | Grave Care Kashmir"}</title>
        <meta
          name="description"
          content={content.seoDescription || "Explore our packages including Routine Care, Premium Restoration, and Custom Dua Tributes in Kashmir. Custom options available."}
        />
      </Head>

      <div className="bg-background pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" /> {content.servicesPageTag || "Transparent Care Services"}
            </span>
            <h1 className="font-serif text-4xl font-extrabold text-foreground md:text-5xl tracking-tight">
              {content.servicesPageHeading || "Our Maintenance & Restoration Services"}
            </h1>
            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              {content.servicesPageSubtext || "We offer flexible programs and specialized custom treatments to fit your family's needs. Pricing varies based on grave size, location, and condition."}
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-stretch">
            {packages.map((pkg) => (
              <Scroll3DTilt key={pkg.name} maxTilt={pkg.popular ? 4 : 6}>
                <div
                  className={`relative bg-background rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 h-full cursor-pointer ${
                    pkg.popular
                      ? "border-primary shadow-lg ring-1 ring-primary/20 scale-[1.02] z-10 hover:shadow-2xl hover:scale-[1.04] active:shadow-lg active:scale-[1.01]"
                      : "border-border/80 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:border-primary/30 active:shadow-md active:scale-[1.00]"
                  }`}
                >
                {pkg.popular && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
                    Most Requested
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">{pkg.name}</h3>
                    <p className="text-xs text-primary font-medium mt-1 uppercase tracking-wide">
                      {pkg.tagline}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <ul className="space-y-3.5 pt-4 border-t border-border/40">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start space-x-2 text-sm text-muted-foreground">
                        <Check className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-auto">
                  <a
                    href={`https://wa.me/${(settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings?.whatsapp_message || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex w-full items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                      pkg.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/95 hover:shadow-md"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    }`}
                  >
                    {pkg.ctaText}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </div>
              </div>
            </Scroll3DTilt>
          ))}
          </div>

          {/* Custom Addons / Custom Request Box */}
          <div className="bg-secondary/20 rounded-3xl p-8 border border-border/60">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  <Heart className="h-3 w-3 mr-1 fill-current" /> {content.customReqTag || "Bespoke Requests"}
                </span>
                <h3 className="font-serif text-3xl font-bold text-foreground">
                  {content.customReqHeading || "Specialized Add-ons & Custom Care"}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {content.customReqDesc || "Every resting place is unique. If you have specific requirements not covered in our standard packages, we are more than happy to accommodate them."}
                </p>
                <div className="pt-4">
                  <a
                    href={`https://wa.me/${(settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings?.whatsapp_message || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Discuss a custom request
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </a>
                </div>
              </div>
              
              <div className="lg:col-span-7">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {customServicesList.map((service, idx) => (
                    <li key={idx} className="flex items-start bg-white p-4 rounded-2xl border border-border/50 shadow-sm">
                      <div className="mr-3 mt-0.5 shrink-0 bg-secondary rounded-full p-1">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{service.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WorkGallery />
    </>
  );
}
