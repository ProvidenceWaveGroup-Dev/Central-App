"use client"

import { Phone, Clock, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function CaregiverCard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const caregiver = {
    name: "Sarah Johnson",
    status: "active" as "active" | "offline",
    lastSeen: "Active now",
  }

  const handleContact = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/communication")
    }, 300)
  }

  return (
    <Card className="p-4 md:p-6 transition-all hover:shadow-lg duration-300">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
          <Avatar className="h-10 w-10 md:h-12 md:w-12 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {caregiver.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-base md:text-lg font-semibold text-foreground">Primary Caregiver</h3>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">{caregiver.name}</p>
            <div className="mt-2 flex items-center gap-2">
              {caregiver.status === "active" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <span className="text-sm text-green-600 font-medium">Active now</span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">{caregiver.lastSeen}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <Badge
          variant={caregiver.status === "active" ? "default" : "secondary"}
          className={`${caregiver.status === "active" ? "bg-green-600" : ""} shrink-0`}
        >
          {caregiver.status === "active" ? "ACTIVE" : "OFFLINE"}
        </Badge>
      </div>
      <Button
        onClick={handleContact}
        disabled={isLoading}
        className="w-full mt-4 bg-primary hover:bg-primary/90 transition-all"
      >
        <Phone className="mr-2 h-4 w-4" />
        {isLoading ? "Connecting..." : "Contact Caregiver"}
      </Button>
    </Card>
  )
}
