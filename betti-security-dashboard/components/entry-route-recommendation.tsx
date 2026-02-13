import { Navigation, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function EntryRouteRecommendation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Navigation className="h-5 w-5 text-primary" />
          Entry Route Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-primary/10 p-4">
          <Badge className="mb-3 bg-primary">RECOMMENDED PATH</Badge>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                1
              </div>
              <span>Main Entrance</span>
            </div>
            <div className="ml-3 border-l-2 border-primary pl-3">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                2
              </div>
              <span>Hallway (East Wing)</span>
            </div>
            <div className="ml-3 border-l-2 border-primary pl-3">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                3
              </div>
              <span className="font-semibold">Bedroom 204</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estimated Time</span>
            <span className="font-semibold">45 seconds</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Distance</span>
            <span className="font-semibold">120 feet</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Obstacles</span>
            <Badge variant="secondary" className="h-5 text-xs">
              None
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
