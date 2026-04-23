"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, ArrowRight } from "lucide-react"
import type { ResidentTransition, ProgramType } from "@/lib/types"

// ── visual config per program type ─────────────────────────────────
const programConfig: Record<ProgramType, { label: string; dot: string; badge: string }> = {
  emergency:             { label: "Emergency",            dot: "bg-red-500",    badge: "bg-red-100 text-red-700" },
  transitional:          { label: "Transitional",         dot: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-700" },
  city_housing:          { label: "City Housing",         dot: "bg-primary",    badge: "bg-blue-100 text-blue-700" },
  permanent_supportive:  { label: "Permanent Supportive", dot: "bg-secondary",  badge: "bg-green-100 text-green-700" },
  rapid_rehousing:       { label: "Rapid Re-housing",     dot: "bg-[#0A588D]",  badge: "bg-sky-100 text-sky-700" },
}

interface Props {
  transitions: ResidentTransition[]
  residentName: string
}

export function ResidentTransitionTimeline({ transitions, residentName }: Props) {
  if (!transitions.length) {
    return (
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base font-serif flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Housing Transition History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">No transition records found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-base font-serif flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          Housing Transition History
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Longitudinal program journey — {transitions.length} placement{transitions.length !== 1 ? "s" : ""} on record for {residentName}
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative">
          {/* Vertical spine */}
          <div className="absolute left-[15px] top-3 bottom-3 w-px bg-border" />

          <ol className="space-y-5">
            {transitions.map((t) => {
              const cfg = programConfig[t.program_type]
              const isCurrent = !t.exit_date
              return (
                <li key={t.id} className="relative flex gap-4 pl-9">
                  {/* Timeline dot */}
                  <span
                    className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-card ${
                      isCurrent ? cfg.dot + " ring-2 ring-offset-1 ring-primary/40" : "bg-muted-foreground/50"
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    {/* Program name + badge */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{t.program_name}</p>
                        <p className="text-xs text-muted-foreground">{t.agency_name}</p>
                        {t.case_manager && (
                          <p className="text-xs text-muted-foreground">Case manager: {t.case_manager}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge className={`text-xs ${cfg.badge}`}>{cfg.label}</Badge>
                        {isCurrent && (
                          <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Date range */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{t.entry_date}</span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                      <span>{t.exit_date ?? "Present"}</span>
                    </div>

                    {/* Transition reason */}
                    {t.transition_reason && (
                      <p className="text-xs text-muted-foreground italic mt-1">
                        ↳ {t.transition_reason}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
