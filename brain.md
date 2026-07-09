# 🧠 Grave Care Kashmir — Project Brain

> **Last Updated**: 2026-07-09  
> **Stack**: Next.js 14 + React 18 + TypeScript + Tailwind CSS 3 + Framer Motion + GSAP + Lenis + Three.js  
> **Deployment**: Vercel (repo: github.com/tawfeeq-A/Kashmir-Grave-Care)  
> **CMS**: Supabase (PostgreSQL) — RLS policies in `docs/supabase-rls.sql`  
> **PWA**: v1.0.0 — standalone, installable (manifest.json + sw.js v3 multi-cache). **First Load JS: 272 KB** (Three.js code-split via dynamic import).

> ⚠️ **AGENT NOTE (read first, always):** This `brain.md` is the source of truth for what has been built and changed. Consult it BEFORE making any new changes, and UPDATE it after every set of changes. Skills installed for this project live in `.kiro/steering/` (UI/UX Pro Max) plus the global taste/design skills.

---

## 📁 Project Structure

```
grave-care-kashmir/
├── pages/
│   ├── _app.tsx            # App wrapper — SmoothScroll + MaskReveal + page transitions + SideDock + AdminPanel
│   ├── _document.tsx       # HTML — fonts, favicon, PWA manifest, theme-init, security meta
│   ├── index.tsx           # Homepage — Hero → Intro (image + text) → Services → Before/After → Timeline → Stats → Eco Horizontal Scroll → CTA
│   ├── about.tsx           # About — Story, Pillars, Cemeteries served
│   ├── services.tsx        # Services & pricing — 3 packages + custom addons + WorkGallery
│   ├── work.tsx            # Portfolio gallery — Instagram/Facebook media from Supabase
│   └── contact.tsx         # Multi-step booking form (4 steps) — Supabase + WhatsApp/email
├── components/
│   ├── SmoothScroll.tsx     # Lenis ↔ GSAP ScrollTrigger sync
│   ├── ParticleCanvas.tsx   # 2D particles — reduced-motion + tab-hidden pause; dynamic-imported
│   ├── WobblySphereCanvas.tsx # 3D wave sphere (IcosahedronGeometry 32) — reduced-motion + tab-hidden pause; dynamic-imported
│   ├── ScrollReveal.tsx     # GSAP ScrollTrigger scroll reveal (multi-direction)
│   ├── MaskReveal.tsx       # Page entrance mask animation
│   ├── HorizontalScrollSlider.tsx  # GSAP pinned horizontal scroll — snap on mobile, smooth on desktop (gsap.matchMedia)
│   ├── SVGPathTimeline.tsx  # Scroll-drawn SVG timeline with sequential path connectors
│   ├── AnimatedCounters.tsx # IntersectionObserver + rAF count-up (no GSAP dependency)
│   ├── Navbar.tsx           # Minimal fixed navbar — logo + social icons only
│   ├── SideDock.tsx         # Router-wired collapsible vertical side dock (nav + WhatsApp)
│   ├── Footer.tsx           # Footer + monumental text + dark-mode toggle + newsletter
│   ├── ImageBeforeAfter.tsx # Interactive before/after image slider (clip-path)
│   ├── Scroll3DTilt.tsx     # Scroll-based 3D perspective tilt (Framer Motion)
│   ├── WorkGallery.tsx      # Work media grid from Supabase
│   ├── AdminPanel.tsx       # Admin panel (triple-tap from footer) + "Reset All to Defaults"
│   ├── ProgressBar.tsx      # Scroll progress bar — ref + rAF DOM write
│   └── ui/
│       ├── shape-landing-hero.tsx  # Geometric shapes hero
│       └── dock-two.tsx     # Collapsible vertical side dock — adaptive dark-surface icons, auto-close
├── docs/
│   └── supabase-rls.sql     # RLS policies (run in Supabase SQL editor before go-live)
├── context/
│   └── SiteContext.tsx      # React context — site_settings + work_media from Supabase
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── utils.ts             # cn() utility
│   └── contentSchema.ts     # Admin content JSON schema + defaults
├── styles/
│   └── globals.css          # Design system: tokens, glass, shadows, animations, reduced-motion
├── public/
│   ├── icons/               # icon-48 thru icon-512.png + maskable-192/512.png (PWA)
│   ├── images/              # logo.jpg, kashmir-cemetery.png, grave-*.jpg, eco_*.webp
│   ├── favicon.png          # 48x48 PNG favicon
│   ├── manifest.json        # PWA manifest (standalone, 11 icons, shortcuts)
│   └── sw.js                # Service worker v3 (multi-cache, offline fallback, update handling)
├── scripts/
│   └── generate-icons.js    # Sharp-based icon generator (run: npm run generate-icons)
├── vercel.json              # git.deploymentEnabled: false (manual deploy only)
├── next.config.js           # AVIF/WebP images, security headers
├── tailwind.config.ts       # CSS-variable colors, accordion animation
├── package.json             # Next.js 14, React 18, Framer Motion, GSAP, Three.js, Lenis
└── brain.md                 # This file — project source of truth
```

---

## 🎨 Design System

