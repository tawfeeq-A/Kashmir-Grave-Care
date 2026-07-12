import * as React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon, Menu, X, Instagram, Facebook } from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   Motion Skill (jezweb) & macOS Magnification Dock — applied principles:
   ─────────────────────────────────────────────────────────────
   1. GPU-only: animate ONLY transform (scale, x, y, rotate) and opacity.
   2. useMotionValue, useTransform, and useSpring to track cursor distance 
      vertically and scale icons dynamically without React re-renders.
   3. Clamped scaling ensures magnification settles cleanly to 1.0.
   4. Staggered organic entrance springs for butter-smooth open/close.
   ═══════════════════════════════════════════════════════════════ */

interface DockItem {
  icon: LucideIcon
  label: string
  onClick?: (e?: React.MouseEvent) => void
  href?: string
  active?: boolean
  accent?: boolean
}

interface VerticalDockProps {
  className?: string
  items: DockItem[]
  instagramUrl?: string
  facebookUrl?: string
}

/* ── Spring presets (GPU-only) ── */
const GLIDE = { type: "spring" as const, stiffness: 200, damping: 26, mass: 0.9 }
const SNAP = { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.6 }
const MORPH = { type: "spring" as const, stiffness: 280, damping: 22, mass: 0.5 }

/* ── Stagger variants for entry/exit ── */
const listVariants = {
  closed: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
}

const itemVariants = {
  closed: {
    opacity: 0,
    scale: 0.3,
    x: 12,
    transition: GLIDE,
  },
  open: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: GLIDE,
  },
}

const dividerVariants = {
  closed: { opacity: 0, scaleX: 0, transition: GLIDE },
  open: { opacity: 1, scaleX: 1, transition: { ...GLIDE, delay: 0.06 } },
}

/* ──────────────────────────────────────────────────── */
/* Individual dock button with macOS Magnification      */
/* ──────────────────────────────────────────────────── */
function DockIconButton({
  icon: Icon,
  label,
  onClick,
  href,
  active,
  accent,
  overDark,
  reduced,
  showLabel,
  mouseY,
}: DockItem & { 
  overDark?: boolean; 
  reduced?: boolean | null; 
  showLabel?: boolean; 
  mouseY: MotionValue<number>;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
  const centerYRef = useRef<number>(0)

  // Cache button position relative to viewport on mount/resize/scroll
  useEffect(() => {
    const updatePosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        centerYRef.current = rect.top + rect.height / 2
      }
    }
    
    updatePosition()
    const t = setTimeout(updatePosition, 350) // Re-measure after intro animation settles
    
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
    }
  }, [showLabel])

  // Calculate vertical distance from mouse Y to button center
  const distance = useTransform(mouseY, (val) => {
    return val - centerYRef.current
  })

  // Magnification: map [-100px, 0px, 100px] distance to [1.0, 1.25, 1.0] scale
  const scaleTransform = useTransform(distance, [-100, 0, 100], [1, 1.25, 1], { clamp: true })
  
  // Smooth out the scale value using a light spring
  const scale = useSpring(scaleTransform, { stiffness: 200, damping: 25, mass: 0.1 })

  const iconColor = accent
    ? "text-[#25d366]"
    : active
      ? overDark ? "text-white" : "text-primary"
      : overDark
        ? "text-white/70 group-hover:text-white"
        : "text-foreground/65 group-hover:text-foreground dark:text-foreground/75 dark:group-hover:text-foreground"

  const labelColor = accent
    ? "text-[#25d366]"
    : active
      ? overDark ? "text-white" : "text-primary"
      : overDark
        ? "text-white/60 group-hover:text-white/90"
        : "text-foreground/50 group-hover:text-foreground/80 dark:text-foreground/60"

  const content = (
    <>
      <Icon className={cn(
        "w-[17px] h-[17px] shrink-0 transition-colors duration-200",
        iconColor
      )} />

      {/* Mobile: inline text label next to icon */}
      {showLabel && (
        <span className={cn(
          "text-[11px] font-medium leading-none whitespace-nowrap transition-colors duration-200 select-none",
          labelColor
        )}>
          {label}
        </span>
      )}

      {/* Desktop: hover tooltip to the left */}
      {!showLabel && (
        <span
          className={cn(
            "absolute right-full mr-3 top-1/2 -translate-y-1/2",
            "px-2.5 py-1.5 rounded-lg text-[11px] font-semibold",
            "bg-foreground text-background",
            "opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0",
            "transition-all duration-200 whitespace-nowrap pointer-events-none",
            "shadow-lg z-50"
          )}
        >
          {label}
        </span>
      )}

      {/* Active dot indicator */}
      {active && (
        <motion.span
          layoutId="dock-active-dot"
          transition={GLIDE}
          className={cn(
            "absolute -left-0.5 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full",
            overDark ? "bg-white" : "bg-primary"
          )}
        />
      )}
    </>
  )

  const classes = cn(
    "relative group flex items-center gap-2.5 py-2 px-2.5 rounded-xl transition-colors duration-150",
    accent
      ? "hover:bg-[#25d366]/10"
      : active
        ? overDark ? "bg-white/10" : "bg-primary/8"
        : overDark
          ? "hover:bg-white/8"
          : "hover:bg-foreground/[0.05]"
  )

  // Disable magnification scaling entirely on mobile/touch (showLabel=true) or when reduced motion is requested
  const dynamicStyle = (reduced || showLabel) ? undefined : { scale }

  const motionProps = {
    whileTap: reduced ? undefined : { scale: 0.92 },
    transition: SNAP,
  }

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={accent ? "_blank" : undefined}
        rel={accent ? "noopener noreferrer" : undefined}
        onClick={onClick}
        className={classes}
        style={dynamicStyle}
        aria-label={label}
        {...motionProps}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={classes}
      style={dynamicStyle}
      aria-label={label}
      {...motionProps}
    >
      {content}
    </motion.button>
  )
}

