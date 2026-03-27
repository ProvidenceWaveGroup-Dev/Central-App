"use client";

import { useEffect } from "react";
import Image from "next/image";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Betti] Runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/betti-logo.png"
            alt="Betti"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Icon + code */}
        <div className="space-y-2">
          <p className="text-8xl font-black text-slate-200 leading-none select-none">
            500
          </p>
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-orange-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 6 0m-6 0H2.25m13.5 0a3 3 0 0 0 3-3m-3 3a3 3 0 1 1-6 0m6 0h2.25m-14.25-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3M6.75 6h10.5"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Something Went Wrong
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            An unexpected error occurred. The Betti team has been notified. You
            can try again or return to the Central Hub.
          </p>
        </div>

        {/* Error digest */}
        {error.digest && (
          <div className="rounded-lg border bg-slate-50 p-3 text-left">
            <p className="text-xs text-slate-500">
              Error reference:{" "}
              <code className="font-mono text-xs">{error.digest}</code>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors"
            style={{ borderColor: "#233e7d", color: "#233e7d" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f0f4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-colors"
            style={{ backgroundColor: "#233e7d" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a2e5e")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#233e7d")}
          >
            Back to Central Hub
          </a>
          <a
            href="https://betti.providencewavegroup.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors"
            style={{ borderColor: "#233e7d", color: "#233e7d" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f0f4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            Visit Betti Website
          </a>
        </div>

        <p className="text-xs text-slate-400">
          Betti Central Hub &mdash; Error 500
        </p>
      </div>
    </div>
  );
}
