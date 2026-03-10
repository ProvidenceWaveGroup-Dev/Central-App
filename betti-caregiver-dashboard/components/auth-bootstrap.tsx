"use client";

import { useLayoutEffect } from "react";

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
};

export function AuthBootstrap() {
  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("betti_token") || params.get("token");
    const userId = params.get("betti_user_id") || params.get("user_id");
    const role = params.get("betti_role") || params.get("role");
    const email = params.get("betti_email") || params.get("email");
    const firstName = params.get("betti_first_name") || params.get("first_name");
    const lastName = params.get("betti_last_name") || params.get("last_name");

    if (token) {
      localStorage.setItem("betti_token", token);
    }
    if (userId) {
      localStorage.setItem("betti_user_id", userId);
    } else if (token) {
      const payload = decodeJwtPayload(token);
      const sub = Number(payload?.sub);
      if (Number.isFinite(sub) && sub > 0) {
        localStorage.setItem("betti_user_id", String(sub));
      }
    }
    if (role) {
      localStorage.setItem("betti_user_role", role);
    }
    if (email) {
      localStorage.setItem("betti_user_email", email);
    }
    if (firstName) {
      localStorage.setItem("betti_user_first_name", firstName);
    }
    if (lastName) {
      localStorage.setItem("betti_user_last_name", lastName);
    }

    const handled = [
      "betti_token",
      "token",
      "betti_user_id",
      "user_id",
      "betti_role",
      "role",
      "betti_email",
      "email",
      "betti_first_name",
      "first_name",
      "betti_last_name",
      "last_name",
    ];
    let shouldRewrite = false;
    handled.forEach((key) => {
      if (params.has(key)) {
        params.delete(key);
        shouldRewrite = true;
      }
    });
    if (shouldRewrite) {
      const qs = params.toString();
      const nextUrl = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
      window.history.replaceState({}, "", nextUrl);
    }
  }, []);

  return null;
}