/* ──────────────────────────────────────────────────── */
/* Main Dock Component                                 */
/* ──────────────────────────────────────────────────── */
const Dock = React.forwardRef<HTMLDivElement, VerticalDockProps>(
  ({ items, className, instagramUrl, facebookUrl }, _ref) => {
    const [mounted, setMounted] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [hasHover, setHasHover] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [overDark, setOverDark] = useState(false)
    const reduced = useReducedMotion()
    const containerRef = useRef<HTMLDivElement | null>(null)
    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const hoveringRef = useRef(false)
    const expandedRef = useRef(false)

    // Motion value to track the absolute vertical mouse Y coordinate
    const mouseY = useMotionValue(Infinity)

    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20)
      }
      window.addEventListener("scroll", handleScroll, { passive: true })
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => { expandedRef.current = isExpanded }, [isExpanded])

    // Detect pointer type + viewport width
    useEffect(() => {
      const checkHover = () => setHasHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      const checkMobile = () => setIsMobile(window.innerWidth < 768)
      checkHover()
      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Auto-collapse after 4s unless hovered
    useEffect(() => {
      if (!isExpanded) return
      const t = setTimeout(() => {
        if (!hoveringRef.current) setIsExpanded(false)
      }, 4000)
      return () => clearTimeout(t)
    }, [isExpanded])

    // Contrast logic based on background section crossing center (38%)
    useEffect(() => {
      const marks = Array.from(document.querySelectorAll("[data-dock-dark]"))
      if (marks.length === 0) return
      const active = new Set<Element>()
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) active.add(e.target)
            else active.delete(e.target)
          })
          setOverDark(active.size > 0)
        },
        { rootMargin: "-38% 0px -62% 0px" }
      )
      marks.forEach((m) => io.observe(m))
      return () => io.disconnect()
    }, [])

    // Touch only: tap outside to close dock
    useEffect(() => {
      if (hasHover || !isExpanded) return
      const onDocDown = (e: PointerEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsExpanded(false)
        }
      }
      document.addEventListener("pointerdown", onDocDown)
      return () => document.removeEventListener("pointerdown", onDocDown)
    }, [hasHover, isExpanded])

    const handleMouseEnter = useCallback(() => {
      if (!hasHover) return
      hoveringRef.current = true
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
      setIsExpanded(true)
    }, [hasHover])

    const handleMouseLeave = useCallback(() => {
      if (!hasHover) return
      hoveringRef.current = false
      // Reset magnification scale
      mouseY.set(Infinity)
      leaveTimer.current = setTimeout(() => setIsExpanded(false), 400)
    }, [hasHover, mouseY])

    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node
      if (typeof _ref === "function") _ref(node)
      else if (_ref) (_ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    }

    const navItems = items.filter((item) => !item.accent)
    const accentItems = items.filter((item) => item.accent)

    const wrapItem = (item: DockItem): DockItem => ({
      ...item,
      onClick: (e?: React.MouseEvent) => {
        item.onClick?.(e)
        if (!hasHover) setIsExpanded(false)
      },
    })

    const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), [])

    // Magnification tracking for the Close button
    const closeRef = useRef<HTMLButtonElement>(null)
    const closeCenterYRef = useRef<number>(0)

    useEffect(() => {
      if (isMobile) return
      const updatePosition = () => {
        if (closeRef.current) {
          const rect = closeRef.current.getBoundingClientRect()
          closeCenterYRef.current = rect.top + rect.height / 2
        }
      }
      updatePosition()
      const t = setTimeout(updatePosition, 350)
      window.addEventListener("resize", updatePosition)
      window.addEventListener("scroll", updatePosition, { passive: true })
      return () => {
        clearTimeout(t)
        window.removeEventListener("resize", updatePosition)
        window.removeEventListener("scroll", updatePosition)
      }
    }, [isExpanded, isMobile])

    const closeDistance = useTransform(mouseY, (val) => val - closeCenterYRef.current)
    const closeScaleTransform = useTransform(closeDistance, [-100, 0, 100], [1, 1.25, 1], { clamp: true })
    const closeScale = useSpring(closeScaleTransform, { stiffness: 200, damping: 25, mass: 0.1 })
    const closeStyle = (reduced || isMobile) ? undefined : { scale: closeScale }
    if (!mounted) return null

    return (
      <div
        className={cn(
          "fixed z-50 flex items-center gap-1.5 sm:gap-2 transition-[top,right] duration-300",
          scrolled 
            ? "top-3 right-3 sm:top-3 sm:right-6" 
            : "top-3 right-3 sm:top-5 sm:right-6",
          className
        )}
      >
        {/* Social Icons (tightly aligned next to the dock with matching spacing) */}
        {!isExpanded && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5 flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5 flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </a>
            )}
          </div>
        )}

        <motion.div
          ref={setRefs}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reduced ? { duration: 0.15 } : GLIDE}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="navigation"
          aria-label="Site navigation"
          className={cn(
            "flex flex-col items-stretch",
            "rounded-2xl",
            "backdrop-blur-xl border border-border/50",
            "transition-[background-color,border-color,box-shadow] duration-300",
            overDark
              ? "bg-black/30 border-white/15 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)]"
              : "bg-background/88 border-border/50 shadow-[-4px_8px_32px_-10px_hsl(var(--foreground)/0.18)]"
          )}
        >
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="expanded-items"
              variants={listVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col items-stretch py-2 px-1.5"
              style={{ transformOrigin: "top right" }}
              onMouseMove={(e) => {
                if (!isMobile) mouseY.set(e.clientY)
              }}
              onMouseLeave={() => {
                if (!isMobile) mouseY.set(Infinity)
              }}
            >
              {/* Close button with X morph */}
              <motion.div variants={itemVariants}>
                <motion.button
                  ref={closeRef}
                  whileTap={reduced ? undefined : { scale: 0.85, rotate: -90 }}
                  transition={SNAP}
                  onClick={toggleExpand}
                  style={closeStyle}
                  className={cn(
                    "flex items-center justify-center py-2 px-2.5 rounded-xl transition-colors duration-150 w-full mb-0.5",
                    isMobile ? "gap-2.5" : "gap-0",
                    overDark
                      ? "text-white/50 hover:text-white hover:bg-white/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]"
                  )}
                  aria-label="Close navigation"
                >
                  <motion.div
                    initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    transition={MORPH}
                  >
                    <X className="w-4 h-4" />
                  </motion.div>
                  {isMobile && (
                    <span className={cn(
                      "text-[11px] font-medium leading-none select-none",
                      overDark ? "text-white/40" : "text-muted-foreground/60"
                    )}>
                      Close
                    </span>
                  )}
                </motion.button>
              </motion.div>

              {/* Nav items — mapped buttons */}
              {navItems.map((item) => (
                <motion.div key={item.label} variants={itemVariants}>
                  <DockIconButton
                    {...wrapItem(item)}
                    overDark={overDark}
                    reduced={reduced}
                    showLabel={isMobile}
                    mouseY={mouseY}
                  />
                </motion.div>
              ))}

              {/* Divider */}
              {accentItems.length > 0 && (
                <motion.div
                  variants={dividerVariants}
                  className={cn("h-px mx-2.5 my-1", overDark ? "bg-white/15" : "bg-border/60")}
                />
              )}

              {/* Accent items (WhatsApp) */}
              {accentItems.map((item) => (
                <motion.div key={item.label} variants={itemVariants}>
                  <DockIconButton 
                    {...item} 
                    overDark={overDark} 
                    reduced={reduced} 
                    showLabel={isMobile} 
                    mouseY={mouseY} 
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed menu trigger */}
        <AnimatePresence initial={false}>
          {!isExpanded && (
            <motion.button
              key="burger"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={GLIDE}
              whileTap={reduced ? undefined : { scale: 0.88 }}
              onClick={toggleExpand}
              className={cn(
                "relative h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center transition-colors",
                overDark
                  ? "text-white/85 hover:text-white"
                  : "text-foreground/75 hover:text-foreground dark:text-foreground/85"
              )}
              aria-label="Open navigation menu"
              aria-expanded={false}
            >
              <motion.div
                initial={{ rotate: 90, scale: 0.4, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={MORPH}
              >
                <Menu className="w-5 h-5" />
              </motion.div>

              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...GLIDE, delay: 0.3 }}
                className={cn(
                  "absolute top-1 right-1 w-1.5 h-1.5 rounded-full animate-pulse",
                  overDark ? "bg-white/50" : "bg-primary/50"
                )}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
)
Dock.displayName = "Dock"

export { Dock }
