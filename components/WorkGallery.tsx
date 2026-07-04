import React from "react";
import { useSite } from "@/context/SiteContext";
import { Image as ImageIcon, Camera } from "lucide-react";

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

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {workMedia.map((media) => (
            <div key={media.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-border bg-secondary shadow-sm hover:shadow-md transition-shadow">
              {media.file_type.startsWith('video') ? (
                <video
                  src={media.file_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto object-cover"
                />
              ) : (
                <img
                  src={media.file_url}
                  alt={media.caption || "Grave care work"}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  loading="lazy"
                />
              )}
              {media.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
                  <p className="text-white text-sm font-medium">{media.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
