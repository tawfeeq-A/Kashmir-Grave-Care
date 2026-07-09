import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TimelineNode {
  num: string;
  title: string;
  desc: string;
}

interface SVGPathTimelineProps {
  nodes: TimelineNode[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionTag?: string;
  tagIcon?: React.ReactNode;
}

/**
 * Journey of Care — responsive timeline.
 *  • Desktop (lg+): horizontal connected steps  ①──②──③──④
 *  • Mobile: vertical flow with a connecting rail
 * A single progress rail per layout fills on scroll (scrubbed, transform-based),
 * and each step fades/rises in with a short stagger.
 */
export default function SVGPathTimeline({
  nodes,
  sectionTitle,
  sectionSubtitle,
  sectionTag,
  tagIcon,
}: SVGPathTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hFillRef = useRef<HTMLDivElement>(null);
  const vFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(".joc-step", { opacity: 1, y: 0 });
        gsap.set([hFillRef.current, vFillRef.current], { scaleX: 1, scaleY: 1 });
        return;
      }

      // Steps: fade + rise, staggered, tied to the section entering view.
      gsap.set(".joc-step", { opacity: 0, y: 24 });
      gsap.to(".joc-step", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      // Progress rails fill as the section scrolls through the viewport.
      if (hFillRef.current) {
        gsap.fromTo(
          hFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "bottom 70%",
              scrub: 0.6,
            },
          }
        );
      }
      if (vFillRef.current) {
        gsap.fromTo(
          vFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              end: "bottom 75%",
              scrub: 0.6,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [nodes.length]);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 bg-background/95 md:bg-background/80 md:backdrop-blur-md border-b border-border/40 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          {sectionTag && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
              {tagIcon} {sectionTag}
            </span>
          )}
          {sectionTitle && (
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance">
              {sectionTitle}
            </h2>
          )}
          {sectionSubtitle && (
            <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed text-pretty">
              {sectionSubtitle}
            </p>
          )}
        </div>

        {/* ── Desktop: horizontal connected steps ── */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Rail track + animated fill, aligned to circle centers (half a column inset) */}
            <div
              className="absolute top-8 left-[12.5%] right-[12.5%] h-[3px] rounded-full bg-primary/12"
              aria-hidden="true"
            />
            <div
              ref={hFillRef}
              className="absolute top-8 left-[12.5%] right-[12.5%] h-[3px] rounded-full bg-primary/70 origin-left"
              style={{ transform: "scaleX(0)", willChange: "transform" }}
              aria-hidden="true"
            />

            <ol className="relative grid grid-cols-4 gap-6 xl:gap-10">
              {nodes.map((node, idx) => (
                <li key={idx} className="joc-step flex flex-col items-center text-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif text-2xl font-bold shadow-lg shadow-primary/25 ring-[6px] ring-background">
                    {node.num}
                  </div>
                  <div className="mt-7 space-y-2">
                    <h3 className="text-lg font-bold font-serif text-foreground">
                      {node.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[15rem] mx-auto text-pretty">
                      {node.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Mobile / tablet: vertical flow with connecting rail ── */}
        <ol className="lg:hidden relative max-w-md mx-auto">
          {/* Vertical rail track + fill, aligned to circle centers (left-6 = 24px = 48px circle center) */}
          {nodes.length > 1 && (
            <>
              <div
                className="absolute top-6 bottom-8 left-6 w-[3px] rounded-full bg-primary/12"
                aria-hidden="true"
              />
              <div
                ref={vFillRef}
                className="absolute top-6 bottom-8 left-6 w-[3px] rounded-full bg-primary/70 origin-top"
                style={{ transform: "scaleY(0)", willChange: "transform" }}
                aria-hidden="true"
              />
            </>
          )}

          {nodes.map((node, idx) => (
            <li
              key={idx}
              className="joc-step relative flex gap-5 pb-10 last:pb-0"
            >
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif text-lg font-bold shadow-md shadow-primary/25 ring-4 ring-background">
                {node.num}
              </div>
              <div className="pt-1 space-y-1.5">
                <h3 className="text-lg font-bold font-serif text-foreground">
                  {node.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                  {node.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
