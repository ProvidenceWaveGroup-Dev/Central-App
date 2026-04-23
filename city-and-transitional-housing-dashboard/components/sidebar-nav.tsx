"use client";
import {
  Home,
  AlertCircle,
  FileText,
  Users,
  Heart,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onNavigate: (page: string) => void;
  currentPage: string;
  onToggle?: () => void;
}

export function Sidebar({
  isOpen,
  onNavigate,
  currentPage,
  onToggle,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "properties", label: "Properties", icon: FileText },
    { id: "alerts", label: "Alerts", icon: AlertCircle },
    { id: "compliance", label: "Compliance, Health & Safety", icon: FileText },
    { id: "residents", label: "Residents", icon: Users },
    { id: "health", label: "Health/Wellness", icon: Heart },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    // Auto-close on mobile after navigation
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onToggle?.();
    }
  };

  return (
    <>
      {/*
        Backdrop: only visible on mobile (md:hidden) when sidebar is open.
        Uses CSS — no JS media query needed.
      */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border",
          "transition-all duration-300 ease-in-out z-40 flex flex-col overflow-hidden",
          "w-64", // mobile always uses full width when sliding in
          isOpen
            ? "translate-x-0 md:w-64"           // open: visible on all, full-width on desktop
            : "-translate-x-full md:translate-x-0 md:w-20", // closed: hidden on mobile, icon-only on desktop
        )}
      >
        {/* App title — shown only when expanded */}
        {isOpen && (
          <div className="px-4 pt-6 pb-2 border-b border-sidebar-border mt-16">
            <p
              className="text-sm font-semibold text-sidebar-foreground leading-tight"
              style={{ fontFamily: "'Georgia Pro', Georgia, serif" }}
            >
              City and Transitional Housing
            </p>
          </div>
        )}

        {/* Nav items */}
        <nav
          className={cn(
            "flex-1 p-2 space-y-1 overflow-y-auto overflow-x-hidden",
            isOpen ? "mt-2" : "mt-24",
          )}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isOpen ? "justify-start" : "justify-center",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20",
                )}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <span className="ml-3 text-left truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border flex flex-col items-center gap-2">
          {isOpen && (
            <Image
              src="/Betti Logo tagline TM and PWG logo_horizontal.jpg"
              alt="Powered by Betti"
              width={180}
              height={30}
              className="object-contain opacity-90 mb-1"
            />
          )}

          {/* Logout button */}
          <Button
            variant="ghost"
            onClick={() => alert("Logging out...")}
            className={cn(
              "w-full text-sidebar-foreground hover:bg-sidebar-accent/20 hover:text-sidebar-foreground",
              isOpen ? "justify-start px-3" : "justify-center px-0",
            )}
            title={!isOpen ? "Logout" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {isOpen && <span className="ml-2 text-sm">Logout</span>}
          </Button>

          {/* Collapse / expand toggle — desktop only (md:flex, hidden on mobile) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden md:flex w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent/20 hover:text-sidebar-foreground"
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
