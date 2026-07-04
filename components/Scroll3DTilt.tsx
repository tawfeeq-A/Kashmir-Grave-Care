import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface Scroll3DTiltProps {
  children: React.ReactNode;
  maxTilt?: number; // Maximum rotation in degrees (default: 8)
}

export default function Scroll3DTilt({ children, maxTilt = 8 }: Scroll3DTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the element relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress to 3D rotation angles
  // When entering: tilts backwards. In center: flat. Leaving: tilts forwards.
  const rawRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [maxTilt, 0, -maxTilt]);
  
  // Apply a spring for smooth, buttery transition physics
  const rotateX = useSpring(rawRotateX, {
    stiffness: 75,
    damping: 20,
    max: 15
  } as any);

  return (
    <div 
      ref={ref} 
      style={{ perspective: 1200 }} 
      className="w-full h-full"
    >
      <motion.div
        style={{
          rotateX,
          transformStyle: "preserve-3d"
        }}
        className="w-full h-full origin-center"
      >
        {children}
      </motion.div>
    </div>
  );
}
