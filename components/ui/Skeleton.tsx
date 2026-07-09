import { cn } from "@/lib/utils";

/** Base shimmer skeleton block. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden="true" />;
}

/** Gallery grid loading state — mirrors the WorkGallery / work page layout. */
export function GalleryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      role="status"
      aria-label="Loading gallery"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl overflow-hidden border border-border/60">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
        </div>
      ))}
      <span className="sr-only">Loading our work…</span>
    </div>
  );
}

/** Text-block skeleton (heading + lines). */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading content">
      <Skeleton className="h-6 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 ? "w-1/2" : "w-full")} />
      ))}
    </div>
  );
}
