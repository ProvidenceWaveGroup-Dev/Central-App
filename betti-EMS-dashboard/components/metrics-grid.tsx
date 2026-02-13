"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageCircle, Frown, TrendingDown, AlertCircle } from "lucide-react"
import { HealthMetricModal } from "./health-metric-modal"

// Sample log data for each metric
const restroomLogs = [
  { timestamp: "Oct 8, 8:45 AM", value: "Visit #1", status: "Normal", notes: "Morning routine" },
  { timestamp: "Oct 8, 11:20 AM", value: "Visit #2", status: "Normal", notes: "" },
  { timestamp: "Oct 8, 2:15 PM", value: "Visit #3", status: "Normal", notes: "" },
  { timestamp: "Oct 8, 5:30 PM", value: "Visit #4", status: "Normal", notes: "" },
  { timestamp: "Oct 8, 8:00 PM", value: "Visit #5", status: "Normal", notes: "Evening routine" },
  { timestamp: "Oct 7, 7:30 AM", value: "Visit #1", status: "Normal", notes: "" },
  { timestamp: "Oct 7, 10:45 AM", value: "Visit #2", status: "Normal", notes: "" },
]

const checkInLogs = [
  { timestamp: "Oct 8, 2:00 PM", value: "I'm fine", status: "Positive", notes: "Voice response, clear speech" },
  { timestamp: "Oct 8, 10:00 AM", value: "Doing well", status: "Positive", notes: "Voice response" },
  { timestamp: "Oct 7, 6:00 PM", value: "Good", status: "Positive", notes: "Voice response" },
  { timestamp: "Oct 7, 2:00 PM", value: "I'm okay", status: "Positive", notes: "Voice response" },
  { timestamp: "Oct 7, 10:00 AM", value: "Fine", status: "Positive", notes: "Voice response, slight delay" },
]

const moodLogs = [
  { timestamp: "Oct 8, 8:30 AM", value: "Slight slurring", status: "Moderate", notes: "Morning speech pattern" },
  { timestamp: "Oct 7, 3:00 PM", value: "Normal speech", status: "Normal", notes: "Clear communication" },
  { timestamp: "Oct 6, 9:00 AM", value: "Tone deviation", status: "Mild", notes: "Slightly lower energy" },
  { timestamp: "Oct 5, 2:00 PM", value: "Normal speech", status: "Normal", notes: "" },
]

const fallLogs = [
  { timestamp: "Oct 8, 8:32 AM", value: "8.7/10", status: "High Impact", notes: "Living room, 4.2g acceleration" },
  { timestamp: "Oct 1, 3:15 PM", value: "3.2/10", status: "Low Impact", notes: "Bedroom, recovered quickly" },
  { timestamp: "Sep 28, 11:00 AM", value: "5.5/10", status: "Medium Impact", notes: "Bathroom, 2.8g acceleration" },
]

const allergyLogs = [
  {
    timestamp: "Oct 8, 9:00 AM",
    value: "Anaphylaxis Risk",
    status: "Critical",
    notes: "Penicillin exposure detected",
  },
  { timestamp: "Sep 15, 2:00 PM", value: "Mild Reaction", status: "Low", notes: "Sulfa medication, monitored" },
  { timestamp: "Aug 22, 10:30 AM", value: "No Reaction", status: "Normal", notes: "Routine medication check" },
]

export function MetricsGrid() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  const metrics = [
    {
      icon: Calendar,
      label: "Restroom Frequency",
      value: "6-7 times/day",
      status: "Within baseline range",
      statusColor: "text-primary",
      modalTitle: "Restroom Frequency Logs",
      logs: restroomLogs,
      headers: ["Timestamp", "Visit", "Status", "Notes"],
    },
    {
      icon: MessageCircle,
      label: 'Last "Are You OK?" Response',
      value: "2 hours ago",
      status: 'Voice response: "I\'m fine"',
      statusColor: "text-primary",
      modalTitle: "Check-In Response Logs",
      logs: checkInLogs,
      headers: ["Timestamp", "Response", "Status", "Notes"],
    },
    {
      icon: Frown,
      label: "Mood / Speech Anomalies",
      value: "Slight slurring detected",
      status: "Tone deviation: Moderate",
      statusColor: "text-yellow-600",
      modalTitle: "Mood & Speech Analysis Logs",
      logs: moodLogs,
      headers: ["Timestamp", "Observation", "Severity", "Notes"],
    },
    {
      icon: TrendingDown,
      label: "Fall Severity Index",
      value: "High Impact - 8.7/10",
      status: "Acceleration: 4.2g • Inactivity: 45s",
      statusColor: "text-destructive",
      modalTitle: "Fall Incident Logs",
      logs: fallLogs,
      headers: ["Timestamp", "Severity", "Impact Level", "Details"],
    },
    {
      icon: AlertCircle,
      label: "Allergy Reaction Severity",
      value: "Anaphylaxis Risk",
      status: "Penicillin exposure: Critical",
      statusColor: "text-destructive",
      modalTitle: "Allergy Reaction Logs",
      logs: allergyLogs,
      headers: ["Timestamp", "Reaction Type", "Severity", "Details"],
    },
  ]

  const selectedMetricData = metrics.find((m) => m.label === selectedMetric)

  return (
    <>
      <Card className="border-border shadow-sm bg-white hover-lift animate-card-in">
        <CardHeader>
          <CardTitle className="text-xl font-serif">Additional Metrics</CardTitle>
          <p className="text-sm text-muted-foreground">Click any metric to view detailed logs</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                onClick={() => setSelectedMetric(metric.label)}
                className="p-4 rounded-lg border border-border bg-white hover:bg-[#5C7F39] hover:text-white transition-all duration-300 cursor-pointer hover-scale group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-white/20 transition-colors">
                    <metric.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-white mb-1 transition-colors">
                      {metric.label}
                    </h4>
                    <p className="text-sm text-foreground group-hover:text-white font-medium mb-1 transition-colors">
                      {metric.value}
                    </p>
                    <p
                      className={`text-xs ${metric.statusColor} group-hover:text-white/90 font-medium transition-colors`}
                    >
                      {metric.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedMetricData && (
        <HealthMetricModal
          isOpen={!!selectedMetric}
          onClose={() => setSelectedMetric(null)}
          title={selectedMetricData.modalTitle}
          logs={selectedMetricData.logs}
          headers={selectedMetricData.headers}
        />
      )}
    </>
  )
}