### Color Palette
| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--primary` | `160 45% 22%` (#1E5C45) | `160 40% 32%` | Main brand green |
| `--accent` | `36 72% 44%` (#C2841A) | `36 72% 44%` | Warm amber accent |
| `--background` | `0 0% 100%` (white) | `220 20% 6%` | Page background |
| `--foreground` | `220 20% 12%` | `45 15% 92%` | Text color |
| `--secondary` | `45 20% 95%` | `220 15% 12%` | Card/surface backgrounds |
| `--muted-foreground` | `220 10% 46%` | `220 10% 60%` | Subtle text |
| `--border` | `220 10% 90%` | `220 15% 18%` | Borders |

### Typography
| Font | Usage | Weights |
|---|---|---|
| **Outfit** | Body text, UI elements | 300-800 |
| **Inter** | Fallback body text | 300-800 |
| **Playfair Display** | Serif headings, hero titles | 400-800 |
| **Noto Nastaliq Urdu** | Urdu/Arabic text (hero) | 400, 700 |

### Animation Inventory
| Animation | Type | Source Inspiration |
|---|---|---|
| Particle canvas background | Canvas API + rAF | futureoffinance.peachweb.io |
| Scroll-pinned horizontal slider | GSAP ScrollTrigger pin | myweblab.it |
| SVG path drawing timeline | GSAP strokeDashoffset | myweblab.it |
| Expanding accordion panels | Framer Motion layout | myweblab.it |
| Animated circular gauges | GSAP + SVG circle | myweblab.it |
| Page entrance mask reveal | Framer Motion clipPath | myweblab.it |
| Smooth scrolling | Lenis + GSAP sync | myweblab.it |
| Scroll reveal (multi-direction) | GSAP ScrollTrigger | Both sites |
| Monumental footer text scroll | CSS animation | myweblab.it |
| Geometric shape float | Framer Motion | Original |
| 3D scroll tilt | Framer Motion + scroll | Original |
| Orbital card breathing | CSS keyframes | Original |
| Floating info cards | CSS keyframes | Original |
| Pulse glow ring | CSS keyframes | New |
| Gradient shift | CSS keyframes | New |

---

## 🗄️ Supabase Schema

### Tables
- **`site_settings`** — Single row (id: 'main'), stores all CMS content
- **`work_media`** — Portfolio media entries (Instagram/Facebook posts)
- **`contact_submissions`** — Form submissions from booking portal
- **`newsletter_subscriptions`** — Email subscriptions

### Key Fields in `site_settings.content_json`
All text on the site is CMS-driven via `content_json` object. Keys follow pattern:
- `seoTitle`, `seoDescription` — page meta
- `serviceOneTitle`, `serviceOneText` — service cards
- `stepOneTitle`, `stepOneText` — process steps
- `ecoCard1Title`, `ecoCard1Text` — eco-values
- `pillar1Title`, `pillar1Text` — about page pillars
- `pkg1Name`, `pkg1Tag`, `pkg1Feature1` — service packages
- `footerDesc`, `footerCopyright` — footer content
- `form_submit_method` — 'whatsapp' or 'email'

---

## 📦 Dependencies

### Production
| Package | Version | Purpose |
|---|---|---|
| next | ^14.2.35 | React framework |
| react / react-dom | ^18.2.0 | UI library |
| @supabase/supabase-js | ^2.110.0 | Database client |
| framer-motion | ^10.16.4 | Layout animations, hero shapes |
| gsap | latest | Scroll animations, counters, timeline |
| lenis | latest | Smooth scroll |
| lucide-react | ^0.314.0 | Icon library |
| tailwindcss | ^3.4.1 | Utility CSS |
| clsx + tailwind-merge | latest | Class merging |

### Dev
| Package | Purpose |
|---|---|
| typescript | Type safety |
| @types/react, @types/node | Type definitions |
| autoprefixer, postcss | CSS processing |

---

## 🔑 Environment Variables

File: `.env.local`
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key

---

## 🔐 Admin Access

- **Trigger**: Triple-tap the `•` dot next to copyright in footer
- **Component**: `AdminPanel.tsx` (37KB)
- **Capabilities**: Edit all CMS content, upload work media, manage settings

---

## 📝 Change Log

### 2026-07-06 — Major Redesign
**Inspiration**: futureoffinance.peachweb.io + myweblab.it

#### New Components Added:
- `SmoothScroll.tsx` — Lenis smooth scroll wrapper
- `ParticleCanvas.tsx` — Floating particles animation
- `ScrollReveal.tsx` — GSAP multi-direction scroll reveal
- `MaskReveal.tsx` — Page entrance mask animation
- `HorizontalScrollSlider.tsx` — GSAP pinned horizontal scroll with imageSrc support
- `SVGPathTimeline.tsx` — Scroll-drawn timeline
- `ExpandingPanels.tsx` — Interactive accordion panels
- `AnimatedCounters.tsx` — Circular gauge counters
- `HoverFocusGrid.tsx` — 3-tile grid with hover scale transitions
- `WobblySphereCanvas.tsx` — 3D-projected wave sphere controlled by scroll velocity and depth

#### Custom Assets Added:
- `public/images/eco_caretaker_wages.png` — Fair wages for caretakers card image
- `public/images/eco_organic_soil.png` — Organic horticulture card image
- `public/images/eco_cemetery_heritage.png` — Respectful appearance card image
- `public/images/eco_gps_reporting.png` — GPS & transparent reporting card image

#### Modified Files:
- `_app.tsx` — Added SmoothScroll + MaskReveal wrappers
- `_document.tsx` — Added Outfit font
- `globals.css` — Complete rewrite with animations, utilities, dark mode
- `index.tsx` — Full redesign with new animation components (HoverFocusGrid, HorizontalScrollSlider image mapping)
- `about.tsx` — Added scroll reveal animations, parallax
- `services.tsx` — Added staggered animations, premium hover
- `work.tsx` — Added parallax gallery, enhanced hover
- `contact.tsx` — Added glass cards, decorative backgrounds, animations
- `Footer.tsx` — Added monumental scrolling text, animated links
- `shape-landing-hero.tsx` — Integrated ParticleCanvas behind hero

#### New Dependencies:
- `gsap` — Scroll animations, counters, timeline
- `lenis` — Smooth scrolling

### 2026-07-06 — Transition, Background & Theme Enhancements

#### Proposed Changes:
1. **Disable Entrance Mask Transition** (`components/MaskReveal.tsx`):
   - Modify component to render children immediately. Remove the circles animation delay and the initial clip-path circles.
2. **Move Sphere & Particle Animation to Page Background** (`pages/index.tsx`, `components/ui/shape-landing-hero.tsx`):
   - Move `WobblySphereCanvas` and `ParticleCanvas` from the local Hero component (`shape-landing-hero.tsx`) to a global fixed background container on the Homepage (`pages/index.tsx`) with a z-index of `-10`, ensuring the wobbly waves span from the header all the way down to the footer.
   - Add `pointer-events-none` to shape-landing-hero wrappers to prevent any visual overlays from blocking click events.
3. **Add Light/Dark Theme Adaptability to 3D Sphere** (`components/WobblySphereCanvas.tsx`):
   - Dynamically read CSS custom properties (`--primary` and `--accent`) in the animation tick to update color uniforms. This automatically syncs the Three.js WebGL rendering colors during dark/light mode switches.

### 2026-07-07 — Admin Panel Scroll Fix

#### Proposed Changes:
1. **Fix Admin Panel Scrolling** (`components/AdminPanel.tsx`):
   - Add `data-lenis-prevent` attribute to the top-level backdrop wrapper of `AdminPanel` to prevent Lenis from hijacking wheel events.
   - Set `document.body.style.overflow = 'hidden'` on mount and restore on unmount to freeze homepage background scroll when editing.

### 2026-07-07 — Global Background Animation & Page Transparency

#### Proposed Changes:
1. **Move Background Canvas to Layout Level** (`pages/_app.tsx`):
   - Import and render `WobblySphereCanvas` and `ParticleCanvas` globally inside `pages/_app.tsx`.
   - Remove the local instance from `pages/index.tsx` to prevent duplicate Three.js contexts.
2. **Apply Transparency to Pages**:
   - Update wrapper containers in `pages/about.tsx`, `pages/services.tsx`, `pages/work.tsx`, and `pages/contact.tsx` to use `bg-background/80 backdrop-blur-md` instead of solid `bg-background`. This enables the wobbly sphere waves to remain visible and morph dynamically across the entire site.

### 2026-07-07 — Horizontal Scroll Slider Mobile Height Fix

#### Proposed Changes:
1. **Fix Mobile Content Clipping** (`components/HorizontalScrollSlider.tsx`):
   - Replace the hardcoded `60vh` inline height on slide elements with a responsive height class: `min-h-[75vh] lg:min-h-0 lg:h-[60vh]`. This allows stacked grid contents to expand naturally on mobile devices without clipping the lower part of the card images.
   - Scale down the large decorative numbers (`text-[80px]` instead of `text-[120px]`) and reduce negative margin offsets on mobile to prevent layouts from overlapping.
   - Adjust the maximum image width on mobile to `max-w-[280px]` (expanding to `360px` on desktop) for optimized framing.

### 2026-07-07 — SVGPathTimeline Responsive Layout Redesign

#### Proposed Changes:
1. **Redesign SVGPathTimeline for Mobile Responsiveness** (`components/SVGPathTimeline.tsx`):
   - Make the connecting line SVG visible on all screen sizes (remove `hidden lg:block`).
   - On mobile, position the connecting line and numbers on the **left** (`left-[28px]`), shifting the text content to the right with left-alignment.
   - On desktop, transition the layout back to a centered alternating timeline.
   - Draw a background track line and an active progress path (`M2 0 L2 100`) that animates sequentially as the user scrolls.

### 2026-07-07 — Complete UI/UX Refinement & Performance Optimization

#### Proposed Changes & Accomplishments:
1. **Responsive Horizontal Scroll Slider Restoration** (`components/HorizontalScrollSlider.tsx`):
   - Preserved horizontal GSAP pinning on all screen widths as a hero element.
   - Sized slide content dynamically for mobile: reduced decorative numbers size (`text-[45px]`), modified mobile image aspect ratios to `4/3` and container bounds to `max-h-[580px]` to guarantee the entire slider fits mobile heights without clipping or cropping.
2. **Warm, Supportive, and Comforting Text Overhaul** (`pages/index.tsx`):
   - Rewrote all homepage core copy, services, step consultation labels, and custodianship values to use a warmer, empathetic tone comforting for grieving families.
3. **Sequential Timeline Path Connectors** (`components/SVGPathTimeline.tsx`):
   - Replaced absolute SVG tracking with inline segment paths inside a natural vertical flex timeline column.
   - Triggers dynamic sequential line drawing dot-to-dot as you scroll down each step.
4. **60fps Render Loop Performance Caching** (`components/WobblySphereCanvas.tsx`, `components/ParticleCanvas.tsx`):
   - Configured a root `MutationObserver` to cache colors and active dark mode boolean state.
   - Completely removed expensive layout-reflow DOM reads from Three.js and 2D canvas ticking rendering frames.
5. **Mobile Touch Adjustments** (`components/Scroll3DTilt.tsx`, `components/HoverFocusGrid.tsx`):
   - Deactivated 3D tilts and hover scale/dim filters on pointer-based touch screens to optimize fluid scrolls.
6. **Hero Shape slow float & trust badges** (`components/ui/shape-landing-hero.tsx`):
   - Slowed float timings, softened shape outlines, and added trust banners directly below the description text.

### 2026-07-08 — Text Sync, Content Fixes & Skill Setup

#### Accomplished:
1. **UI/UX Pro Max skill installed** into `.kiro/steering/` via `uipro init --ai kiro`. Global taste/design skills (impeccable, gpt-taste, design-taste-frontend, emil-design-eng, high-end-visual-design, redesign-existing-projects, review-animations) are loaded per session for this project.
2. **Text synced from Vercel deployment** (github.com/tawfeeq-A/Kashmir-Grave-Care) into local `index.tsx`: concise service descriptions, direct process-step copy, lowercase eco-card titles.
3. **Polite wording fix**: every "local labor" reference changed to "local caretakers and gardeners". Updated in `index.tsx`, `contentSchema.ts` (`ecoCard1Text` default), and hero trust badge in `shape-landing-hero.tsx` ("Fair Wages for Local Caretakers").
4. **globals.css a11y pass**: added full `prefers-reduced-motion` media query disabling infinite/entrance animations; changed `.premium-card` transition from `all` to specific props (avoids GSAP transform conflicts); added `.focus-ring` utility; added glass-card inner highlight.

### 2026-07-08 — Landing Page Visual Redesign

#### `pages/index.tsx` restructured for premium feel:
1. Removed `OrbitalHero` block (generic floating cards) and the `HoverFocusGrid` 3-equal-card services pattern.
2. **Emotional Intro**: asymmetric split — Kashmir cemetery image (aspect 4/3 mobile, 4/5 desktop) with gradient-blur backdrop + floating "12+ Cemeteries" stat card, paired with heading "Distance should never mean neglect." (also set as `eyebrow` default in `contentSchema.ts`).
3. **Services**: tinted `bg-secondary/20` band, left-aligned header, bento-style cards (middle card `lg:translate-y-4` offset), icon scale/fill on hover.
4. **Before/After** moved higher; **Final CTA** cleaned (removed spinning rings, added top-edge highlight line).
5. `active:scale-[0.97]` tactile feedback on all CTAs.

### 2026-07-08 — Dock Component + Vertical Side Dock

1. Installed shadcn-style `components/ui/dock-two.tsx` (deps `lucide-react` + `framer-motion` already present; `components/ui` + `cn()` already existed).
2. First iteration: horizontal dock in navbar (center → then right side).
3. **Final design — Vertical Side Dock**: `dock-two.tsx` is now a fixed vertical pill on the right edge (`right-5 sm:right-8 lg:right-10`, `top-1/2 -translate-y-1/2`, `z-50`). Contains nav icons (Home/Services/About/Work/Book) + separator + WhatsApp (green accent). Tooltips appear to the LEFT. Active page = left dot indicator. Slide-in entry animation.
   - `components/SideDock.tsx` wires dock items to `next/router` and Supabase WhatsApp number; rendered globally in `_app.tsx`.
   - **Navbar simplified** to logo + social icons only. Hamburger + mobile drawer REMOVED.
   - **Floating `WhatsAppButton` removed** from `_app.tsx` — WhatsApp consolidated into the dock (single point).

### 2026-07-08 — Mobile-First Optimization & Component Fixes

1. **Full mobile pass** across `index.tsx` (reduced section padding at breakpoints, image aspect ratios, centered text on mobile / left on desktop, stacked buttons), `shape-landing-hero.tsx` (hero `min-h-[100dvh]` + `pt-16 sm:pt-0`, responsive type scale), `AnimatedCounters.tsx` (smaller gauges/gaps on mobile), `SVGPathTimeline.tsx` (reduced header margin/type on mobile).
2. **AnimatedCounters ("Our Impact") FIX**: replaced unreliable GSAP ScrollTrigger trigger (was not firing under Lenis + dynamic pinned heights) with `IntersectionObserver` + `requestAnimationFrame` count-up. Reduced-motion jumps to final values; already-in-view fallback on mount. Fixed conflicting `sm:text-3xl`/`sm:text-4xl` heading classes.
3. **HorizontalScrollSlider REBUILT from scratch** (previous code had bugs): now horizontal-pinned on ALL devices. Uses exact pixel travel `track.scrollWidth - window.innerWidth` (last panel lands flush), `start:"top top"`, `pin:true`, `scrub:1`, `anticipatePin:1`, `invalidateOnRefresh:true`, `ScrollTrigger.refresh()` after image loads + rAF. Panels are full-viewport `w-screen h-[100dvh]`, responsive grid (image top / text below on mobile, side-by-side on desktop). Header pinned top + progress bar pinned bottom (absolute). Reduced-motion fallback = native `snap-x` swipe carousel.

#### Current Homepage Section Order:
Hero → Emotional Intro → Services (bento) → Before/After → Process Timeline → Animated Stats → Eco Horizontal Scroll → Final CTA

#### Notes / gotchas for future work:
- Prefer `IntersectionObserver`/native APIs over GSAP ScrollTrigger for simple in-view triggers when Lenis + pinned sections make trigger positions unreliable.
- The vertical `SideDock` is the ONLY navigation on all screen sizes (no hamburger). Keep WhatsApp only there + in the Final CTA / booking flow.
- All homepage text still falls back to `contentSchema.ts` defaults; admin "Reset All to Defaults" clears Supabase `content_json` keys so code defaults show.
- **Light mode is the default.** Dark mode only applies if user explicitly toggles via footer button. FOUC script only checks `localStorage("gck-theme") === "dark"`.
- The eco `HorizontalScrollSlider` header is in normal document flow (NOT fixed/absolute) — it pins with the section and stays visible throughout all panels.

### 2026-07-08 — Collapsible Dock, Dark Mode Toggle, PWA & Eco Section Fixes

#### Collapsible Dock (`components/ui/dock-two.tsx`):
- Dock auto-expands on page load (3s) showing all nav icons, then collapses to a single burger (Menu) icon.
- Hover (desktop) / tap (mobile) to re-expand. 400ms leave-delay prevents accidental collapse.
- Uses `AnimatePresence` for smooth height/opacity transitions.
- Position: `right-2 sm:right-3 top-[38%]` (glued to right edge, slightly above center).
- Icons: `w-4 h-4`, dark mode contrast (`text-foreground/70` + `/80` dark variant).
- Tooltips: appear to the left, NOT clipped (removed `overflow-hidden` from container).

#### Dark Mode:
- Toggle removed from dock, added to Footer bottom panel (Sun/Moon icon + "Light"/"Dark" text label).
- Default: **Light mode**. Only applies `dark` class if `localStorage("gck-theme") === "dark"`.
- FOUC prevention script in `_document.tsx` (no system preference auto-detect).

#### PWA (installable app):
- `public/manifest.json` — standalone display, theme-color `#1E5C45`, uses `logo.jpg` as icon.
- `public/sw.js` — network-first service worker, precaches core pages + images, offline fallback.
- Service worker registered in `_app.tsx` via `useEffect`.
- `_document.tsx` — manifest link, theme-color meta, apple-mobile-web-app meta tags.

