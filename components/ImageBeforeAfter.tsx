import React, { useState, useRef, useEffect } from "react";
import { ChevronsLeftRight } from "lucide-react";

interface ImageBeforeAfterProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function ImageBeforeAfter({
  beforeImage = "/images/grave-before-final.jpg",
  afterImage = "/images/grave-after-final.jpg",
  beforeLabel = "Before Care (Weathered & Overgrown)",
  afterLabel = "After Care (Restored, Green & Clean)",
}: ImageBeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="w-full space-y-4">
      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-xl border border-border select-none cursor-ew-resize bg-secondary"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Before Image (Background) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={beforeImage}
            alt="Before restoration"
            className="w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-md backdrop-blur-sm pointer-events-none">
            {beforeLabel}
          </div>
        </div>

        {/* After Image (Foreground, clipped) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden transition-all duration-75"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <img
            src={afterImage}
            alt="After restoration"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ width: containerRef.current?.getBoundingClientRect().width }}
          />
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-md backdrop-blur-sm pointer-events-none">
            {afterLabel}
          </div>
        </div>

        {/* Slider Line Divider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white text-primary border-4 border-primary rounded-full flex items-center justify-center shadow-xl cursor-ew-resize hover:scale-110 active:scale-95 transition-transform duration-150">
            <ChevronsLeftRight className="h-4 w-4" />
          </div>
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground italic">
        Drag the white center slider left or right to inspect the visual care details.
      </p>
    </div>
  );
}
