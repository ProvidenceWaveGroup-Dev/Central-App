"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smile, Frown, Meh } from "lucide-react"

export function MentalHealthCard() {
  const mentalState = {
    temperament: "Calm",
    mood: "Positive",
    stressLevel: "Low",
    lastChecked: "2 minutes ago",
  }

  const getTemperamentIcon = () => {
    switch (mentalState.temperament) {
      case "Calm":
        return <Smile className="h-8 w-8 text-green-500" />
      case "Anxious":
        return <Frown className="h-8 w-8 text-red-500" />
      default:
        return <Meh className="h-8 w-8 text-yellow-500" />
    }
  }

  const getTemperamentColor = () => {
    switch (mentalState.temperament) {
      case "Calm":
        return "bg-green-100 text-green-800"
      case "Anxious":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <Card className="p-6 animate-in fade-in slide-in-from-top-4 duration-500 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">Mental Health Check</h3>
          <p className="text-sm text-muted-foreground mt-1">Current mental state assessment</p>
        </div>
        {getTemperamentIcon()}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Temperament</span>
          <Badge className={getTemperamentColor()}>{mentalState.temperament}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Mood</span>
          <Badge variant="secondary">{mentalState.mood}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Stress Level</span>
          <Badge variant="outline">{mentalState.stressLevel}</Badge>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">Last checked: {mentalState.lastChecked}</p>
        </div>
      </div>
    </Card>
  )
}
