"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageSquare, Video, Phone, Users, Send, Mic } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const recentMessages = [
  {
    id: 1,
    type: "family",
    sender: "Sarah (Daughter)",
    message: "How are you feeling today, Mom?",
    response: "I'm doing well, thank you!",
    time: "2:30 PM",
    unread: false,
  },
  {
    id: 2,
    type: "caregiver",
    sender: "Care Team",
    message: "Medication reminder sent",
    response: "Taken ✓",
    time: "1:00 PM",
    unread: false,
  },
  {
    id: 3,
    type: "family",
    sender: "Mike (Son)",
    message: "Looking forward to our call tomorrow!",
    response: null,
    time: "11:30 AM",
    unread: true,
  },
]

export function CommunicationTools() {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(recentMessages)
  const { toast } = useToast()

  const handleVideoCall = () => {
    toast({
      title: "Starting Video Call...",
      description: "Connecting to Margaret Johnson's device",
    })
    console.log("[v0] Video call initiated")
  }

  const handleVoiceCall = () => {
    toast({
      title: "Starting Voice Call...",
      description: "Dialing Margaret Johnson",
    })
    console.log("[v0] Voice call initiated")
  }

  const handleFamilyGroup = () => {
    toast({
      title: "Opening Family Group",
      description: "Connecting to family members",
    })
    console.log("[v0] Family group call initiated")
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg = {
      id: messages.length + 1,
      type: "caregiver" as const,
      sender: "You",
      message: newMessage,
      response: null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unread: false,
    }

    setMessages((prev) => [newMsg, ...prev])
    setNewMessage("")

    toast({
      title: "Message Sent",
      description: "Your message has been delivered",
    })
  }

  const handleVoiceNote = () => {
    toast({
      title: "Recording Voice Note",
      description: "Tap to stop recording",
    })
    console.log("[v0] Voice note recording started")
  }

  const handleReassuranceUpdate = () => {
    toast({
      title: "Sending Reassurance Update",
      description: "Family members will receive a status update",
    })
    console.log("[v0] Reassurance update sent to family")
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-secondary" />
          Communication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Button
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 h-12"
            onClick={handleVideoCall}
          >
            <Video className="h-5 w-5" />
            Start Video Call
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 bg-transparent"
              onClick={handleVoiceCall}
            >
              <Phone className="h-4 w-4" />
              Voice Call
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 bg-transparent"
              onClick={handleFamilyGroup}
            >
              <Users className="h-4 w-4" />
              Family Group
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Recent Messages</h4>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              {messages.length} conversations
            </Badge>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg border transition-colors ${
                  msg.unread ? "bg-blue-50 border-blue-200" : "bg-muted/30 border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{msg.sender}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                    {msg.unread && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                </div>
                <p className="text-sm text-foreground mb-1">{msg.message}</p>
                {msg.response && <p className="text-sm text-primary font-medium">→ {msg.response}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Type a quick message..."
              className="flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button size="sm" className="px-3" onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2 bg-transparent"
            onClick={handleVoiceNote}
          >
            <Mic className="h-4 w-4" />
            Send Voice Note
          </Button>
        </div>

        <div className="pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2 bg-transparent"
            onClick={handleReassuranceUpdate}
          >
            <Users className="h-4 w-4" />
            Send Reassurance Update
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
