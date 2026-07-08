import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

function DockIconButton({
  icon: Icon,
  label,
  onClick,
  href,
  active,
  accent,
  overDark,
}: DockItem & { overDark?: boolean }) {
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
      <Icon className={cn("w-4 h-4 transition-colors duration-200", iconColor)} />
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
      {active && (
        <span
          className={cn(
            "absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full",
            overDark ? "bg-white" : "bg-primary"
          )}
        />
      )}
    </>
  )

  const classes = cn(
    "relative group p-2.5 rounded-lg transition-colors duration-150",
    accent
      ? "hover:bg-[#25d366]/10"
      : active
      ? overDark
        ? "bg-white/15"
        : "bg-primary/8"
      : overDark
      ? "hover:bg-white/10"
      : "hover:bg-foreground/5"
  )

  if (href) {
    return (
      <motion.a
        href={href}
        target={accent ? "_blank" : undefined}
        rel={accent ? "noopener noreferrer" : undefined}
        whileHover={{ scale: 1.15, x: -2 }}
        whileTap={{ scale: 0.88 }}
        onClick={onClick}
        className={classes}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.15, x: -2 }}
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      className={classes}
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
    const containerRef = useRef<HTMLDivElement | null>(null)
    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const hoveringRef = useRef(false)

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
    // Forward the event so router-based onClick handlers can preventDefault
    // (avoids the <a href> triggering a full page reload).
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
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "fixed right-2 sm:right-3 top-[38%] -translate-y-1/2 z-50",
          "flex flex-col items-center rounded-xl",
          "backdrop-blur-xl border shadow-lg transition-[background-color,border-color,box-shadow] duration-300 hover:shadow-xl",
          overDark
            ? "bg-black/25 border-white/20"
            : "bg-background/90 border-border/50",
          isExpanded ? "px-1.5 py-2" : "p-0",
          className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex flex-col items-center gap-0.5"
            >
              {navItems.map((item) => (
                <DockIconButton key={item.label} {...wrapItem(item)} overDark={overDark} />
              ))}
              {accentItems.length > 0 && (
                <div className={cn("w-4 h-px my-1", overDark ? "bg-white/25" : "bg-border/60")} />
              )}
              {accentItems.map((item) => (
                <DockIconButton key={item.label} {...item} overDark={overDark} />
              ))}
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsExpanded(true)}
              className={cn(
                "p-3 rounded-xl transition-colors",
                overDark
                  ? "text-white/90 hover:text-white"
                  : "text-foreground/80 hover:text-foreground dark:text-foreground/90"
              )}
              aria-label="Open navigation menu"
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
