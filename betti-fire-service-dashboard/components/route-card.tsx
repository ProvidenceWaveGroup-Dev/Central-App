import { Route, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RouteCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Entry Route Suggestion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
            <Route className="h-4 w-4" />
            Recommended Entry Path
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-center leading-8 text-white">1</div>
              <span className="font-medium">Front Door</span>
            </div>
            <div className="ml-4 h-6 w-0.5 bg-primary/30" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-center leading-8 text-white">2</div>
              <span className="font-medium">Hallway</span>
            </div>
            <div className="ml-4 h-6 w-0.5 bg-primary/30" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-center leading-8 text-white">3</div>
              <span className="font-medium">Kitchen (Incident Location)</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          <p>
            <strong>Safety Note:</strong> Avoid Living Room due to high smoke density. Kitchen accessible via hallway
            with clear path.
          </p>
        </div>

        <Button className="w-full bg-secondary hover:bg-secondary/90">
          <Send className="mr-2 h-4 w-4" />
          Send Route to Mobile Responder
        </Button>
      </CardContent>
    </Card>
  )
}
