"use client";

import { BettiLoader } from "@/components/betti-loader";

/**
 * Full-screen loading fallback matching Betti senior dashboard loader.
 * Used in loading.tsx and Suspense fallbacks.
 */
export default function BettiLoadingFallback() {
  return <BettiLoader isLoading={true} minDisplayTime={0} />;
}
