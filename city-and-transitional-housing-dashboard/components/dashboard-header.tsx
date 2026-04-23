"use client"

import { Bell, Settings, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex-shrink-0"
            onClick={onMenuClick}
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5 text-primary" />
          </Button>

          {/* Logo — desktop only */}
          <Image
            src="/logo.png"
            alt="City and Transitional Housing Logo"
            width={120}
            height={40}
            className="hidden md:block h-12 w-auto"
          />

          {/* App name — mobile only (replaces logo) */}
          <p
            className="md:hidden text-base font-semibold text-primary leading-tight"
            style={{ fontFamily: "'Georgia Pro', Georgia, serif" }}
          >
            City and Transitional Housing
          </p>

          {/* App name — desktop (beside logo) */}
          <div className="hidden md:block border-l border-border pl-4">
            <p
              className="text-base font-semibold text-primary"
              style={{ fontFamily: "'Georgia Pro', Georgia, serif" }}
            >
              City and Transitional Housing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings className="w-5 h-5 text-primary" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5 text-primary" />
          </Button>
        </div>
      </div>
    </header>
  );
}
