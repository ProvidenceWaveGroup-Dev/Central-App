"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  User,
  Utensils,
  Dumbbell,
  Pill,
  Droplets,
  PersonStanding,
} from "lucide-react"

export type ReminderFormType = "appointment" | "meal" | "exercise" | "medication" | "hydration" | "restroom"

export interface ReminderPayload {
  type: ReminderFormType
  title: string
  timeLabel: string
  metadata: Record<string, unknown>
}

interface AddReminderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddReminder: (reminder: ReminderPayload) => void
}

const TYPE_OPTIONS: { id: ReminderFormType; label: string; icon: React.ElementType }[] = [
  { id: "appointment", label: "Appointment", icon: User },
  { id: "meal", label: "Meal", icon: Utensils },
  { id: "exercise", label: "PT & Exercise", icon: Dumbbell },
  { id: "medication", label: "Medication", icon: Pill },
  { id: "hydration", label: "Hydration", icon: Droplets },
  { id: "restroom", label: "Restroom", icon: PersonStanding },
]

const inputClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  )
}

// ── Appointment Form ──────────────────────────────────────────────────────────
function AppointmentForm({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <>
      <Field label="Title" required>
        <Input placeholder="e.g. Cardiology follow-up" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} required />
      </Field>
      <Field label="Provider Name" required>
        <Input placeholder="e.g. Dr. Smith" value={data.provider_name || ""} onChange={(e) => onChange("provider_name", e.target.value)} required />
      </Field>
      <Field label="Appointment Type" required>
        <Select value={data.appointment_type || ""} onValueChange={(v) => onChange("appointment_type", v)}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="checkup">Checkup</SelectItem>
            <SelectItem value="follow_up">Follow-up</SelectItem>
            <SelectItem value="specialist">Specialist Visit</SelectItem>
            <SelectItem value="therapy">Therapy</SelectItem>
            <SelectItem value="lab">Lab / Diagnostics</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start Time" required>
          <input type="datetime-local" className={inputClass} value={data.start_time || ""} onChange={(e) => onChange("start_time", e.target.value)} required />
        </Field>
        <Field label="End Time">
          <input type="datetime-local" className={inputClass} value={data.end_time || ""} onChange={(e) => onChange("end_time", e.target.value)} />
        </Field>
      </div>
      <Field label="Location (optional)">
        <Input placeholder="e.g. City Medical Center, Room 3B" value={data.location || ""} onChange={(e) => onChange("location", e.target.value)} />
      </Field>
      <Field label="Notes">
        <Textarea placeholder="Any notes for this appointment..." value={data.notes || ""} onChange={(e) => onChange("notes", e.target.value)} rows={2} />
      </Field>
    </>
  )
}

