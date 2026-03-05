"use client";

import { BettiLoader, usePageLoader } from "@/components/betti-loader";

export function RouteLoaderWrapper({ children }: { children: React.ReactNode }) {
  const isInitialLoad = usePageLoader(120);

  return (
    <>
      <BettiLoader isLoading={isInitialLoad} minDisplayTime={80} />
      {children}
    </>
  );
}
