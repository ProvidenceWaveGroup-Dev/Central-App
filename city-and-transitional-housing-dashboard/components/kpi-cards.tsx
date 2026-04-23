"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Home, TrendingUp, AlertTriangle, Zap, AlertCircle } from "lucide-react"

const kpiData = [
  {
    label: "Total Units",
    value: "2,847",
    icon: Home,
    color: "bg-primary",
    trend: "+12%",
    trendUp: true,
  },
  {
    label: "Occupancy Rate",
    value: "94.2%",
    icon: TrendingUp,
    color: "bg-accent",
    trend: "+2.3%",
    trendUp: true,
  },
  {
    label: "High-Risk Units",
    value: "156",
    icon: AlertTriangle,
    color: "bg-destructive",
    trend: "-8%",
    trendUp: false,
  },
  {
    label: "Energy Efficiency",
    value: "87.5%",
    icon: Zap,
    color: "bg-secondary",
    trend: "+5.1%",
    trendUp: true,
  },
  {
    label: "Active Alerts",
    value: "23",
    icon: AlertCircle,
    color: "bg-[#0A588D]",
    trend: "-3",
    trendUp: false,
  },
]

export function KPICards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index} className="border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`${kpi.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-semibold ${kpi.trendUp ? "text-green-600" : "text-red-600"}`}>
                  {kpi.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
