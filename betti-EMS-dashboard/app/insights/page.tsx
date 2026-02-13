"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, TrendingDown, Activity, Heart, Pill, Droplet, Moon } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const heartRateData = [
  { date: "Oct 1", value: 72 },
  { date: "Oct 2", value: 75 },
  { date: "Oct 3", value: 70 },
  { date: "Oct 4", value: 78 },
  { date: "Oct 5", value: 73 },
  { date: "Oct 6", value: 71 },
  { date: "Oct 7", value: 74 },
  { date: "Oct 8", value: 76 },
]

const medicationAdherenceData = [
  { week: "Week 1", adherence: 95 },
  { week: "Week 2", adherence: 92 },
  { week: "Week 3", adherence: 98 },
  { week: "Week 4", adherence: 94 },
]

const sleepData = [
  { date: "Oct 1", hours: 7.5 },
  { date: "Oct 2", hours: 6.8 },
  { date: "Oct 3", hours: 8.2 },
  { date: "Oct 4", hours: 7.0 },
  { date: "Oct 5", hours: 7.8 },
  { date: "Oct 6", hours: 6.5 },
  { date: "Oct 7", hours: 7.2 },
  { date: "Oct 8", hours: 7.9 },
]

const hydrationData = [
  { date: "Oct 1", glasses: 6 },
  { date: "Oct 2", glasses: 7 },
  { date: "Oct 3", glasses: 5 },
  { date: "Oct 4", glasses: 8 },
  { date: "Oct 5", glasses: 6 },
  { date: "Oct 6", glasses: 7 },
  { date: "Oct 7", glasses: 6 },
  { date: "Oct 8", glasses: 8 },
]

export default function InsightsPage() {
  const [timePeriod, setTimePeriod] = useState("7days")

  const handleExportPDF = () => {
    console.log("[v0] Exporting report as PDF for period:", timePeriod)
    // PDF export logic would go here
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Insights & Reports</h1>
          <p className="text-muted-foreground">Comprehensive health analytics and detailed metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40 bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportPDF} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-lift animate-card-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-foreground">74 bpm</h3>
            <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-card-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Pill className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-foreground">95%</h3>
            <p className="text-sm text-muted-foreground">Medication Adherence</p>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-card-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Moon className="h-5 w-5 text-secondary" />
              </div>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                <TrendingDown className="h-3 w-3 mr-1" />
                -5%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-foreground">7.3 hrs</h3>
            <p className="text-sm text-muted-foreground">Avg Sleep Duration</p>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-card-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Droplet className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-foreground">6.6 glasses</h3>
            <p className="text-sm text-muted-foreground">Avg Daily Hydration</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Trend */}
        <Card className="hover-lift animate-chart">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Heart Rate Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Daily average heart rate over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DADADA" />
                <XAxis dataKey="date" tick={{ fill: "#59595B", fontSize: 12 }} />
                <YAxis tick={{ fill: "#59595B", fontSize: 12 }} domain={[60, 85]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #DADADA",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#5C7F39" strokeWidth={2} dot={{ fill: "#5C7F39" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Medication Adherence */}
        <Card className="hover-lift animate-chart">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Medication Adherence</CardTitle>
            <p className="text-sm text-muted-foreground">Weekly medication compliance rate</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={medicationAdherenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DADADA" />
                <XAxis dataKey="week" tick={{ fill: "#59595B", fontSize: 12 }} />
                <YAxis tick={{ fill: "#59595B", fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #DADADA",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="adherence" fill="#5C7F39" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sleep Duration */}
        <Card className="hover-lift animate-chart">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Sleep Duration</CardTitle>
            <p className="text-sm text-muted-foreground">Daily sleep hours tracked</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DADADA" />
                <XAxis dataKey="date" tick={{ fill: "#59595B", fontSize: 12 }} />
                <YAxis tick={{ fill: "#59595B", fontSize: 12 }} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #DADADA",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="hours" stroke="#233E7D" strokeWidth={2} dot={{ fill: "#233E7D" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hydration Tracking */}
        <Card className="hover-lift animate-chart">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Hydration Tracking</CardTitle>
            <p className="text-sm text-muted-foreground">Daily water intake (8oz glasses)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hydrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DADADA" />
                <XAxis dataKey="date" tick={{ fill: "#59595B", fontSize: 12 }} />
                <YAxis tick={{ fill: "#59595B", fontSize: 12 }} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #DADADA",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="glasses" fill="#99CA3C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="hover-lift animate-card-in">
        <CardHeader>
          <CardTitle className="text-xl font-serif">Detailed Health Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Comprehensive overview for the selected period</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Vitals Analysis */}
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Vital Signs Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Heart Rate Range</p>
                <p className="text-xl font-bold text-foreground">70-78 bpm</p>
                <p className="text-xs text-primary mt-1">Within normal range</p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Skin Temperature</p>
                <p className="text-xl font-bold text-foreground">97.8°F avg</p>
                <p className="text-xs text-primary mt-1">Stable and normal</p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Hydration Level</p>
                <p className="text-xl font-bold text-foreground">Good</p>
                <p className="text-xs text-primary mt-1">Consistent intake</p>
              </div>
            </div>
          </div>

          {/* Medication Analysis */}
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              Medication Compliance
            </h3>
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Overall Adherence Rate</p>
                <Badge className="bg-primary text-primary-foreground">Excellent</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">94.8%</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Patient has consistently taken medications on schedule with only 2 missed doses in the past 30 days.
                Morning medications show 98% adherence, while evening medications show 92% adherence.
              </p>
            </div>
          </div>

          {/* Activity & Lifestyle */}
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
              <Moon className="h-5 w-5 text-secondary" />
              Sleep & Activity Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Average Sleep Duration</p>
                <p className="text-xl font-bold text-foreground">7.3 hours</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Slightly below recommended 8 hours. Consider earlier bedtime routine.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Restroom Frequency</p>
                <p className="text-xl font-bold text-foreground">6-7 times/day</p>
                <p className="text-xs text-primary mt-1">Normal baseline maintained</p>
              </div>
            </div>
          </div>

          {/* Safety & Incidents */}
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-destructive" />
              Safety Incidents
            </h3>
            <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Fall Detected</p>
                <Badge variant="destructive">1 incident</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                One fall incident detected on October 8 at 8:32 AM in the living room. Fall severity index: 6.8/10.
                Emergency protocols activated successfully. Patient responded to check-in within 3 minutes. No injuries
                reported.
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-3">AI-Generated Recommendations</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-border bg-primary/5">
                <p className="font-medium text-sm text-foreground mb-1">Improve Sleep Quality</p>
                <p className="text-sm text-muted-foreground">
                  Consider establishing a consistent bedtime routine 30 minutes earlier to achieve the recommended 8
                  hours of sleep.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-primary/5">
                <p className="font-medium text-sm text-foreground mb-1">Fall Prevention</p>
                <p className="text-sm text-muted-foreground">
                  Review living room layout for potential hazards. Consider installing additional grab bars or improving
                  lighting.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-primary/5">
                <p className="font-medium text-sm text-foreground mb-1">Maintain Hydration</p>
                <p className="text-sm text-muted-foreground">
                  Current hydration levels are good. Continue current water intake pattern of 6-8 glasses daily.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
