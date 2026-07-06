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
  const pathRef = useRef<SVGPathElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const path = pathRef.current;
    let pathTween: gsap.core.Tween | null = null;

    if (path) {
      const svgElement = path.closest("svg");
      const isSvgVisible = svgElement && window.getComputedStyle(svgElement).display !== "none";

      if (isSvgVisible) {
        try {
          const pathLength = path.getTotalLength();
          
          // Set initial state — path invisible
          gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });

          // Animate path drawing on scroll
          pathTween = gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 40%",
              scrub: 1,
            },
          });
        } catch (e) {
          console.warn("Failed to get SVG path length:", e);
        }
      }
    }

    // Animate each node's appearance
    const nodeTweens = nodesRef.current.map((node, idx) => {
      if (!node) return null;
      gsap.set(node, { opacity: 0, y: 40 });
      return gsap.to(node, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: node,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      if (pathTween) {
        pathTween.scrollTrigger?.kill();
        pathTween.kill();
      }
      nodeTweens.forEach((t) => {
        if (t) {
          t.scrollTrigger?.kill();
          t.kill();
        }
      });
    };
  }, [nodes.length]);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-background border-b border-border/40 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
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

        {/* Timeline with SVG path */}
        <div className="relative max-w-4xl mx-auto">
          {/* SVG S-Curve path (hidden on mobile, visible desktop) */}
          <svg
            className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-16 hidden lg:block"
            viewBox="0 0 60 800"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              ref={pathRef}
              d="M30 0 C30 100, 30 100, 30 200 C30 300, 30 300, 30 400 C30 500, 30 500, 30 600 C30 700, 30 700, 30 800"
              stroke="hsl(var(--primary) / 0.4)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Timeline nodes */}
          <div className="space-y-16 lg:space-y-24 relative">
            {nodes.map((node, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  ref={(el) => { nodesRef.current[idx] = el; }}
                  className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-12 ${
                    isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 space-y-3 ${
                      isLeft ? "lg:text-right" : "lg:text-left"
                    } text-center`}
                  >
                    <h3 className="text-xl font-bold text-foreground font-serif">
                      {node.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                      {node.desc}
                    </p>
                  </div>

                  {/* Center node dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-primary/10">
                      {node.num}
                    </div>
                  </div>

                  {/* Spacer for other side */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
