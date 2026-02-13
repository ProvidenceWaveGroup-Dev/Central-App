"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertTriangle, Clock, MapPin, Phone, Shield, Ambulance, CheckCircle2, CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface Incident {
  id: string
  type: string
  location: string
  timestamp: string
  duration: string
  status: "active" | "help-on-way" | "resolved"
  priority: "high" | "medium" | "low"
  source: string
  resolvedBy?: string
  resolvedAt?: string
  contactedAt?: string
}

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "INC-001",
      type: "Fire",
      location: "Kitchen",
      timestamp: "2024-01-10 14:23:15",
      duration: "2 min ago",
      status: "active",
      priority: "high",
      source: "Halo Sensor",
    },
    {
      id: "INC-002",
      type: "Fall",
      location: "Bathroom",
      timestamp: "2024-01-10 13:45:22",
      duration: "40 min ago",
      status: "help-on-way",
      priority: "high",
      source: "Motion Sensor",
      contactedAt: "2024-01-10 13:46:00",
    },
    {
      id: "INC-003",
      type: "Medical",
      location: "Bedroom",
      timestamp: "2024-01-10 11:20:10",
      duration: "3 hours ago",
      status: "resolved",
      priority: "medium",
      source: "Panic Button",
      resolvedBy: "Sarah Johnson (Caregiver)",
      resolvedAt: "2024-01-10 11:35:00",
      contactedAt: "2024-01-10 11:21:00",
    },
    {
      id: "INC-004",
      type: "Panic",
      location: "Living Room",
      timestamp: "2024-01-09 22:15:30",
      duration: "Yesterday",
      status: "resolved",
      priority: "high",
      source: "Voice Trigger (Alexa)",
      resolvedBy: "Emergency Services",
      resolvedAt: "2024-01-09 22:45:00",
      contactedAt: "2024-01-09 22:16:00",
    },
  ])

  const handleNotify = (incidentId: string, service: string) => {
    setIncidents(
      incidents.map((inc) =>
        inc.id === incidentId ? { ...inc, status: "help-on-way" as const, contactedAt: new Date().toISOString() } : inc,
      ),
    )
    toast({
      title: "Notification Sent",
      description: `${service} has been notified and help is on the way.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-600"
      case "help-on-way":
        return "bg-amber-600"
      case "resolved":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50"
      case "medium":
        return "border-amber-500 bg-amber-50"
      case "low":
        return "border-blue-500 bg-blue-50"
      default:
        return "border-gray-500 bg-gray-50"
    }
  }

  const filteredIncidents = incidents.filter((incident) => {
    if (!date) return true
    const incidentDate = new Date(incident.timestamp)
    return (
      incidentDate.getDate() === date.getDate() &&
      incidentDate.getMonth() === date.getMonth() &&
      incidentDate.getFullYear() === date.getFullYear()
    )
  })

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Active Incidents</h1>
            <p className="text-muted-foreground mt-1">Monitor and manage all incident reports</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[240px] justify-start text-left font-normal bg-transparent"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-4">
          {filteredIncidents.map((incident, index) => (
            <Card
              key={incident.id}
              className={`p-4 md:p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${getPriorityColor(incident.priority)} animate-in fade-in slide-in-from-left-4 duration-500`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedIncident(incident)}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 w-full">
                  <div
                    className={`rounded-full p-3 ${incident.status === "resolved" ? "bg-green-500" : incident.status === "help-on-way" ? "bg-amber-500" : "bg-red-500"}`}
                  >
                    {incident.status === "resolved" ? (
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="font-serif text-lg md:text-xl font-bold text-foreground">
                        {incident.type} - {incident.location}
                      </h3>
                      <Badge className={`${getStatusColor(incident.status)} text-white w-fit`}>
                        {incident.status === "active"
                          ? "ACTIVE"
                          : incident.status === "help-on-way"
                            ? "HELP IS ON THE WAY"
                            : "RESOLVED"}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 md:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{incident.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{incident.source}</span>
                      </div>
                      <span className="text-xs">ID: {incident.id}</span>
                    </div>
                  </div>
                </div>
                {incident.status === "active" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                        <Phone className="mr-2 h-4 w-4" />
                        Notify
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Contact Emergency Services</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNotify(incident.id, "Caregiver")
                        }}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Notify Caregiver
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNotify(incident.id, "Security")
                        }}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Notify Security Agencies
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNotify(incident.id, "Emergency Services")
                        }}
                      >
                        <Ambulance className="mr-2 h-4 w-4" />
                        Notify Emergency Services
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Incident Details</DialogTitle>
              <DialogDescription>Complete information about this incident</DialogDescription>
            </DialogHeader>
            {selectedIncident && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Incident ID</p>
                    <p className="text-base font-semibold">{selectedIncident.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="text-base font-semibold">{selectedIncident.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-base font-semibold">{selectedIncident.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Source</p>
                    <p className="text-base font-semibold">{selectedIncident.source}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Occurred At</p>
                    <p className="text-base font-semibold">{selectedIncident.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={`${getStatusColor(selectedIncident.status)} text-white`}>
                      {selectedIncident.status === "active"
                        ? "ACTIVE"
                        : selectedIncident.status === "help-on-way"
                          ? "HELP IS ON THE WAY"
                          : "RESOLVED"}
                    </Badge>
                  </div>
                </div>
                {selectedIncident.contactedAt && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contacted At</p>
                    <p className="text-base font-semibold">{selectedIncident.contactedAt}</p>
                  </div>
                )}
                {selectedIncident.status === "resolved" && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resolved By</p>
                      <p className="text-base font-semibold">{selectedIncident.resolvedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resolved At</p>
                      <p className="text-base font-semibold">{selectedIncident.resolvedAt}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </div>
  )
}
