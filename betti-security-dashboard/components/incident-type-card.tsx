import { AlertCircle, Mic, Hand } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function IncidentTypeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <AlertCircle className="h-5 w-5 text-primary" />
          Incident Type & Source
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Type</span>
            <Badge variant="destructive" className="gap-1">
              <Hand className="h-3 w-3" />
              Panic Alert
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Source</span>
            <Badge variant="secondary" className="gap-1">
              <Mic className="h-3 w-3" />
              Voice Activated
            </Badge>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="mb-1 font-semibold text-sm">Detection Details</p>
          <ul className="space-y-1 text-muted-foreground text-xs">
            <li>• Voice pattern matched distress keywords</li>
            <li>• Elevated vocal stress detected</li>
            <li>• No manual button press recorded</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
