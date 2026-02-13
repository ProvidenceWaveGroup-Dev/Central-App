"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart3, Download, Activity, Heart, Moon, Pill } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateHealthReport } from "@/lib/pdf-generator"
import { useState } from "react"
import { CustomDateRangeDialog } from "@/components/custom-date-range-dialog"

const weeklyTrends = [
  {
    metric: "Mobility",
    icon: Activity,
    current: "85%",
    trend: "down",
    change: "-5%",
    description: "Average daily movement",
    status: "good",
    sparkline: [88, 90, 87, 85, 83, 85, 85],
  },
  {
    metric: "Hydration",
    icon: Heart,
    current: "92%",
    trend: "up",
    change: "+8%",
    description: "Daily water intake goals met",
    status: "excellent",
    sparkline: [84, 86, 88, 90, 91, 92, 92],
  },
  {
    metric: "Sleep Quality",
    icon: Moon,
    current: "8.2/10",
    trend: "up",
    change: "+0.3",
    description: "Average sleep score",
    status: "excellent",
    sparkline: [7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.2],
  },
  {
    metric: "Medication",
    icon: Pill,
    current: "100%",
    trend: "stable",
    change: "0%",
    description: "Adherence rate",
    status: "perfect",
    sparkline: [100, 100, 100, 100, 100, 100, 100],
  },
]

const monthlyInsights = [
  "Sleep patterns have improved by 15% this month",
  "Medication adherence remains consistently excellent",
  "Mobility levels are within normal range for age group",
  "Hydration goals exceeded 4 out of 7 days this week",
]

