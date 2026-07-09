import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        {/* ─── Preconnect to font origin for faster loading ─── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
          rel="stylesheet"
        />

        {/* ─── SEO / Meta ─── */}
        <meta
          name="description"
          content="Compassionate, professional grave care and restoration services in Kashmir. Connecting the diaspora to the resting places of their loved ones with routine maintenance, floral tributes, and virtual reports."
        />

        {/* ─── Favicon ─── */}
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />

        {/* ─── PWA Manifest ─── */}
        <link rel="manifest" href="/manifest.json" />

        {/* ─── Theme Color (matches manifest + splash screen) ─── */}
        <meta name="theme-color" content="#1E5C45" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f1210" media="(prefers-color-scheme: dark)" />

        {/* ─── iOS / Safari PWA ─── */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Grave Care Kashmir" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />

        {/* ─── iOS Splash Screens (uses apple-touch-startup-image) ─── */}
        {/* Using brand green bg with centered icon as a simple approach */}
        <meta name="apple-touch-startup-image" content="/icons/icon-512.png" />

        {/* ─── Windows / Microsoft ─── */}
        <meta name="msapplication-TileColor" content="#1E5C45" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.png" />
        <meta name="msapplication-config" content="none" />

        {/* ─── Misc PWA / Mobile ─── */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="application-name" content="Grave Care Kashmir" />
      </Head>
      <body className="antialiased min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        {/* Prevent FOUC: apply dark class only if explicitly stored */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("gck-theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
