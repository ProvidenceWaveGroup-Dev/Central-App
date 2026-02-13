"use client"

import { Bell, Settings, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export function DashboardHeader() {
  const { toast } = useToast()

  const handleMessages = () => {
    toast({
      title: "Messages",
      description: "Opening message center with 3 unread messages",
    })
  }

  const handleNotifications = () => {
    toast({
      title: "Notifications",
      description: "You have 2 new alerts to review",
    })
  }

  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Opening dashboard settings",
    })
  }

  const handleProfile = () => {
    toast({
      title: "Profile",
      description: "Opening user profile",
    })
  }

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/betti-logo.png" alt="Betti" width={40} height={40} className="rounded-lg" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">Betti Caregiver Dashboard</h1>
            <p className="text-sm text-muted-foreground">Monitor and care for your loved ones</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative" onClick={handleMessages}>
            <MessageSquare className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-accent text-accent-foreground">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={handleNotifications}>
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive">2</Badge>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSettings}>
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleProfile}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
