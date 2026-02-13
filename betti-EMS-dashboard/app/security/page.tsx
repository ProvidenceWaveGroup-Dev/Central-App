"use client"

import { useState } from "react"
import { Lock, LockOpen, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function SecurityPage() {
  const [locks, setLocks] = useState([
    {
      id: 1,
      name: "Front Door",
      location: "Main Entrance",
      status: "Locked",
      lastAction: "Locked at 08:30 AM",
      lastActionTime: "2024-01-10 08:30",
      isLoading: false,
    },
    {
      id: 2,
      name: "Back Door",
      location: "Rear Exit",
      status: "Locked",
      lastAction: "Locked at 07:45 AM",
      lastActionTime: "2024-01-10 07:45",
      isLoading: false,
    },
    {
      id: 3,
      name: "Garage Door",
      location: "Garage",
      status: "Unlocked",
      lastAction: "Unlocked at 06:15 AM",
      lastActionTime: "2024-01-10 06:15",
      isLoading: false,
    },
    {
      id: 4,
      name: "Side Gate",
      location: "Garden",
      status: "Locked",
      lastAction: "Locked at 09:00 AM",
      lastActionTime: "2024-01-10 09:00",
      isLoading: false,
    },
  ])

  const handleToggleLock = (lockId: number) => {
    setLocks((prevLocks) =>
      prevLocks.map((lock) => {
        if (lock.id === lockId) {
          const newStatus = lock.status === "Locked" ? "Unlocked" : "Locked"
          const action = newStatus === "Locked" ? "Locked" : "Unlocked"
          const now = new Date()
          const timeString = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })

          toast({
            title: `${lock.name} ${action}`,
            description: `${lock.name} has been ${action.toLowerCase()} successfully.`,
          })

          return {
            ...lock,
            status: newStatus,
            lastAction: `${action} at ${timeString}`,
            lastActionTime: now.toISOString(),
          }
        }
        return lock
      }),
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Security & Smart Locks
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor all smart locks and doors
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {locks.map((lock) => (
            <div
              key={lock.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {lock.status === "Locked" ? (
                    <Lock className="h-6 w-6 text-[#233E7D]" />
                  ) : (
                    <LockOpen className="h-6 w-6 text-amber-500" />
                  )}
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-gray-900">
                      {lock.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {lock.location}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    lock.status === "Locked"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}
                >
                  {lock.status}
                </span>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{lock.lastAction}</span>
                </div>
              </div>

              <button
                onClick={() => handleToggleLock(lock.id)}
                disabled={lock.isLoading}
                className={`w-full inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                  lock.status === "Locked"
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-[#5C7F39] hover:bg-[#4a6a2e]"
                }`}
              >
                {lock.isLoading
                  ? "Processing..."
                  : lock.status === "Locked"
                  ? "Unlock"
                  : "Lock"}
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">
              Lock Activity Log
            </h2>
          </div>
          <div className="space-y-3">
            {locks.map((lock) => (
              <div
                key={lock.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {lock.status === "Locked" ? (
                    <Lock className="h-4 w-4 text-[#233E7D]" />
                  ) : (
                    <LockOpen className="h-4 w-4 text-amber-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {lock.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lock.location}
                    </p>
                  </div>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <p className="text-sm font-medium text-gray-900">
                    {lock.lastAction}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(lock.lastActionTime).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
