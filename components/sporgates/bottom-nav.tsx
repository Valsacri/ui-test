"use client"

import {
  Home,
  Compass,
  CalendarDays,
  MessageCircle,
  User,
  LayoutDashboard,
  Users,
  Rss,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { useOptionalBusinessContext } from "@/lib/business-context"
import { STORAGE_KEYS } from "@/lib/constants"

interface BottomNavProps {
  currentPage: PageRoute
  onNavigate: (page: PageRoute, detailId?: string) => void
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
  { label: "Feed", icon: Rss, page: "business-feed" as PageRoute },
  { label: "Activities", icon: CalendarDays, page: "business-activities" as PageRoute },
  { label: "Customers", icon: Users, page: "business-customers" as PageRoute },
  { label: "Profile", icon: User, page: "profile" as PageRoute },
]

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const pathname = usePathname()
  const pathNorm = pathname === "/" ? "/" : pathname.replace(/\/$/, "")
  const businessCtx = useOptionalBusinessContext()

  const effectiveBusinessId = useMemo(() => {
    const fromCtx = businessCtx?.activeBusinessId ?? null
    if (fromCtx) return fromCtx
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_BUSINESS_ID)
    } catch {
      return null
    }
  }, [businessCtx?.activeBusinessId])

  const railBusinessMode = !!effectiveBusinessId
  const items = railBusinessMode ? businessItems : userItems

  const isProfileActive = () => {
    if (!effectiveBusinessId) return currentPage === "profile"
    return pathNorm === `/businesses/${effectiveBusinessId}`
  }

  const onItemClick = (page: PageRoute) => {
    if (page === "profile") {
      if (effectiveBusinessId) {
        onNavigate("business-detail", effectiveBusinessId)
      } else {
        onNavigate("profile")
      }
      return
    }
    onNavigate(page)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const active =
            item.page === "profile" ? isProfileActive() : currentPage === item.page
          return (
            <button
              type="button"
              key={item.label}
              onClick={() => onItemClick(item.page)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              />
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
