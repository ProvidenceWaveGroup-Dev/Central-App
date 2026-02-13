import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Droplets, Utensils, Moon, Bath, CheckCircle, X, Clock } from "lucide-react"

const healthMetrics = [
  {
    category: "Medication",
    icon: Heart,
    taken: 2,
    missed: 1,
    total: 3,
    details: "2 taken / 1 missed",
    status: "attention",
  },
  {
    category: "Hydration",
    icon: Droplets,
    taken: 4,
    missed: 0,
    total: 6,
    details: "4/6 reminders logged",
    status: "good",
  },
  {
    category: "Meals",
    icon: Utensils,
    completed: ["Breakfast", "Lunch"],
    pending: ["Dinner"],
    details: "Breakfast ✅, Lunch ✅, Dinner (reminder pending)",
    status: "good",
  },
  {
    category: "Sleep",
    icon: Moon,
    hours: 7.5,
    quality: "good",
    details: "7.5 hrs with trend",
    status: "excellent",
  },
  {
    category: "Personal Care",
    icon: Bath,
    visits: 5,
    details: "5X today",
    status: "normal",
  },
]

export function HealthSummary() {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-primary" />
          Daily Health Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthMetrics.map((metric) => (
          <div key={metric.category} className="space-y-2 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{metric.category}</span>
              </div>
              <div className="flex items-center gap-2">
                {metric.category === "Medication" && (
                  <>
                    <div className="flex items-center gap-1 text-xs">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">{metric.taken}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <X className="h-3 w-3 text-red-600" />
                      <span className="text-red-600">{metric.missed}</span>
                    </div>
                  </>
                )}
                {metric.category === "Meals" && (
                  <div className="flex items-center gap-1 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>2</span>
                    <Clock className="h-3 w-3 text-orange-600 ml-1" />
                    <span>1</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{metric.details}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
