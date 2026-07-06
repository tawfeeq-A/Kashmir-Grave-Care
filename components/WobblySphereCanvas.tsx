import { useEffect, useRef } from "react";

interface WobblySphereCanvasProps {
  className?: string;
  sphereColor?: string; // e.g. "rgba(30, 92, 69, " (emerald)
  accentColor?: string; // e.g. "rgba(194, 132, 26, " (amber)
}

/**
 * WobblySphereCanvas renders a lightweight 3D-projected wobbly sphere
 * on a 2D Canvas. It maps scroll speed and scroll depth to the sphere's
 * size, rotation, wave frequency, and wave amplitude.
 * Runs at 60 FPS without Three.js or other external library overhead.
 */
export default function WobblySphereCanvas({
  className = "",
  sphereColor = "30, 92, 69", // Emerald Green
  accentColor = "194, 132, 26", // Warm Amber
}: WobblySphereCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Tracking animation frame and scroll state
  const requestRef = useRef<number>(0);
  const scrollRef = useRef({
    current: 0,
    target: 0,
    speed: 0,
  });

  // Pseudo 3D Noise function using multi-octave trigonometric values.
  // Smooth, continuous, and looks like Simplex/Perlin noise but extremely fast.
  const getNoise3D = (x: number, y: number, z: number, time: number) => {
    let value = Math.sin(x * 2.1 + y * 1.3 + time) * 0.45;
    value += Math.sin(y * 2.8 + z * 1.9 - time * 0.9) * 0.3;
    value += Math.sin(z * 1.5 + x * 2.5 + time * 1.1) * 0.15;
    value += Math.sin((x + y + z) * 3.5 + time * 1.4) * 0.1;
    return value;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas sizes relative to parent container
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Track scroll events
    const handleScroll = () => {
      scrollRef.current.target = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    let time = 0;

    // Define 3D points in spherical coordinates
    // We create multiple circles (latitude lines) and rotate them
    const latitudeLines = 12;
    const pointsPerLine = 36;
    const sphereRadius = 140; // Base size

    const animate = () => {
      if (!ctx || !canvas) return;

      const cx = canvas.width / 2;
      // Vertically center on the hero (or offset slightly for visual balance)
      const cy = canvas.height / 2.2; 

      // ─── Smooth Interpolation (Easing) of Scroll ───
      const prevScroll = scrollRef.current.current;
      scrollRef.current.current += (scrollRef.current.target - prevScroll) * 0.08;
      
      // Calculate scroll velocity (speed of scroll)
      scrollRef.current.speed = Math.abs(scrollRef.current.current - prevScroll);

      // Increase noise clock speed based on scrolling speed
      time += 0.015 + scrollRef.current.speed * 0.003;

      // Clear frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ─── Draw background radial glow ───
      const glowScale = 1 + Math.sin(time * 0.5) * 0.05 + scrollRef.current.speed * 0.005;
      const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, sphereRadius * 2 * glowScale);
      glow.addColorStop(0, `rgba(${sphereColor}, 0.15)`);
      glow.addColorStop(0.5, `rgba(${accentColor}, 0.04)`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      // ─── Rotation angles mapped to time and scroll ───
      // Yaw (Y-axis): moves continuously, gets pushed by scroll
      const yaw = time * 0.3 + scrollRef.current.current * 0.0015;
      // Pitch (X-axis): tilts based on scroll position
      const pitch = 0.5 + Math.sin(time * 0.2) * 0.1 + scrollRef.current.current * 0.0005;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      // Perspective projection parameters
      const cameraDistance = 450;
      // Grow sphere slightly when scrolling down
      const scaleFactor = sphereRadius * (1 + scrollRef.current.current * 0.00015);

      // ─── Render Sphere Latitudes ───
      for (let i = 1; i < latitudeLines; i++) {
        // Map latitude angle from -PI/2 to PI/2
        const latAngle = -Math.PI / 2 + (Math.PI * i) / latitudeLines;
        const cosLat = Math.cos(latAngle);
        const sinLat = Math.sin(latAngle);

        ctx.beginPath();

        for (let j = 0; j <= pointsPerLine; j++) {
          // Longitude angle from 0 to 2PI
          const lonAngle = ((Math.PI * 2) * j) / pointsPerLine;
          const cosLon = Math.cos(lonAngle);
          const sinLon = Math.sin(lonAngle);

          // Standard 3D spherical coordinate projection
          const x3d = cosLat * cosLon;
          const y3d = sinLat;
          const z3d = cosLat * sinLon;

          // ─── Wobble wave calculation ───
          // Amplitude increases dynamically with scroll speed and depth
          const waveStrength = 0.15 + (scrollRef.current.speed * 0.02) + (scrollRef.current.current * 0.00005);
          // Frequency changes with scroll
          const waveFreq = 1.0 + (scrollRef.current.current * 0.0002);
          
          const noiseVal = getNoise3D(x3d * waveFreq, y3d * waveFreq, z3d * waveFreq, time);
          const displacedRadius = 1.0 + noiseVal * waveStrength;

          // Apply displacement to 3D point
          const dx = x3d * displacedRadius;
          const dy = y3d * displacedRadius;
          const dz = z3d * displacedRadius;

          // ─── 3D Rotations (Yaw & Pitch) ───
          // Yaw rotation (Y-axis)
          let rx = dx * cosY - dz * sinY;
          let rz = dx * sinY + dz * cosY;
          // Pitch rotation (X-axis)
          let ry = dy * cosP - rz * sinP;
          rz = dy * sinP + rz * cosP;

          // ─── Perspective Projection ───
          const perspective = cameraDistance / (cameraDistance + rz);
          const screenX = cx + rx * scaleFactor * perspective;
          const screenY = cy + ry * scaleFactor * perspective;

          if (j === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }

        // Draw line with opacity fading toward the back (z-axis depth)
        const depthVal = (i / latitudeLines);
        ctx.strokeStyle = `rgba(${sphereColor}, ${0.12 + Math.abs(0.5 - depthVal) * 0.15})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      // ─── Draw additional wobbly equator accent path ───
      ctx.beginPath();
      for (let j = 0; j <= 72; j++) {
        const lonAngle = ((Math.PI * 2) * j) / 72;
        const cosLon = Math.cos(lonAngle);
        const sinLon = Math.sin(lonAngle);

        const x3d = cosLon;
        const y3d = 0;
        const z3d = sinLon;

        // Equator has higher displacement response for extra wavy look
        const waveStrength = 0.22 + scrollRef.current.speed * 0.03;
        const noiseVal = getNoise3D(x3d * 1.5, y3d * 1.5, z3d * 1.5, time * 1.2);
        const displacedRadius = 1.0 + noiseVal * waveStrength;

        const dx = x3d * displacedRadius;
        const dy = y3d * displacedRadius;
        const dz = z3d * displacedRadius;

        let rx = dx * cosY - dz * sinY;
        let rz = dx * sinY + dz * cosY;
        let ry = dy * cosP - rz * sinP;
        rz = dy * sinP + rz * cosP;

        const perspective = cameraDistance / (cameraDistance + rz);
        const screenX = cx + rx * scaleFactor * perspective;
        const screenY = cy + ry * scaleFactor * perspective;

        if (j === 0) {
          ctx.moveTo(screenX, screenY);
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
      ctx.strokeStyle = `rgba(${accentColor}, 0.25)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sphereColor, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
