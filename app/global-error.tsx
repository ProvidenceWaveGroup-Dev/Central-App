"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Betti] Global layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#ffffff" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            textAlign: "center",
            gap: "2rem",
          }}
        >
          {/* Logo */}
          <img
            src="/betti-logo.png"
            alt="Betti"
            style={{ height: "40px", objectFit: "contain" }}
          />

          {/* Error code */}
          <p
            style={{
              fontSize: "6rem",
              fontWeight: 900,
              color: "rgba(148,163,184,0.3)",
              lineHeight: 1,
              margin: 0,
              userSelect: "none",
            }}
          >
            500
          </p>

          {/* Icon */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "9999px",
              background: "#fff7ed",
              display: "inline-flex",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "3rem", height: "3rem", color: "#f97316" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          {/* Message */}
          <div style={{ maxWidth: "28rem" }}>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 0.5rem",
              }}
            >
              Critical Error
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
              The Betti Central Hub encountered a critical error and could not
              recover. Please refresh the page. If the problem persists, contact
              your system administrator.
            </p>
          </div>

          {/* Digest */}
          {error.digest && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                maxWidth: "28rem",
                width: "100%",
                textAlign: "left",
              }}
            >
              <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
                Error reference:{" "}
                <code style={{ fontFamily: "monospace" }}>{error.digest}</code>
              </p>
            </div>
          )}

          {/* Retry */}
          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.625rem 1.5rem",
              borderRadius: "0.5rem",
              background: "#0f172a",
              color: "#fff",
              border: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>

          {/* Emergency note */}
          <div
            style={{
              maxWidth: "28rem",
              padding: "1rem",
              borderRadius: "0.5rem",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              textAlign: "left",
            }}
          >
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9a3412", margin: "0 0 0.25rem" }}>
              For urgent patient situations
            </p>
            <p style={{ fontSize: "0.75rem", color: "#c2410c", margin: 0 }}>
              Contact your facility&apos;s on-call coordinator directly if you
              need immediate access to patient data.
            </p>
          </div>

          <p style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.6)", margin: 0 }}>
            Betti Central Hub &mdash; Critical Error
          </p>
        </div>
      </body>
    </html>
  );
}
