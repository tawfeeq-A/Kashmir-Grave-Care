# 🧠 Grave Care Kashmir — Project Brain

> **Last Updated**: 2026-07-06  
> **Stack**: Next.js 14 + React 18 + TypeScript + Tailwind CSS 3 + Framer Motion + GSAP + Lenis  
> **Deployment**: TBD  
> **CMS**: Supabase (PostgreSQL)

---

## 📁 Project Structure

```
grave-care-kashmir/
├── pages/
│   ├── _app.tsx            # App wrapper — SmoothScroll + MaskReveal + Navbar + Footer + AdminPanel
│   ├── _document.tsx       # HTML document — Google Fonts (Outfit, Inter, Playfair Display, Noto Nastaliq Urdu)
│   ├── index.tsx           # Homepage — Hero, ExpandingPanels, Before/After, SVGPathTimeline, AnimatedCounters, HorizontalScrollSlider, CTA
│   ├── about.tsx           # About page — Story, Pillars, Cemeteries served
│   ├── services.tsx        # Services & pricing — 3 packages + custom addons + WorkGallery
│   ├── work.tsx            # Portfolio gallery — Instagram/Facebook media from Supabase
│   └── contact.tsx         # Multi-step booking form (4 steps) — saves to Supabase + WhatsApp/email
├── components/
│   ├── SmoothScroll.tsx     # Lenis smooth scroll wrapper synced with GSAP ScrollTrigger
│   ├── ParticleCanvas.tsx   # Canvas-based floating particles (emerald/gold/white)
│   ├── ScrollReveal.tsx     # GSAP ScrollTrigger-powered scroll reveal (up/down/left/right/scale/fade)
│   ├── MaskReveal.tsx       # Page entrance mask animation (clip-path circle reveal)
│   ├── HorizontalScrollSlider.tsx  # GSAP pinned horizontal scroll section
│   ├── SVGPathTimeline.tsx  # Scroll-drawn SVG path timeline with alternating nodes
│   ├── ExpandingPanels.tsx  # Interactive accordion panels (one active, rest contracted)
│   ├── AnimatedCounters.tsx # Circular SVG gauge counters with GSAP count-up
│   ├── Navbar.tsx           # Fixed navbar with scroll-based transparency + mobile drawer
│   ├── Footer.tsx           # Footer with monumental scrolling background text
│   ├── OrbitalHero.tsx      # 3D orbital card with floating info cards
│   ├── OrbitalHero.module.css  # CSS module for orbital animations
│   ├── ImageBeforeAfter.tsx # Interactive before/after image slider
│   ├── Scroll3DTilt.tsx     # Scroll-based 3D perspective tilt (Framer Motion)
│   ├── Reveal.tsx           # Legacy Framer Motion scroll reveal (still available)
│   ├── WorkGallery.tsx      # Work media grid from Supabase
│   ├── AdminPanel.tsx       # Full admin panel (triple-tap triggered from footer)
│   ├── ProgressBar.tsx      # Page load progress bar
│   ├── WhatsAppButton.tsx   # Floating WhatsApp CTA button
│   └── ui/
│       └── shape-landing-hero.tsx  # Geometric shapes hero + ParticleCanvas background
├── context/
│   └── SiteContext.tsx      # React context — fetches site_settings + work_media from Supabase
├── lib/
│   ├── supabase.ts          # Supabase client initialization
│   ├── utils.ts             # Utility functions (cn for class merging)
│   └── contentSchema.ts     # Content JSON schema definition
├── styles/
│   └── globals.css          # Global styles — CSS variables, keyframes, utilities, dark mode
├── public/
│   └── images/
│       ├── logo.jpg
│       ├── kashmir-cemetery.png
│       ├── grave-before-final.jpg
│       └── grave-after-final.jpg
└── brain.md                 # THIS FILE — project reference
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
