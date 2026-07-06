import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MaskReveal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    initial: { clipPath: "circle(150% at 50% 50%)" },
    animate: {
      clipPath: "circle(0% at 50% 50%)",
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 1.8 }
    }
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0, 1, 1, 0],
      scale: [0.8, 1, 1, 1.2],
      transition: {
        duration: 2.0,
        times: [0, 0.3, 0.7, 1.0],
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.6, delay: 2.4 }
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A1F16]"
        variants={containerVariants}
        initial="initial"
        animate={mounted ? "animate" : "initial"}
        onAnimationComplete={() => setIsRevealed(true)}
        style={{
          display: isRevealed ? "none" : "flex",
          pointerEvents: isRevealed ? "none" : "auto",
        }}
      >
        <motion.div
          variants={logoVariants}
          className="text-white font-serif text-3xl sm:text-5xl font-bold tracking-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-[#C2841A]">
            GCK
          </span>
        </motion.div>
      </motion.div>

      {/* Main content */}
      <motion.div
        variants={contentVariants}
        initial="initial"
        animate={mounted ? "animate" : "initial"}
      >
        {children}
      </motion.div>
    </>
  );
}

