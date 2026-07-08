import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SlideData {
  num: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
  imageSrc?: string;
}

interface HorizontalScrollSliderProps {
  slides: SlideData[];
  sectionTitle?: string;
  sectionTag?: string;
  tagIcon?: React.ReactNode;
}

export default function HorizontalScrollSlider({
  slides,
  sectionTitle,
  sectionTag,
  tagIcon,
}: HorizontalScrollSliderProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setReducedMotion(true);
      return;
    }

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const lastIndex = Math.max(1, slides.length - 1);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + getDistance(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Settle on whole panels so a single slide fills the frame (no half-panels)
          snap: {
            snapTo: 1 / lastIndex,
            duration: { min: 0.2, max: 0.5 },
            delay: 0.06,
            ease: "power1.inOut",
          },
          onUpdate: (self) => {
            const idx = Math.round(self.progress * lastIndex);
            setActiveIndex((prev) => (prev === idx ? prev : idx));
          },
        },
      });

      const imgs = Array.from(track.querySelectorAll("img"));
      imgs.forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
        }
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, section);

    return () => ctx.revert();
  }, [slides.length]);

  const Panel = (slide: SlideData, idx: number, active: boolean) => (
    <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 lg:gap-10 items-center">
      {/* Number + Title inline + Description */}
      <div className="space-y-1.5 sm:space-y-3 lg:space-y-5 order-2 md:order-1 text-center md:text-left">
        {/* Number and title on same line */}
        <div className="flex items-baseline justify-center md:justify-start gap-2 sm:gap-3">
          <span
            className="font-serif text-[24px] sm:text-[48px] lg:text-[100px] leading-none font-bold bg-clip-text text-transparent select-none shrink-0"
            style={{
              WebkitTextStroke: "1.5px hsl(var(--primary) / 0.25)",
              backgroundImage: active
                ? "linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--primary) / 0.05))"
                : "none",
            }}
          >
            {slide.num}
          </span>
          <h3 className="text-sm sm:text-lg lg:text-2xl font-bold text-foreground font-serif">
            {slide.title}
          </h3>
        </div>
        <p className="text-muted-foreground leading-relaxed text-[11px] sm:text-xs lg:text-base max-w-sm mx-auto md:mx-0">
          {slide.desc}
        </p>
      </div>
      {/* Image */}
      <div className="flex justify-center items-center order-1 md:order-2">
        {slide.imageSrc ? (
          <div className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[360px] aspect-[4/5] sm:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-border/70 bg-secondary relative group">
            <img
              src={slide.imageSrc}
              alt={slide.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/10 flex items-center justify-center">
            <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary/20">
              {slide.num}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Reduced-motion fallback ───
  if (reducedMotion) {
    return (
      <section className="relative bg-background border-b border-border/40 py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          {sectionTag && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
              {tagIcon} {sectionTag}
            </span>
          )}
          {sectionTitle && (
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              {sectionTitle}
            </h2>
          )}
        </div>
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {slides.map((slide, idx) => (
            <div key={idx} className="w-full shrink-0 snap-center px-6 sm:px-10 lg:px-16">
              {Panel(slide, idx, idx === activeIndex)}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">Swipe to explore</p>
      </section>
    );
  }

  // ─── Default: GSAP pinned horizontal scroll ───
  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background border-b border-border/40 h-[100dvh]"
    >
      {/* Pinned viewport: header in flow + track below */}
      <div className="flex flex-col h-full">
        {/* Header — always visible, in normal flow, never moves */}
        <div className="shrink-0 pt-16 sm:pt-14 lg:pt-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {sectionTag && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-1.5 sm:mb-2">
                {tagIcon} {sectionTag}
              </span>
            )}
            {sectionTitle && (
              <h2 className="font-serif text-lg sm:text-2xl lg:text-4xl font-bold text-foreground">
                {sectionTitle}
              </h2>
            )}
          </div>
        </div>

        {/* Horizontal track — fills remaining vertical space */}
        <div
          ref={trackRef}
          className="flex flex-1 min-h-0"
          style={{ width: `${slides.length * 100}vw` }}
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="w-screen shrink-0 h-full flex items-center justify-center px-5 sm:px-8 lg:px-16 py-2 sm:py-4 overflow-hidden"
            >
              {Panel(slide, idx, idx === activeIndex)}
            </div>
          ))}
        </div>

        {/* Progress indicator — always visible at bottom */}
        <div className="shrink-0 pb-4 sm:pb-6 flex items-center justify-center gap-4">
          <span className="text-xs sm:text-sm font-mono text-muted-foreground">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <div className="w-24 sm:w-48 h-0.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }}
            />
          </div>
          <span className="text-xs sm:text-sm font-mono text-muted-foreground">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
