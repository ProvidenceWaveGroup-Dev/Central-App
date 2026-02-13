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
  Ambulance,
  Shield,
  AlertTriangle,
  MapPin,
  Clock,
  User,
  Navigation,
  CheckCircle,
  Siren,
} from "lucide-react"

type EmergencyStatus = "standby" | "incoming" | "dispatched" | "on_scene" | "resolved"

interface EmergencyCall {
  id: number
  patientName: string
  age: number
  address: string
  location: string
  time: string
  status: EmergencyStatus
  priority: "critical" | "high" | "medium"
  eta?: string
}

export function FallAlertCard() {
  const [emergencyStatus, setEmergencyStatus] = useState<EmergencyStatus>("standby")
  const [currentCall, setCurrentCall] = useState<EmergencyCall | null>(null)
  const [responseCountdown, setResponseCountdown] = useState(60)
  const [showCallModal, setShowCallModal] = useState(false)

  // Countdown effect for incoming calls
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout

    if (emergencyStatus === "incoming" && responseCountdown > 0) {
      countdownInterval = setInterval(() => {
        setResponseCountdown((prev) => prev - 1)
      }, 1000)
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, [emergencyStatus, responseCountdown])

  // Simulate incoming emergency call for demo
  const simulateIncomingCall = () => {
    const newCall: EmergencyCall = {
      id: Date.now(),
      patientName: "Margaret Johnson",
      age: 78,
      address: "123 Oak Street, Springfield, IL 62701",
      location: "Living Room",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "incoming",
      priority: "critical",
    }
    setCurrentCall(newCall)
    setEmergencyStatus("incoming")
    setResponseCountdown(60)
    setShowCallModal(true)
  }

  // Handle dispatch
  const handleDispatch = () => {
    setEmergencyStatus("dispatched")
    setShowCallModal(false)
    if (currentCall) {
      setCurrentCall({ ...currentCall, status: "dispatched", eta: "8 min" })
    }

    // Simulate arrival
    setTimeout(() => {
      setEmergencyStatus("on_scene")
      if (currentCall) {
        setCurrentCall((prev) => prev ? { ...prev, status: "on_scene" } : null)
      }
    }, 5000)
  }

  // Handle resolution
  const handleResolve = () => {
    setEmergencyStatus("resolved")
    if (currentCall) {
      setCurrentCall({ ...currentCall, status: "resolved" })
    }

    // Reset after a few seconds
    setTimeout(() => {
      setEmergencyStatus("standby")
      setCurrentCall(null)
      setResponseCountdown(60)
    }, 5000)
  }

  const getStatusColor = () => {
    switch (emergencyStatus) {
      case "incoming":
        return "bg-red-50 border-red-400 dark:bg-red-950 dark:border-red-700"
      case "dispatched":
        return "bg-orange-50 border-orange-400 dark:bg-orange-950 dark:border-orange-700"
      case "on_scene":
        return "bg-yellow-50 border-yellow-400 dark:bg-yellow-950 dark:border-yellow-700"
      case "resolved":
        return "bg-green-50 border-green-400 dark:bg-green-950 dark:border-green-700"
      default:
        return "border-border bg-white"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-600"
      case "high":
        return "bg-orange-500"
      default:
        return "bg-yellow-500"
    }
  }

  return (
    <>
      <Card className={`${getStatusColor()} border-2 shadow-sm hover-lift animate-card-in transition-colors duration-300`}>
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg md:text-xl font-serif">
              <Siren className={`h-5 w-5 md:h-6 md:w-6 ${
                emergencyStatus === "incoming" ? "text-red-600 animate-pulse" :
                emergencyStatus === "dispatched" ? "text-orange-600" :
                emergencyStatus === "on_scene" ? "text-yellow-600" :
                emergencyStatus === "resolved" ? "text-green-600" :
                "text-primary"
              }`} />
              Fall Emergency Response
            </div>
            <Badge className={`text-xs ${
              emergencyStatus === "incoming" ? "bg-red-600 text-white animate-pulse" :
              emergencyStatus === "dispatched" ? "bg-orange-500 text-white" :
              emergencyStatus === "on_scene" ? "bg-yellow-500 text-white" :
              emergencyStatus === "resolved" ? "bg-green-600 text-white" :
              "bg-primary text-primary-foreground"
            }`}>
              {emergencyStatus === "incoming" ? "INCOMING CALL" :
               emergencyStatus === "dispatched" ? "UNIT DISPATCHED" :
               emergencyStatus === "on_scene" ? "ON SCENE" :
               emergencyStatus === "resolved" ? "RESOLVED" :
               "Standby"}
            </Badge>
          </CardTitle>
          <p className="text-xs md:text-sm text-muted-foreground">
            {emergencyStatus === "standby"
              ? "Monitoring for fall-related emergency calls"
              : emergencyStatus === "incoming"
              ? "Immediate response required"
              : emergencyStatus === "dispatched"
              ? "EMS unit en route"
              : emergencyStatus === "on_scene"
              ? "EMS providing assistance"
              : "Call resolved - returning to standby"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Display */}
          <div className={`p-4 rounded-lg ${
            emergencyStatus === "incoming" ? "bg-red-100 dark:bg-red-900/30" :
            emergencyStatus === "dispatched" ? "bg-orange-100 dark:bg-orange-900/30" :
            emergencyStatus === "on_scene" ? "bg-yellow-100 dark:bg-yellow-900/30" :
            emergencyStatus === "resolved" ? "bg-green-100 dark:bg-green-900/30" :
            "bg-muted"
          }`}>
            <div className="flex items-center gap-3 mb-2">
              {emergencyStatus === "standby" && (
                <>
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium text-primary">All Units Available</span>
                </>
              )}
              {emergencyStatus === "incoming" && (
                <>
                  <AlertOctagon className="h-5 w-5 text-red-600 animate-pulse" />
                  <span className="font-medium text-red-700 dark:text-red-400">Fall Emergency - Dispatch Required!</span>
                </>
              )}
              {emergencyStatus === "dispatched" && (
                <>
                  <Ambulance className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-700 dark:text-orange-400">Unit En Route</span>
                </>
              )}
              {emergencyStatus === "on_scene" && (
                <>
                  <PersonStanding className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-700 dark:text-yellow-400">Providing Medical Assistance</span>
                </>
              )}
              {emergencyStatus === "resolved" && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-700 dark:text-green-400">Patient Stabilized - Call Resolved</span>
                </>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              {emergencyStatus === "standby" && "3 EMS units available for immediate dispatch."}
              {emergencyStatus === "incoming" && currentCall && `Priority: ${currentCall.priority.toUpperCase()} - Elderly fall detected via Betti monitoring system.`}
              {emergencyStatus === "dispatched" && currentCall && `ETA: ${currentCall.eta} - Unit 7 responding.`}
              {emergencyStatus === "on_scene" && "First responders assessing patient condition."}
              {emergencyStatus === "resolved" && "Patient refused transport. Caregiver on site."}
            </p>
          </div>

          {/* Call Details */}
          {currentCall && emergencyStatus !== "standby" && (
            <div className="space-y-2 text-sm border rounded-lg p-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" /> Patient:
                </span>
                <span className="font-medium">{currentCall.patientName}, {currentCall.age}y/o</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address:
                </span>
                <span className="font-medium text-right text-xs">{currentCall.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Navigation className="h-4 w-4" /> Location:
                </span>
                <span className="font-medium">{currentCall.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Call Time:
                </span>
                <span className="font-medium">{currentCall.time}</span>
              </div>
              {currentCall.eta && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Ambulance className="h-4 w-4" /> ETA:
                  </span>
                  <span className="font-medium text-orange-600">{currentCall.eta}</span>
                </div>
              )}
            </div>
          )}

          {/* Standby Stats */}
          {emergencyStatus === "standby" && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Available Units:</span>
                <span className="font-medium text-green-600">3 Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fall Calls Today:</span>
                <span className="font-medium">2 Resolved</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg Response Time:</span>
                <span className="font-medium">6.2 min</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {emergencyStatus === "on_scene" && (
            <Button
              onClick={handleResolve}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Resolved
            </Button>
          )}

          {/* Simulate Button (for demo) */}
          {emergencyStatus === "standby" && (
            <Button
              onClick={simulateIncomingCall}
              variant="outline"
              className="w-full border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Simulate Fall Detection
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Incoming Call Modal */}
      {showCallModal && currentCall && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl border-4 border-red-500">
            {/* Alert Icon */}
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
              <Siren className="h-14 w-14 text-red-600" />
            </div>

            {/* Priority Badge */}
            <Badge className={`${getPriorityColor(currentCall.priority)} text-white mb-3`}>
              {currentCall.priority.toUpperCase()} PRIORITY
            </Badge>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
              FALL EMERGENCY
            </h2>
            <p className="text-lg font-medium mb-1">
              {currentCall.patientName}, {currentCall.age} y/o
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {currentCall.address}
            </p>

            {/* Patient Info */}
            <div className="bg-muted p-3 rounded-lg mb-4 text-left text-sm">
              <p><strong>Location in Home:</strong> {currentCall.location}</p>
              <p><strong>Alert Source:</strong> Betti Fall Detection System</p>
              <p><strong>Patient Status:</strong> No response to recovery prompt</p>
            </div>

            {/* Response Timer */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                Response time: <span className="font-bold text-foreground">{responseCountdown}s</span>
              </p>
              <Progress
                value={(responseCountdown / 60) * 100}
                className="h-2 [&>div]:bg-red-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleDispatch}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6"
              >
                <Ambulance className="mr-2 h-6 w-6" />
                DISPATCH UNIT
              </Button>

              <Button
                onClick={() => {
                  setShowCallModal(false)
                  setEmergencyStatus("standby")
                  setCurrentCall(null)
                }}
                variant="outline"
                className="w-full"
              >
                Cancel (False Alarm)
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
