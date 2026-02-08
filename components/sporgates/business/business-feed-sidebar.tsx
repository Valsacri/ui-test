"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowUpRight,
  Building2,
  DollarSign,
  Eye,
  MessageSquare,
  Plus,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BusinessFeedSidebarProps {
  businessName?: string
  businessType?: string
  businessAvatar?: string
  stats?: {
    totalRevenue: number
    activeEvents: number
    totalCustomers: number
    avgRating: number
  }
  onProfile?: () => void
  onCreateActivity?: () => void
  onCreateCampaign?: () => void
}

export function BusinessFeedSidebar({
  businessName = "Peak Performance Gym",
  businessType = "Fitness Center",
  businessAvatar,
  stats = {
    totalRevenue: 2450,
    activeEvents: 8,
    totalCustomers: 245,
    avgRating: 4.8,
  },
  onProfile,
  onCreateActivity,
  onCreateCampaign,
}: BusinessFeedSidebarProps) {
  const initials = businessName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div className="sticky top-[3.5rem] max-h-[calc(100vh-3.5rem)] space-y-4 overflow-y-auto pb-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <button
              type="button"
              onClick={onProfile}
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
            >
              {businessAvatar ? (
                <Avatar className="h-20 w-20">
                  <AvatarImage src={businessAvatar} alt={businessName} />
                  <AvatarFallback className="bg-primary text-lg font-bold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Building2 className="h-10 w-10" />
              )}
            </button>
            <h3 className="text-lg font-bold text-foreground">{businessName}</h3>
            <p className="text-xs text-muted-foreground">{businessType}</p>

            <div className="mt-3 flex items-center gap-1">
              <Star className="h-4 w-4 text-secondary fill-secondary" />
              <span className="text-sm font-semibold text-foreground">{stats.avgRating}</span>
              <span className="text-[11px] text-muted-foreground">(342 reviews)</span>
            </div>

            <Button onClick={onProfile} variant="outline" size="sm" className="mt-4 w-full">
              <Eye className="mr-2 h-4 w-4" />
              View Business Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <TrendingUp className="h-4 w-4" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Total Revenue", value: `$${stats.totalRevenue}`, color: "bg-green-500" },
            { label: "Active Events", value: stats.activeEvents.toString(), color: "bg-blue-500" },
            { label: "Total Customers", value: stats.totalCustomers.toString(), color: "bg-purple-500" },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", item.color)} style={{ width: "70%" }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={onCreateActivity} size="sm" className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            Create Activity
          </Button>
          <Button
            onClick={onCreateCampaign}
            size="sm"
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {[
            { label: "5 new bookings", time: "2 hours ago", icon: Users, color: "bg-green-100 text-green-700" },
            { label: "3 new reviews", time: "5 hours ago", icon: MessageSquare, color: "bg-blue-100 text-blue-700" },
            { label: "$450 revenue today", time: "Updated 1h ago", icon: DollarSign, color: "bg-purple-100 text-purple-700" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-2 border-b border-border pb-2 last:border-0">
              <div className={cn("rounded-lg p-1.5", item.color)}>
                <item.icon className="h-3 w-3" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-secondary/20 bg-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-secondary/10 p-2">
              <TrendingUp className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Growth Tip</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Create more morning activities to attract early birds.
              </p>
              <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs text-secondary">
                Learn more <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
