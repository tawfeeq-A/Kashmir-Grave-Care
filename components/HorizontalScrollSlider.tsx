import { useEffect, useRef, useState, useCallback } from "react";
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

/* Auto-advance interval (ms) and pause after user interaction (ms) */
const AUTO_INTERVAL = 3000;
const TOUCH_PAUSE = 8000;

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

  // Auto-advance refs (mobile only)
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);
  // NOTE: we do NOT rely on activeIndexRef for the next-slide computation —
  // instead we always read scrollLeft directly to avoid iOS stale-ref bugs.

  // Detect mobile on mount + resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ─── DESKTOP: GSAP pinned horizontal scroll ───
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
      const slideWidth = el.offsetWidth;
      if (!slideWidth) return;
      const idx = Math.round(el.scrollLeft / slideWidth);
      setActiveIndex(idx);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // ─── MOBILE: Programmatic scroll to a specific slide index ───
  // FIX: removed 'smooth' CSS class from the element — we rely solely on JS
  // scrollTo({ behavior: "smooth" }) to avoid the iOS Safari silent-fail bug
  // where scroll-behavior:smooth on the element suppresses programmatic smooth
  // scrolls that originate from setInterval (no user gesture in the chain).
  const scrollToSlide = useCallback((idx: number) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTo({
      left: idx * el.offsetWidth,
      behavior: "smooth",
    });
  }, []);

  // ─── MOBILE: Auto-advance timer — reads scrollLeft directly (never stale) ───
  const startAutoAdvance = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      const el = carouselRef.current;
      if (!el) return;
      // Derive current slide from DOM state — avoids any React state/ref lag
      const slideWidth = el.offsetWidth;
      const currentIdx = slideWidth > 0 ? Math.round(el.scrollLeft / slideWidth) : 0;
      const nextIdx = (currentIdx + 1) % slides.length;
      scrollToSlide(nextIdx);
    }, AUTO_INTERVAL);
  }, [slides.length, scrollToSlide]);

  const pauseAutoAdvance = useCallback(() => {
    isPausedRef.current = true;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, TOUCH_PAUSE);
  }, []);

  // Start auto-advance when the carousel enters the viewport
  useEffect(() => {
    if (!isMobile || !sectionRef.current) return;

    const section = sectionRef.current;

    // Initially snap to slide 0 immediately
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
    setActiveIndex(0);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // If user scrolled away while offscreen, snap back to slide 0
          if (carouselRef.current) {
            const slideWidth = carouselRef.current.offsetWidth;
            const currentIdx = slideWidth > 0
              ? Math.round(carouselRef.current.scrollLeft / slideWidth)
              : 0;
            if (currentIdx !== 0) {
              carouselRef.current.scrollTo({ left: 0, behavior: "auto" });
              setActiveIndex(0);
            }
          }
          isPausedRef.current = false;
          startAutoAdvance();
        } else {
          // Stop rotation when scrolled out of view
          if (autoTimerRef.current) {
            clearInterval(autoTimerRef.current);
            autoTimerRef.current = null;
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [isMobile, startAutoAdvance]);

  // Pause on user touch/pointer interaction
  useEffect(() => {
    if (!isMobile || !carouselRef.current) return;
    const el = carouselRef.current;
    const onTouch = () => pauseAutoAdvance();
    el.addEventListener("touchstart", onTouch, { passive: true });
    el.addEventListener("pointerdown", onTouch);
    return () => {
      el.removeEventListener("touchstart", onTouch);
      el.removeEventListener("pointerdown", onTouch);
    };
  }, [isMobile, pauseAutoAdvance]);

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
  // MOBILE: Auto-rotating carousel (no arrows, timer-driven)
  // ═══════════════════════════════════════════════════
  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative bg-background border-b border-border/40 py-12 overflow-hidden">
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

        {/* Auto-rotating carousel
            FIX: removed scroll-smooth Tailwind class — scroll-behavior:smooth on the
            element causes iOS Safari to silently drop programmatic smooth scrolls
            triggered by setInterval (no user gesture). We use scrollTo({behavior:"smooth"})
            in JS instead, which works correctly across all tested browsers.
        */}
        <div className="relative">
          <div
            ref={carouselRef}
            role="region"
            aria-label="Eco-ethical values carousel"
            className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ overscrollBehaviorX: "contain", willChange: "scroll-position" }}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${slides.length}: ${slide.title}`}
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

        {/* Dot indicators — tapping pauses auto-advance and jumps to slide */}
        <div className="flex items-center justify-center gap-2 mt-5" role="tablist" aria-label="Slide navigation">
          {slides.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === activeIndex}
              aria-current={idx === activeIndex ? "true" : undefined}
              onClick={() => {
                scrollToSlide(idx);
                pauseAutoAdvance();
              }}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                idx === activeIndex
                  ? "bg-primary w-6"
                  : "bg-border hover:bg-muted-foreground/40 w-2"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>
    );
  }

  // ═══════════════════════════════════════════════════
  // DESKTOP/TABLET: GSAP pinned horizontal scroll
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
