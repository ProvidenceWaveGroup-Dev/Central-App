"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Thermometer, Droplets, Activity } from "lucide-react"

export function VitalsMicroTiles() {
  const [vitals, setVitals] = useState([
    {
      icon: Heart,
      label: "Heart Rate",
      value: 72,
      unit: "bpm",
      status: "normal",
      color: "text-white",
      bgColor: "bg-primary",
    },
    {
      icon: Thermometer,
      label: "Skin Temperature",
      value: 98.2,
      unit: "°F",
      status: "normal",
      color: "text-white",
      bgColor: "bg-primary",
    },
    {
      icon: Droplets,
      label: "Hydration Level",
      value: 68,
      unit: "%",
      status: "warning",
      color: "text-foreground",
      bgColor: "bg-yellow-500",
    },
    {
      icon: Activity,
      label: "AI Confidence",
      value: 94,
      unit: "%",
      status: "elevated",
      color: "text-white",
      bgColor: "bg-secondary",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals((prev) =>
        prev.map((vital) => {
          let newValue = vital.value
          const change = Math.random() * 2 - 1 // Random change between -1 and 1

          if (vital.label === "Heart Rate") {
            newValue = Math.max(65, Math.min(85, vital.value + change))
          } else if (vital.label === "Skin Temperature") {
            newValue = Math.max(97.5, Math.min(99.0, vital.value + change * 0.1))
          } else if (vital.label === "Hydration Level") {
            newValue = Math.max(60, Math.min(75, vital.value + change * 0.5))
          } else if (vital.label === "AI Confidence") {
            newValue = Math.max(90, Math.min(98, vital.value + change * 0.3))
          }

          return { ...vital, value: Number.parseFloat(newValue.toFixed(1)) }
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-white/20 text-white border-white/30">Normal</Badge>
      case "warning":
        return <Badge className="bg-white/20 text-foreground border-white/30">Warning</Badge>
      case "elevated":
        return <Badge className="bg-white/20 text-white border-white/30">Elevated</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="border-border shadow-sm bg-white hover-lift animate-card-in">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Vitals - Live Feed</CardTitle>
        <p className="text-sm text-muted-foreground">Real-time monitoring from Halo sensor</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vitals.map((vital) => (
            <div
              key={vital.label}
              className={`${vital.bgColor} rounded-lg p-4 border border-border hover-scale transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-3">
                <vital.icon className={`w-5 h-5 ${vital.color}`} />
                {getStatusBadge(vital.status)}
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${vital.color}`}>{vital.value}</span>
                  <span className={`text-sm ${vital.color} opacity-80`}>{vital.unit}</span>
                </div>
                <p className={`text-xs ${vital.color} opacity-80 font-medium`}>{vital.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
