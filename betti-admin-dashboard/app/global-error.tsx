"use client";

import { useEffect } from "react";
import { ServerCrash, RefreshCw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// global-error must include its own <html> and <body> tags
// as it replaces the root layout when triggered.
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Betti] Global layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f8fafc" }}>
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
          {/* Icon */}
          <div
            style={{
              padding: "1.5rem",
              borderRadius: "9999px",
              background: "#fff7ed",
              display: "inline-flex",
            }}
          >
            <ServerCrash
              style={{ width: "3.5rem", height: "3.5rem", color: "#ea580c" }}
            />
          </div>

          {/* Error code */}
          <p
            style={{
              fontSize: "6rem",
              fontWeight: 900,
              color: "rgba(100,116,139,0.2)",
              lineHeight: 1,
              userSelect: "none",
              margin: 0,
            }}
          >
            500
          </p>

          {/* Message */}
          <div style={{ maxWidth: "28rem", margin: "0 auto" }}>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "0.5rem",
              }}
            >
              Critical Error
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.6 }}>
              The Betti dashboard encountered a critical error and could not
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
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
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
            <RefreshCw style={{ width: "1rem", height: "1rem" }} />
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
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#9a3412",
                margin: "0 0 0.25rem",
              }}
            >
              For urgent patient situations
            </p>
            <p style={{ fontSize: "0.75rem", color: "#c2410c", margin: 0 }}>
              Contact your facility&apos;s on-call coordinator directly if you
              need immediate access to patient data.
            </p>
          </div>

          <p style={{ fontSize: "0.75rem", color: "rgba(100,116,139,0.5)", margin: 0 }}>
            Betti Admin Dashboard &mdash; Critical Error
          </p>
        </div>
      </body>
    </html>
  );
}
