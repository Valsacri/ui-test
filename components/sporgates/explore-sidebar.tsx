"use client"

import {
  Home,
  Compass,
  CalendarDays,
  MapPin,
  ShoppingBag,
  Briefcase,
  Building2,
  Users,
  MessageCircle,
  Bell,
  Settings,
  LayoutDashboard,
  BarChart3,
  UserCheck,
  Megaphone,
  Package,
} from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface ExploreSidebarProps {
  currentPage: PageRoute
  onNavigate: (page: PageRoute) => void
  isBusinessMode: boolean
}

const userNavItems = [
  { label: "Home", icon: Home, page: "home" as PageRoute },
  { label: "Explore", icon: Compass, page: "explore" as PageRoute },
  { label: "Activities", icon: CalendarDays, page: "activities" as PageRoute },
  { label: "Facilities", icon: MapPin, page: "facilities" as PageRoute },
  { label: "Marketplace", icon: ShoppingBag, page: "marketplace" as PageRoute },
  { label: "Services", icon: Briefcase, page: "services" as PageRoute },
  { label: "Businesses", icon: Building2, page: "businesses" as PageRoute },
  { label: "Jobs", icon: Briefcase, page: "jobs" as PageRoute },
]

const userSecondaryItems = [
  { label: "Messages", icon: MessageCircle, page: "messages" as PageRoute },
  { label: "Notifications", icon: Bell, page: "notifications" as PageRoute },
  { label: "Profile", icon: Users, page: "profile" as PageRoute },
  { label: "Settings", icon: Settings, page: "settings" as PageRoute },
]

const businessNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, page: "business-dashboard" as PageRoute },
  { label: "Activities", icon: CalendarDays, page: "business-activities" as PageRoute },
  { label: "Customers", icon: UserCheck, page: "business-customers" as PageRoute },
  { label: "Team", icon: Users, page: "business-team" as PageRoute },
  { label: "Analytics", icon: BarChart3, page: "business-analytics" as PageRoute },
  { label: "Campaigns", icon: Megaphone, page: "business-campaigns" as PageRoute },
  { label: "Resources", icon: Package, page: "business-resources" as PageRoute },
  { label: "Partners", icon: Users, page: "business-partners" as PageRoute },
  { label: "Jobs", icon: Briefcase, page: "business-jobs" as PageRoute },
]

export function ExploreSidebar({ currentPage, onNavigate, isBusinessMode }: ExploreSidebarProps) {
  const mainItems = isBusinessMode ? businessNavItems : userNavItems
  const secondaryItems = isBusinessMode ? userSecondaryItems.slice(0, 2) : userSecondaryItems

  // Check if current page matches item page, including detail pages
  const isActive = (itemPage: PageRoute, current: PageRoute) => {
    if (itemPage === current) return true
    // For business jobs, highlight when on list or detail page
    if (itemPage === "business-jobs" && current === "business-job-detail") return true
    // For regular jobs, highlight when on list or detail page
    if (itemPage === "jobs" && current === "job-detail") return true
    return false
  }

  return (
    <aside className="hidden w-80 shrink-0 border-r border-border bg-card lg:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
        <nav className="space-y-1">
          {mainItems.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => onNavigate(item.page)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive(item.page, currentPage)
                  ? "gradient-primary text-white shadow-md"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="my-4 border-t border-border" />

        <nav className="space-y-1">
          {secondaryItems.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => onNavigate(item.page)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                currentPage === item.page
                  ? "gradient-primary text-white shadow-md"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {!isBusinessMode && (
          <>
            <div className="my-4 border-t border-border" />
            <div className="rounded-xl bg-muted p-3">
              <p className="mb-2 text-xs font-semibold text-foreground">Favorite Sports</p>
              <div className="flex flex-wrap gap-1.5">
                {["Basketball", "Tennis", "Running"].map((sport) => (
                  <span
                    key={sport}
                    className="rounded-full bg-card px-2.5 py-1 text-[10px] font-medium text-foreground shadow-sm"
                  >
                    {sport}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
