"use client"

import { useState } from "react"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const notifications = [
  {
    id: 1,
    title: "Fall Alert Acknowledged",
    message: "Patient Margaret Chen's fall alert has been acknowledged",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    title: "Medication Reminder",
    message: "Patient has confirmed taking morning medication",
    time: "15 minutes ago",
    unread: true,
  },
  {
    id: 3,
    title: "Appointment Scheduled",
    message: "New appointment scheduled for tomorrow at 10:00 AM",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 4,
    title: "Vitals Update",
    message: "Heart rate returned to normal range",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: 5,
    title: "System Alert",
    message: "Halo sensor battery at 15%",
    time: "3 hours ago",
    unread: false,
  },
]

export function TopNav() {
  const [notificationList, setNotificationList] = useState(notifications)
  const [isOpen, setIsOpen] = useState(false)

  const hasUnread = notificationList.some((n) => n.unread)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && hasUnread) {
      setTimeout(() => {
        setNotificationList((prev) => prev.map((n) => ({ ...n, unread: false })))
      }, 2000)
    }
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-30 h-16 md:h-20 border-b border-neutral-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex-1 md:flex-none w-12 md:w-0" />

        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications Dropdown */}
          <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
                <Bell className="h-4 w-4 md:h-5 md:w-5 text-neutral-700" />
                {hasUnread && (
                  <div className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 md:w-80">
              <div className="border-b border-neutral-200 px-3 md:px-4 py-2 md:py-3">
                <h3 className="font-semibold text-sm md:text-base text-neutral-900">Notifications</h3>
                <p className="text-xs text-neutral-500">
                  {notificationList.filter((n) => n.unread).length} unread notifications
                </p>
              </div>
              <div className="max-h-80 md:max-h-96 overflow-y-auto">
                {notificationList.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 px-3 md:px-4 py-2 md:py-3"
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <p className="font-medium text-xs md:text-sm text-neutral-900">{notification.title}</p>
                      {notification.unread && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-neutral-600">{notification.message}</p>
                    <p className="text-xs text-neutral-400">{notification.time}</p>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="border-t border-neutral-200 px-3 md:px-4 py-2">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View All Notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                <User className="h-4 w-4 md:h-5 md:w-5 text-neutral-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
