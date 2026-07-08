import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    // On mobile, reduce distance to prevent jarring layout jumps.
    // The element still fades in, just with less vertical travel.
    const isMobileDevice = window.innerWidth < 768;
    const actualDistance = isMobileDevice ? Math.min(distance, 24) : distance;
    const actualDuration = isMobileDevice ? Math.min(duration, 0.6) : duration;

    const ctx = gsap.context(() => {
      const targets = stagger > 0 ? el.children : el;

      const fromVars: gsap.TweenVars = { opacity: 0 };
      const toVars: gsap.TweenVars = {
        opacity: 1,
        duration: actualDuration,
        delay,
        ease: "power3.out",
        stagger: stagger > 0 ? stagger : undefined,
      };

      switch (direction) {
        case "up":
          fromVars.y = actualDistance;
          toVars.y = 0;
          break;
        case "down":
          fromVars.y = -actualDistance;
          toVars.y = 0;
          break;
        case "left":
          fromVars.x = actualDistance;
          toVars.x = 0;
          break;
        case "right":
          fromVars.x = -actualDistance;
          toVars.x = 0;
          break;
        case "scale":
          fromVars.scale = 0.92;
          toVars.scale = 1;
          break;
        case "fade":
          // Just opacity
          break;
      }

      gsap.set(targets, fromVars);

      ScrollTrigger.create({
        trigger: el,
        start: isMobileDevice ? "top 90%" : "top 85%",
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
    }, ref);

    return () => {
      ctx.revert();
    };
  }, [direction, delay, duration, distance, stagger, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
