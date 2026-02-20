"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BettiLoaderProps {
  isLoading?: boolean;
  minDisplayTime?: number;
}

/**
 * Betti senior dashboard loading spinner: blur overlay + pulsing logo.
 */
export function BettiLoader({ isLoading = true, minDisplayTime = 1000 }: BettiLoaderProps) {
  const [visible, setVisible] = useState(isLoading);
  const [shouldRender, setShouldRender] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setShouldRender(false), 400);
      }, minDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minDisplayTime]);

  if (!shouldRender) return null;

  return (
    <div
      className="betti-loader"
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
        style={{
          width: 120,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/betti-logo.png"
          alt=""
          width={90}
          height={90}
          className="betti-loader__logo"
          style={{
            width: 90,
            height: "auto",
            animation: "betti-loader-pulse 1.2s ease-in-out infinite",
          }}
          priority
        />
      </div>
      <style jsx global>{`
        @keyframes betti-loader-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .betti-loader__logo { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
