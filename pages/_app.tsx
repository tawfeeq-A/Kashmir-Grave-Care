import type { AppProps } from "next/app";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import SideDock from "@/components/SideDock";
import AdminPanel from "@/components/AdminPanel";
import MaskReveal from "@/components/MaskReveal";
import SmoothScroll from "@/components/SmoothScroll";
import { SiteProvider } from "@/context/SiteContext";

// Decorative background canvases are client-only and heavy (Three.js).
// Lazy-load them so they stay out of the initial JS bundle.
const WobblySphereCanvas = dynamic(() => import("@/components/WobblySphereCanvas"), { ssr: false });
const ParticleCanvas = dynamic(() => import("@/components/ParticleCanvas"), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  // Register service worker with update detection
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;

    const registerSW = async () => {
      try {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        // Check for updates on page visibility change (user comes back to tab)
        const checkForUpdate = () => {
          if (document.visibilityState === "visible" && registration) {
            registration.update();
          }
        };
        document.addEventListener("visibilitychange", checkForUpdate);

        // Detect waiting worker (new version available)
        if (registration.waiting) {
          setSwUpdateAvailable(true);
        }

        registration.addEventListener("updatefound", () => {
          const newWorker = registration?.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New version installed and waiting
              setSwUpdateAvailable(true);
            }
          });
        });

        // Listen for controller change (new SW took over) → reload
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      } catch (err) {
        console.warn("SW registration failed:", err);
      }
    };

    registerSW();
  }, []);

  // Prompt user to update when new SW is waiting
  const handleUpdate = useCallback(() => {
    const reg = navigator.serviceWorker?.controller;
    if (reg) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.waiting?.postMessage({ type: "SKIP_WAITING" });
      });
    }
    setSwUpdateAvailable(false);
  }, []);

  return (
    <SiteProvider>
      <Head>
        <title>Grave Care Kashmir | Preserving Peace &amp; Memories</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, interactive-widget=resizes-content" />
      </Head>
      <SmoothScroll>
        <MaskReveal>
          <ProgressBar />
          
          {/* Global Background 3D Sphere & Particle Animations */}
          <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.32] dark:opacity-40 transition-colors duration-300">
            <WobblySphereCanvas />
            <ParticleCanvas
              particleCount={55}
              colors={[
                "rgba(30,92,69,",
                "rgba(194,132,26,",
                "rgba(255,255,255,",
              ]}
            />
          </div>

          <div className="flex flex-col min-h-screen relative z-10">
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-grow">
              {/* Opacity-only page transition (no transform — keeps GSAP pin
                  and position:fixed working). Refreshes ScrollTrigger after. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={router.asPath}
                  initial={prefersReduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                  onAnimationComplete={() => ScrollTrigger.refresh()}
                >
                  <Component {...pageProps} />
                </motion.div>
              </AnimatePresence>
            </main>
            <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
          </div>

          {/* Vertical Side Dock — fixed right edge, all screens */}
          <SideDock />

          {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}

          {/* ─── SW Update Toast ─── */}
          {swUpdateAvailable && (
            <div
              role="alert"
              aria-live="polite"
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] glass-card shadow-premium rounded-xl px-5 py-3 flex items-center gap-3 animate-fadeInUp"
            >
              <p className="text-sm text-foreground font-medium">A new version is available</p>
              <button
                onClick={handleUpdate}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors whitespace-nowrap focus-ring rounded px-2 py-1"
              >
                Update now
              </button>
              <button
                onClick={() => setSwUpdateAvailable(false)}
                aria-label="Dismiss update notification"
                className="text-muted-foreground hover:text-foreground transition-colors p-1 focus-ring rounded"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>
          )}
        </MaskReveal>
      </SmoothScroll>
    </SiteProvider>
  );
}
