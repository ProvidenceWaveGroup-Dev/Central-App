"use client";

import { ReactNode } from "react";
import { BettiLoader, usePageLoader } from "./betti-loader";

interface PageLoaderWrapperProps {
  children: ReactNode;
  loadDelay?: number;
}

export function PageLoaderWrapper({ children, loadDelay = 1500 }: PageLoaderWrapperProps) {
  const isLoading = usePageLoader(loadDelay);

  return (
    <>
      <BettiLoader isLoading={isLoading} />
      {children}
    </>
  );
}
