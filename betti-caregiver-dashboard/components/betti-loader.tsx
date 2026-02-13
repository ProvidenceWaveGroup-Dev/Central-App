"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BettiLoaderProps {
  isLoading?: boolean;
  minDisplayTime?: number;
}

export function BettiLoader({ isLoading = true, minDisplayTime = 1000 }: BettiLoaderProps) {
  const [visible, setVisible] = useState(isLoading);
  const [shouldRender, setShouldRender] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setShouldRender(true);
    } else {
      // Ensure minimum display time before hiding
      const timer = setTimeout(() => {
        setVisible(false);
        // Wait for fade out animation before removing from DOM
        setTimeout(() => setShouldRender(false), 400);
      }, minDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minDisplayTime]);

  if (!shouldRender) return null;

  return (
    <div
      className={`betti-loader ${!visible ? "is-hidden" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(9, 16, 32, 0.35)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
        transition: "opacity 0.4s ease, visibility 0.4s ease",
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
      }}
    >
      <div
        className="betti-loader__inner"
        style={{
          width: "120px",
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/betti-logo.png"
          alt="Loading..."
          width={90}
          height={90}
          className="betti-loader__logo"
          style={{
            width: "90px",
            height: "auto",
            animation: "betti-loader-pulse 1.2s ease-in-out infinite",
          }}
          priority
        />
      </div>

      <style jsx global>{`
        @keyframes betti-loader-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.06);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .betti-loader__logo {
            animation: none !important;
          }
        }

        body.has-loader {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

// Page loader hook for initial page loads
export function usePageLoader(delay = 500) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isLoading;
}
