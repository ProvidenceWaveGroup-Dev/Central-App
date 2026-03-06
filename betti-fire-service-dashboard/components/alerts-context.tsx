"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// ── API-Ready Interfaces ──────────────────────────────────────────────
export interface NotificationAlert {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  severity: "critical" | "warning" | "info";
  iconBg: string;
  iconColor: string;
}

interface AlertsContextType {
  alerts: NotificationAlert[];
  readAlertIds: string[];
  unreadCount: number;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
}

const AlertsContext = createContext<AlertsContextType | null>(null);

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts must be used within AlertsProvider");
  return ctx;
}

export function AlertsProvider({
  alerts,
  children,
}: {
  alerts: NotificationAlert[];
  children: ReactNode;
}) {
  const [readAlertIds, setReadAlertIds] = useState<string[]>([]);

  const unreadCount = alerts.filter((a) => !readAlertIds.includes(a.id)).length;

  const markAsRead = useCallback((alertId: string) => {
    setReadAlertIds((prev) =>
      prev.includes(alertId) ? prev : [...prev, alertId]
    );
    // TODO: POST to API to mark alert as read
    // fetch(`/api/alerts/${alertId}/read`, { method: 'POST' });
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadAlertIds(alerts.map((a) => a.id));
    // TODO: POST to API to mark all as read
  }, [alerts]);

  return (
    <AlertsContext.Provider
      value={{ alerts, readAlertIds, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </AlertsContext.Provider>
  );
}