"use client";

import { useState } from "react";
import { Bell, Volume2, Monitor, User } from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    warningAlerts: true,
    deviceNotifications: false,
    shiftReminders: true,
  });

  const [alertSound, setAlertSound] = useState("chime");
  const [displayMode, setDisplayMode] = useState("comfortable");

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>

        {/* Profile */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">Profile</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</p>
              <p className="text-sm text-gray-900 mt-1">Operator Demo User</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</p>
              <p className="text-sm text-gray-900 mt-1">Facility Operator — Care Aide</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Facility</p>
              <p className="text-sm text-gray-900 mt-1">Betti Senior Living</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Shift Assignment</p>
              <p className="text-sm text-gray-900 mt-1">Day Shift (7:00 AM – 3:00 PM)</p>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">Notification Preferences</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: "criticalAlerts" as const, label: "Critical Alerts", desc: "Falls, emergencies, vitals anomalies" },
              { key: "warningAlerts" as const, label: "Warning Alerts", desc: "Inactivity, medication reminders" },
              { key: "deviceNotifications" as const, label: "Device Notifications", desc: "Battery low, offline devices" },
              { key: "shiftReminders" as const, label: "Shift Reminders", desc: "Upcoming shift, handoff notes" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications[item.key]}
                  onClick={() => toggleNotification(item.key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#5C7F39] focus:ring-offset-2 ${
                    notifications[item.key] ? "bg-[#5C7F39]" : "bg-gray-200"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notifications[item.key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Sound */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <Volume2 className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">Alert Sound</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["chime", "urgent", "soft", "silent"].map((s) => (
              <button
                key={s}
                onClick={() => setAlertSound(s)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize transition ${
                  alertSound === s
                    ? "border-[#5C7F39] bg-[#5C7F39] text-white"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Display */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">Display Preferences</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["compact", "comfortable"].map((d) => (
              <button
                key={d}
                onClick={() => setDisplayMode(d)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize transition ${
                  displayMode === d
                    ? "border-[#233E7D] bg-[#233E7D] text-white"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
