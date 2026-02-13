"use client"

import { Thermometer, Wind, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const environmentData = [
  {
    icon: Thermometer,
    label: "Temperature",
    value: 28,
    unit: "°C",
    max: 50,
    status: "warning",
    trend: "+4°C/min",
  },
  {
    icon: Wind,
    label: "Air Quality Index",
    value: 165,
    unit: "AQI",
    max: 300,
    status: "danger",
    trend: "Unhealthy",
  },
  {
    icon: Flame,
    label: "Smoke Density",
    value: 78,
    unit: "%",
    max: 100,
    status: "danger",
    trend: "Critical",
  },
]

export function EnvironmentCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Environmental Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {environmentData.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">
                  {item.value}
                  <span className="text-sm font-normal text-muted-foreground">{item.unit}</span>
                </span>
              </div>
            </div>
            <Progress
              value={(item.value / item.max) * 100}
              className={
                item.status === "danger"
                  ? "[&>div]:bg-red-500"
                  : item.status === "warning"
                    ? "[&>div]:bg-yellow-500"
                    : "[&>div]:bg-primary"
              }
            />
            <p className="text-sm text-muted-foreground">{item.trend}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
