"use client";

import { usePathname } from "next/navigation";
import { BettiLoader, useTransitionLoader } from "@/components/betti-loader";

export function RouteLoaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPageLoading = useTransitionLoader(pathname, 300);

  return (
    <>
      <BettiLoader isLoading={isPageLoading} minDisplayTime={400} />
      {children}
    </>
  );
}
