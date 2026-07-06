import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PanelData {
  num: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
}

interface ExpandingPanelsProps {
  panels: PanelData[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionTag?: string;
  tagIcon?: React.ReactNode;
}

export default function ExpandingPanels({
  panels,
  sectionTitle,
  sectionSubtitle,
  sectionTag,
  tagIcon,
}: ExpandingPanelsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 bg-secondary/20 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Panels — horizontal on desktop, vertical on mobile */}
        <div className="flex flex-col lg:flex-row gap-3 min-h-[400px]">
          {panels.map((panel, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.div
                key={idx}
                layout
                onClick={() => setActiveIndex(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIndex(idx);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`relative rounded-2xl border cursor-pointer overflow-hidden transition-colors duration-300 ${
                  isActive
                    ? "bg-primary border-primary/30 flex-[3]"
                    : "bg-background border-border/60 hover:border-primary/20 flex-1"
                }`}
                style={{ minHeight: isActive ? 400 : undefined }}
                transition={{ layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
              >
                {/* Inactive state — number + title vertically */}
                <AnimatePresence mode="wait">
                  {!isActive ? (
                    <motion.div
                      key="inactive"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="h-full flex flex-col items-center justify-center p-6 text-center"
                    >
                      <span className="text-3xl font-serif font-bold text-primary/30 mb-2">
                        {panel.num}
                      </span>
                      <span className="text-sm font-semibold text-foreground [writing-mode:vertical-rl] lg:[writing-mode:vertical-rl] hidden lg:block rotate-180">
                        {panel.title}
                      </span>
                      <span className="text-sm font-semibold text-foreground lg:hidden">
                        {panel.title}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="active"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="h-full flex flex-col justify-between p-8 lg:p-10"
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80 pointer-events-none" />
                      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                          <span className="text-5xl font-serif font-bold text-primary-foreground/30">
                            {panel.num}
                          </span>
                          {panel.icon && (
                            <div className="text-primary-foreground/70">
                              {panel.icon}
                            </div>
                          )}
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-primary-foreground font-serif">
                          {panel.title}
                        </h3>
                        <p className="text-primary-foreground/80 leading-relaxed text-base max-w-lg">
                          {panel.desc}
                        </p>
                      </div>

                      {/* Bottom decorative element */}
                      <div className="relative z-10 mt-8">
                        <div className="w-12 h-0.5 bg-primary-foreground/30 rounded-full" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
