"use client"

import { useState } from "react"
import { MessageCircle, XCircle, CheckCircle, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const checkIns = [
  { time: "3:30 AM", question: "Are you OK?", status: "unanswered", attempts: 3 },
  { time: "11:00 PM", question: "Evening check-in", status: "answered", response: "All good" },
  { time: "6:00 PM", question: "Dinner reminder", status: "answered", response: "Completed" },
]

export function CheckInResponsiveness() {
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)

  const handleCheckIn = async () => {
    setIsSending(true)

    // Simulate sending check-in message
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Check-In Sent",
      description: "Check-in message has been sent to the patient.",
    })

    setIsSending(false)
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <MessageCircle className="h-5 w-5 text-primary" />
          Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-3">
          {checkIns.map((checkIn, index) => (
            <div
              key={index}
              className={`rounded-lg border p-3 ${
                checkIn.status === "unanswered" ? "border-destructive bg-destructive/5" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {checkIn.status === "unanswered" ? (
                      <XCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-semibold text-xs sm:text-sm">{checkIn.question}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">{checkIn.time}</p>
                  {checkIn.response && <p className="mt-1 text-xs sm:text-sm italic">&quot;{checkIn.response}&quot;</p>}
                  {checkIn.attempts && (
                    <p className="mt-1 text-destructive text-xs">{checkIn.attempts} unanswered attempts</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Response Rate (24h)</span>
            <span className="font-semibold">67%</span>
          </div>
          <Progress value={67} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white"
          onClick={handleCheckIn}
          disabled={isSending}
        >
          <Send className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Check-In"}
        </Button>
      </CardFooter>
    </Card>
  )
}
