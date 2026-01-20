"use client";

import { useEffect } from "react";

type DashboardWarmupProps = {
  urls: string[];
};

const warmupDelayMs = 300;

export default function DashboardWarmup({ urls }: DashboardWarmupProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      urls.forEach((url) => {
        if (!url) {
          return;
        }

        fetch(url, { mode: "no-cors", cache: "no-store" }).catch(() => {});
      });
    }, warmupDelayMs);

    return () => clearTimeout(timeout);
  }, [urls]);

  return null;
}
