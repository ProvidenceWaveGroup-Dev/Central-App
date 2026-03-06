"use client";

import { useState } from "react";
import { useAlerts } from "@/components/alerts-context";
import { Bell, X, ChevronRight } from "lucide-react";

export function NotificationBellWidget({ alertsHref = "/" }: { alertsHref?: string }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { alerts: notificationAlerts, readAlertIds, unreadCount, markAsRead } = useAlerts();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 bg-white shadow-xl z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-semibold text-gray-900">Alerts</h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button onClick={() => setShowNotifications(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
              {notificationAlerts.map((alert) => {
                const isUnread = !readAlertIds.includes(alert.id);
                return (
                  <div
                    key={alert.id}
                    onClick={() => markAsRead(alert.id)}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${isUnread ? "bg-blue-50/40" : ""}`}
                  >
                    <div className="flex-shrink-0 flex items-center pt-3">
                      <span className={`h-2 w-2 rounded-full ${isUnread ? "bg-[#233E7D]" : "bg-transparent"}`} />
                    </div>
                    <div className={`flex-shrink-0 w-9 h-9 rounded-full ${alert.iconBg} flex items-center justify-center mt-0.5`}>
                      <alert.icon className={`h-4 w-4 ${alert.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm truncate ${isUnread ? "font-bold text-gray-900" : "font-normal text-gray-600"}`}>{alert.title}</span>
                        {alert.severity === "critical" && (
                          <span className="inline-flex rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">Critical</span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-2 ${isUnread ? "font-semibold text-gray-700" : "font-normal text-gray-500"}`}>{alert.description}</p>
                      <span className="text-[11px] text-gray-400 mt-1 block">{alert.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-100 px-4 py-3">
              <a
                href={alertsHref}
                className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-[#233E7D] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c3266] transition-colors"
              >
                View All Alerts
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}