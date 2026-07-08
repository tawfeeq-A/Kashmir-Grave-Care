import { useEffect, useRef } from "react";
import * as THREE from "three";

interface WobblySphereCanvasProps {
  className?: string;
  color1?: string; // hex string e.g. "#133B2C" (emerald)
  color2?: string; // hex string e.g. "#C2841A" (amber)
}

// GLSL Vertex Shader: Computes displacement on the GPU using 3D Simplex Noise
const VERTEX_SHADER = `
  // Classic 3D Simplex Noise by Stefan Gustavson
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  uniform float uTime;
  uniform float uScroll;
  uniform float uScrollSpeed;
  uniform float uNoiseStrength;
  uniform float uNoiseFrequency;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    vNormal = normal;
    vPosition = position;
    
    // Wave calculations using 3D noise
    float noiseTime = uTime * 0.6;
    vec3 noiseCoord = position * (uNoiseFrequency + uScroll * 0.4);
    noiseCoord.y += noiseTime;
    
    float noiseVal = snoise(noiseCoord);
    vDisplacement = noiseVal;
    
    // Total morphing strength responsive to scroll depth and scroll speed ripples
    float totalStrength = uNoiseStrength + (uScrollSpeed * 1.5) + (uScroll * 0.08);
    vec3 newPosition = position + normal * (noiseVal * totalStrength);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// GLSL Fragment Shader: Physical bubble Fresnel shading with iridescent glow borders
const FRAGMENT_SHADER = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    vec3 norm = normalize(vNormal);
    
    // Fresnel reflection glow vector
    vec3 cameraDir = vec3(0.0, 0.0, 1.0);
    float fresnel = 1.0 - max(dot(norm, cameraDir), 0.0);
    fresnel = pow(fresnel, 2.5); // Fresnel falloff
    
    // Shading based on wave peaks/valleys
    vec3 baseColor = mix(uColor1, uColor2, vDisplacement * 0.4 + 0.4);
    vec3 finalColor = mix(baseColor, uColor2, fresnel * 0.7);
    
    // Shiny specular light highlights
    vec3 lightDir = normalize(vec3(5.0, 5.0, 8.0));
    float spec = max(dot(norm, lightDir), 0.0);
    spec = pow(spec, 40.0) * 0.35;
    
    gl_FragColor = vec4(finalColor + vec3(spec), 0.5);
  }
`;

// Helper to parse CSS custom HSL variables to support dynamic theme switching in WebGL
const parseHSL = (hslStr: string): THREE.Color => {
  const cleaned = hslStr.replace(/hsla?\(|\)|%/g, "");
  const parts = cleaned.trim().split(/[\s,]+/);
  if (parts.length >= 3) {
    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    return new THREE.Color().setHSL(h, s, l);
  }
  return new THREE.Color();
};

const getThemeColor = (varName: string, fallback: string): THREE.Color => {
  if (typeof window === "undefined") return new THREE.Color(fallback);
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName);
  if (!val) return new THREE.Color(fallback);
  return parseHSL(val);
};

/**
 * WobblySphereCanvas renders a physical 3D WebGL morphing sphere using
 * Three.js and custom GLSL vertex/fragment noise shaders.
 * It animates smoothly at 60 FPS, reacts dynamically to window scroll events,
 * and handles resizing and cleanups correctly.
 */
export default function WobblySphereCanvas({
  className = "",
  color1 = "#133B2C", // Primary Emerald Green
  color2 = "#C2841A", // Secondary Warm Amber Accent
}: WobblySphereCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced-motion: skip the WebGL animation entirely
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    
    // Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5.5;
    
    // WebGL Renderer with alpha channel and antialiasing
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Resize logic
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const width = parent.clientWidth || window.innerWidth;
      const height = parent.clientHeight || window.innerHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);
    
    // Geometry subdivision: 32 gives smooth waves at roughly a quarter of the
    // vertex count of 64 (which the shader displaces per-frame). Big GPU win.
    const geometry = new THREE.IcosahedronGeometry(1.6, 32);
    
    // Shader Material with custom uniforms
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uScrollSpeed: { value: 0 },
        uNoiseStrength: { value: 0.15 },
        uNoiseFrequency: { value: 1.4 },
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
      },
      depthWrite: false,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Scroll progress tracker
    let targetScroll = 0;
    let currentScroll = 0;
    let scrollSpeed = 0;

    // Cache theme colors to prevent expensive DOM queries (getComputedStyle) in the 60fps loop
    let pColor = getThemeColor("--primary", color1);
    let aColor = getThemeColor("--accent", color2);

    const updateColors = () => {
      pColor = getThemeColor("--primary", color1);
      aColor = getThemeColor("--accent", color2);
    };

    const observer = new MutationObserver(updateColors);
    if (typeof window !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });
    }
    
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      targetScroll = window.scrollY / maxScroll;
    };
    window.addEventListener("scroll", handleScroll);
    
    const clock = new THREE.Clock();
    let animId = 0;

    // Pause rendering when the tab is hidden to save GPU/battery
    let paused = document.hidden;
    const handleVisibility = () => {
      const wasPaused = paused;
      paused = document.hidden;
      if (wasPaused && !paused) {
        clock.getDelta(); // discard the large delta accumulated while hidden
        animId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    
    // Animation frame render tick
    const tick = () => {
      if (paused) return; // stop scheduling while hidden
      const elapsedTime = clock.getElapsedTime();
      
      // Smoothly interpolate scroll state
      const prevScroll = currentScroll;
      currentScroll += (targetScroll - currentScroll) * 0.08;
      scrollSpeed = Math.abs(currentScroll - prevScroll);
      
      // Push parameters to GPU shaders
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uScroll.value = currentScroll;
      material.uniforms.uScrollSpeed.value = scrollSpeed;

      // Use cached colors in WebGL tick
      material.uniforms.uColor1.value.copy(pColor);
      material.uniforms.uColor2.value.copy(aColor);
      
      // Dynamic multi-axis rotation responsive to elapsed time and scroll depth
      mesh.rotation.y = elapsedTime * 0.12 + currentScroll * 1.8;
      mesh.rotation.x = elapsedTime * 0.04 + currentScroll * 0.4;
      
      // Dynamic mobile-responsive 3D translation trajectory
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const xRange = isMobile ? 0.7 : 1.7;
      const yRange = isMobile ? 1.4 : 2.2;
      
      mesh.position.x = Math.cos(currentScroll * Math.PI * 2.5) * xRange;
      mesh.position.y = (isMobile ? 0.5 : 1.0) - currentScroll * yRange + Math.sin(currentScroll * Math.PI * 3.0) * (isMobile ? 0.2 : 0.35);
      mesh.position.z = Math.sin(currentScroll * Math.PI) * -0.8;
      
      // Dynamic scale
      const scale = 1.0 + currentScroll * 0.3;
      mesh.scale.set(scale, scale, scale);
      
      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };
    tick();
    
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [color1, color2]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%", outline: "none" }}
    />
  );
}
