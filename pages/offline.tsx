import Head from "next/head";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <>
      <Head>
        <title>Offline — Kashmir Grave Care</title>
      </Head>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md mx-auto space-y-6">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              You&apos;re offline
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              It looks like your device isn&apos;t connected to the internet.
              Please check your connection and try again.
            </p>
          </div>

          {/* Retry button */}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          {/* Subtle branding */}
          <p className="text-xs text-muted-foreground/60 pt-4">
            Kashmir Grave Care &middot; Preserving Peace &amp; Memories
          </p>
        </div>
      </div>
    </>
  );
}
