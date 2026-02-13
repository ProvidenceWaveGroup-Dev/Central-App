"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const locationLogs = [
  {
    id: 1,
    timestamp: "2024-01-10 03:42:15",
    location: "Bedroom",
    duration: "5 mins",
    activity: "No movement detected",
    status: "current",
  },
  {
    id: 2,
    timestamp: "2024-01-10 03:41:30",
    location: "Bedroom",
    duration: "1 min",
    activity: "Movement detected",
    status: "passed",
  },
  {
    id: 3,
    timestamp: "2024-01-10 03:40:15",
    location: "Hallway",
    duration: "1 min",
    activity: "Walking detected",
    status: "passed",
  },
  {
    id: 4,
    timestamp: "2024-01-10 03:15:00",
    location: "Bathroom",
    duration: "25 mins",
    activity: "Routine activity",
    status: "passed",
  },
  {
    id: 5,
    timestamp: "2024-01-10 02:50:00",
    location: "Bedroom",
    duration: "25 mins",
    activity: "Resting",
    status: "passed",
  },
  {
    id: 6,
    timestamp: "2024-01-10 02:30:00",
    location: "Kitchen",
    duration: "20 mins",
    activity: "Preparing food",
    status: "passed",
  },
  {
    id: 7,
    timestamp: "2024-01-10 02:10:00",
    location: "Living Room",
    duration: "20 mins",
    activity: "Watching TV",
    status: "passed",
  },
]

export default function LocationsPage() {
  const [trailPoints, setTrailPoints] = useState<{ x: number; y: number; room: string }[]>([])

  useEffect(() => {
    const points = [
      { x: 20, y: 80, room: "Living Room" },
      { x: 35, y: 70, room: "Hallway" },
      { x: 50, y: 60, room: "Kitchen" },
      { x: 65, y: 50, room: "Hallway" },
      { x: 80, y: 40, room: "Bathroom" },
      { x: 75, y: 30, room: "Hallway" },
      { x: 70, y: 20, room: "Bedroom" },
    ]
    setTrailPoints(points)
  }, [])

  return (
    <div className="p-4 md:p-6 lg:p-8"><div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Location Tracking</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Patient movement history and room-based activity logs
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg sm:text-xl">
              <MapPin className="h-5 w-5 text-primary" />
              Live Movement Map (Last 5 Minutes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[300px] sm:h-[400px] bg-muted rounded-lg border overflow-hidden">
              {/* Floor Plan Background */}
              <div className="absolute inset-0 p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 h-full">
                  <div className="border-2 border-border rounded p-2 sm:p-4 bg-background/50">
                    <p className="text-xs sm:text-sm font-semibold">Living Room</p>
                  </div>
                  <div className="border-2 border-border rounded p-2 sm:p-4 bg-background/50">
                    <p className="text-xs sm:text-sm font-semibold">Kitchen</p>
                  </div>
                  <div className="border-2 border-border rounded p-2 sm:p-4 bg-background/50">
                    <p className="text-xs sm:text-sm font-semibold">Bedroom</p>
                  </div>
                  <div className="border-2 border-border rounded p-2 sm:p-4 bg-background/50">
                    <p className="text-xs sm:text-sm font-semibold">Bathroom</p>
                  </div>
                </div>
              </div>

              {/* Movement Trail */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {trailPoints.map((point, index) => {
                  if (index === 0) return null
                  const prevPoint = trailPoints[index - 1]
                  return (
                    <line
                      key={index}
                      x1={`${prevPoint.x}%`}
                      y1={`${prevPoint.y}%`}
                      x2={`${point.x}%`}
                      y2={`${point.y}%`}
                      stroke="#5C7F39"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      opacity="0.6"
                    />
                  )
                })}
                {trailPoints.map((point, index) => (
                  <circle
                    key={`point-${index}`}
                    cx={`${point.x}%`}
                    cy={`${point.y}%`}
                    r="4"
                    fill={index === trailPoints.length - 1 ? "#ef4444" : "#5C7F39"}
                    opacity={index === trailPoints.length - 1 ? "1" : "0.5"}
                  />
                ))}
              </svg>

              {/* Current Location Indicator - Added red blinking dot */}
              {trailPoints.length > 0 && (
                <div
                  className="absolute w-4 h-4 sm:w-6 sm:h-6 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${trailPoints[trailPoints.length - 1].x}%`,
                    top: `${trailPoints[trailPoints.length - 1].y}%`,
                  }}
                >
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                  <div className="absolute inset-0 bg-red-500 rounded-full" />
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span>Movement Trail</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span>Current Location</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg sm:text-xl">
              <MapPin className="h-5 w-5 text-primary" />
              Location History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-4 rounded-lg border p-4 ${
                    log.status === "current" ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        log.status === "current" ? "bg-primary animate-pulse" : "bg-muted"
                      }`}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{log.location}</h3>
                      {log.status === "current" && <Badge className="bg-primary">Current Location</Badge>}
                    </div>
                    <p className="text-muted-foreground text-sm">{log.activity}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </div>
                      <span>Duration: {log.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div></div>
  )
}
