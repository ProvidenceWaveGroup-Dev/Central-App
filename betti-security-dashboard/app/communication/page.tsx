"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Video, Phone, Bell, Send, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const recipients = [
  { id: "caregiver", name: "Caregiver", status: "online" },
  { id: "emergency", name: "Emergency Services", status: "available" },
  { id: "family", name: "Family Member", status: "online" },
  { id: "patient", name: "Patient", status: "active" },
]

const chatHistory = [
  {
    id: 1,
    sender: "Caregiver",
    message: "Patient is resting comfortably",
    timestamp: "3:30 PM",
    type: "received",
  },
  {
    id: 2,
    sender: "You",
    message: "Thank you for the update",
    timestamp: "3:32 PM",
    type: "sent",
  },
  {
    id: 3,
    sender: "System",
    message: "Alert: Distress signal detected",
    timestamp: "3:40 PM",
    type: "system",
  },
]

export default function CommunicationPage() {
  const { toast } = useToast()
  const [selectedRecipient, setSelectedRecipient] = useState(recipients[0])
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsSending(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedRecipient.name}`,
    })

    setMessage("")
    setIsSending(false)
  }

  const handleVideoCall = () => {
    toast({
      title: "Initiating Video Call",
      description: `Calling ${selectedRecipient.name}...`,
    })
  }

  const handleAudioCall = () => {
    toast({
      title: "Initiating Audio Call",
      description: `Calling ${selectedRecipient.name}...`,
    })
  }

  const handlePushNotification = () => {
    toast({
      title: "Notification Sent",
      description: `Push notification sent to ${selectedRecipient.name}`,
    })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8"><div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Communication</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Connect with caregivers, emergency services, family, and patients
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Text Chat Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-serif">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Text Chat
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                      To: {selectedRecipient.name}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Select Recipient</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {recipients.map((recipient) => (
                      <DropdownMenuItem key={recipient.id} onClick={() => setSelectedRecipient(recipient)}>
                        <div className="flex items-center justify-between w-full">
                          <span>{recipient.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {recipient.status}
                          </Badge>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat History */}
              <div className="space-y-3 rounded-lg border p-4 h-[300px] sm:h-[400px] overflow-y-auto">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className={`flex ${chat.type === "sent" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        chat.type === "sent"
                          ? "bg-primary text-white"
                          : chat.type === "system"
                            ? "bg-destructive/10 text-destructive border border-destructive"
                            : "bg-muted"
                      }`}
                    >
                      <p className="font-semibold text-xs mb-1">{chat.sender}</p>
                      <p className="text-sm">{chat.message}</p>
                      <p className="text-xs opacity-70 mt-1">{chat.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Textarea
                  placeholder={`Type your message to ${selectedRecipient.name}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 min-h-[80px] sm:min-h-[60px]"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || !message.trim()}
                  className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Video & Audio Calls */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleVideoCall}
                  className="w-full bg-primary hover:bg-primary/90 text-white justify-start"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Video Call
                </Button>
                <Button
                  onClick={handleAudioCall}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white justify-start"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Audio Call
                </Button>
                <Button
                  onClick={handlePushNotification}
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Push Notification
                </Button>
              </CardContent>
            </Card>

            {/* Recipient Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Recipient Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      selectedRecipient.id === recipient.id ? "bg-primary/5 border-primary" : ""
                    }`}
                  >
                    <span className="font-semibold text-sm">{recipient.name}</span>
                    <Badge
                      variant={recipient.status === "online" || recipient.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {recipient.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div></div>
  )
}
