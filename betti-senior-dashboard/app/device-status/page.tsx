"use client";

import { useState } from "react";
import { Lock, Zap, Wifi, Battery, Shield } from "lucide-react";

interface DeviceStatuses {
  smartlock: { locked: boolean; lastAction: string };
  backDoor: { locked: boolean; lastAction: string };
  livingRoom: { locked: boolean; lastAction: string };
  bedroom1: { locked: boolean; lastAction: string };
  stoveAutoShutoff: { active: boolean };
  ovenAutoShutoff: { active: boolean };
  fallDetection: { active: boolean };
  motionSensor: { active: boolean };
  medicationDispenser: { active: boolean };
  [key: string]: { locked?: boolean; active?: boolean; lastAction?: string };
}

export default function DeviceStatusPage() {
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatuses>({
    smartlock: { locked: true, lastAction: "Locked 2 hours ago" },
    backDoor: { locked: true, lastAction: "Locked 5 hours ago" },
    livingRoom: { locked: true, lastAction: "Locked 3 hours ago" },
    bedroom1: { locked: true, lastAction: "Locked 8 hours ago" },
    stoveAutoShutoff: { active: true },
    ovenAutoShutoff: { active: false },
    fallDetection: { active: true },
    motionSensor: { active: true },
    medicationDispenser: { active: true },
  });

  const handleDoorToggle = (doorKey: string) => {
    setDeviceStatuses({
      ...deviceStatuses,
      [doorKey]: {
        ...deviceStatuses[doorKey],
        locked: !deviceStatuses[doorKey].locked,
        lastAction: `${!deviceStatuses[doorKey].locked ? "Locked" : "Unlocked"} just now`,
      },
    });
  };

  const handleApplianceToggle = (applianceKey: string) => {
    setDeviceStatuses({
      ...deviceStatuses,
      [applianceKey]: {
        ...deviceStatuses[applianceKey],
        active: !deviceStatuses[applianceKey].active,
      },
    });
  };

  const devices = [
    {
      id: 3,
      name: "Front Door Lock",
      category: "Smart Locks",
      battery: 78,
      status: deviceStatuses.smartlock.locked ? "Locked" : "Unlocked",
      lastToggle: deviceStatuses.smartlock.lastAction,
      controllable: true,
      doorKey: "smartlock",
    },
    {
      id: 4,
      name: "Back Door Lock",
      category: "Smart Locks",
      battery: 72,
      status: deviceStatuses.backDoor.locked ? "Locked" : "Unlocked",
      lastToggle: deviceStatuses.backDoor.lastAction,
      controllable: true,
      doorKey: "backDoor",
    },
    {
      id: 10,
      name: "Living Room Door Lock",
      category: "Smart Locks",
      battery: 74,
      status: deviceStatuses.livingRoom.locked ? "Locked" : "Unlocked",
      lastToggle: deviceStatuses.livingRoom.lastAction,
      controllable: true,
      doorKey: "livingRoom",
    },
    {
      id: 11,
      name: "Bedroom 1 Door Lock",
      category: "Smart Locks",
      battery: 70,
      status: deviceStatuses.bedroom1.locked ? "Locked" : "Unlocked",
      lastToggle: deviceStatuses.bedroom1.lastAction,
      controllable: true,
      doorKey: "bedroom1",
    },
    {
      id: 5,
      name: "Stove Auto-Shutoff",
      category: "Appliance Safety",
      battery: 88,
      status: deviceStatuses.stoveAutoShutoff.active ? "Active" : "Off",
      lastToggle: "Auto-shutoff in 30 min",
      controllable: true,
      applianceKey: "stoveAutoShutoff",
    },
    {
      id: 6,
      name: "Oven Auto-Shutoff",
      category: "Appliance Safety",
      battery: 85,
      status: deviceStatuses.ovenAutoShutoff.active ? "Active" : "Off",
      lastToggle: "Last used yesterday",
      controllable: true,
      applianceKey: "ovenAutoShutoff",
    },
    {
      id: 7,
      name: "Fall Detection Sensor",
      category: "Safety Sensors",
      battery: 91,
      status: deviceStatuses.fallDetection.active ? "Active" : "Off",
      lastToggle: "Always monitoring",
      controllable: true,
      applianceKey: "fallDetection",
    },
    {
      id: 8,
      name: "Motion Sensor",
      category: "Safety Sensors",
      battery: 76,
      status: deviceStatuses.motionSensor.active ? "Active" : "Off",
      lastToggle: "Motion detected 2 min ago",
      controllable: true,
      applianceKey: "motionSensor",
    },
    {
      id: 9,
      name: "Medication Dispenser",
      category: "Health Devices",
      battery: 60,
      status: deviceStatuses.medicationDispenser.active ? "Active" : "Off",
      lastToggle: "Next dose in 4 hours",
      controllable: true,
      applianceKey: "medicationDispenser",
    },
  ];

  const categories = Array.from(new Set(devices.map((d) => d.category)));

  const getBatteryColor = (battery: number) => {
    if (battery > 70) return "text-green-600 bg-green-100 border-green-200";
    if (battery > 40) return "text-amber-600 bg-amber-100 border-amber-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Device Status</h1>
          <p className="text-sm text-gray-500 mt-1">Smart home devices monitoring</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <Wifi className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{devices.length}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Total Devices</p>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {devices.filter((d) => d.status === "Active" || d.status === "Locked").length}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Active / Secured</p>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-center justify-between">
              <Battery className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">
                {devices.filter((d) => d.battery <= 40).length}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Low Battery</p>
          </div>

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center justify-between">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="inline-flex rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                All Systems OK
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">System Status</p>
          </div>
        </div>

        {/* Devices by Category */}
        {categories.map((category) => (
          <div key={category} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              {category === "Smart Locks" ? (
                <Lock className="h-5 w-5 text-[#233E7D]" />
              ) : category === "Appliance Safety" ? (
                <Zap className="h-5 w-5 text-[#233E7D]" />
              ) : (
                <Shield className="h-5 w-5 text-[#233E7D]" />
              )}
              <h2 className="font-serif text-lg font-semibold text-gray-900">{category}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices
                .filter((d) => d.category === category)
                .map((device) => (
                  <div
                    key={device.id}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-serif font-semibold text-gray-900">{device.name}</span>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getBatteryColor(device.battery)}`}
                      >
                        {device.battery}%
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Status</span>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            device.status === "Active" || device.status === "Locked"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : device.status === "Unlocked"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-gray-100 text-gray-700 border border-gray-300"
                          }`}
                        >
                          {device.status}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Last Action:</span>
                        <div className="text-gray-600 mt-0.5">{device.lastToggle}</div>
                      </div>
                    </div>

                    {device.doorKey && (
                      <button
                        onClick={() => handleDoorToggle(device.doorKey!)}
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                          deviceStatuses[device.doorKey].locked
                            ? "bg-[#233E7D] hover:bg-[#1c3266]"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        <Lock className="h-4 w-4" />
                        {deviceStatuses[device.doorKey].locked ? "Unlock" : "Lock"}
                      </button>
                    )}

                    {device.applianceKey && (
                      <button
                        onClick={() => handleApplianceToggle(device.applianceKey!)}
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                          deviceStatuses[device.applianceKey].active
                            ? "bg-[#5C7F39] hover:bg-[#4a6a2e]"
                            : "bg-gray-400 hover:bg-gray-500"
                        }`}
                      >
                        <Zap className="h-4 w-4" />
                        {deviceStatuses[device.applianceKey].active ? "Turn Off" : "Turn On"}
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="rounded-xl bg-[#233E7D] p-6 text-center">
          <h3 className="font-serif text-lg font-semibold text-white mb-2">All Systems Operational</h3>
          <p className="text-white/90 leading-relaxed">
            Your smart home devices are functioning properly. All safety features are active and monitoring your home.
          </p>
        </div>
      </div>
    </div>
  );
}
