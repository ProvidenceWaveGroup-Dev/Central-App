"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

type AssignedPatient = {
  patient_id: number
  patient_name: string
  facility_name?: string | null
  latest_risk_score?: number | null
  active_alerts?: number
}

export function RealTimeStatus() {
  const [isCalling, setIsCalling] = useState(false)
  const [patient, setPatient] = useState<AssignedPatient | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    // TODO: re-enable when backend is available
    /*
    const userId = localStorage.getItem("betti_user_id")
    const token = localStorage.getItem("betti_token")
    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    if (!userId) {
      return
    }
    const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/users/${userId}/assigned-patients?active_only=true&home_only=false`, { headers })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("assignment fetch failed")
        }
        return res.json()
      })
      .then((rows: AssignedPatient[]) => {
        if (rows && rows.length > 0) {
          setPatient(rows[0])
          return
        }
        throw new Error("no assigned patient")
      })
      .catch(async () => {
        try {
          const fallbackRes = await fetch(`${apiUrl}/api/patients?home_only=false`, { headers })
          if (!fallbackRes.ok) {
            setPatient(null)
            return
          }
          const fallbackPayload = (await fallbackRes.json()) as
            | Array<{
                patient_id?: number
                first_name?: string
                last_name?: string
                facility_name?: string
              }>
            | { value?: Array<{ patient_id?: number; first_name?: string; last_name?: string; facility_name?: string }> }
          const fallbackRows = Array.isArray(fallbackPayload)
            ? fallbackPayload
            : Array.isArray(fallbackPayload?.value)
              ? fallbackPayload.value
              : []
          if (fallbackRows.length > 0 && fallbackRows[0].patient_id) {
            const first = fallbackRows[0].first_name || ""
            const last = fallbackRows[0].last_name || ""
            setPatient({
              patient_id: Number(fallbackRows[0].patient_id),
              patient_name: `${first} ${last}`.trim() || `Patient #${fallbackRows[0].patient_id}`,
              facility_name: fallbackRows[0].facility_name || "Home",
            })
          } else {
            setPatient(null)
          }
        } catch {
          setPatient(null)
        }
      })
    */
  }, [])

  const patientName = patient?.patient_name || "Linked Senior"
  const facilityText = patient?.facility_name || "Home"
  const riskScore =
    patient?.latest_risk_score !== null && patient?.latest_risk_score !== undefined
      ? Number(patient.latest_risk_score)
      : null
  const wellnessScore = riskScore === null ? "N/A" : `${Math.max(1, Math.round((1 - riskScore) * 10))}/10`
  const activeAlerts = Number(patient?.active_alerts || 0)

  const handleCall = () => {
    setIsCalling(true)
    toast({
      title: `Calling ${patientName}...`,
      description: "Connecting to senior's device",
    })

    setTimeout(() => {
      setIsCalling(false)
      toast({
        title: "Call Connected",
        description: `You are now connected with ${patientName}`,
      })
    }, 2000)
  }

  const handleEmergency = () => {
    toast({
      title: "Emergency Alert Sent!",
      description: "Emergency services and family members have been notified",
      variant: "destructive",
    })
    console.log("[caregiver] Emergency alert triggered", new Date().toISOString())
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <span className="text-2xl">S</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-foreground mb-1">{patientName}</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                {facilityText} - Live monitoring - Last update just now
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-medium">Wellness Score:</span>
                <Badge variant={activeAlerts > 0 ? "destructive" : "secondary"} className="text-xs sm:text-sm">
                  {wellnessScore}
                </Badge>
                {activeAlerts > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {activeAlerts} active alert{activeAlerts === 1 ? "" : "s"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              onClick={handleCall}
              disabled={isCalling}
            >
              <Phone className="h-4 w-4 mr-2" />
              {isCalling ? "Calling..." : "Call Senior"}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleEmergency}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