#### HorizontalScrollSlider (Eco section) — Final Layout:
- **Header in normal flow** inside the pinned section (not fixed, not absolute). Pins WITH the section, always visible, never fades, never jumps.
- Section has `h-[100dvh]` so pin engages immediately when top reaches viewport top.
- Flex layout: header (shrink-0, `pt-10` mobile) → track (flex-1) → progress bar (shrink-0).
- **Number + title on same line** (`flex items-baseline`) — saves vertical space on mobile.
- Image: `max-w-[240px]` mobile, `aspect-[4/5]` (taller than square, dramatic but fits).
- Each panel has `overflow-hidden` to prevent adjacent slide content from peeking in.
- Reduced-motion fallback: native snap-x scroll carousel.

#### Service Cards Fix:
- Removed `lg:translate-y-4` offset on middle card that caused misalignment on laptop.
- Added `items-stretch` for equal-height cards.

### 2026-07-08 — Full Audit Pass (performance, animation, security)

**Result: First Load JS 403 KB → 262 KB (-35%); total image weight ~6.7 MB → ~1.9 MB.**

#### Performance / images:
- Compressed all source images (one-time `sharp`, then removed): `logo.jpg` 639 KB → 4 KB, before/after JPGs -64/65%, `kashmir-cemetery.png` -27%.
- Converted 4 eco images PNG → WebP (68–148 KB, was ~1 MB each). Refs updated to `.webp` in `index.tsx`.
- Generated real PWA icons `public/icons/icon-192.png` + `icon-512.png`; `manifest.json` now points to them.
- `next.config.js`: `images.formats = ['image/avif','image/webp']`; removed unused unsplash domain.

