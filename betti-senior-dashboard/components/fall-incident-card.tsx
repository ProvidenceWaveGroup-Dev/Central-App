"use client";

import { Shield, AlertTriangle, Clock, TrendingDown } from "lucide-react";

const MOCK = {
  noFallsDetected: true,
  timeSinceLastFall: "14 days",
  incidentCountThisMonth: 0,
  incidentCountLastMonth: 0,
  recentIncidents: [] as { id: string; type: string; time: string; severity: "low" | "medium" | "high" }[],
  frequencyTrend: "improving" as "improving" | "stable" | "increasing",
};

export function FallIncidentCard({
  lastFallTime,
  recoveryStatus,
}: {
  lastFallTime: string | null;
  recoveryStatus: string;
}) {
  const data = MOCK;
  const hasRecentFall = recoveryStatus === "fall_detected" || recoveryStatus === "help_requested" || recoveryStatus === "recovering";
  const displayTimeSince = lastFallTime ? "Just now" : data.timeSinceLastFall;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-[#5C7F39]" />
        <h2 className="font-serif text-lg font-semibold text-gray-900">Fall & Incident Visibility</h2>
      </div>

      {/* Top-level "No falls detected" indicator */}
      <div className={`mb-4 flex items-center gap-3 p-4 rounded-xl border ${data.noFallsDetected && !hasRecentFall ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
        {data.noFallsDetected && !hasRecentFall ? (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-green-800">No falls detected</div>
              <div className="text-sm text-green-700">Sensors are actively monitoring</div>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <div className="font-semibold text-amber-800">Attention needed</div>
              <div className="text-sm text-amber-700">Please respond to the recovery prompt</div>
            </div>
          </>
        )}
      </div>

      {/* Time since last fall */}
      <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Time since last fall/event</span>
        </div>
        <span className="font-semibold text-[#5C7F39]">{displayTimeSince}</span>
      </div>

      {/* Incident frequency metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">This month</div>
          <div className="text-xl font-bold text-gray-900">{data.incidentCountThisMonth}</div>
          <div className="text-xs text-gray-500">incidents</div>
        </div>
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Frequency trend</div>
          <div className="flex items-center gap-1.5">
            <TrendingDown className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-700 capitalize">{data.frequencyTrend}</span>
          </div>
        </div>
      </div>

      {/* Recent incident alerts */}
      {data.recentIncidents.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Recent incident alerts</div>
          <div className="space-y-2">
            {data.recentIncidents.map((inc) => (
              <div key={inc.id} className={`flex items-center justify-between p-3 rounded-lg border ${inc.severity === "high" ? "bg-red-50 border-red-200" : inc.severity === "medium" ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
                <span className="text-sm font-medium">{inc.type}</span>
                <span className="text-xs text-gray-500">{inc.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.recentIncidents.length === 0 && (
        <div className="text-xs text-gray-500 text-center py-2">No recent incidents to display</div>
      )}
    </div>
  );
}
