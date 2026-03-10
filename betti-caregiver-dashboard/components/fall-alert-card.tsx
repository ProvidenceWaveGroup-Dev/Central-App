"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  PersonStanding,
  AlertOctagon,
  PhoneCall,
  ThumbsUp,
  Shield,
  AlertTriangle,
  MapPin,
  Clock,
  User,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type FallStatus = "monitoring" | "fall_detected" | "responding" | "resolved"

interface FallEvent {
  id: number
  patientName: string
  location: string
  time: string
  status: FallStatus
  respondedBy?: string
}

export function FallAlertCard() {
  const [fallStatus, setFallStatus] = useState<FallStatus>("monitoring")
  const [currentFall, setCurrentFall] = useState<FallEvent | null>(null)
  const [responseCountdown, setResponseCountdown] = useState(30)
  const [showFallModal, setShowFallModal] = useState(false)
  const [patientName, setPatientName] = useState("Linked Senior")
  const [linkedPatientId, setLinkedPatientId] = useState<number | null>(null)
  const [linkedFacilityId, setLinkedFacilityId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
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
      .then((rows: Array<{ patient_id?: number; facility_id?: number; patient_name?: string }>) => {
        if (rows && rows.length > 0 && rows[0].patient_name) {
          setPatientName(rows[0].patient_name)
          setLinkedPatientId(Number(rows[0].patient_id || 0) || null)
          setLinkedFacilityId(Number(rows[0].facility_id || 0) || null)
          return
        }
        throw new Error("no assigned patient")
      })
      .catch(async () => {
        try {
          const fallbackRes = await fetch(`${apiUrl}/api/patients?home_only=false`, { headers })
          if (!fallbackRes.ok) {
            setPatientName("Linked Senior")
            return
          }
          const payload = (await fallbackRes.json()) as
            | Array<{ first_name?: string; last_name?: string; patient_id?: number; facility_id?: number }>
            | { value?: Array<{ first_name?: string; last_name?: string; patient_id?: number; facility_id?: number }> }
          const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.value) ? payload.value : []
          if (rows.length > 0) {
            const first = rows[0].first_name || ""
            const last = rows[0].last_name || ""
            setPatientName(`${first} ${last}`.trim() || `Patient #${rows[0].patient_id || ""}`.trim())
            setLinkedPatientId(Number(rows[0].patient_id || 0) || null)
            setLinkedFacilityId(Number(rows[0].facility_id || 0) || null)
          } else {
            setPatientName("Linked Senior")
            setLinkedPatientId(null)
            setLinkedFacilityId(null)
          }
        } catch {
          setPatientName("Linked Senior")
          setLinkedPatientId(null)
          setLinkedFacilityId(null)
        }
      })
  }, [])

  // Countdown effect when fall is detected
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout

    if (fallStatus === "fall_detected" && responseCountdown > 0) {
      countdownInterval = setInterval(() => {
        setResponseCountdown((prev) => {
          if (prev <= 1) {
            handleAutoEscalate()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, [fallStatus, responseCountdown])

  // HARDWARE_READINESS: simulate button now posts through open-ingest so demo follows real pipeline.
  const simulateFallDetection = async () => {
    const newFall: FallEvent = {
      id: Date.now(),
      patientName,
      location: "Living Room",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "fall_detected",
    }
    setCurrentFall(newFall)
    setFallStatus("fall_detected")
    setResponseCountdown(30)
    setShowFallModal(true)

    try {
      const patientId = linkedPatientId || 1
      const facilityId = linkedFacilityId || 1
      const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000"
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      const ingestKey = process.env.NEXT_PUBLIC_OPEN_INGEST_KEY || ""
      if (ingestKey) {
        headers["x-open-ingest-key"] = ingestKey
      }
      await fetch(`${apiUrl}/api/intelligence/open-ingest?source=caregiver_simulator&run_ai=false`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          event_type: "fall_suspected",
          patient_id: patientId,
          facility_id: facilityId,
          confidence: 0.86,
          source_sensor_id: 7001,
          attributes: {
            no_motion_after_fall_duration_seconds: 32,
            impact_g: 2.7,
            velocity_change_m_s: 1.9,
          },
        }),
      })
    } catch {
      // keep local UI flow even when ingest endpoint is unavailable
    }
  }

  // Handle caregiver response
  const handleRespond = () => {
    setFallStatus("responding")
    setShowFallModal(false)
    toast({
      title: "Response Initiated",
      description: "You are now responding to the fall alert. Patient has been notified.",
    })

    // Simulate resolution after response
    setTimeout(() => {
      setFallStatus("resolved")
      if (currentFall) {
        setCurrentFall({ ...currentFall, status: "resolved", respondedBy: "You" })
      }
      toast({
        title: "Fall Alert Resolved",
        description: "The patient confirmed they are okay.",
      })

      // Reset after a few seconds
      setTimeout(() => {
        setFallStatus("monitoring")
        setCurrentFall(null)
        setResponseCountdown(30)
      }, 5000)
    }, 3000)
  }

  // Handle auto-escalation when no response
  const handleAutoEscalate = () => {
    setShowFallModal(false)
    setFallStatus("responding")
    toast({
      title: "Emergency Services Contacted",
      description: "No response received. EMS has been automatically notified.",
      variant: "destructive",
    })
  }

  // Handle calling EMS directly
  const handleCallEMS = () => {
    setShowFallModal(false)
    setFallStatus("responding")
    toast({
      title: "EMS Contacted",
      description: "Emergency Medical Services have been dispatched.",
      variant: "destructive",
    })
  }

  const getStatusColor = () => {
    switch (fallStatus) {
      case "fall_detected":
        return "bg-red-50 border-red-300 dark:bg-red-950 dark:border-red-800"
      case "responding":
        return "bg-yellow-50 border-yellow-300 dark:bg-yellow-950 dark:border-yellow-800"
      case "resolved":
        return "bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-800"
      default:
        return "border-border"
    }
  }

  return (
    <>
      <Card className={`${getStatusColor()} transition-colors duration-300`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PersonStanding className={`h-5 w-5 ${
                fallStatus === "fall_detected" ? "text-red-600 animate-pulse" :
                fallStatus === "responding" ? "text-yellow-600" :
                fallStatus === "resolved" ? "text-green-600" :
                "text-primary"
              }`} />
              Fall Detection Monitor
            </div>
            <Badge className={`text-xs ${
              fallStatus === "fall_detected" ? "bg-red-600 text-white animate-pulse" :
              fallStatus === "responding" ? "bg-yellow-500 text-white" :
              fallStatus === "resolved" ? "bg-green-600 text-white" :
              "bg-primary text-primary-foreground"
            }`}>
              {fallStatus === "fall_detected" ? "FALL DETECTED" :
               fallStatus === "responding" ? "RESPONDING" :
               fallStatus === "resolved" ? "RESOLVED" :
               "Monitoring"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Display */}
          <div className={`p-4 rounded-lg ${
            fallStatus === "fall_detected" ? "bg-red-100 dark:bg-red-900/30" :
            fallStatus === "responding" ? "bg-yellow-100 dark:bg-yellow-900/30" :
            fallStatus === "resolved" ? "bg-green-100 dark:bg-green-900/30" :
            "bg-muted"
          }`}>
            <div className="flex items-center gap-3 mb-2">
              {fallStatus === "monitoring" && (
                <>
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium text-primary">All Patients Safe</span>
                </>
              )}
              {fallStatus === "fall_detected" && (
                <>
                  <AlertOctagon className="h-5 w-5 text-red-600 animate-pulse" />
                  <span className="font-medium text-red-700 dark:text-red-400">Fall Detected - Immediate Response Needed!</span>
                </>
              )}
              {fallStatus === "responding" && (
                <>
                  <PhoneCall className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-700 dark:text-yellow-400">Response In Progress</span>
                </>
              )}
              {fallStatus === "resolved" && (
                <>
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-700 dark:text-green-400">Patient Confirmed OK</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {fallStatus === "monitoring" && "Fall detection sensors are actively monitoring all assigned patients."}
              {fallStatus === "fall_detected" && currentFall && `${currentFall.patientName} may have fallen in the ${currentFall.location}.`}
              {fallStatus === "responding" && "Caregiver is en route. Patient has been notified help is coming."}
              {fallStatus === "resolved" && "Fall alert has been resolved. Continuing to monitor."}
            </p>
          </div>

          {/* Current Fall Details */}
          {currentFall && fallStatus !== "monitoring" && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" /> Patient:
                </span>
                <span className="font-medium">{currentFall.patientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Location:
                </span>
                <span className="font-medium">{currentFall.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Time:
                </span>
                <span className="font-medium">{currentFall.time}</span>
              </div>
            </div>
          )}

          {/* Monitoring Stats */}
          {fallStatus === "monitoring" && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Patients Monitored:</span>
                <span className="font-medium">3 Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Incident:</span>
                <span className="font-medium">None today</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sensor Status:</span>
                <span className="font-medium text-green-600">All Online</span>
              </div>
            </div>
          )}

          {/* Simulate Button (for demo) */}
          {fallStatus === "monitoring" && (
            <Button
              onClick={simulateFallDetection}
              variant="outline"
              className="w-full border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Simulate Fall Detection
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Fall Alert Modal */}
      {showFallModal && currentFall && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl">
            {/* Alert Icon */}
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce">
              <AlertOctagon className="h-12 w-12 text-red-600" />
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
              Fall Detected!
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              {currentFall.patientName}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Location: {currentFall.location} • Time: {currentFall.time}
            </p>

            {/* Countdown Timer */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {responseCountdown}
              </div>
              <p className="text-sm text-muted-foreground">
                seconds until EMS is automatically contacted
              </p>
              <Progress
                value={(responseCountdown / 30) * 100}
                className="mt-3 h-2 [&>div]:bg-red-500"
              />
            </div>

            {/* Response Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRespond}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-5"
              >
                <ThumbsUp className="mr-2 h-5 w-5" />
                I&apos;m Responding
              </Button>

              <Button
                onClick={handleCallEMS}
                variant="destructive"
                className="w-full text-lg py-5"
              >
                <PhoneCall className="mr-2 h-5 w-5" />
                Call EMS Now
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              If no action is taken, emergency services will be contacted automatically.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
