import { Phone, Shield, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function CareStatusBar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Shield className="h-5 w-5 text-secondary" />
          Caregiver Contact Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-white">SJ</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">Sarah Johnson</h3>
              <p className="text-muted-foreground text-sm">Primary Caregiver</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>(555) 123-4567</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  On Duty
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-sm">Caregiver: Notified</p>
              <p className="text-muted-foreground text-xs">Sarah Johnson</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary text-white">
            2 min ago
          </Badge>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-semibold text-sm">Police ETA</p>
              <p className="text-muted-foreground text-xs">Pending assignment</p>
            </div>
          </div>
          <Badge variant="outline">Standby</Badge>
        </div>

        <Button className="w-full bg-secondary hover:bg-secondary/90">
          <Phone className="mr-2 h-4 w-4" />
          Call Caregiver
        </Button>
      </CardContent>
    </Card>
  )
}
