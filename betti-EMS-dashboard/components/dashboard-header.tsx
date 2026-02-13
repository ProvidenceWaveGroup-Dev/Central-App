"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, Clock, MapPin, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function DashboardHeader() {
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const [showAcknowledgmentPopup, setShowAcknowledgmentPopup] = useState(false)
  const [isCriticalAlertAcknowledged, setIsCriticalAlertAcknowledged] = useState(false)
  const { toast } = useToast()

  const handleAcknowledgeAlert = () => {
    setIsAcknowledged(true)
    setShowAcknowledgmentPopup(true)

    setTimeout(() => {
      setShowAcknowledgmentPopup(false)
    }, 2000)
  }

  const handleCriticalFallAlert = () => {
    if (!isCriticalAlertAcknowledged) {
      setIsCriticalAlertAcknowledged(true)
      toast({
        title: "Critical Alert Acknowledged",
        description: "You have recognized the fall alert. Emergency response team has been notified.",
      })
    }
  }

  return (
    <>
      <div className="bg-primary border border-border rounded-lg p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 md:gap-4 w-full md:w-auto">
            <Avatar className="h-12 w-12 md:h-16 md:w-16 border-2 border-white flex-shrink-0">
              <AvatarImage src="/elderly-woman-portrait.png" />
              <AvatarFallback className="bg-white text-primary text-lg md:text-xl font-bold">MC</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-3xl font-serif font-bold text-white truncate">Margaret Chen</h1>
              <p className="text-sm md:text-base text-white/90 mt-1">
                Responding to alert triggered 3 mins ago from Living Room
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/80 flex-shrink-0" />
                  <span className="text-xs md:text-sm text-white/90 font-medium">Wellness Score: 7.8/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/80 flex-shrink-0" />
                  <span className="text-xs md:text-sm text-white/90">Living Room • Last seen 3 mins ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
            <Badge
              variant={isCriticalAlertAcknowledged ? "secondary" : "destructive"}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold justify-center transition-all ${
                isCriticalAlertAcknowledged
                  ? "bg-[#DADADA] text-[#59595B] cursor-not-allowed opacity-70"
                  : "cursor-pointer hover:opacity-90 animate-blink-alert"
              }`}
              onClick={handleCriticalFallAlert}
              style={isCriticalAlertAcknowledged ? { pointerEvents: "none" } : {}}
            >
              <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
              {isCriticalAlertAcknowledged ? "Alert Recognized" : "CRITICAL - Fall Alert"}
            </Badge>
            <Button
              className="bg-white hover:bg-white/90 text-primary text-sm md:text-base"
              onClick={handleAcknowledgeAlert}
              disabled={isAcknowledged}
            >
              {isAcknowledged ? "Alert Acknowledged" : "Acknowledge Alert"}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
          <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
          <span className="truncate">Alert triggered at 8:32 AM • Last updated 30 seconds ago</span>
        </div>
      </div>

      <Dialog open={showAcknowledgmentPopup} onOpenChange={setShowAcknowledgmentPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Alert Acknowledged</DialogTitle>
            <DialogDescription className="sr-only">The alert has been successfully acknowledged</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-24 h-24 mb-6">
              <svg className="w-24 h-24 animate-scale-in" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#5C7F39"
                  strokeWidth="4"
                  className="animate-draw-circle"
                  style={{
                    strokeDasharray: "283",
                    strokeDashoffset: "283",
                    animation: "drawCircle 0.6s ease-out forwards",
                  }}
                />
                <path
                  d="M30 50 L45 65 L70 35"
                  fill="none"
                  stroke="#5C7F39"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-draw-check"
                  style={{
                    strokeDasharray: "60",
                    strokeDashoffset: "60",
                    animation: "drawCheck 0.4s ease-out 0.6s forwards",
                  }}
                />
              </svg>
            </div>

            <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Alert Acknowledged</h3>
            <p className="text-sm text-muted-foreground text-center">Emergency response team has been notified</p>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes drawCircle {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
