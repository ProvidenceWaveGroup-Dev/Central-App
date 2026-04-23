"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle } from "lucide-react"
import { useState } from "react"

export function MessagesPage() {
  const [messageText, setMessageText] = useState("")

  const messages = [
    {
      id: 1,
      sender: "Betti System",
      type: "system",
      message: "Scheduled maintenance reminder: Unit 12A HVAC service scheduled for Oct 28",
      timestamp: "2024-10-25 10:30",
      read: true,
    },
    {
      id: 2,
      sender: "Sarah Johnson (Team)",
      type: "team",
      message: "Completed inspection at Riverside Apartments. All units passed safety check.",
      timestamp: "2024-10-25 09:15",
      read: true,
    },
    {
      id: 3,
      sender: "Betti System",
      type: "system",
      message: "Alert: High occupancy rate detected at Green Valley Housing (98%)",
      timestamp: "2024-10-24 16:45",
      read: true,
    },
    {
      id: 4,
      sender: "Michael Chen (Team)",
      type: "team",
      message: "Resident complaint resolved: Water leak in Unit 5B - plumbing repaired",
      timestamp: "2024-10-24 14:20",
      read: true,
    },
    {
      id: 5,
      sender: "Betti System",
      type: "system",
      message: "Monthly compliance report generated and ready for review",
      timestamp: "2024-10-24 08:00",
      read: false,
    },
  ]

  return (
    <main className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">Log from Betti system and team communications</p>
      </div>

      {/* Message filters */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="cursor-pointer bg-primary/10">
          All
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          System
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Team
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Unread
        </Badge>
      </div>

      {/* Messages list */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={`hover:shadow-md transition-shadow ${!msg.read ? "border-primary/50 bg-primary/5" : ""}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{msg.sender}</p>
                      <Badge variant="outline" className="text-xs">
                        {msg.type === "system" ? "🤖 System" : "👤 Team"}
                      </Badge>
                    </div>
                    {!msg.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-foreground mb-2">{msg.message}</p>
                  <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message input */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
