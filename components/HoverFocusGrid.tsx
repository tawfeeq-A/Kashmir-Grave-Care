import React, { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

interface TileData {
  num: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
}

interface HoverFocusGridProps {
  tiles: TileData[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionTag?: string;
  tagIcon?: React.ReactNode;
}

/**
 * HoverFocusGrid component renders a list of tiles side-by-side.
 * When a user hovers over one tile, the other tiles scale down and dim,
 * leaving only the hovered tile in sharp focus.
 */
export default function HoverFocusGrid({
  tiles,
  sectionTitle,
  sectionSubtitle,
  sectionTag,
  tagIcon,
}: HoverFocusGridProps) {
  // Track which tile index is currently being hovered
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="py-20 bg-background border-b border-border/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        {(sectionTitle || sectionTag) && (
          <div className="text-center max-w-2xl mx-auto mb-16">
            {sectionTag && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                {tagIcon} {sectionTag}
              </span>
            )}
            {sectionTitle && (
              <h2 className="font-serif text-3xl font-bold sm:text-4xl text-foreground">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="mt-4 text-muted-foreground max-w-2xl text-lg">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        {/* 3-Column Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiles.map((tile, idx) => {
            const isHovered = hoveredIdx === idx;
            const isAnyHovered = hoveredIdx !== null;
            const isOtherHovered = isAnyHovered && !isHovered;

            return (
              <ScrollReveal
                key={idx}
                direction="up"
                delay={idx * 0.1}
                className="h-full"
              >
                <div
                  // Keyboard focus support for accessibility (a11y)
                  tabIndex={0}
                  onFocus={() => setHoveredIdx(idx)}
                  onBlur={() => setHoveredIdx(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setHoveredIdx(idx);
                    }
                  }}
                  
                  // Mouse hover event triggers
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  
                  // Fluid CSS transition classes:
                  // - If hovered: scale up, bring to front, highlight border and background
                  // - If another tile is hovered: scale down, lower opacity, add subtle blur
                  // - focus-visible: add visible ring outline for keyboard users
                  className={`flex flex-col p-8 h-full bg-secondary/40 rounded-3xl border transition-all duration-500 ease-out select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isHovered
                      ? "scale-[1.04] z-10 border-primary/40 bg-secondary/70 shadow-xl shadow-primary/5"
                      : isOtherHovered
                      ? "scale-[0.93] opacity-45 blur-[0.5px] border-border/40"
                      : "scale-100 opacity-100 border-border/80"
                  }`}
                >
                  {/* Icon Area */}
                  {tile.icon && (
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                      isHovered
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-primary/10 text-primary border-primary/20"
                    }`}>
                      {tile.icon}
                    </div>
                  )}

                  {/* Tile Number / Label */}
                  <div className={`text-xs font-mono font-bold mt-6 tracking-wider uppercase transition-colors duration-500 ${
                    isHovered ? "text-accent" : "text-muted-foreground/60"
                  }`}>
                    {tile.num}
                  </div>

                  {/* Card Title */}
                  <h3 className="text-xl font-bold text-foreground font-serif mt-2 mb-3">
                    {tile.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tile.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
