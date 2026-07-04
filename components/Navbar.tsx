import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X, Instagram, Facebook } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export default function Navbar() {
  const router = useRouter();
  const { settings } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About Us" },
    { href: "/work", label: "Our Work" },
    { href: "/contact", label: "Book a Service" },
  ];

  const isActive = (path: string) => router.pathname === path;

  // On the homepage, before scroll the navbar sits over the dark hero
  const isHeroPage = router.pathname === "/";
  const showLightText = isHeroPage && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-border/40 py-3 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <img
              src="/images/logo.jpg"
              alt="Grave Care Kashmir Logo"
              className="h-9 w-9 rounded-full object-cover border border-amber-500/20 group-hover:scale-105 transition-transform duration-300"
            />
            <span className={`font-serif text-lg md:text-xl font-bold tracking-tight transition-colors ${
              showLightText
                ? "text-white group-hover:text-white/80"
                : "text-foreground group-hover:text-primary"
            }`}>
              Grave Care Kashmir
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center lg:space-x-5 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(link.href)
                    ? showLightText
                      ? "text-white font-semibold"
                      : "text-primary font-semibold"
                    : showLightText
                    ? "text-white/70 hover:text-white"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className={`absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full ${
                    showLightText ? "bg-white" : "bg-primary"
                  }`} />
                )}
              </Link>
            ))}
          </nav>

          {/* Call to Action and Socials */}
          <div className="hidden lg:flex items-center lg:space-x-4 xl:space-x-5">
            {/* Social Icons */}
            <div className={`flex items-center space-x-3 mr-2 ${showLightText ? "text-white/70" : "text-muted-foreground"}`}>
              {settings?.instagram_profile_url && (
                <a href={settings.instagram_profile_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <Instagram className="h-4.5 w-4.5" />
                </a>
              )}
              {settings?.facebook_profile_url && (
                <a href={settings.facebook_profile_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <Facebook className="h-4.5 w-4.5" />
                </a>
              )}
            </div>
            
            <a
              href={`https://wa.me/${(settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-full transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
                showLightText
                  ? "text-[#0A1F16] bg-white hover:bg-white/90"
                  : "text-primary-foreground bg-primary hover:bg-primary/90"
              }`}
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`p-2 rounded-lg focus:outline-none ${
                showLightText
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-muted"
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-4/5 max-w-sm bg-background border-l border-border px-6 py-6 transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2.5" onClick={() => setIsOpen(false)}>
            <img
              src="/images/logo.jpg"
              alt="Grave Care Kashmir Logo"
              className="h-7 w-7 rounded-full object-cover border border-amber-500/20"
            />
            <span className="font-serif text-lg font-bold text-foreground">
              Grave Care Kashmir
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground p-2 rounded-lg hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-base font-medium px-3 py-2 rounded-lg transition-colors ${
                isActive(link.href)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-border mt-4 flex items-center justify-center space-x-6">
            {settings?.instagram_profile_url && (
              <a href={settings.instagram_profile_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {settings?.facebook_profile_url && (
              <a href={settings.facebook_profile_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2">
                <Facebook className="h-5 w-5" />
              </a>
            )}
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <a
              href={`https://wa.me/${(settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center px-4 py-3 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-sm"
            >
              Get in Touch on WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