// ── Meal Form ─────────────────────────────────────────────────────────────────
function MealForm({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <>
      <Field label="Title" required>
        <Input placeholder="e.g. Afternoon Snack" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} required />
      </Field>
      <Field label="Meal Type" required>
        <Select value={data.meal_type || ""} onValueChange={(v) => onChange("meal_type", v)}>
          <SelectTrigger><SelectValue placeholder="Select meal type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="snack">Snack</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Meal Description">
        <Input placeholder="Brief description of the meal" value={data.meal_description || ""} onChange={(e) => onChange("meal_description", e.target.value)} />
      </Field>
      <Field label="Items (comma-separated)">
        <Input placeholder="e.g. rice, chicken, broccoli" value={data.items || ""} onChange={(e) => onChange("items", e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Calories (kcal)">
          <Input type="number" placeholder="e.g. 450" min="0" value={data.calories_kcal || ""} onChange={(e) => onChange("calories_kcal", e.target.value)} />
        </Field>
        <Field label="Portion">
          <Input placeholder="e.g. 1 cup, medium" value={data.portion || ""} onChange={(e) => onChange("portion", e.target.value)} />
        </Field>
      </div>
      <Field label="Nutrition Label">
        <Select value={data.nutrition_label || ""} onValueChange={(v) => onChange("nutrition_label", v)}>
          <SelectTrigger><SelectValue placeholder="Select label" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="balanced">Balanced</SelectItem>
            <SelectItem value="high_protein">High Protein</SelectItem>
            <SelectItem value="low_sodium">Low Sodium</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Scheduled Time" required>
        <input type="datetime-local" className={inputClass} value={data.scheduled_time || ""} onChange={(e) => onChange("scheduled_time", e.target.value)} required />
      </Field>
    </>
  )
}

// ── PT & Exercise Form ────────────────────────────────────────────────────────
function ExerciseForm({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <>
      <Field label="Title" required>
        <Input placeholder="e.g. Morning Walk" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} required />
      </Field>
      <Field label="Exercise Type" required>
        <Input placeholder="e.g. walking, stretching, resistance" value={data.exercise_type || ""} onChange={(e) => onChange("exercise_type", e.target.value)} required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Duration (min)" required>
          <Input type="number" placeholder="e.g. 30" min="1" value={data.duration_min || ""} onChange={(e) => onChange("duration_min", e.target.value)} required />
        </Field>
        <Field label="Intensity" required>
          <Select value={data.intensity || ""} onValueChange={(v) => onChange("intensity", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Sets (opt.)">
          <Input type="number" placeholder="e.g. 3" min="0" value={data.sets || ""} onChange={(e) => onChange("sets", e.target.value)} />
        </Field>
        <Field label="Reps (opt.)">
          <Input type="number" placeholder="e.g. 12" min="0" value={data.reps || ""} onChange={(e) => onChange("reps", e.target.value)} />
        </Field>
        <Field label="Distance/Steps">
          <Input type="number" placeholder="e.g. 5000" min="0" value={data.distance_steps || ""} onChange={(e) => onChange("distance_steps", e.target.value)} />
        </Field>
      </div>
      <Field label="Scheduled Time" required>
        <input type="datetime-local" className={inputClass} value={data.scheduled_time || ""} onChange={(e) => onChange("scheduled_time", e.target.value)} required />
      </Field>
    </>
  )
}

// ── Medication Form ───────────────────────────────────────────────────────────
function MedicationForm({
  data,
  onChange,
  prn,
  onPrnChange,
  shareWithCaregiver,
  onShareChange,
}: {
  data: Record<string, string>
  onChange: (k: string, v: string) => void
  prn: boolean
  onPrnChange: (v: boolean) => void
  shareWithCaregiver: boolean
  onShareChange: (v: boolean) => void
}) {
  return (
    <>
      <Field label="Medication Name" required>
        <Input placeholder="e.g. Lisinopril" value={data.name || ""} onChange={(e) => onChange("name", e.target.value)} required />
      </Field>
      <Field label="Dose" required>
        <Input placeholder="e.g. 10mg" value={data.dose || ""} onChange={(e) => onChange("dose", e.target.value)} required />
      </Field>
      <Field label="Schedule" required>
        <Input placeholder="e.g. Once daily with breakfast" value={data.schedule || ""} onChange={(e) => onChange("schedule", e.target.value)} required />
      </Field>
      <Field label="Start Date" required>
        <input type="date" className={inputClass} value={data.start_date || ""} onChange={(e) => onChange("start_date", e.target.value)} required />
      </Field>
      <Field label="Notes">
        <Textarea placeholder="Special instructions, side effects to watch..." value={data.notes || ""} onChange={(e) => onChange("notes", e.target.value)} rows={2} />
      </Field>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox id="prn" checked={prn} onCheckedChange={(v) => onPrnChange(v === true)} />
          <Label htmlFor="prn" className="text-sm cursor-pointer">PRN (as needed)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="share" checked={shareWithCaregiver} onCheckedChange={(v) => onShareChange(v === true)} />
          <Label htmlFor="share" className="text-sm cursor-pointer">Share with caregiver</Label>
        </div>
      </div>
    </>
  )
}

// ── Hydration Form ────────────────────────────────────────────────────────────
function HydrationForm({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <>
      <Field label="Title" required>
        <Input placeholder="e.g. Morning Hydration" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount" required>
          <Input type="number" placeholder="e.g. 8" min="0" value={data.amount || ""} onChange={(e) => onChange("amount", e.target.value)} required />
        </Field>
        <Field label="Unit" required>
          <Select value={data.unit || ""} onValueChange={(v) => onChange("unit", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="oz">oz</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Beverage Type" required>
        <Select value={data.beverage_type || ""} onValueChange={(v) => onChange("beverage_type", v)}>
          <SelectTrigger><SelectValue placeholder="Select beverage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="water">Water</SelectItem>
            <SelectItem value="tea">Tea</SelectItem>
            <SelectItem value="juice">Juice</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Daily Target">
        <Input placeholder="e.g. 64 oz per day" value={data.target_daily || ""} onChange={(e) => onChange("target_daily", e.target.value)} />
      </Field>
      <Field label="Scheduled Time" required>
        <input type="datetime-local" className={inputClass} value={data.scheduled_time || ""} onChange={(e) => onChange("scheduled_time", e.target.value)} required />
      </Field>
      <Field label="Notes">
        <Textarea placeholder="Additional notes..." value={data.notes || ""} onChange={(e) => onChange("notes", e.target.value)} rows={2} />
      </Field>
    </>
  )
}

// ── Restroom Form ─────────────────────────────────────────────────────────────
function RestroomForm({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <>
      <Field label="Title" required>
        <Input placeholder="e.g. Scheduled Restroom Break" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} required />
      </Field>
      <Field label="Scheduled Time" required>
        <input type="datetime-local" className={inputClass} value={data.scheduled_time || ""} onChange={(e) => onChange("scheduled_time", e.target.value)} required />
      </Field>
      <Field label="Frequency">
        <Input placeholder="e.g. Every 3 hours" value={data.frequency || ""} onChange={(e) => onChange("frequency", e.target.value)} />
      </Field>
      <Field label="Assistance Required">
        <Select value={data.assistance || ""} onValueChange={(v) => onChange("assistance", v)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None — Independent</SelectItem>
            <SelectItem value="standby">Standby Assistance</SelectItem>
            <SelectItem value="full">Full Assistance</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Notes">
        <Textarea placeholder="Any notes..." value={data.notes || ""} onChange={(e) => onChange("notes", e.target.value)} rows={2} />
      </Field>
    </>
  )
}

// ── Main Dialog ───────────────────────────────────────────────────────────────
export function AddReminderDialog({ open, onOpenChange, onAddReminder }: AddReminderDialogProps) {
  const [activeType, setActiveType] = useState<ReminderFormType>("appointment")
  const [fields, setFields] = useState<Record<string, string>>({})
  const [prn, setPrn] = useState(false)
  const [shareWithCaregiver, setShareWithCaregiver] = useState(false)

  const updateField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  const handleTypeChange = (type: ReminderFormType) => {
    setActiveType(type)
    setFields({})
    setPrn(false)
    setShareWithCaregiver(false)
  }

  const handleClose = () => {
    setFields({})
    setPrn(false)
    setShareWithCaregiver(false)
    setActiveType("appointment")
    onOpenChange(false)
  }

  const getTitle = (): string => {
    if (activeType === "medication") return fields.name || "Medication"
    return fields.title || ""
  }

  const getTimeLabel = (): string => {
    const t = fields.start_time || fields.scheduled_time || fields.start_date || ""
    if (!t) return "Scheduled"
    try {
      return new Date(t).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
    } catch {
      return t
    }
  }

  const isFormValid = (): boolean => {
    if (activeType === "appointment") return !!(fields.title && fields.provider_name && fields.appointment_type && fields.start_time)
    if (activeType === "meal") return !!(fields.title && fields.meal_type && fields.scheduled_time)
    if (activeType === "exercise") return !!(fields.title && fields.exercise_type && fields.duration_min && fields.intensity && fields.scheduled_time)
    if (activeType === "medication") return !!(fields.name && fields.dose && fields.schedule && fields.start_date)
    if (activeType === "hydration") return !!(fields.title && fields.amount && fields.unit && fields.beverage_type && fields.scheduled_time)
    if (activeType === "restroom") return !!(fields.title && fields.scheduled_time)
    return false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) return

    onAddReminder({
      type: activeType,
      title: getTitle(),
      timeLabel: getTimeLabel(),
      metadata: {
        ...fields,
        ...(activeType === "medication" ? { prn, share_with_caregiver: shareWithCaregiver } : {}),
      },
    })

    handleClose()
  }

  const typeLabel = TYPE_OPTIONS.find((t) => t.id === activeType)?.label ?? "Reminder"

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add {typeLabel}</DialogTitle>
        </DialogHeader>

        {/* Type Selector */}
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-border">
          {TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isActive = activeType === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleTypeChange(opt.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  isActive
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-background text-muted-foreground border-border hover:border-green-400 hover:text-green-700"
                }`}
              >
                <Icon className="h-3 w-3" />
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Scrollable Form */}
        <form id="reminder-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="grid gap-3 py-3 pr-1">
            {activeType === "appointment" && <AppointmentForm data={fields} onChange={updateField} />}
            {activeType === "meal" && <MealForm data={fields} onChange={updateField} />}
            {activeType === "exercise" && <ExerciseForm data={fields} onChange={updateField} />}
            {activeType === "medication" && (
              <MedicationForm
                data={fields}
                onChange={updateField}
                prn={prn}
                onPrnChange={setPrn}
                shareWithCaregiver={shareWithCaregiver}
                onShareChange={setShareWithCaregiver}
              />
            )}
            {activeType === "hydration" && <HydrationForm data={fields} onChange={updateField} />}
            {activeType === "restroom" && <RestroomForm data={fields} onChange={updateField} />}
          </div>
        </form>

        <DialogFooter className="pt-2 border-t border-border">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="reminder-form" disabled={!isFormValid()} className="bg-green-600 hover:bg-green-700 text-white">
            Add {typeLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
