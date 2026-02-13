"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, AlertCircle } from "lucide-react"

interface MentalHealthData {
  temperament: "calm" | "anxious" | "stressed" | "happy" | "neutral"
  mood: string
  stressLevel: number
  lastUpdated: string
}

const temperamentConfig = {
  calm: { color: "bg-green-100 text-green-800", icon: "😌", label: "Calm" },
  anxious: { color: "bg-yellow-100 text-yellow-800", icon: "😟", label: "Anxious" },
  stressed: { color: "bg-orange-100 text-orange-800", icon: "😰", label: "Stressed" },
  happy: { color: "bg-blue-100 text-blue-800", icon: "😊", label: "Happy" },
  neutral: { color: "bg-gray-100 text-gray-800", icon: "😐", label: "Neutral" },
}

export function MentalHealthCheck() {
  const mentalHealthData: MentalHealthData = {
    temperament: "calm",
    mood: "Relaxed and stable",
    stressLevel: 25,
    lastUpdated: "5 minutes ago",
  }

  const config = temperamentConfig[mentalHealthData.temperament]

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-lg sm:text-xl">
          <Brain className="h-5 w-5 text-primary" />
          Mental Health Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Current Mental State</span>
          <Badge className={config.color}>{config.label}</Badge>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">{mentalHealthData.mood}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Updated {mentalHealthData.lastUpdated}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stress Level</span>
            <span className="font-semibold">{mentalHealthData.stressLevel}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all"
              style={{ width: `${mentalHealthData.stressLevel}%` }}
            />
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-blue-800">
            Patient appears calm and stable. Continue regular monitoring.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