#### Canvases (both `WobblySphereCanvas` + `ParticleCanvas`):
- `dynamic(() => import(...), { ssr:false })` in `_app.tsx` → Three.js out of the initial bundle (the big First-Load win).
- Both now early-return under `prefers-reduced-motion` and pause their rAF loop on `visibilitychange` (tab hidden).
- Sphere `IcosahedronGeometry(1.6, 64) → (1.6, 32)` (~75% fewer displaced vertices).
- ParticleCanvas: removed dead `mouseRef` + mousemove listener; `pointer-events-auto → none`.

#### Animation:
- **Page transitions:** opacity-only crossfade via `AnimatePresence mode="wait"` keyed on `router.asPath` in `_app.tsx`. Opacity-ONLY on purpose (transform would break GSAP `position:fixed` pinning + fixed SideDock). Honors reduced-motion. Calls `ScrollTrigger.refresh()` on complete.
- `ProgressBar`: ref + rAF DOM write instead of `setState` per scroll frame.

#### Security:
- `next.config.js` security headers: `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`, `X-DNS-Prefetch-Control`.
- `sw.js`: caches **same-origin GET only** (skips Supabase API / fonts / external media); cache bumped `gck-v1 → gck-v2`.
- Contact form: central `FIELD_LIMITS` truncation in `handleInputChange`; footer newsletter email `maxLength 160`.
- **`docs/supabase-rls.sql`** created — MUST be run in Supabase before go-live. This is the real gate for the public anon key (public read on settings/media; anon INSERT-only on submissions/newsletter; admin-only reads).

