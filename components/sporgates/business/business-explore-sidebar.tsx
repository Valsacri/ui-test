"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  LayoutDashboard,
  Megaphone,
  Package,
  Rss,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BusinessExploreSidebarProps {
  onNavigate?: (destination: string) => void
  currentPage?: string
}

const businessItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    description: "Analytics & insights",
    destination: "business-dashboard",
  },
  {
    id: "feed",
    icon: Rss,
    label: "Feed",
    description: "Posts & updates",
    destination: "business-feed",
  },
  {
    id: "activities",
    icon: Calendar,
    label: "Activities",
    description: "Manage events & sessions",
    destination: "business-activities",
  },
  {
    id: "campaigns",
    icon: Megaphone,
    label: "Campaigns",
    description: "Sponsorship & marketing",
    destination: "business-campaigns",
  },
  {
    id: "customers",
    icon: Users,
    label: "Customers",
    description: "Manage relationships",
    destination: "business-customers",
  },
  {
    id: "resources",
    icon: Package,
    label: "Resources",
    description: "Products & facilities",
    destination: "business-resources",
  },
  {
    id: "athletes",
    icon: UserCheck,
    label: "Athletes & Influencers",
    description: "Collaboration partners",
    destination: "business-athletes",
  },
  {
    id: "partners",
    icon: Building2,
    label: "Businesses",
    description: "Business partnerships",
    destination: "business-partners",
  },
  {
    id: "team",
    icon: Briefcase,
    label: "Team",
    description: "Staff & permissions",
    destination: "business-team",
  },
  {
    id: "jobs",
    icon: Briefcase,
    label: "Jobs",
    description: "Post & manage job listings",
    destination: "business-jobs",
  },
]

export function BusinessExploreSidebar({ onNavigate, currentPage }: BusinessExploreSidebarProps) {
  return (
    <div className="sticky top-[3.5rem] max-h-[calc(100vh-3.5rem)] space-y-4 overflow-y-auto pb-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">Business Hub</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {businessItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.destination

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate?.(item.destination)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all",
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                )}
              >
                <div className={cn("rounded-xl p-2", isActive ? "bg-white/20" : "bg-muted")}> 
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-primary")} />
                </div>
                <div className="flex-1">
                  <p className={cn("text-xs font-semibold", isActive ? "text-white" : "text-foreground")}>
                    {item.label}
                  </p>
                  <p className={cn("text-[10px]", isActive ? "text-white/80" : "text-muted-foreground")}>
                    {item.description}
                  </p>
                </div>
                <ChevronRight className={cn("h-4 w-4", isActive ? "text-white" : "text-muted-foreground")} />
              </button>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Revenue</span>
            </div>
            <span className="font-semibold text-foreground">$2,450</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-secondary/10 p-2">
                <Calendar className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-muted-foreground">Active Events</span>
            </div>
            <span className="font-semibold text-foreground">8</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Customers</span>
            </div>
            <span className="font-semibold text-foreground">245</span>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onNavigate?.("business-settings")}> 
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </div>
  )
}
