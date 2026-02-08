"use client"

import {
  Home,
  Compass,
  CalendarDays,
  MessageCircle,
  User,
  LayoutDashboard,
  BarChart3,
  Users,
} from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  currentPage: PageRoute
  onNavigate: (page: PageRoute) => void
  isBusinessMode: boolean
}

const userItems = [
  { label: "Home", icon: Home, page: "home" as PageRoute },
  { label: "Explore", icon: Compass, page: "explore" as PageRoute },
  { label: "Activities", icon: CalendarDays, page: "activities" as PageRoute },
  { label: "Messages", icon: MessageCircle, page: "messages" as PageRoute },
  { label: "Profile", icon: User, page: "profile" as PageRoute },
]

const businessItems = [
  { label: "Dashboard", icon: LayoutDashboard, page: "business-dashboard" as PageRoute },
  { label: "Activities", icon: CalendarDays, page: "business-activities" as PageRoute },
  { label: "Customers", icon: Users, page: "business-customers" as PageRoute },
  { label: "Analytics", icon: BarChart3, page: "business-analytics" as PageRoute },
  { label: "Profile", icon: User, page: "profile" as PageRoute },
]

export function BottomNav({ currentPage, onNavigate, isBusinessMode }: BottomNavProps) {
  const items = isBusinessMode ? businessItems : userItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <button
            type="button"
            key={item.label}
            onClick={() => onNavigate(item.page)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors",
              currentPage === item.page ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5",
                currentPage === item.page ? "text-primary" : "text-muted-foreground"
              )}
            />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
