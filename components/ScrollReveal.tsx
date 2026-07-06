import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: number;
  className?: string;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 60,
  stagger = 0,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const targets = stagger > 0 ? el.children : el;

    const fromVars: gsap.TweenVars = { opacity: 0 };
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration,
      delay,
      ease: "power3.out",
      stagger: stagger > 0 ? stagger : undefined,
    };

    switch (direction) {
      case "up":
        fromVars.y = distance;
        toVars.y = 0;
        break;
      case "down":
        fromVars.y = -distance;
        toVars.y = 0;
        break;
      case "left":
        fromVars.x = distance;
        toVars.x = 0;
        break;
      case "right":
        fromVars.x = -distance;
        toVars.x = 0;
        break;
      case "scale":
        fromVars.scale = 0.85;
        toVars.scale = 1;
        break;
      case "fade":
        // Just opacity
        break;
    }

    gsap.set(targets, fromVars);

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once,
      onEnter: () => {
        gsap.to(targets, toVars);
      },
      onEnterBack: once
        ? undefined
        : () => {
            gsap.to(targets, toVars);
          },
    });

    return () => {
      trigger.kill();
    };
  }, [direction, delay, duration, distance, stagger, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
