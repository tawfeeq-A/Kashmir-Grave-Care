import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon, Menu } from "lucide-react"

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
}

// Apple-style spring: smooth, barely-there settle. Used for open/close + press.
const SPRING = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.9 }

function DockIconButton({
  icon: Icon,
  label,
  onClick,
  href,
  active,
  accent,
  overDark,
  reduced,
}: DockItem & { overDark?: boolean; reduced?: boolean | null }) {
  const iconColor = accent
    ? "text-[#25d366]"
    : active
    ? overDark
      ? "text-white"
      : "text-primary"
    : overDark
    ? "text-white/75 group-hover:text-white"
    : "text-foreground/70 group-hover:text-foreground dark:text-foreground/80 dark:group-hover:text-foreground"

  const content = (
    <>
      <Icon className={cn("w-[18px] h-[18px] transition-colors duration-200", iconColor)} />
      {/* Tooltip to the left */}
      <span
        className={cn(
          "absolute right-full mr-3 top-1/2 -translate-y-1/2",
          "px-2 py-1 rounded-md text-[10px] font-semibold",
          "bg-foreground text-background",
          "opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0",
          "transition-all duration-150 whitespace-nowrap pointer-events-none",
          "shadow-md z-50"
        )}
      >
        {label}
      </span>
      {/* Sliding active indicator (shared layout) */}
      {active && (
        <motion.span
          layoutId="dock-active"
          transition={SPRING}
          className={cn(
            "absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full",
            overDark ? "bg-white" : "bg-primary"
          )}
        />
      )}
    </>
  )

  const classes = cn(
    "relative group flex items-center justify-center p-3 rounded-xl transition-colors duration-150",
    accent
      ? "hover:bg-[#25d366]/12"
      : active
      ? overDark
        ? "bg-white/15"
        : "bg-primary/10"
      : overDark
      ? "hover:bg-white/10"
      : "hover:bg-foreground/[0.06]"
  )

  const motionProps = {
    whileHover: reduced ? undefined : { scale: 1.12 },
    whileTap: reduced ? undefined : { scale: 0.9 },
    transition: SPRING,
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target={accent ? "_blank" : undefined}
        rel={accent ? "noopener noreferrer" : undefined}
        onClick={onClick}
        className={classes}
        aria-label={label}
        {...motionProps}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      className={classes}
      aria-label={label}
      {...motionProps}
    >
      {content}
    </motion.button>
  )
}

const Dock = React.forwardRef<HTMLDivElement, VerticalDockProps>(
  ({ items, className }, _ref) => {
    const [isExpanded, setIsExpanded] = useState(true)
    const [hasHover, setHasHover] = useState(true)
    const [overDark, setOverDark] = useState(false)
    const [hidden, setHidden] = useState(false)
    const reduced = useReducedMotion()
    const containerRef = useRef<HTMLDivElement | null>(null)
    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const hoveringRef = useRef(false)
    const expandedRef = useRef(true)

    useEffect(() => { expandedRef.current = isExpanded }, [isExpanded])

    // Detect input type on mount
    useEffect(() => {
      setHasHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches)
    }, [])

    // Auto-close a few seconds after expanding. Hovering keeps it open;
    // on touch it collapses on its own after the delay.
    useEffect(() => {
      if (!isExpanded) return
      const t = setTimeout(() => {
        if (!hoveringRef.current) setIsExpanded(false)
      }, 4000)
      return () => clearTimeout(t)
    }, [isExpanded])

    // Adaptive contrast: lighten icons when the dock's vertical band overlaps a
    // section marked [data-dock-dark]. The band sits at the dock's center (~38%).
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

    // Hide-on-scroll-down / show-on-scroll-up (premium mobile-OS behavior).
    // Only hides while collapsed & not hovered, and only past a small offset.
    useEffect(() => {
      let lastY = window.scrollY
      let ticking = false
      const onScroll = () => {
        if (ticking) return
        ticking = true
        requestAnimationFrame(() => {
          const y = window.scrollY
          const delta = y - lastY
          if (Math.abs(delta) > 6) {
            if (delta > 0 && y > 240 && !expandedRef.current && !hoveringRef.current) {
              setHidden(true)
            } else if (delta < 0) {
              setHidden(false)
            }
            lastY = y
          }
          ticking = false
        })
      }
      window.addEventListener("scroll", onScroll, { passive: true })
      return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Touch: tap outside to close
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

    const handleMouseEnter = () => {
      if (!hasHover) return
      hoveringRef.current = true
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
      setIsExpanded(true)
    }

    const handleMouseLeave = () => {
      if (!hasHover) return
      hoveringRef.current = false
      leaveTimer.current = setTimeout(() => setIsExpanded(false), 300)
    }

    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node
      if (typeof _ref === "function") _ref(node)
      else if (_ref) (_ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    }

    const navItems = items.filter((item) => !item.accent)
    const accentItems = items.filter((item) => item.accent)

    // On touch, selecting a nav item collapses the dock after navigation.
    const wrapItem = (item: DockItem): DockItem => ({
      ...item,
      onClick: (e?: React.MouseEvent) => {
        item.onClick?.(e)
        if (!hasHover) setIsExpanded(false)
      },
    })

    return (
      <motion.div
        ref={setRefs}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: hidden ? 0 : 1, x: hidden ? 64 : 0 }}
        transition={reduced ? { duration: 0.2 } : { ...SPRING, opacity: { duration: 0.25 } }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="navigation"
        aria-label="Site navigation"
        className={cn(
          // Attached flush to the right edge — reads as part of the interface,
          // not a floating pill. Left corners rounded only.
          "fixed right-0 top-[38%] -translate-y-1/2 z-50",
          "flex flex-col items-center rounded-l-2xl rounded-r-none",
          "backdrop-blur-xl border border-r-0",
          "transition-[background-color,border-color,box-shadow] duration-300",
          overDark
            ? "bg-black/30 border-white/15 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)]"
            : "bg-background/85 border-border/60 shadow-[-4px_8px_30px_-10px_hsl(var(--foreground)/0.25)]",
          isExpanded ? "px-1.5 py-2" : "p-0",
          className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={reduced ? { duration: 0.15 } : SPRING}
              className="flex flex-col items-center gap-0.5"
              style={{ transformOrigin: "right center" }}
            >
              {navItems.map((item) => (
                <DockIconButton key={item.label} {...wrapItem(item)} overDark={overDark} reduced={reduced} />
              ))}
              {accentItems.length > 0 && (
                <div className={cn("w-5 h-px my-1", overDark ? "bg-white/20" : "bg-border/70")} />
              )}
              {accentItems.map((item) => (
                <DockIconButton key={item.label} {...item} overDark={overDark} reduced={reduced} />
              ))}
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={reduced ? { duration: 0.12 } : SPRING}
              whileTap={reduced ? undefined : { scale: 0.9 }}
              onClick={() => setIsExpanded(true)}
              className={cn(
                "p-3.5 rounded-l-2xl transition-colors",
                overDark
                  ? "text-white/90 hover:text-white"
                  : "text-foreground/80 hover:text-foreground dark:text-foreground/90"
              )}
              aria-label="Open navigation menu"
              aria-expanded={false}
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
)
Dock.displayName = "Dock"

export { Dock }