#### Cleanup:
- Deleted unused: `OrbitalHero.tsx` + `.module.css`, `HoverFocusGrid.tsx`, `ExpandingPanels.tsx`, `Reveal.tsx`, `WhatsAppButton.tsx`.
- `package.json`: removed `dotenv` (unused); moved `@types/three` to devDependencies.

#### ⚠️ Still requires the user (dashboard, cannot be done from code):
- **Run `docs/supabase-rls.sql`** in Supabase SQL Editor and verify anon cannot read `contact_submissions` / `newsletter_subscriptions`.
- Confirm `verify_recovery_pin` / `update_recovery_pin` RPCs are `SECURITY DEFINER` and only return booleans.

### 2026-07-08 — Dock UX, Eco Snap, Sphere Contrast, Favicon

#### Dock (`components/ui/dock-two.tsx`) — rewritten:
- **Fixed touch double-tap**: hover handlers are gated behind `matchMedia("(hover:hover) and (pointer:fine)")`. Touch devices only use tap (no emulated mouseenter fighting the click). First tap opens.
- **Auto-close**: whenever expanded, a 4s timer collapses it unless the pointer is hovering (`hoveringRef`). Touch → opens then closes itself; hover → stays open while hovered, closes 300ms after leave.
- **Tap-outside to close** on touch (pointerdown listener).
- **Adaptive contrast**: an IntersectionObserver watches `[data-dock-dark]` sections crossing a band at the dock's center (`rootMargin:"-38% 0px -62% 0px"`). When over a dark section, icons/burger go white and the dock bg becomes `bg-black/25 border-white/20`. The final CTA `<section data-dock-dark>` on the homepage is marked.
- Smoother open/close (durations 0.15–0.18), bg opacity bumped to `/90`.

