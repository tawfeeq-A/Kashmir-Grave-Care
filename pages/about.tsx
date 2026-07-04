import React from "react";
import Head from "next/head";
import Image from "next/image";
import { Users, ShieldCheck, Heart, Sparkles, HeartHandshake, BookOpen, Leaf } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export default function About() {
  const { settings } = useSite();
  const content = settings?.content_json || {};

  const pillars = [
    {
      title: content.pillar1Title || "Respect (Adab)",
      desc: content.pillar1Text || "Every action we take in the graveyard is performed with the utmost respect, following Islamic guidelines for visiting and maintaining resting places.",
      icon: <Leaf className="h-6 w-6" />,
    },
    {
      title: content.pillar2Title || "Transparency",
      desc: content.pillar2Text || "We provide clear, honest pricing and comprehensive photo/video reports so you know exactly what care was provided.",
      icon: <ShieldCheck className="h-6 w-6" />,
    },
    {
      title: content.pillar3Title || "Excellence (Ihsan)",
      desc: content.pillar3Text || "From removing the smallest weeds to restoring intricate marble calligraphy, we perform our work to the highest possible standard.",
      icon: <HeartHandshake className="h-6 w-6" />,
    },
  ];

  const cemeteries = [
    {
      name: content.cemetery1Name || "Malkhah Cemetery (Rainawari / Eidgah)",
      tag: content.cemetery1Tag || "Srinagar\u0027s Largest",
    },
    {
      name: content.cemetery2Name || "Hazratbal Shrine Graveyard",
      tag: content.cemetery2Tag || "Serene Lakeside",
    },
    {
      name: content.cemetery3Name || "Naqshband Sahib Cemetery",
      tag: content.cemetery3Tag || "Heritage Site",
    },
  ];

  return (
    <>
      <Head>
        <title>About Us | Grave Care Kashmir</title>
        <meta
          name="description"
          content="Learn about our story, fair-wage caretaking, eco-friendly policies, and our commitment to preserving Kashmir graveyards."
        />
      </Head>

      <div className="bg-background pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Story Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                <Heart className="h-3.5 w-3.5 mr-1.5 fill-current" /> {content.aboutHeroTag || "Connecting Families"}
              </span>
              <h1 className="font-serif text-4xl font-extrabold text-foreground md:text-5xl tracking-tight leading-tight">
                {content.aboutHeroTitle || "Our Story: Preserving Heritage & Dignity"}
              </h1>
              <p className="text-muted-foreground leading-relaxed text-base">
                {content.aboutHeroText1 || "Our cemeteries have stood for centuries as silent sentinels of remembrance. They represent our history, our families, and our deeply held respect for those who came before us."}
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                {content.aboutHeroText2 || "Grave Care Kashmir was founded by a group of passionate locals in Srinagar who recognized a growing challenge: as more Kashmiri families moved abroad to build lives in the Gulf, North America, and Europe, their ancestral graves in Srinagar, Sopore, Anantnag, and local village graveyards became increasingly neglected due to distance."}
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                {content.aboutHeroText3 || "Our service is built to be a bridge of filial duty and love. We combine traditional respect with modern communication so that distance never weakens your connection to your ancestors."}
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-xl border border-border bg-zinc-950">
                <Image
                  src="/images/kashmir-cemetery.png"
                  alt="Traditional Kashmir cemetery with white marble graves and Chinar trees"
                  fill
                  className="object-cover opacity-95"
                />
              </div>
            </div>
          </div>

          {/* Three Pillars: Ethics, Eco, Quality */}
          <div className="border-t border-border/40 pt-16 mb-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h1 className="font-serif text-3xl font-bold sm:text-4xl text-foreground">
                {content.aboutHeading || "Our Story of Compassion"}
              </h1>
              <p className="mt-4 text-muted-foreground max-w-2xl text-lg">
                {content.aboutSubHeading || "Caring for those who have departed, comforting those who remain."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="bg-secondary/15 rounded-2xl p-8 border border-border/50 hover:shadow-md transition-shadow space-y-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary inline-block">
                    {pillar.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kashmir Cemeteries Section */}
          <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              <div className="lg:w-1/2 space-y-6">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                  <BookOpen className="h-3.5 w-3.5 mr-1" /> {content.aboutOurStoryTag || "Heritage"}
                </span>
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  {content.aboutOurStoryHeading || "Serving Across Kashmir"}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                  <p>{content.aboutOurStoryText1 || "Grave Care Kashmir began with a simple, deeply personal realization. Many families, separated by oceans and borders, carry a quiet heartache knowing they cannot regularly visit or maintain the resting places of their loved ones in Kashmir."}</p>
                  <p>{content.aboutOurStoryText2 || "We understand that tending to a grave is an act of profound love. When distance prevents you from being there, we step in to fulfill that duty. We treat every resting place with the utmost reverence, as if it belonged to our own family."}</p>
                  <p>{content.aboutOurStoryText3 || "Our mission is not just maintenance; it is providing peace of mind. We want you to feel connected, knowing that your loved one's memory is honored in a beautiful, well-cared-for space."}</p>
                </div>
              </div>

              {/* Visual Grid representing cemeteries of Kashmir */}
              <div className="space-y-4">
                <div className="p-6 bg-background rounded-2xl border border-border">
                  <h4 className="font-serif font-bold text-foreground text-lg mb-2">
                    {content.aboutCemeteriesHeading || "Srinagar Cemeteries We Regularly Serve"}
                  </h4>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    {cemeteries.map((cem, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span>{cem.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">{cem.tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
