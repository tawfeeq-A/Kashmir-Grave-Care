import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    if (!sectionRef.current) return;
    const tweens: gsap.core.Tween[] = [];

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        counters.forEach((counter, idx) => {
          const obj = { val: 0 };
          const tween = gsap.to(obj, {
            val: counter.value,
            duration: 2,
            ease: "power2.out",
            delay: idx * 0.15,
            onUpdate: () => {
              setValues((prev) => {
                const next = [...prev];
                next[idx] = Math.floor(obj.val);
                return next;
              });
            },
          });
          tweens.push(tween);
        });
      },
    });

    return () => {
      trigger.kill();
      tweens.forEach((t) => t.kill());
    };
  }, [counters]);

  return (
    <section ref={sectionRef} className="py-20 bg-background border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Counter grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
                className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-secondary/20 border border-border/40 hover:border-primary/20 transition-colors"
              >
                {/* Circular gauge */}
                <div className="relative w-28 h-28">
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
                      className="transition-all duration-100"
                    />
                  </svg>
                  {/* Number in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground font-mono">
                      {counter.prefix}
                      {values[idx]}
                      {counter.suffix}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
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
