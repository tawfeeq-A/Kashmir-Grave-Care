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
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !sliderRef.current) return;

    const totalSlides = slides.length;
    const slider = sliderRef.current;

    const tween = gsap.to(slider, {
      xPercent: -(100 - 100 / totalSlides),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 0.8,
        end: () => "+=" + slider.offsetWidth,
        onUpdate: (self) => {
          const idx = Math.min(
            totalSlides - 1,
            Math.floor(self.progress * totalSlides)
          );
          setActiveIndex(idx);
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [slides.length]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-background"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {sectionTag && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            {tagIcon} {sectionTag}
          </span>
        )}
        {sectionTitle && (
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {sectionTitle}
          </h2>
        )}
      </div>

      {/* Horizontal slider track */}
      <div
        ref={sliderRef}
        className="flex"
        style={{ width: `${slides.length * 100}vw` }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-screen px-4 sm:px-8 lg:px-16 flex items-center"
            style={{ height: "60vh" }}
          >
            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Number + Content */}
              <div className="space-y-6">
                <span
                  className="font-serif text-[120px] sm:text-[160px] leading-none font-bold bg-clip-text text-transparent select-none"
                  style={{
                    WebkitTextStroke: "2px hsl(var(--primary) / 0.2)",
                    backgroundImage:
                      idx === activeIndex
                        ? "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))"
                        : "none",
                  }}
                >
                  {slide.num}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground font-serif -mt-8">
                  {slide.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base max-w-lg">
                  {slide.desc}
                </p>
              </div>
              {/* Visual/Image Area */}
              <div className="flex justify-center items-center">
                {slide.imageSrc ? (
                  <div className="w-full max-w-[360px] aspect-square rounded-3xl overflow-hidden shadow-xl border border-border/85 bg-secondary relative group select-none">
                    <img
                      src={slide.imageSrc}
                      alt={slide.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>
                ) : slide.icon ? (
                  <div className="w-40 h-40 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                    {slide.icon}
                  </div>
                ) : (
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/10 flex items-center justify-center">
                    <span className="font-serif text-6xl font-bold text-primary/20">
                      {slide.num}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 px-8">
        <span className="text-sm font-mono text-muted-foreground">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <div className="w-48 h-0.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{
              width: `${((activeIndex + 1) / slides.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-sm font-mono text-muted-foreground">
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
