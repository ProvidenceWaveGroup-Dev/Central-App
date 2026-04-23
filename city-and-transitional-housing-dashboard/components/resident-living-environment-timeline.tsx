"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, ArrowRight } from "lucide-react"
import type { LivingEnvironment, EnvironmentType } from "@/lib/types"

// ── visual config per environment type ─────────────────────────────
const envConfig: Record<
  EnvironmentType,
  { label: string; bar: string; badge: string }
> = {
  emergency_shelter:      { label: "Emergency Shelter",       bar: "bg-red-400",     badge: "bg-red-100 text-red-700" },
  transitional_housing:   { label: "Transitional Housing",    bar: "bg-yellow-400",  badge: "bg-yellow-100 text-yellow-700" },
  permanent_supportive:   { label: "Permanent Supportive",    bar: "bg-green-500",   badge: "bg-green-100 text-green-700" },
  private_residence:      { label: "Private Residence",       bar: "bg-blue-400",    badge: "bg-blue-100 text-blue-700" },
  medical_facility:       { label: "Medical Facility",        bar: "bg-purple-400",  badge: "bg-purple-100 text-purple-700" },
  unknown:                { label: "Unknown / Gap Period",    bar: "bg-gray-300",    badge: "bg-gray-100 text-gray-500" },
}

interface Props {
  environments: LivingEnvironment[]
  residentName: string
}

export function ResidentLivingEnvironmentTimeline({ environments, residentName }: Props) {
  if (!environments.length) {
    return (
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base font-serif flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Living Environment Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">No environment records found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-base font-serif flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Living Environment Timeline
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Residential history including gap periods for {residentName}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">

        {/* Proportional colour bar */}
        <div className="flex gap-0.5 h-5 rounded-md overflow-hidden">
          {environments.map((env) => (
            <div
              key={env.id}
              className={`flex-1 min-w-2 ${envConfig[env.environment_type].bar}`}
              title={`${envConfig[env.environment_type].label}: ${env.location_name}`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {(Object.entries(envConfig) as [EnvironmentType, typeof envConfig[EnvironmentType]][]).map(
            ([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${cfg.bar}`} />
                {cfg.label}
              </div>
            )
          )}
        </div>

        {/* Detailed environment records */}
        <div className="pt-1 space-y-4">
          {environments.map((env) => {
            const cfg = envConfig[env.environment_type]
            const isCurrent = !env.exit_date
            return (
              <div key={env.id} className="flex gap-3">
                {/* Colour spine */}
                <div className={`w-1 rounded-full shrink-0 ${cfg.bar}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{env.location_name}</p>
                      <p className="text-xs text-muted-foreground">{env.city}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge className={`text-xs ${cfg.badge}`}>{cfg.label}</Badge>
                      {isCurrent && (
                        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                          Present
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Date range */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{env.entry_date}</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    <span>{env.exit_date ?? "Present"}</span>
                  </div>

                  {env.notes && (
                    <p className="text-xs text-muted-foreground italic mt-1">{env.notes}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
