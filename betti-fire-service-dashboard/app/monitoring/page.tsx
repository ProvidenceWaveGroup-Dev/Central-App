"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, Video, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const monitoringLogs = [
  {
    id: 1,
    timestamp: "2024-01-10 03:45:23",
    event: "Movement Detected",
    location: "Bedroom",
    status: "normal",
    details: "Patient moved from bed to bathroom",
  },
  {
    id: 2,
    timestamp: "2024-01-10 03:30:15",
    event: "Voice Activity",
    location: "Bedroom",
    status: "alert",
    details: "Distress keyword detected: 'Help'",
  },
  {
    id: 3,
    timestamp: "2024-01-10 03:15:42",
    event: "Heart Rate Spike",
    location: "Bedroom",
    status: "warning",
    details: "Heart rate increased to 110 bpm",
  },
  {
    id: 4,
    timestamp: "2024-01-10 02:50:18",
    event: "Sleep Pattern",
    location: "Bedroom",
    status: "normal",
    details: "Deep sleep phase detected",
  },
  {
    id: 5,
    timestamp: "2024-01-10 02:30:05",
    event: "Environmental Change",
    location: "Bedroom",
    status: "normal",
    details: "Temperature adjusted to 72°F",
  },
]

const cameraLocations = [
  { id: "current", name: "Front Entrance", room: "Front Entrance" },
  { id: "backyard", name: "Backyard", room: "Backyard" },
  { id: "driveway", name: "Driveway", room: "Driveway" },
  { id: "patio", name: "Patio", room: "Patio" },
]

export default function MonitoringPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState(cameraLocations[0])

  const handleCameraSelect = (camera: (typeof cameraLocations)[0]) => {
    setSelectedCamera(camera)
    setIsVideoOpen(true)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Live Monitoring</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Real-time patient activity and health monitoring logs
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg sm:text-xl">
              <Activity className="h-5 w-5 text-primary" />
              Monitoring Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monitoringLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 rounded-lg border p-3 sm:p-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="font-semibold text-sm sm:text-base">{log.event}</h3>
                      <Badge
                        variant={
                          log.status === "alert" ? "destructive" : log.status === "warning" ? "secondary" : "outline"
                        }
                        className="w-fit"
                      >
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm">{log.details}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </div>
                      <span>Location: {log.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
