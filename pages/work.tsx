import React from "react";
import Head from "next/head";
import { useSite } from "@/context/SiteContext";
import { ExternalLink, Instagram, Facebook, Sparkles, Camera } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { GalleryGridSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/EmptyState";

export default function Work() {
  const { settings, workMedia, loading } = useSite();
  const content = settings?.content_json || {};
  const hasMedia = workMedia && workMedia.length > 0;

  return (
    <>
      <Head>
        <title>Our Work | {settings?.brand_name || "Grave Care Kashmir"}</title>
        <meta
          name="description"
          content="View our past projects, restorations, and general maintenance work."
        />
      </Head>

      <div className="bg-background/95 md:bg-background/80 md:backdrop-blur-md pt-28 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                <Sparkles className="h-3.5 w-3.5 mr-1" /> {content.workTag || "Our work"}
              </span>
              <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                {content.workHeading || "Browse our work on Instagram and Facebook."}
              </h1>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
                {content.workSubtext || "Browse before-and-after photos of our cleaning, alignment, and restoration work. Latest jobs are shared on our social platforms."}
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-8">
                {settings?.instagram_profile_url && (
                  <a
                    href={settings.instagram_profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-base btn-secondary px-6 py-3 text-sm hover:shadow-md"
                  >
                    <Instagram className="h-4.5 w-4.5 mr-2" /> Follow on Instagram
                  </a>
                )}
                {settings?.facebook_profile_url && (
                  <a
                    href={settings.facebook_profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-base press px-6 py-3 text-sm font-semibold text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Facebook className="h-4.5 w-4.5 mr-2" /> Follow on Facebook
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>

          {loading && !hasMedia ? (
            <GalleryGridSkeleton count={6} />
          ) : hasMedia ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workMedia.map((media, idx) => (
                <ScrollReveal key={media.id || idx} direction="up" delay={idx * 0.08}>
                  <a 
                    href={media.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block relative overflow-hidden rounded-3xl bg-secondary/30 border border-border/60 hover:border-primary/50 transition-all hover:shadow-xl aspect-[4/5] premium-card"
                  >
                    {media.storage_path ? (
                      <img 
                        src={media.storage_path} 
                        alt={media.caption || "Our work"} 
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                        <Instagram className="h-12 w-12 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex justify-between items-start">
                        <p className="text-white font-medium line-clamp-2 text-sm leading-relaxed">
                          {media.caption || "View post on social media"}
                        </p>
                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white ml-4 shrink-0 group-hover:bg-primary transition-colors duration-300">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal direction="up" delay={0.2}>
              <EmptyState
                icon={Camera}
                title="Our portfolio is being updated"
                description="We're preparing fresh before-and-after photos of our latest work across Kashmir. In the meantime, our newest projects are shared on our social pages."
                action={
                  settings?.instagram_profile_url ? (
                    <a
                      href={settings.instagram_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-base btn-secondary px-6 py-3 text-sm"
                    >
                      <Instagram className="h-4 w-4 mr-2" /> Follow on Instagram
                    </a>
                  ) : undefined
                }
              />
            </ScrollReveal>
          )}
        </div>
      </div>
    </>
  );
}
