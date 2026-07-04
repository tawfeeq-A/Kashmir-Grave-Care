import { useEffect, useState } from "react";

export default function ProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight === 0) return;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[4px] w-full z-[100] origin-left shadow-[0_0_14px_rgba(53,208,127,0.45)] transition-transform duration-75 ease-out"
      style={{
        transform: `scaleX(${scrollProgress})`,
        background: "linear-gradient(90deg, #35d07f, #C2841A)",
      }}
    />
  );
}
