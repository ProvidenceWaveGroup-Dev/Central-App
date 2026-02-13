import { Brain, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function IntoxicationDetection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Brain className="h-5 w-5 text-secondary" />
          Speech Pattern Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3">
          <div className="mb-2 flex items-center justify-between">
            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
              <TrendingDown className="mr-1 h-3 w-3" />
              Deviation Detected
            </Badge>
            <span className="text-muted-foreground text-xs">Last 2 hours</span>
          </div>
          <p className="text-sm">Slurred speech patterns detected, deviation from baseline</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Speech Clarity</span>
              <span className="font-semibold">62%</span>
            </div>
            <Progress value={62} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Baseline Deviation</span>
              <span className="font-semibold text-yellow-700">38%</span>
            </div>
            <Progress value={38} className="h-2 [&>div]:bg-yellow-500" />
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-3 text-xs">
          <p className="font-semibold">AI Analysis:</p>
          <p className="mt-1 text-muted-foreground">
            Speech patterns show significant deviation from established baseline. Recommend caregiver assessment.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
