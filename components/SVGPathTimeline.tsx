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

export default function SVGPathTimeline({
  nodes,
  sectionTitle,
  sectionSubtitle,
  sectionTag,
  tagIcon,
}: SVGPathTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const paths = section.querySelectorAll(".timeline-path");

      paths.forEach((path) => {
        try {
          const svgPath = path as SVGPathElement;
          const pathLength = svgPath.getTotalLength();
          
          // Set initial state — path invisible
          gsap.set(svgPath, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });

          // Animate path drawing on scroll
          gsap.to(svgPath, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: svgPath,
              start: "top 75%",
              end: "bottom 55%",
              scrub: true,
            },
          });
        } catch (e) {
          console.warn("Failed to get SVG path length:", e);
        }
      });

      // Animate each node's appearance
      nodesRef.current.forEach((node) => {
        if (!node) return;
        gsap.set(node, { opacity: 0, y: 30 });
        gsap.to(node, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: node,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [nodes.length]);
  return (
    <section
      ref={sectionRef}
      className="py-14 sm:py-20 bg-background/95 md:bg-background/80 md:backdrop-blur-md border-b border-border/40 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
          {sectionTag && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
              {tagIcon} {sectionTag}
            </span>
          )}
          {sectionTitle && (
            <h2 className="font-serif text-2xl sm:text-3xl font-bold sm:text-4xl text-foreground">
              {sectionTitle}
            </h2>
          )}
          {sectionSubtitle && (
            <p className="mt-3 sm:mt-4 text-muted-foreground max-w-2xl text-base sm:text-lg">
              {sectionSubtitle}
            </p>
          )}
        </div>

        {/* Timeline container */}
        <div className="relative max-w-3xl mx-auto">
          {/* Timeline nodes */}
          <div className="space-y-0 relative z-10">
            {nodes.map((node, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  ref={(el) => { nodesRef.current[idx] = el; }}
                  className={`flex flex-row items-stretch gap-6 lg:gap-12 text-left ${
                    isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Node dot and connector column */}
                  <div className="relative flex-shrink-0 z-10 order-1 lg:order-2 flex flex-col items-center">
                    <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-primary text-primary-foreground font-bold text-base lg:text-xl flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-primary/10 transition-transform duration-300 hover:scale-110 shrink-0">
                      {node.num}
                    </div>
                    {/* Active Sequential Path (Only show if not last step) */}
                    {idx < nodes.length - 1 && (
                      <div className="w-1 lg:w-2 grow flex justify-center py-2 min-h-[60px]">
                        <svg
                          className="w-full h-full text-primary/15"
                          viewBox="0 0 4 100"
                          preserveAspectRatio="none"
                          fill="none"
                        >
                          <line
                            x1="2"
                            y1="0"
                            x2="2"
                            y2="100"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            className="timeline-path"
                            d="M2 0 L2 100"
                            stroke="hsl(var(--primary))"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 space-y-2 lg:space-y-3 pb-12 order-2 ${
                      isLeft ? "lg:order-1 lg:text-right" : "lg:order-3 lg:text-left"
                    }`}
                  >
                    <h3 className="text-lg lg:text-xl font-bold text-foreground font-serif">
                      {node.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-md lg:mx-0">
                      {node.desc}
                    </p>
                  </div>

                  {/* Spacer (hidden on mobile, visible on desktop to push layout) */}
                  <div className={`flex-1 hidden lg:block ${isLeft ? "lg:order-3" : "lg:order-1"}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
