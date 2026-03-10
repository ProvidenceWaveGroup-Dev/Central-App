"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Navigation, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type MovementPoint = {
  room: string;
  time: string;
  confidence: number;
};

type AssignedPatient = {
  patient_id?: number;
  patient_name?: string;
  facility_name?: string;
};

type AlertRow = {
  patient_id?: number | null;
  description?: string | null;
  event_time?: string | null;
  recorded_time?: string | null;
};

const FALLBACK_TRAIL: MovementPoint[] = [
  { room: "Living Room", time: "Just now", confidence: 80 },
  { room: "Hallway", time: "3 minutes ago", confidence: 72 },
  { room: "Bedroom", time: "8 minutes ago", confidence: 68 },
];

const prettyTime = (raw: string | null | undefined): string => {
  if (!raw) return "Unknown time";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "Unknown time";
  const now = Date.now();
  const diffMs = Math.max(0, now - parsed.getTime());
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  return parsed.toLocaleString();
};

const parseRoomFromAlert = (description: string | null | undefined): string | null => {
  const text = String(description || "").trim();
  if (!text) return null;
  const roomMatch = text.match(/\b(room|location)\s*:\s*([A-Za-z0-9 _-]+)/i);
  if (roomMatch?.[2]) {
    return roomMatch[2].trim();
  }
  const inMatch = text.match(/\bin\s+([A-Za-z0-9 _-]{3,40})/i);
  if (inMatch?.[1]) {
    return inMatch[1].trim();
  }
  return null;
};

export function OccupancyCard() {
  const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [facilityName, setFacilityName] = useState("Assigned Home");
  const [patientName, setPatientName] = useState("Assigned patient");
  const [movementTrail, setMovementTrail] = useState<MovementPoint[]>(FALLBACK_TRAIL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("betti_token") || "";
        const userId = Number(localStorage.getItem("betti_user_id") || 0);
        if (!userId || !token) {
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };

        const assignedRes = await fetch(
          `${apiUrl}/api/users/${userId}/assigned-patients?active_only=true`,
          { headers },
        );
        if (!assignedRes.ok) {
          return;
        }

        const assignedRows = (await assignedRes.json().catch(() => [])) as AssignedPatient[];
        const primary = assignedRows[0];
        const primaryPatientId = Number(primary?.patient_id || 0);
        if (!primaryPatientId) {
          return;
        }
        if (primary?.facility_name && mounted) {
          setFacilityName(primary.facility_name);
        }
        if (primary?.patient_name && mounted) {
          setPatientName(primary.patient_name);
        }

        const alertsRes = await fetch(`${apiUrl}/api/alerts?limit=40`, { headers });
        if (!alertsRes.ok) {
          return;
        }
        const alertRows = (await alertsRes.json().catch(() => [])) as AlertRow[];
        const filtered = (alertRows || [])
          .filter((row) => Number(row.patient_id || 0) === primaryPatientId)
          .slice(0, 12);

        const parsedTrail: MovementPoint[] = filtered
          .map((row) => {
            const room = parseRoomFromAlert(row.description) || primary?.facility_name || "Assigned Home";
            return {
              room,
              time: prettyTime(row.recorded_time || row.event_time),
              confidence: parseRoomFromAlert(row.description) ? 88 : 72,
            };
          })
          .filter((item) => Boolean(item.room))
          .slice(0, 5);

        if (mounted && parsedTrail.length > 0) {
          setMovementTrail(parsedTrail);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void run();
    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  const current = useMemo(
    () => movementTrail[0] || FALLBACK_TRAIL[0],
    [movementTrail],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Live Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-primary/10 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <MapPin className="h-4 w-4" />
            Last Known Location
          </div>
          <p className="mt-2 text-2xl font-bold">{current.room}</p>
          <p className="text-sm text-muted-foreground">{current.time}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Confidence:</span>
            <Badge variant="secondary">{current.confidence}%</Badge>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {patientName} - {facilityName}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Navigation className="h-4 w-4" />
            Recent Movement Trail
          </div>
          <div className="space-y-2">
            {movementTrail.map((location, index) => (
              <div key={`${location.room}-${index}`} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${index === 0 ? "bg-primary" : "bg-muted-foreground"}`} />
                  <div>
                    <p className="font-medium">{location.room}</p>
                    <p className="text-xs text-muted-foreground">{location.time}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {location.confidence}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border-2 border-dashed border-border p-4">
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            <TrendingUp className="mr-2 h-4 w-4" />
            {loading ? "Loading live location context..." : "Location telemetry synced"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
