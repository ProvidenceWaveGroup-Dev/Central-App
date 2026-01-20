"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import DashboardWarmup from "@/components/DashboardWarmup";
import SignUpForm from "@/components/SignUpForm";

/**
 * Safely resolve public URLs from env.
 * Prevents silent localhost usage in production.
 */
const requireUrl = (key: string, fallback: string) => {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : fallback;
};

const buildHostUrl = (hostname: string, port: number) =>
  `http://${hostname}:${port}`;

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const appUrls = {
    senior: requireUrl(
      "NEXT_PUBLIC_BETTI_SENIOR_URL",
      buildHostUrl("localhost", 3001)
    ),
    caregiver: requireUrl(
      "NEXT_PUBLIC_BETTI_CAREGIVER_URL",
      buildHostUrl("localhost", 3002)
    ),
    ems: requireUrl(
      "NEXT_PUBLIC_BETTI_EMS_URL",
      buildHostUrl("localhost", 3003)
    ),
    security: requireUrl(
      "NEXT_PUBLIC_BETTI_SECURITY_URL",
      buildHostUrl("localhost", 3004)
    ),
    fire: requireUrl(
      "NEXT_PUBLIC_BETTI_FIRE_URL",
      buildHostUrl("localhost", 3005)
    ),
  };

  const apps = [
    {
      title: "Betti Senior",
      description: "Betti-Senior-Dashboard web app for wellness monitoring.",
      href: appUrls.senior,
    },
    {
      title: "Betti Caregiver",
      description: "Betti-Caregiver-dashboard web app for care coordination.",
      href: appUrls.caregiver,
    },
    {
      title: "Betti Emergency Service",
      description: "Betti-EMS-dashboard web app for emergency response.",
      href: appUrls.ems,
    },
    {
      title: "Betti Security",
      description: "Betti-Security-Dashboard web app for security monitoring.",
      href: appUrls.security,
    },
    {
      title: "Betti Fire Service",
      description: "Fire service entry that points to the caregiver app.",
      href: appUrls.fire,
    },
  ];

  const openLogin = (href: string) => {
    setPendingHref(href);
    setAuthView("login");
    setIsAuthOpen(true);
  };

  const handleContinue = () => {
    if (!pendingHref) {
      return;
    }

    window.location.href = pendingHref;
  };

  const authTitle = useMemo(
    () => (authView === "login" ? "Welcome back" : "Create your account"),
    [authView]
  );

  return (
    <div className="min-h-screen bg-[#DADADA] text-[#59595B]">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:px-10">
        {/* Header */}
        <section className="flex flex-col items-start gap-4 rounded-2xl border border-[#DADADA] bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white">
            <Image
              src="/betti-logo.png"
              alt="Betti logo"
              width={80}
              height={80}
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#233E7D]">
              Betti Central Hub
            </h1>
            <p className="text-sm text-[#59595B]">
              Quick access to every Betti dashboard experience.
            </p>
          </div>
        </section>

        {/* App Cards */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <article
              key={app.title}
              className="flex h-full flex-col gap-4 rounded-2xl border border-[#DADADA] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-[#233E7D]">
                  {app.title}
                </h2>
                <p className="text-sm text-[#59595B]">{app.description}</p>
              </div>
              <div className="mt-auto">
                <button
                  type="button"
                  onClick={() => openLogin(app.href)}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#233E7D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1c3164]"
                >
                  Open dashboard
                </button>
              </div>
            </article>
          ))}
        </section>
        <DashboardWarmup urls={apps.map((app) => app.href)} />
      </main>

      {isAuthOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#59595B]/40 px-4 py-8">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl sm:p-8">
            <button
              type="button"
              onClick={() => setIsAuthOpen(false)}
              className="absolute right-4 top-4 rounded-full px-2 py-1 text-xs font-semibold text-[#59595B] transition hover:text-[#233E7D]"
            >
              Close
            </button>
            {authView === "login" ? (
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white">
                  <Image
                    src="/betti-logo.png"
                    alt="Betti logo"
                    width={64}
                    height={64}
                    priority
                  />
                </div>
                <h2 className="text-xl font-semibold text-[#233E7D]">
                  {authTitle}
                </h2>
                <p className="mt-1 text-sm text-[#59595B]">
                  Sign in to continue to your dashboard.
                </p>
              </div>
            ) : null}

            {authView === "login" ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#59595B]">
                    User ID
                  </label>
                  <input
                    className="w-full rounded-lg border border-[#DADADA] px-3 py-2 text-sm text-[#59595B]"
                    placeholder="User ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#59595B]">
                    Password
                  </label>
                  <input
                    className="w-full rounded-lg border border-[#DADADA] px-3 py-2 text-sm text-[#59595B]"
                    placeholder="Password"
                    type="password"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4f6b32]"
                >
                  Sign in
                </button>
                <p className="text-center text-xs text-[#59595B]">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthView("signup")}
                    className="font-semibold text-[#5C7F39] hover:text-[#4f6b32]"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <SignUpForm />
                <p className="text-center text-xs text-[#59595B]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthView("login")}
                    className="font-semibold text-[#5C7F39] hover:text-[#4f6b32]"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
