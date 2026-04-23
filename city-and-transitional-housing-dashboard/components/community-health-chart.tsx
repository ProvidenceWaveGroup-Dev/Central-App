"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { CommunityHealthSnapshot } from "@/lib/types"

// healthIndex = round((mobility + activity) / 2)
const chartData: CommunityHealthSnapshot[] = [
  { month: "Jan", mobility: 82, activity: 75, healthIndex: 79 },
  { month: "Feb", mobility: 85, activity: 78, healthIndex: 82 },
  { month: "Mar", mobility: 88, activity: 82, healthIndex: 85 },
  { month: "Apr", mobility: 90, activity: 85, healthIndex: 88 },
  { month: "May", mobility: 92, activity: 88, healthIndex: 90 },
  { month: "Jun", mobility: 94, activity: 90, healthIndex: 92 },
]

type DrillDown = "all" | "healthIndex" | "mobility" | "activity"

const views: { id: DrillDown; label: string }[] = [
  { id: "all",         label: "All Metrics" },
  { id: "healthIndex", label: "Health Index" },
  { id: "mobility",    label: "Mobility" },
  { id: "activity",    label: "Activity" },
]

const drillDownInfo: Record<Exclude<DrillDown, "all">, string> = {
  healthIndex: "Overall Health / Wellness Index — composite score calculated from Mobility and Activity component metrics.",
  mobility:    "Mobility Score — tracks resident movement capability and physical independence. Component metric of the Health Index.",
  activity:    "Activity Score — daily activity engagement and participation levels. Component metric of the Health Index.",
}

export function CommunityHealthChart() {
  const [view, setView] = useState<DrillDown>("all")
  const latest = chartData[chartData.length - 1]

  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border pb-3">
        {/* Title + live summary numbers */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-serif">Community Health Index</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              6-month trend — tap a metric to drill down
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{latest.healthIndex}</p>
              <p className="text-xs text-muted-foreground leading-tight">Health Index</p>
            </div>
            <div className="border-l border-border pl-4 text-center">
              <p className="text-xl font-bold" style={{ color: "var(--chart-2)" }}>{latest.mobility}</p>
              <p className="text-xs text-muted-foreground leading-tight">Mobility</p>
            </div>
            <div className="border-l border-border pl-4 text-center">
              <p className="text-xl font-bold" style={{ color: "var(--chart-3)" }}>{latest.activity}</p>
              <p className="text-xs text-muted-foreground leading-tight">Activity</p>
            </div>
          </div>
        </div>

        {/* Drill-down tab bar */}
        <div className="flex flex-wrap gap-1.5 pt-3">
          {views.map((v) => (
            <Button
              key={v.id}
              size="sm"
              variant={view === v.id ? "default" : "outline"}
              className={view === v.id
                ? "bg-primary hover:bg-primary/90 text-white text-xs h-7 px-3"
                : "bg-transparent text-xs h-7 px-3"}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="month"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={[60, 100]}
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />

            {/* Overall Health Index — primary metric, always thicker */}
            {(view === "all" || view === "healthIndex") && (
              <Line
                type="monotone"
                dataKey="healthIndex"
                name="Overall Health Index"
                stroke="var(--chart-1)"
                strokeWidth={view === "healthIndex" ? 3 : 2}
                dot={{ fill: "var(--chart-1)", r: view === "healthIndex" ? 5 : 4 }}
                activeDot={{ r: 6 }}
              />
            )}

            {/* Mobility Score — component metric */}
            {(view === "all" || view === "mobility") && (
              <Line
                type="monotone"
                dataKey="mobility"
                name="Mobility Score"
                stroke="var(--chart-2)"
                strokeWidth={view === "mobility" ? 3 : 1.5}
                strokeDasharray={view === "all" ? "5 3" : undefined}
                dot={{ fill: "var(--chart-2)", r: view === "mobility" ? 5 : 3 }}
                activeDot={{ r: 6 }}
              />
            )}

            {/* Activity Score — component metric */}
            {(view === "all" || view === "activity") && (
              <Line
                type="monotone"
                dataKey="activity"
                name="Activity Score"
                stroke="var(--chart-3)"
                strokeWidth={view === "activity" ? 3 : 1.5}
                strokeDasharray={view === "all" ? "2 2" : undefined}
                dot={{ fill: "var(--chart-3)", r: view === "activity" ? 5 : 3 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        {/* Contextual description for single-metric drill-down */}
        {view !== "all" && (
          <p className="mt-3 px-3 py-2 bg-muted rounded-md text-xs text-muted-foreground">
            {drillDownInfo[view]}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
