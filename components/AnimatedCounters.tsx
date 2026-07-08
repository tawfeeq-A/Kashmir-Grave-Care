import { useEffect, useRef, useState } from "react";

interface CounterData {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  desc?: string;
}

interface AnimatedCountersProps {
  counters: CounterData[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionTag?: string;
  tagIcon?: React.ReactNode;
}

export default function AnimatedCounters({
  counters,
  sectionTitle,
  sectionSubtitle,
  sectionTag,
  tagIcon,
}: AnimatedCountersProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<number[]>(counters.map(() => 0));
  const hasAnimated = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect reduced-motion: jump straight to final values
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const runCountUp = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      if (prefersReduced) {
        setValues(counters.map((c) => c.value));
        return;
      }

      const duration = 1800; // ms
      const start = performance.now();
      // easeOutCubic for a natural deceleration
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        const eased = ease(progress);
        setValues(counters.map((c) => Math.round(c.value * eased)));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountUp();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    // Fallback: if the section is already in view on mount (e.g. very tall screens)
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      runCountUp();
      observer.disconnect();
    }

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [counters]);

  return (
    <section ref={sectionRef} className="py-14 sm:py-20 bg-background/95 md:bg-background/80 md:backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(sectionTitle || sectionTag) && (
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            {sectionTag && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                {tagIcon} {sectionTag}
              </span>
            )}
            {sectionTitle && (
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="mt-3 sm:mt-4 text-muted-foreground max-w-2xl text-base sm:text-lg">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Counter grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {counters.map((counter, idx) => {
            const percentage = counter.value > 0
              ? Math.min(100, (values[idx] / counter.value) * 100)
              : 0;
            const circumference = 2 * Math.PI * 45;
            const dashOffset = counter.value > 0
              ? circumference - (percentage / 100) * circumference
              : circumference;

            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-2xl bg-secondary/20 border border-border/40 hover:border-primary/20 transition-colors"
              >
                {/* Circular gauge */}
                <div className="relative w-20 h-20 sm:w-28 sm:h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="4"
                    />
                    {/* Animated fill circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      style={{ transition: "stroke-dashoffset 0.1s linear" }}
                    />
                  </svg>
                  {/* Number in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg sm:text-2xl font-bold text-foreground font-mono">
                      {counter.prefix}
                      {values[idx]}
                      {counter.suffix}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    {counter.label}
                  </h4>
                  {counter.desc && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {counter.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
