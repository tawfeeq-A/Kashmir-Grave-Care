import Head from "next/head";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <>
      <Head>
        <title>Offline — Grave Care Kashmir</title>
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
            className="btn-base btn-primary gap-2 px-6 py-3 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          {/* Subtle branding */}
          <p className="text-xs text-muted-foreground/60 pt-4">
            Grave Care Kashmir &middot; Preserving Peace &amp; Memories
          </p>
        </div>
      </div>
    </>
  );
}
