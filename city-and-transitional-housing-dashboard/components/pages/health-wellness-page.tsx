"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Activity, Heart, TrendingUp } from "lucide-react"
import type { CommunityHealthSnapshot } from "@/lib/types"

// healthIndex = round((mobility + activity) / 2)
const healthData: CommunityHealthSnapshot[] = [
  { month: "Jan", mobility: 82, activity: 68, healthIndex: 75 },
  { month: "Feb", mobility: 85, activity: 72, healthIndex: 79 },
  { month: "Mar", mobility: 88, activity: 75, healthIndex: 82 },
  { month: "Apr", mobility: 86, activity: 78, healthIndex: 82 },
  { month: "May", mobility: 90, activity: 82, healthIndex: 86 },
  { month: "Jun", mobility: 92, activity: 85, healthIndex: 89 },
]

type DrillDown = "all" | "healthIndex" | "mobility" | "activity"

export function HealthWellnessPage() {
  const [chartView, setChartView] = useState<DrillDown>("all")
  const latest = healthData[healthData.length - 1]

  // Primary: Overall Health Index
  // Secondary: Mobility Score, Activity Score
  const primaryMetric = {
    title: "Overall Health / Wellness Index",
    value: `${latest.healthIndex}`,
    description: "Composite of Mobility + Activity scores",
    icon: TrendingUp,
    color: "text-white",
    bgColor: "bg-primary",
    trend: "+14 pts since Jan",
  }

  const componentMetrics = [
    {
      title: "Mobility Score",
      value: `${latest.mobility}`,
      description: "Physical movement capability",
      icon: Activity,
      color: "text-white",
      bgColor: "bg-secondary",
      trend: "+10 pts since Jan",
    },
    {
      title: "Activity Score",
      value: `${latest.activity}`,
      description: "Daily engagement & participation",
      icon: Heart,
      color: "text-white",
      bgColor: "bg-[#0A588D]",
      trend: "+17 pts since Jan",
    },
  ]

  const views: { id: DrillDown; label: string }[] = [
    { id: "all",         label: "All Metrics" },
    { id: "healthIndex", label: "Health Index" },
    { id: "mobility",    label: "Mobility" },
    { id: "activity",    label: "Activity" },
  ]

  return (
    <main className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Health &amp; Wellness</h1>
        <p className="text-muted-foreground">
          Community Health Index and component metric tracking
        </p>
      </div>

      {/* Primary metric — full width */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">
                Primary Metric
              </p>
              <p className="text-base font-semibold text-foreground" style={{ fontFamily: "'Georgia Pro', Georgia, serif" }}>
                {primaryMetric.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{primaryMetric.description}</p>
              <p className="text-4xl font-bold text-primary mt-2">{primaryMetric.value}</p>
              <p className="text-xs text-green-600 font-medium mt-1">{primaryMetric.trend}</p>
            </div>
            <div className={`${primaryMetric.bgColor} p-4 rounded-xl`}>
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component metrics */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
          Component Metrics
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {componentMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{metric.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{metric.description}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{metric.value}</p>
                      <p className="text-xs text-green-600 font-medium mt-1">{metric.trend}</p>
                    </div>
                    <div className={`${metric.bgColor} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Interactive trend chart */}
      <Card>
        <CardHeader className="border-b border-border pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base font-serif">Health Index Trends — 6 Months</CardTitle>
              <CardDescription>Select a metric to drill down</CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {views.map((v) => (
              <Button
                key={v.id}
                size="sm"
                variant={chartView === v.id ? "default" : "outline"}
                className={chartView === v.id
                  ? "bg-primary hover:bg-primary/90 text-white text-xs h-7 px-3"
                  : "bg-transparent text-xs h-7 px-3"}
                onClick={() => setChartView(v.id)}
              >
                {v.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={healthData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 100]} stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />

              {(chartView === "all" || chartView === "healthIndex") && (
                <Line
                  type="monotone"
                  dataKey="healthIndex"
                  name="Overall Health Index"
                  stroke="var(--chart-1)"
                  strokeWidth={chartView === "healthIndex" ? 3 : 2}
                  dot={{ fill: "var(--chart-1)", r: chartView === "healthIndex" ? 5 : 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {(chartView === "all" || chartView === "mobility") && (
                <Line
                  type="monotone"
                  dataKey="mobility"
                  name="Mobility Score"
                  stroke="var(--chart-2)"
                  strokeWidth={chartView === "mobility" ? 3 : 1.5}
                  strokeDasharray={chartView === "all" ? "5 3" : undefined}
                  dot={{ fill: "var(--chart-2)", r: chartView === "mobility" ? 5 : 3 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {(chartView === "all" || chartView === "activity") && (
                <Line
                  type="monotone"
                  dataKey="activity"
                  name="Activity Score"
                  stroke="var(--chart-3)"
                  strokeWidth={chartView === "activity" ? 3 : 1.5}
                  strokeDasharray={chartView === "all" ? "2 2" : undefined}
                  dot={{ fill: "var(--chart-3)", r: chartView === "activity" ? 5 : 3 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Active wellness programs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-serif">Active Wellness Programs</CardTitle>
          <CardDescription>Community health initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Morning Yoga Classes",   participants: 24, frequency: "3x / week" },
              { name: "Nutrition Workshops",     participants: 18, frequency: "Monthly" },
              { name: "Walking Groups",          participants: 32, frequency: "Daily" },
              { name: "Mental Health Support",   participants: 15, frequency: "Weekly" },
              { name: "Mobility Therapy",        participants: 11, frequency: "2x / week" },
            ].map((program, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm text-foreground">{program.name}</p>
                  <p className="text-xs text-muted-foreground">{program.frequency}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{program.participants}</p>
                  <p className="text-xs text-muted-foreground">participants</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
