"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function RealTimeStatus() {
  const [isCalling, setIsCalling] = useState(false);
  const { toast } = useToast();

  const handleCall = () => {
    setIsCalling(true);
    toast({
      title: "Calling Margaret Johnson...",
      description: "Connecting to senior's device",
    });

    setTimeout(() => {
      setIsCalling(false);
      toast({
        title: "Call Connected",
        description: "You are now connected with Margaret Johnson",
      });
    }, 2000);
  };

  const handleEmergency = () => {
    toast({
      title: "Emergency Alert Sent!",
      description: "Emergency services and family members have been notified",
      variant: "destructive",
    });
    console.log("[v0] Emergency alert triggered at", new Date().toISOString());
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left Section - Avatar + Status */}
          <div className="flex items-center gap-4 flex-1">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <span className="text-2xl">👵</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Status Info */}
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-foreground mb-1">
                Margaret Johnson
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                In Living Room – Sitting – Last active 2 mins ago
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium">
                  Wellness Score:
                </span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm"
                >
                  8.1/10
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              onClick={handleCall}
              disabled={isCalling}
            >
              <Phone className="h-4 w-4 mr-2" />
              {isCalling ? "Calling..." : "Call Senior"}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleEmergency}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

