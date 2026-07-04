import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import AdminPanel from "@/components/AdminPanel";
import { SiteProvider } from "@/context/SiteContext";

export default function App({ Component, pageProps }: AppProps) {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <SiteProvider>
      <Head>
        <title>Grave Care Kashmir | Preserving Peace & Memories</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ProgressBar />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
        <WhatsAppButton />
      </div>
      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
    </SiteProvider>
  );
}