#### Eco `HorizontalScrollSlider`:
- Added GSAP ScrollTrigger **`snap`** (`snapTo: 1/(n-1)`) so it settles on whole panels — one slide fills the frame instead of showing two half-panels. (Note: verify snap ↔ Lenis feel on device; standard Lenis+ScrollTrigger integration is in `SmoothScroll.tsx`.)
- Header/tag pushed down (`pt-16 sm:pt-14 lg:pt-12`) so tag + title clear the navbar and the section fits one frame.
- Pin still `start:"top top"` (horizontal begins exactly when the section tops out).

#### Background sphere:
- Light-mode opacity bumped `opacity-20 → opacity-[0.32]` (dark stays `/40`) so the wobble sphere reads on white without being loud.

#### Favicon:
- `_document.tsx`: added `<link rel="icon">` (icon-192/512.png) + `shortcut icon` (logo.jpg) using the generated logo icons.

### 2026-07-08 — Premium Glass Polish + Favicon + Deploy Config

#### Visual polish (`styles/globals.css` + className tweaks):
- **`.glass-card` upgraded**: `backdrop-filter: blur(22px) saturate(160%) brightness(1.02)`, two-layer shadow, `::before` thin top-edge highlight (confined to top ~14% so it never washes content), `::after` hairline inner border. Used by the contact form card + the intro floating stat card.
- **`.shadow-premium`**: three-layer ambient+key shadow token (light + dark variants).
- **`.btn-sheen`**: diagonal sheen sweep on hover — applied to the two primary WhatsApp CTAs (intro + final CTA).
- **`.grain-overlay`**: subtle SVG fractal-noise overlay (mix-blend overlay) — added to the dark final-CTA `<section>` to kill banding.
- **`.premium-card`**: deeper two-layer lift shadow, softer easing. Service cards use `premium-card` + `bg-background/70 backdrop-blur-md` (kept off full glass-card to avoid pseudo-element paint-order washing the icon/text).
- Body: `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`; `h1/h2/h3 { text-wrap: balance }`.
- All new effects (sheen, grain) disabled under `prefers-reduced-motion`.

#### Favicon: `_document.tsx` — `<link rel="icon">` (icon-192/512.png) + `shortcut icon` (logo.jpg).

#### Deploy / Vercel:
- **`vercel.json`** added with `git.deploymentEnabled: false` → **disables automatic Git deploys**. Deploys are now manual only (Vercel CLI `vercel --prod` or the dashboard "Deploy" button).
- Repo: `main` branch, remote `github.com/tawfeeq-A/Kashmir-Grave-Care` (project = repo root).
- `.env.local` is gitignored (no secrets committed). `.kiro/` steering left untracked.

