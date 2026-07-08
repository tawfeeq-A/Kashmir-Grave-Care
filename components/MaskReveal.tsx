import { useEffect, useState } from "react";

export default function MaskReveal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Keep consistent server/client DOM node hierarchy for hydration safety
    return <div className="opacity-0">{children}</div>;
  }

  return <>{children}</>;
}

