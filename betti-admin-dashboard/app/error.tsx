"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ServerCrash, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to error reporting service when available
    console.error("[Betti] Runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/betti-logo.png"
            alt="Betti"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Icon + Code */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-6 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <ServerCrash className="h-14 w-14 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-8xl font-black text-muted-foreground/30 leading-none select-none">
            500
          </p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Something Went Wrong
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            An unexpected error occurred. The Betti team has been notified. You
            can try refreshing the page or return to the dashboard.
          </p>
        </div>

        {/* Error digest for support */}
        {error.digest && (
          <div className="rounded-lg border bg-muted/50 p-3 text-left">
            <p className="text-xs text-muted-foreground">
              Error reference:{" "}
              <code className="font-mono text-xs">{error.digest}</code>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button asChild className="gap-2">
            <a href="/admin-dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Back to Dashboard
            </a>
          </Button>
        </div>

        {/* Emergency note */}
        <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10 p-4 text-left space-y-1">
          <p className="text-xs font-medium text-orange-800 dark:text-orange-300">
            For urgent patient situations
          </p>
          <p className="text-xs text-orange-700 dark:text-orange-400">
            If you need immediate access to patient data during this outage,
            contact your facility&apos;s on-call coordinator directly.
          </p>
        </div>

        <p className="text-xs text-muted-foreground/60">
          Betti Admin Dashboard &mdash; Error 500
        </p>
      </div>
    </div>
  );
}