export function InsightsTrends() {
  const { toast } = useToast()
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false)

  const handleDownloadPDF = () => {
    toast({
      title: "Generating PDF Report",
      description: "Your comprehensive health report is being prepared",
    })

    setTimeout(() => {
      generateHealthReport(
        {
          name: "Margaret Thompson",
          caregiverName: "Sarah Johnson",
          reportType: "daily",
        },
        {
          mobility: "85% - Good",
          hydration: "92% - Excellent",
          sleepQuality: "8.2/10 - Excellent",
          medicationAdherence: "100% - Perfect",
        },
        {
          heartRate: "72 bpm",
          bloodPressure: "120/80 mmHg",
          temperature: "98.6°F",
          oxygenLevel: "98%",
        },
        [
          "Morning medication taken at 8:00 AM",
          "Breakfast completed at 9:00 AM",
          "Light walking exercise for 15 minutes",
          "Lunch completed at 12:00 PM",
          "Afternoon rest period",
        ],
        ["Slight decrease in mobility (-5%)", "Medication reminder for 6:00 PM"],
      )

      toast({
        title: "Report Ready",
        description: "Your PDF report has been downloaded",
      })
    }, 1500)
  }

  const handleWeeklyReport = () => {
    toast({
      title: "Generating Weekly Report",
      description: "Compiling data from the past 7 days",
    })

    setTimeout(() => {
      generateHealthReport(
        {
          name: "Margaret Thompson",
          caregiverName: "Sarah Johnson",
          reportType: "weekly",
        },
        {
          mobility: "85% - Good (down 5% from last week)",
          hydration: "92% - Excellent (up 8% from last week)",
          sleepQuality: "8.2/10 - Excellent (up 0.3 from last week)",
          medicationAdherence: "100% - Perfect (stable)",
        },
        {
          heartRate: "72 bpm (average)",
          bloodPressure: "120/80 mmHg (average)",
          temperature: "98.6°F (average)",
          oxygenLevel: "98% (average)",
        },
        [
          "Completed all medication schedules",
          "Daily walking exercises maintained",
          "Sleep patterns improved by 15%",
          "Hydration goals exceeded 4 out of 7 days",
          "All scheduled appointments attended",
        ],
        ["Mobility levels slightly decreased", "Continue monitoring hydration"],
      )

      toast({
        title: "Weekly Report Ready",
        description: "Your weekly PDF report has been downloaded",
      })
    }, 1500)
  }

  const handleMonthlyReport = () => {
    toast({
      title: "Generating Monthly Report",
      description: "Compiling data from the past 30 days",
    })

    setTimeout(() => {
      generateHealthReport(
        {
          name: "Margaret Thompson",
          caregiverName: "Sarah Johnson",
          reportType: "monthly",
        },
        {
          mobility: "87% - Good (average for the month)",
          hydration: "90% - Excellent (average for the month)",
          sleepQuality: "8.0/10 - Excellent (average for the month)",
          medicationAdherence: "100% - Perfect (consistent)",
        },
        {
          heartRate: "73 bpm (monthly average)",
          bloodPressure: "122/81 mmHg (monthly average)",
          temperature: "98.6°F (monthly average)",
          oxygenLevel: "98% (monthly average)",
        },
        [
          "100% medication adherence maintained",
          "Sleep patterns improved by 15% this month",
          "Regular exercise routine established",
          "All medical appointments attended",
          "Consistent hydration levels",
        ],
        ["Monitor mobility trends", "Continue current care plan"],
      )

      toast({
        title: "Monthly Report Ready",
        description: "Your monthly PDF report has been downloaded",
      })
    }, 1500)
  }

  const handleCustomReport = (startDate: Date, endDate: Date) => {
    toast({
      title: "Generating Custom Report",
      description: `Compiling data from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
    })

    setTimeout(() => {
      generateHealthReport(
        {
          name: "Margaret Thompson",
          caregiverName: "Sarah Johnson",
          reportType: "custom",
          startDate,
          endDate,
        },
        {
          mobility: "86% - Good (custom period average)",
          hydration: "91% - Excellent (custom period average)",
          sleepQuality: "8.1/10 - Excellent (custom period average)",
          medicationAdherence: "100% - Perfect (consistent)",
        },
        {
          heartRate: "72 bpm (period average)",
          bloodPressure: "121/80 mmHg (period average)",
          temperature: "98.6°F (period average)",
          oxygenLevel: "98% (period average)",
        },
        [
          "Medication adherence maintained throughout period",
          "Consistent sleep patterns observed",
          "Regular exercise routine followed",
          "All scheduled appointments attended",
          "Stable vital signs throughout period",
        ],
        ["Continue monitoring trends", "Maintain current care plan"],
      )

      toast({
        title: "Custom Report Ready",
        description: "Your custom period PDF report has been downloaded",
      })
    }, 1500)
  }

  return (
    <>
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Insights & Reports
            <Button size="sm" variant="outline" className="ml-auto bg-transparent" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-1" />
              PDF Report
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Weekly Trends</h4>
            {weeklyTrends.map((trend, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <trend.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-medium text-foreground">{trend.metric}</h5>
                    <span className="text-sm font-semibold text-foreground">{trend.current}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{trend.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {trend.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                    {trend.trend === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                    {trend.trend === "stable" && <div className="h-3 w-3" />}
                    <span
                      className={`text-xs font-medium ${
                        trend.trend === "up"
                          ? "text-green-600"
                          : trend.trend === "down"
                            ? "text-red-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {trend.change}
                    </span>
                  </div>
                  <Badge
                    variant={trend.status === "excellent" || trend.status === "perfect" ? "default" : "secondary"}
                    className={`text-xs ${
                      trend.status === "excellent" || trend.status === "perfect"
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                  >
                    {trend.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Key Insights</h4>
            <div className="space-y-2">
              {monthlyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded bg-blue-50 border border-blue-200">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-xs text-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="text-xs bg-transparent" onClick={handleWeeklyReport}>
                Weekly
              </Button>
              <Button variant="outline" size="sm" className="text-xs bg-transparent" onClick={handleMonthlyReport}>
                Monthly
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-transparent"
                onClick={() => setIsCustomRangeOpen(true)}
              >
                Custom
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomDateRangeDialog
        open={isCustomRangeOpen}
        onOpenChange={setIsCustomRangeOpen}
        onGenerateReport={handleCustomReport}
      />
    </>
  )
}
