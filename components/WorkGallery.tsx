import React from "react";
import Link from "next/link";
import { useSite } from "@/context/SiteContext";
import { Camera, ExternalLink, ArrowRight, Instagram } from "lucide-react";

export default function WorkGallery() {
  const { workMedia, settings } = useSite();
  const content = settings?.content_json || {};

  if (!workMedia || workMedia.length === 0) {
    return null; // Don't render anything if there's no work media available
  }

  return (
    <section className="py-20 bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            <Camera className="h-3.5 w-3.5 mr-1" /> Portfolio
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {content.workGalleryHeading || "See Our Work"}
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-2xl mx-auto">
            {content.workGalleryDesc || "Browse through our recent maintenance and restoration projects across Kashmir. We take pride in the visible difference our respectful care brings to these resting places."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workMedia.map((media) => (
            <a
              key={media.id}
              href={media.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 aspect-[4/5] min-h-[280px]"
            >
              {media.file_type.startsWith('video') ? (
                <video
                  src={media.file_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <img
                  src={media.storage_path || media.file_url}
                  alt={media.caption || "Grave care work"}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  loading="lazy"
                  onError={(e) => {
                    // Hide broken image and show fallback
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              )}
              {/* Fallback placeholder for broken images */}
              <div 
                className="absolute inset-0 items-center justify-center bg-zinc-900 hidden"
              >
                <Instagram className="h-12 w-12 text-white/20" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Caption and link icon */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between items-end">
                  <div>
                    {media.caption && (
                      <p className="text-white text-sm font-medium line-clamp-2 leading-relaxed">{media.caption}</p>
                    )}
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white ml-3 shrink-0 group-hover:bg-primary transition-colors duration-300">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View All Work Link */}
        <div className="text-center mt-12">
          <Link
            href="/work"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all border border-primary/20 hover:-translate-y-0.5 hover:shadow-md"
          >
            View All Our Work
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
