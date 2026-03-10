"use client"

import { useCallback, useEffect, useState } from "react"
import { Thermometer, Wind, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type EnvironmentItem = {
  icon: typeof Thermometer
  label: string
  value: number
  unit: string
  max: number
  status: "safe" | "warning" | "danger"
  trend: string
}

const trendText = (direction: string | undefined): string => {
  const normalized = String(direction || "stable").toLowerCase()
  if (normalized === "rising") return "Rising"
  if (normalized === "falling") return "Falling"
  return "Stable"
}

// HARDWARE_READINESS: keep fallback values so dashboard still runs without live sensors.
const FALLBACK_ENVIRONMENT_DATA: EnvironmentItem[] = [
  {
    icon: Thermometer,
    label: "Temperature",
    value: 28,
    unit: "C",
    max: 50,
    status: "warning",
    trend: "Stable",
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
    value: 18,
    unit: "%",
    max: 100,
    status: "warning",
    trend: "Stable",
  },
]

const classifyAqi = (aqi: number): "safe" | "warning" | "danger" => {
  if (aqi > 150) return "danger"
  if (aqi > 80) return "warning"
  return "safe"
}

const classifySmoke = (smokePct: number): "safe" | "warning" | "danger" => {
  if (smokePct >= 40) return "danger"
  if (smokePct >= 20) return "warning"
  return "safe"
}

const classifyTemp = (tempC: number): "safe" | "warning" | "danger" => {
  if (tempC >= 35 || tempC <= 10) return "danger"
  if (tempC >= 30 || tempC <= 15) return "warning"
  return "safe"
}

export function EnvironmentCard() {
  const [environmentData, setEnvironmentData] = useState<EnvironmentItem[]>(FALLBACK_ENVIRONMENT_DATA)
  const [dataMode, setDataMode] = useState<"live_sensor_ingest" | "mock_fallback">("mock_fallback")

  const fetchEnvironment = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000"
    try {
      const params = new URLSearchParams()
      if (typeof window !== "undefined") {
        const userId = window.localStorage.getItem("betti_user_id") || ""
        if (userId) {
          params.set("patient_id", userId)
        }
      }
      const query = params.toString()
      const response = await fetch(
        `${apiUrl}/api/intelligence/environment/live${query ? `?${query}` : ""}`,
        { cache: "no-store" },
      )
      if (!response.ok) {
        throw new Error(`environment endpoint failed: ${response.status}`)
      }
      const payload = (await response.json()) as {
        data_mode?: string
        metrics?: {
          temperature_c?: number
          aqi?: number
          smoke_pct?: number
        }
        trend_direction?: {
          temperature_c?: string
          aqi?: string
          smoke_pct?: string
        }
      }

      const temperature = Number(payload?.metrics?.temperature_c ?? FALLBACK_ENVIRONMENT_DATA[0].value)
      const aqi = Number(payload?.metrics?.aqi ?? FALLBACK_ENVIRONMENT_DATA[1].value)
      const smoke = Number(payload?.metrics?.smoke_pct ?? FALLBACK_ENVIRONMENT_DATA[2].value)

      const mapped: EnvironmentItem[] = [
        {
          icon: Thermometer,
          label: "Temperature",
          value: Number.isFinite(temperature) ? temperature : FALLBACK_ENVIRONMENT_DATA[0].value,
          unit: "C",
          max: 50,
          status: classifyTemp(temperature),
          trend: trendText(payload?.trend_direction?.temperature_c),
        },
        {
          icon: Wind,
          label: "Air Quality Index",
          value: Number.isFinite(aqi) ? aqi : FALLBACK_ENVIRONMENT_DATA[1].value,
          unit: "AQI",
          max: 300,
          status: classifyAqi(aqi),
          trend: trendText(payload?.trend_direction?.aqi),
        },
        {
          icon: Flame,
          label: "Smoke Density",
          value: Number.isFinite(smoke) ? smoke : FALLBACK_ENVIRONMENT_DATA[2].value,
          unit: "%",
          max: 100,
          status: classifySmoke(smoke),
          trend: trendText(payload?.trend_direction?.smoke_pct),
        },
      ]

      setEnvironmentData(mapped)
      setDataMode(payload?.data_mode === "live_sensor_ingest" ? "live_sensor_ingest" : "mock_fallback")
    } catch {
      setEnvironmentData(FALLBACK_ENVIRONMENT_DATA)
      setDataMode("mock_fallback")
    }
  }, [])

  useEffect(() => {
    fetchEnvironment()
    const timer = window.setInterval(fetchEnvironment, 30000)
    return () => window.clearInterval(timer)
  }, [fetchEnvironment])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Environmental Monitoring</CardTitle>
        <p className="text-xs text-muted-foreground">
          {dataMode === "live_sensor_ingest" ? "Live pipeline sensor data" : "Mock fallback (hardware not connected)"}
        </p>
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