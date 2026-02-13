"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, FileText } from "lucide-react"
import { HealthMetricModal } from "./health-metric-modal"

const medications = [
  {
    id: 1,
    name: "Lisinopril 10mg",
    time: "8:00 AM",
    acknowledged: true,
    acknowledgedAt: "8:05 AM",
  },
  {
    id: 2,
    name: "Metformin 500mg",
    time: "8:00 AM",
    acknowledged: true,
    acknowledgedAt: "8:05 AM",
  },
  {
    id: 3,
    name: "Aspirin 81mg",
    time: "12:00 PM",
    acknowledged: false,
    acknowledgedAt: null,
  },
  {
    id: 4,
    name: "Atorvastatin 20mg",
    time: "8:00 PM",
    acknowledged: false,
    acknowledgedAt: null,
  },
]

const medicationLogs = [
  { timestamp: "Oct 8, 8:05 AM", value: "Lisinopril 10mg", status: "Confirmed", notes: "On time" },
  { timestamp: "Oct 8, 8:05 AM", value: "Metformin 500mg", status: "Confirmed", notes: "On time" },
  { timestamp: "Oct 7, 8:10 PM", value: "Atorvastatin 20mg", status: "Confirmed", notes: "5 min delay" },
  { timestamp: "Oct 7, 12:15 PM", value: "Aspirin 81mg", status: "Confirmed", notes: "15 min delay" },
  { timestamp: "Oct 7, 8:03 AM", value: "Lisinopril 10mg", status: "Confirmed", notes: "On time" },
  { timestamp: "Oct 7, 8:03 AM", value: "Metformin 500mg", status: "Confirmed", notes: "On time" },
  { timestamp: "Oct 6, 8:00 PM", value: "Atorvastatin 20mg", status: "Confirmed", notes: "On time" },
  { timestamp: "Oct 6, 12:00 PM", value: "Aspirin 81mg", status: "Missed", notes: "Patient forgot" },
]

export function MedicationAcknowledgment() {
  const [showLogs, setShowLogs] = useState(false)

  return (
    <>
      <Card className="p-6 bg-white border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground">Medication Acknowledgment</h3>
            <p className="text-sm text-muted-foreground">Patient medication confirmation status</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowLogs(true)} className="gap-2 bg-transparent">
            <FileText className="h-4 w-4" />
            View Logs
          </Button>
        </div>

        <div className="space-y-3">
          {medications.map((med) => (
            <div
              key={med.id}
              className="flex items-center justify-between rounded-lg border border-border p-4 bg-white"
            >
              <div className="flex items-center gap-3">
                {med.acknowledged ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Clock className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-sm text-foreground">{med.name}</p>
                  <p className="text-xs text-muted-foreground">Scheduled: {med.time}</p>
                </div>
              </div>

              <div className="text-right">
                {med.acknowledged ? (
                  <>
                    <Badge className="bg-primary text-white">Confirmed</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{med.acknowledgedAt}</p>
                  </>
                ) : (
                  <Badge variant="outline" className="border-muted">
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <HealthMetricModal
        isOpen={showLogs}
        onClose={() => setShowLogs(false)}
        title="Medication Acknowledgment Logs"
        logs={medicationLogs}
        headers={["Timestamp", "Medication", "Status", "Notes"]}
      />
    </>
  )
}
