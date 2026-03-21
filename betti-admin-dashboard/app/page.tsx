"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// TODO: re-enable auth when backend is available
// Authentication bypassed for frontend preview — redirect directly to dashboard
// Original login form with full auth flow preserved in app/login/page.tsx

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin-dashboard");
  }, [router]);

  return null;
}
