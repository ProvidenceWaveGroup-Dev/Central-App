import { Volume2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DistressDetection() {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Volume2 className="h-5 w-5 text-destructive" />
          Distress Voice Pattern
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-destructive/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              DETECTED
            </Badge>
            <span className="text-muted-foreground text-xs">3:42 AM</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Keyword Match</span>
              <span className="font-semibold">&quot;Help me!&quot;</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence Level</span>
              <span className="font-semibold text-destructive">94%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Vocal Stress</span>
              <span className="font-semibold text-destructive">High</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <p className="font-semibold">Detected Keywords:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Help</Badge>
            <Badge variant="outline">Emergency</Badge>
            <Badge variant="outline">Distress tone</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
