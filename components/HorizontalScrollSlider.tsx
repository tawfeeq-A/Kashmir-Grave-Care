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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount + resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ─── DESKTOP: GSAP pinned horizontal scroll (unchanged) ───
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
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
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
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
    });

    return () => mm.revert();
  }, [slides.length, isMobile]);

  // ─── MOBILE: Track active slide via scroll snap ───
  useEffect(() => {
    if (!isMobile || !carouselRef.current) return;
    const el = carouselRef.current;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const slideWidth = el.offsetWidth;
      const idx = Math.round(scrollLeft / slideWidth);
      setActiveIndex(idx);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // ─── Shared slide content (both layouts use this) ───
  const Panel = (slide: SlideData, idx: number, active: boolean) => (
    <div className="max-w-5xl lg:max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8 lg:gap-20 items-center">
      {/* Number + Title inline + Description */}
      <div className="space-y-1.5 sm:space-y-4 lg:space-y-7 order-2 md:order-1 text-center md:text-left">
        <div className="flex items-baseline justify-center md:justify-start gap-2 sm:gap-3 lg:gap-5">
          <span
            className="font-serif text-[24px] sm:text-[48px] lg:text-[128px] leading-none font-bold bg-clip-text text-transparent select-none shrink-0"
            style={{
              WebkitTextStroke: "1.5px hsl(var(--primary) / 0.25)",
              backgroundImage: active
                ? "linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--primary) / 0.05))"
                : "none",
            }}
          >
            {slide.num}
          </span>
          <h3 className="text-sm sm:text-lg lg:text-3xl xl:text-4xl font-bold text-foreground font-serif leading-tight">
            {slide.title}
          </h3>
        </div>
        <p className="text-muted-foreground leading-relaxed text-[11px] sm:text-sm lg:text-lg max-w-sm lg:max-w-md mx-auto md:mx-0">
          {slide.desc}
        </p>
      </div>
      {/* Image */}
      <div className="flex justify-center md:justify-end items-center order-1 md:order-2">
        {slide.imageSrc ? (
          <div className="w-full max-w-[220px] sm:max-w-[300px] lg:max-w-[460px] aspect-[4/5] sm:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-border/70 bg-secondary relative group">
            <img
              src={slide.imageSrc}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/10 flex items-center justify-center">
            <span className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-primary/20">
              {slide.num}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // MOBILE: Native CSS-snap carousel (no GSAP, no pin, no scroll hijack)
  // ═══════════════════════════════════════════════════
  if (isMobile) {
    return (
      <section className="relative bg-background border-b border-border/40 py-12 overflow-hidden">
        {/* Header */}
        <div className="px-4 mb-6">
          {sectionTag && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
              {tagIcon} {sectionTag}
            </span>
          )}
          {sectionTitle && (
            <h2 className="font-serif text-xl font-bold text-foreground">
              {sectionTitle}
            </h2>
          )}
        </div>

        {/* Swipeable carousel with navigation arrows */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => {
              const prev = Math.max(0, activeIndex - 1);
              carouselRef.current?.scrollTo({
                left: prev * (carouselRef.current?.offsetWidth || 0),
                behavior: "smooth",
              });
            }}
            className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 border border-border/60 shadow-md flex items-center justify-center text-foreground/70 hover:text-foreground transition-all ${
              activeIndex === 0 ? "opacity-30 pointer-events-none" : "opacity-100"
            }`}
            aria-label="Previous slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => {
              const next = Math.min(slides.length - 1, activeIndex + 1);
              carouselRef.current?.scrollTo({
                left: next * (carouselRef.current?.offsetWidth || 0),
                behavior: "smooth",
              });
            }}
            className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 border border-border/60 shadow-md flex items-center justify-center text-foreground/70 hover:text-foreground transition-all ${
              activeIndex === slides.length - 1 ? "opacity-30 pointer-events-none" : "opacity-100"
            }`}
            aria-label="Next slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="w-full shrink-0 snap-center px-4"
            >
              {/* Card layout for mobile carousel */}
              <div className="bg-secondary/20 rounded-2xl border border-border/50 p-5 space-y-4">
                {/* Image */}
                {slide.imageSrc && (
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-border/60 bg-secondary">
                    <img
                      src={slide.imageSrc}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                {/* Text */}
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl font-bold text-primary/30 select-none">
                    {slide.num}
                  </span>
                  <h3 className="text-base font-bold text-foreground font-serif">
                    {slide.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {slide.desc}
                </p>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                carouselRef.current?.scrollTo({
                  left: idx * (carouselRef.current?.offsetWidth || 0),
                  behavior: "smooth",
                });
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "bg-primary w-6"
                  : "bg-border hover:bg-muted-foreground/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>
    );
  }

  // ═══════════════════════════════════════════════════
  // DESKTOP/TABLET: GSAP pinned horizontal scroll (unchanged from working version)
  // ═══════════════════════════════════════════════════
  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background border-b border-border/40 h-screen"
    >
      <div className="flex flex-col h-full">
        {/* Header — clears the fixed navbar */}
        <div className="shrink-0 pt-20 sm:pt-24 lg:pt-28 px-4 sm:px-6 lg:px-8">
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

        {/* Horizontal track */}
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

        {/* Progress indicator */}
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
