"use client"

import { useState } from "react"
import { MapPin, Clock, Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const locationHistory = [
  { room: "Hallway", time: "3:40 AM", status: "passed" },
  { room: "Bedroom", time: "3:41 AM", status: "passed" },
  { room: "Bedroom", time: "3:42 AM - Present", status: "current", duration: "5 mins no movement" },
]

export function LocationTrail() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <MapPin className="h-5 w-5 text-primary" />
          Location Trail
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {locationHistory.map((location, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="relative">
                <div
                  className={`h-3 w-3 rounded-full ${
                    location.status === "current" ? "bg-destructive animate-pulse" : "bg-muted"
                  }`}
                />
                {index < locationHistory.length - 1 && (
                  <div className="absolute left-1/2 top-3 h-8 w-0.5 -translate-x-1/2 bg-muted" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm sm:text-base">{location.room}</span>
                  {location.status === "current" && (
                    <span className="text-destructive text-xs font-semibold">CURRENT</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                  <Clock className="h-3 w-3" />
                  {location.time}
                </div>
                {location.duration && <p className="text-muted-foreground text-xs italic">{location.duration}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
