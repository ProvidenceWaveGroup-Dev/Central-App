"use client"

import { useState } from "react"
import { AlertTriangle, Clock, Radio, Phone, Shield, Ambulance } from "lucide-react"
import { Card } from "@/components/ui/card"
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

export function IncidentHeader() {
  const [notificationStatus, setNotificationStatus] = useState<"active" | "help-on-way">("active")

  const handleNotify = (service: string) => {
    console.log(`[v0] Notifying ${service}`)
    setNotificationStatus("help-on-way")
  }

  return (
    <Card
      className={cn(
        "alert-pulse border-2 p-6",
        notificationStatus === "active" ? "border-red-500 bg-red-50" : "border-amber-500 bg-amber-50",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={cn("rounded-full p-3", notificationStatus === "active" ? "bg-red-500" : "bg-amber-500")}>
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2
              className={cn(
                "font-serif text-2xl font-bold",
                notificationStatus === "active" ? "text-red-900" : "text-amber-900",
              )}
            >
              Smoke Detected in Kitchen
            </h2>
            <div
              className={cn(
                "mt-2 flex flex-wrap items-center gap-4 text-sm",
                notificationStatus === "active" ? "text-red-800" : "text-amber-800",
              )}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Triggered 2 min ago</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4" />
                <span>Halo Sensor - Kitchen</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                variant="destructive"
                className={cn(notificationStatus === "active" ? "bg-red-600" : "bg-amber-600")}
              >
                FIRE
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  notificationStatus === "active" ? "border-red-600 text-red-900" : "border-amber-600 text-amber-900",
                )}
              >
                High Priority
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={cn("text-white", notificationStatus === "active" ? "bg-red-600" : "bg-amber-600")}>
            {notificationStatus === "active" ? "ACTIVE" : "HELP IS ON THE WAY"}
          </Badge>

          {notificationStatus === "active" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Phone className="mr-2 h-4 w-4" />
                  Notify
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Contact Emergency Services</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNotify("Caregiver")}>
                  <Phone className="mr-2 h-4 w-4" />
                  Notify Caregiver
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNotify("Security")}>
                  <Shield className="mr-2 h-4 w-4" />
                  Notify Security Agencies
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNotify("Emergency Services")}>
                  <Ambulance className="mr-2 h-4 w-4" />
                  Notify Emergency Services
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Card>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