### 2026-07-08 — Mobile Dock Fix, Responsive Eco Snap, Laptop Tile Layout

#### Dock / mobile hamburger (`components/ui/dock-two.tsx`):
- **Fixed tap-to-navigate bug**: nav items are `<a href>` + `onClick`, but `wrapItem` was calling the item's `onClick` **without the event**, so `e.preventDefault()` never ran → every tap did a full page reload instead of SPA nav. Now the event is forwarded (`DockItem.onClick: (e?) => void`; `wrapItem` passes `e`).
- Larger touch targets: expanded icons `p-2` → `p-2.5`; collapsed burger `p-2.5`+`w-4` → `p-3`+`w-5 h-5`; clearer `aria-label`.

#### Eco `HorizontalScrollSlider` — responsive pin/snap (`gsap.matchMedia`):
- **Per-frame SNAP now only on phones** (`max-width: 767px`). Tablet/laptop/desktop (`min-width: 768px`) use **smooth continuous scrub, no snap**.
- Pinning is consistent on all breakpoints (`start:"top top"`, `pin`, `pinSpacing`, `anticipatePin`, `scrub:1`) → pins exactly when the green tag (section top) reaches the top; matchMedia auto-rebuilds + cleans up on resize (no jumps/flicker).

#### Laptop tile layout (task 4):
- Panel widened `lg:max-w-6xl`, gap `lg:gap-20`, number `lg:text-[128px]`, title `lg:text-3xl xl:text-4xl`, desc `lg:text-lg lg:max-w-md`, image `lg:max-w-[460px]`, image aligned `md:justify-end` — fills horizontal space, less empty margin.

Build clean (263 KB First Load JS). Committed + pushed to `main`. (Vercel auto-deploy remains disabled via vercel.json.)

### 2026-07-09 — Green Tag Visibility Fix + Final Cleanup

- **Eco header top padding fixed**: `pt-16 sm:pt-14 lg:pt-12` → `pt-20 sm:pt-24 lg:pt-28`. The green tag "Eco-Conscious & Ethical Custodianship" was being clipped behind the fixed navbar (~60px). The padding now *increases* with screen size and always clears the navbar.
- **Removed `docs/supabase_schema.sql`** (old 307-line schema+seed file, superseded by the current `docs/supabase-rls.sql`).
- **Removed stale local directories**: `src/` (empty, never tracked), `scripts/` (empty), `tsconfig.tsbuildinfo` (generated artifact).
- **brain.md refreshed**: project structure updated to reflect current reality (all deletions, correct paths for docs/icons/manifest/sw.js/vercel.json).

### 2026-07-09 — Hero → Intro Mobile UX & Perf Pass (desktop untouched)

Root cause of the reported mobile "screen jump / next-screen enlarges" between the hero and intro sections was a combination of a hydration-gated reveal, priority image, and per-frame GPU compositing over the live canvas. Seven fixes, all mobile-scoped (`sm:`/`md:` guards keep desktop identical):

1. **`MaskReveal.tsx`** — rewrote to a pure passthrough (`return <>{children}</>`). The old `opacity-0` hydration gate caused a blank flash + reparent reflow on first paint. The component no longer runs a mask animation (the gate only caused harm).
2. **Intro image (`index.tsx`)** — `priority` → `loading="lazy"`. It sits below the fold, so `priority` was competing with the true LCP and hurting it.
3. **`ParticleCanvas.tsx`** — mobile detection via `isMobileRef` (`window.innerWidth < 768` on mount). On mobile: particle cap 55 → 22, skip the soft-glow arc, and skip the O(n²) connection-line loop. Keeps subtle ambiance without the per-frame cost.
4. **backdrop-blur on mobile** — full-viewport section blurs re-composite every frame over the repainting canvas. Hero floating shapes → `md:backdrop-blur-[2px]` (no blur on mobile). All full-viewport section wrappers → `bg-background/95 md:bg-background/80 md:backdrop-blur-md` (near-solid, no blur on mobile; translucent + blur unchanged at `md+`). Applied to `index.tsx` (intro, before/after, service cards `/90`), `AnimatedCounters.tsx`, `SVGPathTimeline.tsx`, and the `about`/`services`/`work`/`contact` page wrappers.
5. **Dead imports** — removed unused `ParticleCanvas` + `WobblySphereCanvas` imports from `components/ui/shape-landing-hero.tsx`.
6. **Hero vertical clipping (short screens)** — hero wrapper `overflow-hidden` → `overflow-x-clip` (hides horizontal shape overflow without clipping vertical content), and `pt-16 sm:pt-0` → `pt-24 pb-12 sm:pt-0 sm:pb-0` so content clears the navbar and isn't cropped top/bottom on short viewports.
7. **Floating stat card overlap (`index.tsx`)** — root cause: the `.relative` wrapper was full column width while the image was `max-w-sm mx-auto` (centered/narrower), so the `-bottom-4 right-2` card anchored to the column edge, detached from the image on mobile. Moved `max-w-sm sm:max-w-md mx-auto lg:mx-0` up to the wrapper; image container is now plain `w-full`. Card now anchors to the image edge on all screens.

Verified: `npx tsc --noEmit` clean; `npm run build` clean (7 static pages, homepage 272 KB First Load JS). Desktop layout/behavior unchanged.

