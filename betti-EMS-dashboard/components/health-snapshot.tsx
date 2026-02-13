import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/circular-progress"
import { Pill, Droplet, Moon, Tablet as Toilet } from "lucide-react"

export function HealthSnapshot() {
  const metrics = [
    {
      icon: Pill,
      label: "Medication Adherence",
      value: 87,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Droplet,
      label: "Hydration Adherence",
      value: 72,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Moon,
      label: "Sleep Hours (24h)",
      value: 65,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Toilet,
      label: "Restroom Frequency",
      value: 92,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ]

  return (
    <Card className="border-border shadow-sm bg-white hover-lift animate-card-in">
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-lg md:text-xl font-serif">Health Snapshot</CardTitle>
        <p className="text-xs md:text-sm text-muted-foreground">
          Vitals within expected range • Sleep deficit detected
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((metric) => (
            <CircularProgress
              key={metric.label}
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              color={metric.color}
              bgColor={metric.bgColor}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
