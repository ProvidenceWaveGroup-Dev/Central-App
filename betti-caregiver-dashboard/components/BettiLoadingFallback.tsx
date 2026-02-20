"use client";

import { BettiLoader } from "@/components/betti-loader";

export default function BettiLoadingFallback() {
  return <BettiLoader isLoading={true} minDisplayTime={0} />;
}
