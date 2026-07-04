import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, Check } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { supabase } from "@/lib/supabase";

export default function Footer({ onOpenAdmin }: { onOpenAdmin?: () => void }) {
  const { settings } = useSite();
  const content = settings?.content_json || {};
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Triple-tap logic for admin panel trigger
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAdminTrigger = useCallback(() => {
    tapCountRef.current += 1;

    // Clear existing timer
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 3) {
      // 3 taps reached — open admin
      tapCountRef.current = 0;
      onOpenAdmin?.();
      return;
    }

    // Reset after 800ms of inactivity
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 800);
  }, [onOpenAdmin]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        const { error } = await supabase
          .from("newsletter_subscriptions")
          .insert([{ email: email.trim() }]);
        
        if (error) {
          console.error("Newsletter subscription error:", error.message);
        }
      } catch (err) {
        console.error("Failed to subscribe:", err);
      }
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-secondary/40 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <img
                src="/images/logo.jpg"
                alt="Grave Care Kashmir Logo"
                className="h-8 w-8 rounded-full object-cover border border-amber-500/20"
              />
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                {settings?.brand_name || "Grave Care Kashmir"}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {content.footerDesc || "Dignified grave maintenance for families across Srinagar and local qabristans. We support families and diaspora around the world in keeping the resting places of their loved ones clean, green, and beautifully preserved."}
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Certified, eco-friendly maintenance</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Book a Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{content.displayAddress || "Srinagar, Jammu & Kashmir, 190001"}</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <div className="flex items-start">
                  <a href={`tel:+${(settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '')}`} className="hover:text-primary transition-colors">+{settings?.whatsapp_number || "91 70068 30501"}</a>
                </div>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>{content.displayEmail || "support@gravecarekashmir.com"}</span>
              </li>
            </ul>
          </div>

          {/* Subscribe Box */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {content.newsletterHeading || "Diaspora Updates"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {content.newsletterText || "Subscribe to receive updates regarding cemetery conditions, seasonal plantation schedules, and community graveyard support projects in Kashmir."}
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm text-primary font-medium py-2 px-3 bg-primary/10 rounded-lg">
                <Check className="h-4 w-4" />
                <span>Thank you! You&apos;ll receive updates soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-primary-foreground bg-primary hover:bg-primary/95 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>
            {content.footerCopyright || `© ${currentYear} ${settings?.brand_name || "Grave Care Kashmir"}. All rights reserved.`}
            <span 
              onClick={handleAdminTrigger} 
              className="inline-flex w-3 h-3 ml-1 cursor-default text-transparent hover:text-transparent select-none"
              title=""
            >
              •
            </span> 
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Caretaker Ethics</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
