import type { AppProps } from "next/app";
import Head from "next/head";
import { useState, useEffect } from "react";
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
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  // Register service worker for PWA install
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <SiteProvider>
      <Head>
        <title>Grave Care Kashmir | Preserving Peace &amp; Memories</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
            <Navbar />
            <main className="flex-grow">
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
        </MaskReveal>
      </SmoothScroll>
    </SiteProvider>
  );
}