### 2026-07-09 — Production PWA Upgrade (v1.0.0)

Comprehensive Progressive Web App upgrade to pass Lighthouse PWA installability checks and deliver a polished native-app experience on all platforms.

#### Web App Manifest (`public/manifest.json`) — complete rewrite:
- `name`: "Kashmir Grave Care", `short_name`: "GraveCare"
- `display`: standalone (no browser chrome), `display_override`: ["standalone", "minimal-ui"]
- `background_color` + `theme_color`: `#1E5C45` (brand green)
- **11 icons**: 9 standard (48–512px, purpose: any) + 2 maskable (192, 512) with 10% safe-zone padding on brand-green background
- **Shortcuts**: Services, Book a Service, Our Work (appear on long-press of app icon)
- `id`, `scope`, `orientation`, `categories`, `lang`, `dir` fields added

#### Icon Generation (`scripts/generate-icons.js`):
- Node script using `sharp` (devDep) — generates all icon sizes + maskable variants + favicon.png from the 512×512 source
- Run via `npm run generate-icons`

#### Service Worker (`public/sw.js`) — rewritten from scratch:
- **Versioned multi-cache**: `gck-v3-static`, `gck-v3-pages`, `gck-v3-images`, `gck-v3-fonts`
- **Strategies**: cache-first (static assets, fonts), network-first with offline fallback (HTML pages), stale-while-revalidate (images)
- **Precaching**: all 6 app-shell pages (/, /services, /about, /work, /contact, /offline) + manifest + favicon + logo + icons
- **Offline fallback**: graceful `/offline` page with retry button (instead of browser error)
- **Update handling**: `SKIP_WAITING` message listener for seamless version transitions
- **Activation**: immediately claims all clients, purges old version caches

#### Offline Page (`pages/offline.tsx`):
- Clean, branded offline state with Wi-Fi icon, explanatory text, retry button
- Uses existing design tokens (no extra CSS)

#### `_document.tsx` — full PWA head:
- Dual `theme-color` meta (light: `#1E5C45`, dark: `#0f1210`)
- `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style` (black-translucent), `apple-mobile-web-app-title`
- Multiple `apple-touch-icon` sizes (152, 192, 512)
- `msapplication-TileColor` + `msapplication-TileImage` (icon-144)
- `mobile-web-app-capable`, `format-detection`, `application-name`
- Favicon: `/favicon.png` (48px)

#### `_app.tsx` — smart SW registration:
- Registers `/sw.js` with scope `/`
- Checks for updates on `visibilitychange` (user returns to tab)
- Detects `updatefound` → shows non-intrusive glass toast: "A new version is available" with "Update now" button
- `controllerchange` listener reloads page after user accepts update
- Toast is dismissible, uses `role="alert"` + `aria-live="polite"` for screen readers
- Skip-to-content link (`#main-content`) for keyboard navigation

#### Performance:
- `next.config.js`: HSTS header, `compress: true`, `poweredByHeader: false`, aggressive cache headers (icons immutable 1yr, images 30d SWR, SW no-cache)
- `vercel.json`: SW `Cache-Control: no-cache` + `Service-Worker-Allowed: /`, manifest `Content-Type: application/manifest+json`
- Navbar + Footer logos: switched from `<img>` to `next/image` (optimized WebP/AVIF serving, prevents layout shift via explicit width/height)
- Navbar scroll listener: `{ passive: true }` (eliminates scroll jank warning)
- `globals.css`: `scrollbar-gutter: stable` (prevents layout shift from scrollbar appearance), `-webkit-tap-highlight-color: transparent` (iOS)
- Package version bumped to `1.0.0`

#### Accessibility:
- Skip-to-content link at top of DOM (`<a href="#main-content" class="skip-link">`)
- `role="banner"` on Navbar `<header>`
- `role="contentinfo"` on Footer `<footer>`
- `role="navigation"` + `aria-label="Site navigation"` on dock
- Dock touch targets increased from `p-2.5` (36px) → `p-3` (40px + hit area)
- Touch-target utility class in globals.css (48×48dp minimum via pseudo-element)
- Smooth scroll only when `prefers-reduced-motion: no-preference`
- All existing a11y preserved: focus-ring, reduced-motion block, semantic HTML

#### Build output:
- 8 static pages (new: `/offline`)
- Homepage: 272 KB First Load JS (unchanged from before)
- `_app` shared: 268 KB (4 KB increase from SW update toast + skip-link)

---

## 🚀 Deployment Checklist (before go-live)

1. **Run `docs/supabase-rls.sql`** in Supabase SQL Editor. Verify anon cannot read `contact_submissions` / `newsletter_subscriptions`.
2. **Verify RPC security**: `verify_recovery_pin` / `update_recovery_pin` must be `SECURITY DEFINER` and only return booleans.
3. **Deploy**: Vercel auto-deploy is OFF. Use `vercel deploy --prod` (CLI) or the Vercel dashboard "Create Deployment" button.
4. **Set env vars on Vercel**: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. **Verify PWA**: open site on mobile Chrome → should show "Add to Home Screen" prompt after 2 visits.
6. **Test admin**: triple-tap footer `•` → login with email/password → verify content edits save and "Reset All to Defaults" works.
