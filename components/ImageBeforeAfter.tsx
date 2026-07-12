import React, { useState, useRef, useCallback, useEffect } from "react";
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
  // FIX: use a ref for isDragging instead of state so event handlers always
  // read the latest value without stale-closure bugs. State would require
  // handlers to be recreated on every isDragging change.
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  }, []);

  // FIX: wrap handlers in useCallback so their identity is stable between
  // add/remove calls — prevents the remove from no-op-ing on a different reference.
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // FIX: touchmove must be { passive: false } so we can call preventDefault()
  // to block iOS from scrolling the page while the user drags the slider.
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    // passive: false so preventDefault() works on touchmove
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="w-full space-y-4">
      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-xl border border-border select-none cursor-ew-resize bg-secondary"
        onMouseDown={() => { isDraggingRef.current = true; }}
        onTouchStart={() => { isDraggingRef.current = true; }}
        role="img"
        aria-label={`Before and after comparison. ${beforeLabel} on the right, ${afterLabel} on the left.`}
      >
        {/* Before Image (Background) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={beforeImage}
            alt="Before grave restoration"
            className="w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-md backdrop-blur-sm pointer-events-none">
            {beforeLabel}
          </div>
        </div>

        {/* After Image (Foreground, clipped)
            FIX: removed inline getBoundingClientRect() width override from render —
            it was re-querying layout every render and is unnecessary since the
            element fills 100% of its container via className. */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            transition: "clip-path 0.05s linear",
          }}
        >
          <img
            src={afterImage}
            alt="After grave restoration"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
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
          aria-hidden="true"
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
