export default function MaskReveal({ children }: { children: React.ReactNode }) {
  // Render immediately — no opacity gate. Gating the whole page behind
  // opacity-0 until hydration caused a blank flash on slow mobile connections
  // and a reparent reflow when the wrapper switched from <div> to fragment.
  return <>{children}</>;
}
