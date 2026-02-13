"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
    <div className="p-4 md:p-6 lg:p-8"><div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Security & Smart Locks</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all smart locks and doors</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {locks.map((lock, index) => (
            <Card
              key={lock.id}
              className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {lock.status === "Locked" ? (
                    <Lock className="h-6 w-6 text-primary" />
                  ) : (
                    <LockOpen className="h-6 w-6 text-amber-500" />
                  )}
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{lock.name}</h3>
                    <p className="text-sm text-muted-foreground">{lock.location}</p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    lock.status === "Locked" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {lock.status}
                </div>
              </div>

              <div className="mb-4 p-3 bg-accent/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{lock.lastAction}</span>
                </div>
              </div>

              <Button
                onClick={() => handleToggleLock(lock.id)}
                disabled={lock.isLoading}
                className={`w-full ${
                  lock.status === "Locked" ? "bg-amber-500 hover:bg-amber-600" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {lock.isLoading ? "Processing..." : lock.status === "Locked" ? "Unlock" : "Lock"}
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Lock Activity Log</h2>
          <div className="space-y-3">
            {locks.map((lock) => (
              <div
                key={lock.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-accent/20 rounded-lg transition-all hover:bg-accent/30 duration-300"
              >
                <div className="flex items-center gap-3">
                  {lock.status === "Locked" ? (
                    <Lock className="h-4 w-4 text-primary" />
                  ) : (
                    <LockOpen className="h-4 w-4 text-amber-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{lock.name}</p>
                    <p className="text-xs text-muted-foreground">{lock.location}</p>
                  </div>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <p className="text-sm font-medium text-foreground">{lock.lastAction}</p>
                  <p className="text-xs text-muted-foreground">{new Date(lock.lastActionTime).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div></div>
  )
}
