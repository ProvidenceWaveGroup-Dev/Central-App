"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AiAssistantFab } from "@/components/ai-assistant-fab";
import DashboardWarmup from "@/components/DashboardWarmup";
import SignUpForm from "@/components/SignUpForm";

const buildHostUrl = (hostname: string, port: number) =>
  `http://${hostname}:${port}`;

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const appUrls = {
    senior: process.env.NEXT_PUBLIC_BETTI_SENIOR_URL || buildHostUrl("localhost", 3001),
    caregiver: process.env.NEXT_PUBLIC_BETTI_CAREGIVER_URL || buildHostUrl("localhost", 3002),
    ems: process.env.NEXT_PUBLIC_BETTI_EMS_URL || buildHostUrl("localhost", 3003),
    security: process.env.NEXT_PUBLIC_BETTI_SECURITY_URL || buildHostUrl("localhost", 3004),
    fire: process.env.NEXT_PUBLIC_BETTI_FIRE_URL || buildHostUrl("localhost", 3005),
    admin: process.env.NEXT_PUBLIC_BETTI_ADMIN_URL || buildHostUrl("localhost", 3006),
    operator: process.env.NEXT_PUBLIC_BETTI_OPERATOR_URL || buildHostUrl("localhost", 3007),
  };
  // TODO: re-enable when backend is available
  // const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || buildHostUrl("localhost", 8000);

  const tiers = [
    {
      tier: "Organizational",
      label: "Tier 1",
      description: "Portfolio oversight, compliance, audit, and system administration.",
      apps: [
        {
          title: "Betti Admin",
          description: "Organizational oversight, portfolio management, compliance, audit, and system administration across all facilities and sites.",
          href: appUrls.admin,
        },
      ],
    },
    {
      tier: "Facility Operations",
      label: "Tier 2",
      description: "Site-level event queues, resident oversight, and daily operations.",
      apps: [
        {
          title: "Betti Staff Operator",
          description: "Facility-level event queue, resident oversight, incident coordination, and shift management.",
          href: appUrls.operator,
        },
        {
          title: "Betti Caregiver",
          description: "Event monitoring, care activity coordination, and environment response support for care staff.",
          href: appUrls.caregiver,
        },
      ],
    },
    {
      tier: "Response Partners",
      label: "Tier 3",
      description: "Responder consoles for dispatched and on-call partner agencies.",
      apps: [
        {
          title: "Betti Emergency Service",
          description: "Event response console and dispatch coordination for emergency medical services.",
          href: appUrls.ems,
        },
        {
          title: "Betti Security",
          description: "Environmental monitoring and incident coordination for security personnel.",
          href: appUrls.security,
        },
        {
          title: "Betti Fire Service",
          description: "Incident monitoring and responder coordination for fire and rescue services.",
          href: appUrls.fire,
        },
      ],
    },
    {
      tier: "Resident & Household",
      label: "Tier 4",
      description: "Individual-facing views for residents and the people they live with.",
      apps: [
        {
          title: "Betti Senior",
          description: "Personal living environment monitoring, daily routine support, and event visibility for residents.",
          href: appUrls.senior,
        },
      ],
    },
  ];

  // Flat list kept for DashboardWarmup
  const apps = tiers.flatMap((t) => t.apps);

  // All tiers open by default
  const [openTiers, setOpenTiers] = useState<Record<string, boolean>>(
    Object.fromEntries(tiers.map((t) => [t.tier, true]))
  );

  const toggleTier = (tier: string) =>
    setOpenTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));

  const openLogin = (href: string) => {
    setPendingHref(href);
    setAuthView("login");
    setIsAuthOpen(true);
    setLoginIdentifier("");
    setLoginPassword("");
    setLoginError("");
  };

  const handleLogin = async () => {
    setLoginError("");

    if (!loginIdentifier || !loginPassword) {
      setLoginError("Please enter both Email/Username and Password.");
      return;
    }

    // TODO: re-enable when backend is available
    /*
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail = typeof data?.detail === "string" ? data.detail : "";
        if (/invalid credentials/i.test(detail)) {
          setLoginError("Invalid credentials. Use your email or username (not numeric user ID).");
        } else {
          setLoginError(detail || "Login failed. Please check your credentials.");
        }
        return;
      }

      // Store the JWT token
      if (data.access_token) {
        localStorage.setItem("betti_token", data.access_token);
        localStorage.setItem("betti_user_id", data.user_id);
        localStorage.setItem("betti_user_role", data.role || "");
        localStorage.setItem("betti_user_email", data.email || loginIdentifier);
        localStorage.setItem("betti_user_first_name", data.first_name || "");
        localStorage.setItem("betti_user_last_name", data.last_name || "");
      }

      // Map role to dashboard URL
      const roleToDashboard: Record<string, string> = {
        senior: appUrls.senior,
        caregiver: appUrls.caregiver,
        ems: appUrls.ems,
        security: appUrls.security,
        fire_service: appUrls.fire,
        admin: appUrls.admin,
      };

      const roleToPath: Record<string, string> = {
        senior: "",
        caregiver: "",
        ems: "",
        security: "",
        fire_service: "/admin-dashboard",
        admin: "/admin-dashboard",
      };

      // Redirect to the dashboard matching user's role
      const userRole = data.role;
      const dashboardUrl = userRole && roleToDashboard[userRole]
        ? roleToDashboard[userRole]
        : pendingHref; // Fallback to selected dashboard if role not found
      const dashboardPath = userRole && roleToPath[userRole] ? roleToPath[userRole] : "";

      if (dashboardUrl) {
        const target = new URL(`${dashboardUrl}${dashboardPath}`);
        if (data.access_token) {
          target.searchParams.set("betti_token", String(data.access_token));
        }
        if (data.user_id) {
          target.searchParams.set("betti_user_id", String(data.user_id));
        }
        if (data.role) {
          target.searchParams.set("betti_role", String(data.role));
        }
        if (data.email || loginIdentifier) {
          target.searchParams.set("betti_email", String(data.email || loginIdentifier));
        }
        if (data.first_name) {
          target.searchParams.set("betti_first_name", String(data.first_name));
        }
        if (data.last_name) {
          target.searchParams.set("betti_last_name", String(data.last_name));
        }
        window.location.href = target.toString();
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Network error. Please check if the backend is running.");
    }
    */
    setLoginError("Login is currently unavailable. Backend not yet connected.");
  };

  const authTitle = useMemo(
    () => (authView === "login" ? "Welcome back" : "Create your account"),
    [authView]
  );

  return (
    <div className="min-h-screen bg-white text-[#59595B]">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10 sm:px-10">
        {/* Header */}
        <section className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100">
            <Image
              src="/betti-logo.png"
              alt="Betti logo"
              width={48}
              height={48}
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#233E7D]">
              Betti Intelligence Platform
            </h1>
            <p className="text-sm text-[#59595B]">
              Human-Centric Intelligence Infrastructure — environment monitoring, event coordination, and role-based response across every tier.
            </p>
          </div>
        </section>

        {/* Accordion Tiers */}
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {tiers.map((tier) => {
            const isOpen = openTiers[tier.tier] ?? true;
            return (
              <div key={tier.tier} className="bg-white">
                {/* Accordion header */}
                <button
                  type="button"
                  onClick={() => toggleTier(tier.tier)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-gray-50"
                >
                  <span className="inline-flex items-center rounded-full bg-[#233E7D] px-2.5 py-0.5 text-xs font-semibold text-white flex-shrink-0">
                    {tier.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#233E7D]">{tier.tier}</p>
                    <p className="text-xs text-[#59595B]">{tier.description}</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2 lg:grid-cols-3">
                    {tier.apps.map((app) => (
                      <article
                        key={app.title}
                        className="flex h-full flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:-translate-y-0.5 hover:shadow-md hover:bg-white"
                      >
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-[#233E7D]">{app.title}</h3>
                          <p className="text-xs text-[#59595B] leading-relaxed">{app.description}</p>
                        </div>
                        <div className="mt-auto pt-1">
                          <button
                            type="button"
                            onClick={() => { window.location.href = app.href; }}
                            className="inline-flex w-full items-center justify-center rounded-lg bg-[#233E7D] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1c3164]"
                          >
                            Open
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

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
                {loginError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {loginError}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#59595B]">
                    Email or Username
                  </label>
                  <input
                    className="w-full rounded-lg border border-[#DADADA] px-3 py-2 text-sm text-[#59595B]"
                    placeholder="Email or Username"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
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
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLogin}
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
      <AiAssistantFab />
    </div>
  );
}
