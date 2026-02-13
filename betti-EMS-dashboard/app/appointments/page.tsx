"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Clock, MapPin, User, Plus, Video, Phone } from "lucide-react"
import { format } from "date-fns"

interface Appointment {
  id: number
  title: string
  type: string
  attendee: string
  date: Date
  duration: string
  location: string
  status: string
  mode: string
}

const initialAppointments: Appointment[] = [
  {
    id: 1,
    title: "Cardiology Checkup",
    type: "Doctor",
    attendee: "Dr. Sarah Johnson",
    date: new Date(2025, 9, 10, 10, 0),
    duration: "45 minutes",
    location: "Medical Center - Room 302",
    status: "upcoming",
    mode: "in-person",
  },
  {
    id: 2,
    title: "Physical Therapy Session",
    type: "Therapy",
    attendee: "Mike Thompson, PT",
    date: new Date(2025, 9, 12, 14, 30),
    duration: "60 minutes",
    location: "Rehabilitation Center",
    status: "upcoming",
    mode: "in-person",
  },
  {
    id: 3,
    title: "Family Check-in",
    type: "Family",
    attendee: "Sarah Chen (Daughter)",
    date: new Date(2025, 9, 9, 16, 0),
    duration: "30 minutes",
    location: "Video Call",
    status: "upcoming",
    mode: "video",
  },
  {
    id: 4,
    title: "Medication Review",
    type: "Doctor",
    attendee: "Dr. Michael Lee",
    date: new Date(2025, 9, 5, 11, 0),
    duration: "30 minutes",
    location: "Medical Center - Room 205",
    status: "completed",
    mode: "in-person",
  },
  {
    id: 5,
    title: "Blood Work",
    type: "Lab",
    attendee: "Lab Technician",
    date: new Date(2025, 9, 3, 9, 0),
    duration: "15 minutes",
    location: "Medical Center - Lab",
    status: "completed",
    mode: "in-person",
  },
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    attendee: "",
    date: undefined as Date | undefined,
    time: "",
    duration: "",
    mode: "",
    location: "",
    notes: "",
  })

  const filteredAppointments = appointments.filter((apt) => {
    const matchesDate = selectedDate ? format(apt.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") : true
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus
    return matchesDate && matchesStatus
  })

  const upcomingAppointments = filteredAppointments.filter((apt) => apt.status === "upcoming")
  const pastAppointments = filteredAppointments.filter((apt) => apt.status === "completed")

  const handleScheduleAppointment = () => {
    if (!formData.title || !formData.type || !formData.attendee || !formData.date || !formData.time) {
      alert("Please fill in all required fields")
      return
    }

    const [hours, minutes] = formData.time.split(":").map(Number)
    const appointmentDate = new Date(formData.date)
    appointmentDate.setHours(hours, minutes)

    const newAppointment: Appointment = {
      id: appointments.length + 1,
      title: formData.title,
      type: formData.type,
      attendee: formData.attendee,
      date: appointmentDate,
      duration: formData.duration || "30 minutes",
      location: formData.location || "TBD",
      status: "upcoming",
      mode: formData.mode || "in-person",
    }

    setAppointments([...appointments, newAppointment])
    setIsDialogOpen(false)
    setFormData({
      title: "",
      type: "",
      attendee: "",
      date: undefined,
      time: "",
      duration: "",
      mode: "",
      location: "",
      notes: "",
    })
    console.log("[v0] New appointment scheduled:", newAppointment)
  }

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setFormData({
      title: appointment.title,
      type: appointment.type,
      attendee: appointment.attendee,
      date: appointment.date,
      time: format(appointment.date, "HH:mm"),
      duration: appointment.duration,
      mode: appointment.mode,
      location: appointment.location,
      notes: "",
    })
    setIsRescheduleDialogOpen(true)
  }

  const handleSaveReschedule = () => {
    if (!selectedAppointment || !formData.date || !formData.time) {
      alert("Please select a new date and time")
      return
    }

    const [hours, minutes] = formData.time.split(":").map(Number)
    const newDate = new Date(formData.date)
    newDate.setHours(hours, minutes)

    setAppointments(
      appointments.map((apt) =>
        apt.id === selectedAppointment.id
          ? {
              ...apt,
              date: newDate,
              location: formData.location || apt.location,
            }
          : apt,
      ),
    )

    setIsRescheduleDialogOpen(false)
    setSelectedAppointment(null)
    console.log("[v0] Appointment rescheduled:", selectedAppointment.id)
  }

  const handleCancel = (appointmentId: number) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments(appointments.filter((apt) => apt.id !== appointmentId))
      console.log("[v0] Appointment cancelled:", appointmentId)
    }
  }

  const handleJoinCall = (appointment: Appointment) => {
    console.log("[v0] Joining video call for:", appointment.title)
    alert(`Joining video call for ${appointment.title}...`)
    // In a real app, this would open the video call interface
  }

  const getStatusColor = (status: string) => {
    return status === "upcoming" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "video":
        return <Video className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Appointment Scheduling</h1>
          <p className="text-muted-foreground">Manage patient appointments and schedule new visits</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif">Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Appointment Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Cardiology Checkup"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type" className="bg-transparent">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Therapy">Therapy</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Specialist">Specialist</SelectItem>
                    <SelectItem value="Lab">Lab Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendee">With *</Label>
                <Input
                  id="attendee"
                  placeholder="Doctor or family member name"
                  value={formData.attendee}
                  onChange={(e) => setFormData({ ...formData, attendee: e.target.value })}
                  className="bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => setFormData({ ...formData, date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="bg-transparent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger id="duration" className="bg-transparent">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 minutes">15 minutes</SelectItem>
                    <SelectItem value="30 minutes">30 minutes</SelectItem>
                    <SelectItem value="45 minutes">45 minutes</SelectItem>
                    <SelectItem value="60 minutes">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mode">Meeting Mode</Label>
                <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
                  <SelectTrigger id="mode" className="bg-transparent">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Address or meeting link"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional information..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleScheduleAppointment}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-semibold text-sm">{formData.title}</p>
              <p className="text-xs text-muted-foreground">with {formData.attendee}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>New Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reschedule-time">New Time</Label>
                <Input
                  id="reschedule-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="bg-transparent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-location">Location (Optional)</Label>
              <Input
                id="reschedule-location"
                placeholder="Update location if needed"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setIsRescheduleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveReschedule}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-3 text-foreground">Filter by Date</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "All dates"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setSelectedDate(undefined)}>
                Clear Filter
              </Button>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-3 text-foreground">Status</h3>
              <div className="space-y-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterStatus("all")}
                >
                  All Appointments
                </Button>
                <Button
                  variant={filterStatus === "upcoming" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterStatus("upcoming")}
                >
                  Upcoming
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterStatus("completed")}
                >
                  Past
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upcoming Appointments */}
          {(filterStatus === "all" || filterStatus === "upcoming") && upcomingAppointments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif">Upcoming Appointments</CardTitle>
                <p className="text-sm text-muted-foreground">{upcomingAppointments.length} scheduled</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{apt.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {apt.type}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(apt.status)}>Upcoming</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{apt.attendee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(apt.date, "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(apt.date, "h:mm a")} • {apt.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {getModeIcon(apt.mode)}
                        <span>{apt.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReschedule(apt)}
                        className="bg-transparent"
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(apt.id)}
                        className="bg-transparent"
                      >
                        Cancel
                      </Button>
                      {apt.mode === "video" && (
                        <Button
                          size="sm"
                          onClick={() => handleJoinCall(apt)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Join Call
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Past Appointments */}
          {(filterStatus === "all" || filterStatus === "completed") && pastAppointments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif">Past Appointments</CardTitle>
                <p className="text-sm text-muted-foreground">{pastAppointments.length} completed</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {pastAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{apt.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {apt.type}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(apt.status)}>Completed</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{apt.attendee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(apt.date, "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(apt.date, "h:mm a")} • {apt.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {getModeIcon(apt.mode)}
                        <span>{apt.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {filteredAppointments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg text-foreground mb-2">No appointments found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filters or schedule a new appointment
                </p>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
