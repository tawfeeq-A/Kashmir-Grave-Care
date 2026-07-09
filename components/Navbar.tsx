import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export default function Navbar() {
  const { settings } = useSite();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/40 py-3 shadow-sm"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group" aria-label="Kashmir Grave Care — Home">
            <Image
              src="/images/logo.jpg"
              alt=""
              width={36}
              height={36}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-amber-500/20 group-hover:scale-105 transition-transform duration-300"
              priority
            />
            <span className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Grave Care Kashmir
            </span>
          </Link>

          {/* Social Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-muted-foreground">
            {settings?.instagram_profile_url && (
              <a
                href={settings.instagram_profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </a>
            )}
            {settings?.facebook_profile_url && (
              <a
                href={settings.facebook_profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
