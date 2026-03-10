"use client";

import { useEffect, useState } from "react";

type UserProfile = {
  user_id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  role_name?: string;
  facility_name?: string;
  facility_role?: string;
};

export function UserProfileBanner() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedUserId = localStorage.getItem("betti_user_id");
    const storedRole = localStorage.getItem("betti_user_role");
    const storedEmail = localStorage.getItem("betti_user_email");
    const storedFirstName = localStorage.getItem("betti_user_first_name");
    const storedLastName = localStorage.getItem("betti_user_last_name");

    setUserId(storedUserId);
    setRole(storedRole);

    if (!storedUserId) {
      if (storedEmail || storedFirstName || storedLastName) {
        setProfile({
          first_name: storedFirstName || undefined,
          last_name: storedLastName || undefined,
          email: storedEmail || undefined,
          role_name: storedRole || undefined,
        });
      }
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
    const token = localStorage.getItem("betti_token");
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`${apiUrl}/api/users/${storedUserId}`, { headers })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("profile fetch failed");
        }
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch(() => {
        if (storedEmail || storedFirstName || storedLastName) {
          setProfile({
            first_name: storedFirstName || undefined,
            last_name: storedLastName || undefined,
            email: storedEmail || undefined,
            role_name: storedRole || undefined,
          });
        } else {
          setError("Profile unavailable");
        }
      });
  }, []);

  if (!profile && !userId && !error) {
    return null;
  }

  const nameParts = [profile?.first_name, profile?.last_name].filter(Boolean);
  const displayName =
    nameParts.length > 0
      ? nameParts.join(" ")
      : profile?.email || (userId ? `User ${userId}` : "User");
  const displayRole = profile?.role_name || role || "unknown";

  return (
    <div className="w-full border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
      <span className="font-semibold">Signed in:</span> {displayName}{" "}
      <span className="text-slate-500">({displayRole})</span>
      {profile?.facility_name ? (
        <span className="ml-2 text-slate-500">
          Facility: {profile.facility_name}
          {profile.facility_role ? ` (${profile.facility_role})` : ""}
        </span>
      ) : null}
    </div>
  );
}
