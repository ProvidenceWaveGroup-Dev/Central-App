"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Video, Phone, Mail, Bell, Send, Paperclip, Smile, VideoOff, MicOff, Mic } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const messages = [
  {
    id: 1,
    sender: "Margaret Chen",
    content: "Good morning! I just took my medication.",
    time: "8:05 AM",
    isPatient: true,
  },
  {
    id: 2,
    sender: "You",
    content: "Great! How are you feeling today?",
    time: "8:07 AM",
    isPatient: false,
  },
  {
    id: 3,
    sender: "Margaret Chen",
    content: "I'm feeling well, thank you. A bit tired but overall good.",
    time: "8:10 AM",
    isPatient: true,
  },
  {
    id: 4,
    sender: "You",
    content: "That's good to hear. Remember to stay hydrated throughout the day.",
    time: "8:12 AM",
    isPatient: false,
  },
  {
    id: 5,
    sender: "Margaret Chen",
    content: "Will do! Thank you for checking in.",
    time: "8:15 AM",
    isPatient: true,
  },
]

export default function CommunicationPage() {
  const [newMessage, setNewMessage] = useState("")
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [showPushNotificationModal, setShowPushNotificationModal] = useState(false)
  const [notificationTitle, setNotificationTitle] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationRecipient, setNotificationRecipient] = useState("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsVideoCallActive(true)
      console.log("[v0] Video call started successfully")
    } catch (error) {
      console.error("[v0] Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  const startVoiceCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (audioRef.current) {
        audioRef.current.srcObject = stream
      }
      setIsVoiceCallActive(true)
      console.log("[v0] Voice call started successfully")
    } catch (error) {
      console.error("[v0] Error accessing microphone:", error)
      alert("Unable to access microphone. Please check permissions.")
    }
  }

  const endVideoCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsVideoCallActive(false)
    setIsVideoEnabled(true)
    setIsMuted(false)
  }

  const endVoiceCall = () => {
    if (audioRef.current && audioRef.current.srcObject) {
      const stream = audioRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      audioRef.current.srcObject = null
    }
    setIsVoiceCallActive(false)
    setIsMuted(false)
  }

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleMute = () => {
    const ref = isVideoCallActive ? videoRef : audioRef
    if (ref.current && ref.current.srcObject) {
      const stream = ref.current.srcObject as MediaStream
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const handleSendEmail = () => {
    const email = "margaret.chen@example.com"
    const subject = "Health Check-In"
    const body = "Dear Margaret,%0D%0A%0D%0A"
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  const handleSendPushNotification = () => {
    if (!notificationTitle || !notificationMessage || !notificationRecipient) {
      alert("Please fill in all fields")
      return
    }

    console.log("[v0] Sending push notification:", {
      title: notificationTitle,
      message: notificationMessage,
      recipient: notificationRecipient,
    })

    // Simulate notification sending
    alert(`Push notification sent to ${notificationRecipient}`)
    setShowPushNotificationModal(false)
    setNotificationTitle("")
    setNotificationMessage("")
    setNotificationRecipient("")
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("[v0] Sending message:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Communication & Messaging</h1>
        <p className="text-muted-foreground">Connect with your patient through multiple channels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Communication Options */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={startVideoCall}
              disabled={isVideoCallActive}
              className="w-full justify-start gap-3 h-auto py-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Video className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Start Video Call</p>
                <p className="text-xs opacity-90">Connect face-to-face</p>
              </div>
            </Button>

            <Button
              onClick={startVoiceCall}
              disabled={isVoiceCallActive}
              className="w-full justify-start gap-3 h-auto py-4 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Phone className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Start Voice Call</p>
                <p className="text-xs opacity-90">Quick audio check-in</p>
              </div>
            </Button>

            <Button
              onClick={handleSendEmail}
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
            >
              <Mail className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Send Email</p>
                <p className="text-xs text-muted-foreground">Detailed message</p>
              </div>
            </Button>

            <Button
              onClick={() => setShowPushNotificationModal(true)}
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
            >
              <Bell className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Push Notification</p>
                <p className="text-xs text-muted-foreground">Instant alert</p>
              </div>
            </Button>
          </CardContent>

          <CardHeader className="pt-6">
            <CardTitle className="text-lg font-serif">Patient Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/elderly-woman-portrait.png" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">MC</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">Margaret Chen</h3>
                <p className="text-sm text-muted-foreground">Patient ID: #12847</p>
                <Badge className="mt-1 bg-primary text-primary-foreground">Active</Badge>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Contact:</span>
                <span className="font-medium text-foreground">Today, 8:15 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Response Time:</span>
                <span className="font-medium text-foreground">~2 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Preferred Method:</span>
                <span className="font-medium text-foreground">Text Message</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Messaging or Active Call */}
        <Card className="lg:col-span-2 flex flex-col">
          {isVideoCallActive ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-serif">Video Call Active</CardTitle>
                  <Badge className="bg-primary text-primary-foreground">
                    <div className="h-2 w-2 rounded-full bg-white mr-2 animate-pulse" />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="relative flex-1 bg-black rounded-lg overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <VideoOff className="h-16 w-16 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    onClick={toggleMute}
                    variant="outline"
                    size="icon"
                    className={`h-12 w-12 rounded-full ${isMuted ? "bg-red-500 text-white" : ""}`}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button
                    onClick={toggleVideo}
                    variant="outline"
                    size="icon"
                    className={`h-12 w-12 rounded-full ${!isVideoEnabled ? "bg-red-500 text-white" : ""}`}
                  >
                    {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  <Button onClick={endVideoCall} variant="destructive" size="icon" className="h-12 w-12 rounded-full">
                    <Phone className="h-5 w-5 rotate-135" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : isVoiceCallActive ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-serif">Voice Call Active</CardTitle>
                  <Badge className="bg-primary text-primary-foreground">
                    <div className="h-2 w-2 rounded-full bg-white mr-2 animate-pulse" />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center">
                <audio ref={audioRef} autoPlay />
                <Avatar className="h-32 w-32 mb-6">
                  <AvatarImage src="/elderly-woman-portrait.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl">MC</AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-semibold mb-2">Margaret Chen</h3>
                <p className="text-muted-foreground mb-8">Call in progress...</p>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={toggleMute}
                    variant="outline"
                    size="icon"
                    className={`h-12 w-12 rounded-full ${isMuted ? "bg-red-500 text-white" : ""}`}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button onClick={endVoiceCall} variant="destructive" size="icon" className="h-12 w-12 rounded-full">
                    <Phone className="h-5 w-5 rotate-135" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-serif">Live Messaging</CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                    Online
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Real-time conversation with Margaret Chen</p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 space-y-4 mb-4 max-h-[500px] overflow-y-auto p-4 bg-muted/30 rounded-lg">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isPatient ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[70%] ${message.isPatient ? "order-2" : "order-1"}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            message.isPatient ? "bg-white border border-border" : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        <p
                          className={`text-xs text-muted-foreground mt-1 ${
                            message.isPatient ? "text-left" : "text-right"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                      {message.isPatient && (
                        <Avatar className="h-8 w-8 order-1 mr-2">
                          <AvatarImage src="/elderly-woman-portrait.png" />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">MC</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t border-border pt-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                      className="flex-1 bg-transparent"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>

      {/* Push Notification Modal */}
      <Dialog open={showPushNotificationModal} onOpenChange={setShowPushNotificationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Send Push Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notif-title">Title</Label>
              <Input
                id="notif-title"
                placeholder="Notification title"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                className="bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notif-message">Message</Label>
              <Textarea
                id="notif-message"
                placeholder="Notification message"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                className="bg-transparent"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notif-recipient">Send To</Label>
              <Select value={notificationRecipient} onValueChange={setNotificationRecipient}>
                <SelectTrigger id="notif-recipient" className="bg-transparent">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Margaret Chen (Patient)</SelectItem>
                  <SelectItem value="family">Family Members</SelectItem>
                  <SelectItem value="security">Security Agency</SelectItem>
                  <SelectItem value="fire">Fire Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setShowPushNotificationModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendPushNotification}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Send Notification
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Communication History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Recent Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: "Video Call",
                duration: "12 minutes",
                time: "Yesterday, 3:30 PM",
                icon: Video,
                status: "Completed",
              },
              {
                type: "Voice Call",
                duration: "5 minutes",
                time: "Oct 6, 10:15 AM",
                icon: Phone,
                status: "Completed",
              },
              {
                type: "Email",
                duration: "Sent",
                time: "Oct 5, 2:00 PM",
                icon: Mail,
                status: "Read",
              },
              {
                type: "Push Notification",
                duration: "Delivered",
                time: "Oct 5, 9:00 AM",
                icon: Bell,
                status: "Acknowledged",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.type}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{item.status}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{item.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
