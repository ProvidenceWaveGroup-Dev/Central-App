"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Flame, Wind } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "Fall Detection",
    icon: AlertCircle,
    property: "Greenview Apts",
    unit: "204B",
    severity: "critical",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "Fire Alert",
    icon: Flame,
    property: "Riverside Complex",
    unit: "102A",
    severity: "high",
    time: "12 min ago",
  },
  {
    id: 3,
    type: "Air Quality",
    icon: Wind,
    property: "Hillside Residences",
    unit: "305C",
    severity: "medium",
    time: "28 min ago",
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-700 border-red-300"
    case "high":
      return "bg-orange-100 text-orange-700 border-orange-300"
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-300"
    default:
      return "bg-blue-100 text-blue-700 border-blue-300"
  }
}

export function AlertFeed() {
  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg font-serif">Live Alerts</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {alerts.map((alert) => {
            const Icon = alert.icon
            return (
              <div key={alert.id} className={`p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start gap-3 mb-2">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{alert.type}</p>
                    <p className="text-xs opacity-75">
                      {alert.property} • Unit {alert.unit}
                    </p>
                  </div>
                  <span className="text-xs opacity-75 whitespace-nowrap">{alert.time}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                    ✓ Acknowledge
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                    📝 Note
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
