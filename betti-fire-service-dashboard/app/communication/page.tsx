"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Video, Phone, Bell, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function CommunicationPage() {
  const [message, setMessage] = useState("")
  const [recipient, setRecipient] = useState<"caregiver" | "patient">("caregiver")
  const { toast } = useToast()
  const [messages, setMessages] = useState([
    { id: 1, sender: "caregiver", text: "How are you feeling today?", time: "10:30 AM" },
    { id: 2, sender: "patient", text: "I'm doing well, thank you!", time: "10:32 AM" },
    { id: 3, sender: "caregiver", text: "Great! Remember to take your medication.", time: "10:35 AM" },
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "you",
          text: message,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setMessage("")
      toast({
        title: "Message Sent",
        description: `Your message was sent to ${recipient === "caregiver" ? "Sarah Johnson" : "Patient"}.`,
      })
    }
  }

  const handleCall = (type: "audio" | "video", target: string) => {
    toast({
      title: `${type === "audio" ? "Audio" : "Video"} Call Started`,
      description: `Connecting to ${target}...`,
    })
  }

  const handleSendNotification = () => {
    toast({
      title: "Notification Sent",
      description: "Push notification has been delivered to the patient.",
    })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Communication Center</h1>
          <p className="text-muted-foreground mt-1">Connect with caregiver and patient</p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Text Chat</TabsTrigger>
            <TabsTrigger value="calls">Audio/Video Calls</TabsTrigger>
            <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4 animate-in fade-in duration-500">
            <Card className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 pb-4 border-b">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto justify-between bg-transparent">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={
                              recipient === "caregiver"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }
                          >
                            {recipient === "caregiver" ? "SJ" : "PT"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{recipient === "caregiver" ? "Sarah Johnson (Caregiver)" : "Patient"}</span>
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Select Recipient</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setRecipient("caregiver")}>
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">SJ</AvatarFallback>
                      </Avatar>
                      Sarah Johnson (Caregiver)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRecipient("patient")}>
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">PT</AvatarFallback>
                      </Avatar>
                      Patient
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Badge className="ml-auto bg-green-600">Online</Badge>
              </div>

              <div className="space-y-3 mb-4 h-[400px] overflow-y-auto">
                {messages
                  .filter((m) => m.sender === recipient || m.sender === "you")
                  .map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${msg.sender === "you" ? "text-white" : "bg-accent"}`}
                        style={msg.sender === "you" ? { backgroundColor: "#233E7D" } : {}}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs mt-1 opacity-70">{msg.time}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} className="bg-primary">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="space-y-4 animate-in fade-in duration-500">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 transition-all hover:shadow-lg duration-300">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Call Caregiver</h3>
                <div className="flex items-center gap-3 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Primary Caregiver</p>
                    <Badge className="mt-1 bg-green-600">Available</Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleCall("audio", "Sarah Johnson")}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Audio Call
                  </Button>
                  <Button
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                    onClick={() => handleCall("video", "Sarah Johnson")}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Video Call
                  </Button>
                </div>
              </Card>

              <Card className="p-6 transition-all hover:shadow-lg duration-300">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Call Patient</h3>
                <div className="flex items-center gap-3 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xl">PT</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">Patient</h4>
                    <p className="text-sm text-muted-foreground">Resident</p>
                    <Badge className="mt-1 bg-green-600">Available</Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleCall("audio", "Patient")}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Audio Call
                  </Button>
                  <Button
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                    onClick={() => handleCall("video", "Patient")}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Video Call
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Recent Calls</h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-accent/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Video call with Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Today at 2:30 PM • 15 min</p>
                    </div>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-accent/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Audio call with Patient</p>
                      <p className="text-sm text-muted-foreground">Yesterday at 11:00 AM • 8 min</p>
                    </div>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 animate-in fade-in duration-500">
            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                Send Push Notification to Patient
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Notification Title</label>
                  <Input placeholder="e.g., Medication Reminder" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                  <Textarea placeholder="Enter your message here..." rows={4} />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSendNotification}>
                  <Bell className="mr-2 h-4 w-4" />
                  Send Notification
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                <div className="p-3 bg-accent/20 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-foreground">Medication Reminder</p>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Time to take your afternoon medication</p>
                  <Badge className="mt-2 bg-green-600">Delivered</Badge>
                </div>
                <div className="p-3 bg-accent/20 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-foreground">Check-in Request</p>
                    <span className="text-xs text-muted-foreground">5 hours ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">How are you feeling today?</p>
                  <Badge className="mt-2 bg-green-600">Delivered</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </div>
  )
}
