import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function IncidentHeader() {
  return (
    <Card className="border-destructive bg-destructive/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive p-2">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-serif text-destructive">Distress Alert — Voice Triggered</CardTitle>
              <CardDescription className="mt-1 text-base">
                Detected phrase: &quot;Help me!&quot; at 3:42 AM
              </CardDescription>
            </div>
          </div>
          <Badge variant="destructive" className="text-sm">
            ACTIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status: Awaiting caregiver confirmation</span>
            <span className="font-semibold">65%</span>
          </div>
          <Progress value={65} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
