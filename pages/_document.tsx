import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="Compassionate, professional grave care and restoration services in Kashmir. Connecting the diaspora to the resting places of their loved ones with routine maintenance, floral tributes, and virtual reports."
        />
      </Head>
      <body className="antialiased min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
