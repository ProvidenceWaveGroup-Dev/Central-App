"use client";

import { useEffect, useState } from "react";

type Summary = {
  patients: number;
  alerts: number;
  vitals: number;
  partial?: boolean;
};

export function LiveDataSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    // TODO: re-enable when backend is available
    /*
    let mounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";

    const toArray = <T,>(payload: unknown): T[] => {
      if (Array.isArray(payload)) {
        return payload as T[];
      }
      if (payload && typeof payload === "object") {
        const objectPayload = payload as { value?: unknown; items?: unknown; data?: unknown };
        if (Array.isArray(objectPayload.value)) return objectPayload.value as T[];
        if (Array.isArray(objectPayload.items)) return objectPayload.items as T[];
        if (Array.isArray(objectPayload.data)) return objectPayload.data as T[];
      }
      return [];
    };

    const fetchWithTimeout = async (url: string, headers: Record<string, string>, timeoutMs = 10000) => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, { headers, signal: controller.signal });
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    const fetchArray = async <T,>(url: string, headers: Record<string, string>) => {
      try {
        const response = await fetchWithTimeout(url, headers);
        if (!response.ok) {
          return { ok: false, rows: [] as T[] };
        }
        const payload = await response.json().catch(() => []);
        return { ok: true, rows: toArray<T>(payload) };
      } catch {
        return { ok: false, rows: [] as T[] };
      }
    };

    const fetchArrayWithFallback = async <T,>(
      primaryUrl: string,
      fallbackUrl: string,
      headers: Record<string, string>,
    ) => {
      const primary = await fetchArray<T>(primaryUrl, headers);
      if (primary.ok) {
        return primary;
      }
      return fetchArray<T>(fallbackUrl, headers);
    };

    const load = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("betti_token") : null;
        setHasToken(Boolean(token));
        if (!token) {
          setSummary(null);
          setError("");
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        const [patientsResult, alertsResult, vitalsResult] = await Promise.all([
          fetchArrayWithFallback<Record<string, unknown>>(
            `${apiUrl}/api/patients?home_only=true`,
            `${apiUrl}/api/patients`,
            headers,
          ),
          fetchArrayWithFallback<Record<string, unknown>>(
            `${apiUrl}/api/alerts?limit=10&home_only=true`,
            `${apiUrl}/api/alerts?limit=10`,
            headers,
          ),
          fetchArrayWithFallback<Record<string, unknown>>(
            `${apiUrl}/api/vitals?home_only=true`,
            `${apiUrl}/api/vitals`,
            headers,
          ),
        ]);

        if (!mounted) {
          return;
        }

        const anyLoaded = patientsResult.ok || alertsResult.ok || vitalsResult.ok;
        if (!anyLoaded) {
          setSummary(null);
          setError("Live data unavailable");
          return;
        }

        setSummary({
          patients: patientsResult.rows.length || 0,
          alerts: alertsResult.rows.length || 0,
          vitals: vitalsResult.rows.length || 0,
          partial: !(patientsResult.ok && alertsResult.ok && vitalsResult.ok),
        });
        setError("");
      } catch {
        if (!mounted) {
          return;
        }
        setSummary(null);
        setError("Live data unavailable");
      }
    };

    void load();
    const intervalId = window.setInterval(() => {
      void load();
    }, 30000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
    */
  }, []);

  if (hasToken === null || hasToken === false) {
    return null;
  }

  if (error) {
    return (
      <div className="border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
        {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
        Loading live data...
      </div>
    );
  }

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">
      Live data: {summary.patients} patients, {summary.alerts} recent alerts, {summary.vitals} vitals
      {summary.partial ? " (partial feed)" : ""}
    </div>
  );
}
