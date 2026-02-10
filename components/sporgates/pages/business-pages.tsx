"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  MoreHorizontal,
  TrendingUp,
  Users,
  CalendarDays,
  DollarSign,
  ArrowUpRight,
  Mail,
  Phone,
  Megaphone,
  BarChart3,
} from "lucide-react"
import {
  activities,
  athletes,
  businessDashboardData,
  businessPartners,
  businessResources,
} from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { AddCampaignModal } from "@/components/sporgates/business/add-campaign-modal"
import { AddResourceModal } from "@/components/sporgates/business/add-resource-modal"
import { EditResourceModal } from "@/components/sporgates/business/edit-resource-modal"
import { AddTeamMemberModal } from "@/components/sporgates/business/add-team-member-modal"
import { SponsorshipTierBuilder, type SponsorshipTier } from "@/components/sporgates/business/sponsorship-tier-builder"
import { AthleteCollaborationSelector } from "@/components/sporgates/business/athlete-collaboration-selector"

interface BusinessSubPageProps {
  onNavigate: (page: PageRoute) => void
}

export function BusinessActivitiesPage({ onNavigate }: BusinessSubPageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Business Activities</h1>
          <p className="text-sm text-muted-foreground">Manage your sports activities and events</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("create-activity")}
          className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Activity
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search activities..."
          className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Activity</th>
              <th className="hidden px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">Sport</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Price</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Spots</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={activity.image || "/placeholder.svg"} alt="" className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
                    <span className="text-xs font-semibold text-foreground">{activity.title}</span>
                  </div>
                </td>
                <td className="hidden px-5 py-3 text-xs text-muted-foreground md:table-cell">{activity.sport}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{activity.date}</td>
                <td className="px-5 py-3 text-xs font-semibold text-foreground">${activity.price}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{activity.spots}/{activity.totalSpots}</td>
                <td className="px-5 py-3">
                  <button type="button" className="rounded-full p-1 hover:bg-muted">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function BusinessCustomersPage({ onNavigate }: BusinessSubPageProps) {
  const customers = [
    { name: "Jordan Rivera", email: "jordan@email.com", bookings: 12, spent: 340, avatar: "JR", status: "active" },
    { name: "Emily Park", email: "emily@email.com", bookings: 8, spent: 220, avatar: "EP", status: "active" },
    { name: "David Kim", email: "david@email.com", bookings: 15, spent: 450, avatar: "DK", status: "active" },
    { name: "Lisa Chen", email: "lisa@email.com", bookings: 5, spent: 125, avatar: "LC", status: "inactive" },
    { name: "Mark Brown", email: "mark@email.com", bookings: 3, spent: 75, avatar: "MB", status: "active" },
  ]

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-sm text-muted-foreground">Manage your customer relationships</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Users className="mb-2 h-5 w-5 text-primary" />
          <p className="text-xl font-bold text-foreground">1,289</p>
          <p className="text-[11px] text-muted-foreground">Total Customers</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <TrendingUp className="mb-2 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold text-foreground">89%</p>
          <p className="text-[11px] text-muted-foreground">Retention Rate</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <CalendarDays className="mb-2 h-5 w-5 text-primary" />
          <p className="text-xl font-bold text-foreground">6.2</p>
          <p className="text-[11px] text-muted-foreground">Avg Bookings</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <DollarSign className="mb-2 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold text-foreground">$186</p>
          <p className="text-[11px] text-muted-foreground">Avg Spend</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search customers..."
          className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        {customers.map((customer) => (
          <div
            key={customer.name}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
          >
            <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold text-white">
              {customer.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{customer.name}</p>
              <p className="text-xs text-muted-foreground">{customer.email}</p>
            </div>
            <div className="hidden items-center gap-6 text-xs md:flex">
              <div className="text-center">
                <p className="font-semibold text-foreground">{customer.bookings}</p>
                <p className="text-[10px] text-muted-foreground">Bookings</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">${customer.spent}</p>
                <p className="text-[10px] text-muted-foreground">Spent</p>
              </div>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                customer.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
              )}
            >
              {customer.status}
            </span>
            <div className="flex gap-1">
              <button type="button" className="rounded-full p-2 hover:bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </button>
              <button type="button" className="rounded-full p-2 hover:bg-muted">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BusinessTeamPage({ onNavigate }: BusinessSubPageProps) {
  const data = businessDashboardData
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="text-sm text-muted-foreground">Manage your team members and roles</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddMemberOpen(true)}
          className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.teamMembers.map((member) => (
          <div
            key={member.name}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="gradient-primary flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white">
              {member.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
              <span
                className={cn(
                  "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                  member.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                )}
              >
                {member.status}
              </span>
            </div>
            <button type="button" className="rounded-full p-2 hover:bg-muted">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>

      <AddTeamMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
    </div>
  )
}

export function BusinessResourcesPage({ onNavigate }: BusinessSubPageProps) {
  type BusinessResource = (typeof businessResources)[number] & {
    price?: number
    pricePerHour?: number
    description?: string
  }

  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false)
  const [resources, setResources] = useState<BusinessResource[]>(businessResources)
  const [editingResource, setEditingResource] = useState<BusinessResource | null>(null)

  const resourceTypeLabels: Record<"facility" | "product" | "service", string> = {
    facility: "Court",
    product: "Product",
    service: "Service",
  }

  const resolveResourceType = (type: string) => {
    const normalized = type.toLowerCase()
    if (["court", "pool", "studio", "ring"].some((item) => normalized.includes(item))) return "facility"
    if (["product", "gear", "item"].some((item) => normalized.includes(item))) return "product"
    return "service"
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resources</h1>
          <p className="text-sm text-muted-foreground">Track facility resources and utilization</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddResourceOpen(true)}
          className="gradient-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
        >
          Add Resource
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <div key={resource.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={resource.image}
                alt={resource.name}
                className="h-16 w-16 rounded-xl object-cover"
                crossOrigin="anonymous"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{resource.name}</p>
                <p className="text-xs text-muted-foreground">{resource.type}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-foreground">
                    {resource.bookingsToday} bookings today
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
                    ${resource.revenue} revenue
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                  resource.status === "available"
                    ? "bg-green-100 text-green-700"
                    : resource.status === "maintenance"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {resource.status}
              </span>
              <button
                type="button"
                onClick={() => setEditingResource(resource)}
                className="rounded-full p-2 hover:bg-muted"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddResourceModal
        isOpen={isAddResourceOpen}
        onClose={() => setIsAddResourceOpen(false)}
        onCreate={(resource) => {
          const label = resourceTypeLabels[resource.resourceType]
          const nextResource = {
            id: `resource-${Date.now()}`,
            name: resource.name || `New ${label}`,
            type: label,
            status: "available",
            bookingsToday: 0,
            revenue: 0,
            image: resource.image || "/placeholder.svg",
            description: resource.description,
            price: resource.resourceType === "facility" ? undefined : resource.price,
            pricePerHour: resource.resourceType === "facility" ? resource.price : undefined,
          }
          setResources((prev) => [nextResource, ...prev])
        }}
      />
      {editingResource && (
        <EditResourceModal
          isOpen={!!editingResource}
          onClose={() => setEditingResource(null)}
          onDelete={() => {
            setResources((prev) => prev.filter((item) => item.id !== editingResource.id))
            setEditingResource(null)
          }}
          onSave={(updated) => {
            setResources((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)))
            setEditingResource(null)
          }}
          resource={editingResource}
          resourceType={resolveResourceType(editingResource.type)}
        />
      )}
    </div>
  )
}

export function BusinessPartnersPage({ onNavigate }: BusinessSubPageProps) {
  const [tierPoster, setTierPoster] = useState("")
  const [tiers, setTiers] = useState<SponsorshipTier[]>([
    { id: "tier-gold", name: "Gold", price: 4500, benefits: ["Logo on jersey", "2 social posts"], logoPositions: ["Jersey Front", "Poster Top"] },
    { id: "tier-silver", name: "Silver", price: 2500, benefits: ["Logo on poster"], logoPositions: ["Poster Bottom"] },
  ])
  const [collaborationPhase, setCollaborationPhase] = useState<"pre" | "during" | "post">("pre")
  const [collaborationSearch, setCollaborationSearch] = useState("")
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | undefined>(undefined)
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Partners & Athletes</h1>
        <p className="text-sm text-muted-foreground">Manage sponsors and athlete collaborations</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {businessPartners.map((partner) => (
          <div key={partner.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-xl text-xs font-bold text-white">
                {partner.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{partner.name}</p>
                <p className="text-xs text-muted-foreground">{partner.type}</p>
                {partner.tier && (
                  <p className="mt-1 text-xs text-secondary">{partner.tier} sponsor</p>
                )}
                {partner.sport && (
                  <p className="mt-1 text-xs text-muted-foreground">{partner.sport}</p>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">Since {partner.since}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Sponsorship Packages</p>
              <p className="text-xs text-muted-foreground">Bundle placements and perks</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary">Builder</span>
          </div>
          <div className="mt-4">
            <SponsorshipTierBuilder
              tiers={tiers}
              onChange={setTiers}
              eventPoster={tierPoster}
              onPosterUpload={setTierPoster}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Athlete Collaboration</p>
              <p className="text-xs text-muted-foreground">Plan deliverables by phase</p>
            </div>
            <div className="flex gap-1 rounded-full border border-border p-1 text-[10px]">
              {(["pre", "during", "post"] as const).map((phase) => (
                <button
                  key={phase}
                  type="button"
                  onClick={() => setCollaborationPhase(phase)}
                  className={cn(
                    "rounded-full px-3 py-1 font-semibold",
                    collaborationPhase === phase ? "bg-secondary text-white" : "text-muted-foreground"
                  )}
                >
                  {phase}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <AthleteCollaborationSelector
              phase={collaborationPhase}
              athletes={athletes.map((athlete) => ({
                id: athlete.id,
                name: athlete.name,
                sport: athlete.sport,
                followers: athlete.followers,
                ranking: athlete.ranking,
                avatar: athlete.avatar,
                verified: athlete.status === "active",
              }))}
              selectedAthlete={selectedAthleteId}
              onSelectAthlete={setSelectedAthleteId}
              searchQuery={collaborationSearch}
              onSearchChange={setCollaborationSearch}
              selectedDeliverables={selectedDeliverables}
              onDeliverablesChange={setSelectedDeliverables}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function BusinessAnalyticsPage({ onNavigate }: BusinessSubPageProps) {
  const data = businessDashboardData
  const maxRevenue = Math.max(...data.monthlyRevenue.map((d) => d.revenue))

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Detailed performance metrics</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Revenue", value: `$${data.totalRevenue.toLocaleString()}`, change: "+12.5%", positive: true },
          { label: "Bookings", value: data.totalBookings.toString(), change: "+8.3%", positive: true },
          { label: "Customers", value: data.totalCustomers.toLocaleString(), change: "+15.2%", positive: true },
          { label: "Avg Order", value: "$71.87", change: "-2.1%", positive: false },
        ].map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-[11px] text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-xl font-bold text-foreground">{metric.value}</p>
            <span className={cn("flex items-center gap-0.5 text-[10px] font-semibold mt-1", metric.positive ? "text-green-600" : "text-red-500")}>
              <ArrowUpRight className="h-3 w-3" />
              {metric.change}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Monthly Revenue</h3>
        <div className="flex items-end gap-3" style={{ height: 200 }}>
          {data.monthlyRevenue.map((item) => (
            <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-foreground">
                ${(item.revenue / 1000).toFixed(1)}k
              </span>
              <div
                className="gradient-primary w-full rounded-t-lg transition-all duration-500"
                style={{ height: `${(item.revenue / maxRevenue) * 160}px` }}
              />
              <span className="text-[10px] text-muted-foreground">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Activity Performance</h3>
        <div className="space-y-3">
          {data.topActivities.map((activity) => {
            const maxBookings = Math.max(...data.topActivities.map((a) => a.bookings))
            return (
              <div key={activity.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{activity.name}</span>
                  <span className="text-muted-foreground">{activity.bookings} bookings - ${activity.revenue}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="gradient-secondary h-full rounded-full transition-all duration-500"
                    style={{ width: `${(activity.bookings / maxBookings) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { label: "Customer Satisfaction", value: "4.8/5", sub: "From 156 reviews", color: "text-yellow-500" },
          { label: "Profile Views", value: "1,247", sub: "Last 30 days", color: "text-blue-500" },
          { label: "Avg. Attendance", value: "87%", sub: "Across all activities", color: "text-green-500" },
        ].map((insight) => (
          <div key={insight.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-[11px] text-muted-foreground">{insight.label}</p>
            <p className={cn("mt-1 text-xl font-bold", insight.color)}>{insight.value}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">{insight.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BusinessCampaignsPage({ onNavigate }: BusinessSubPageProps) {
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false)
  const [campaigns, setCampaigns] = useState([
    { name: "Summer Sports Fest", status: "active", reach: 4500, conversions: 234, budget: 500, spent: 320 },
    { name: "New Member Discount", status: "active", reach: 2800, conversions: 156, budget: 300, spent: 180 },
    { name: "Team Building Promo", status: "ended", reach: 1900, conversions: 89, budget: 200, spent: 200 },
    { name: "Holiday Special", status: "draft", reach: 0, conversions: 0, budget: 400, spent: 0 },
  ])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Manage your marketing campaigns</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddCampaignOpen(true)}
          className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.name}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                  <Megaphone className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{campaign.name}</p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      campaign.status === "active" && "bg-green-100 text-green-700",
                      campaign.status === "ended" && "bg-muted text-muted-foreground",
                      campaign.status === "draft" && "bg-yellow-100 text-yellow-700"
                    )}
                  >
                    {campaign.status}
                  </span>
                </div>
              </div>
              <button type="button" className="rounded-full p-2 hover:bg-muted">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground">Reach</p>
                <p className="text-sm font-bold text-foreground">{campaign.reach.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Conversions</p>
                <p className="text-sm font-bold text-foreground">{campaign.conversions}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Budget</p>
                <p className="text-sm font-bold text-foreground">${campaign.budget}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Spent</p>
                <p className="text-sm font-bold text-foreground">${campaign.spent}</p>
              </div>
            </div>
            {campaign.budget > 0 && (
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="gradient-secondary h-full rounded-full"
                    style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <AddCampaignModal
        isOpen={isAddCampaignOpen}
        onClose={() => setIsAddCampaignOpen(false)}
        onCreate={(campaign) => {
          setCampaigns((prev) => [
            {
              name: campaign.name,
              status: "draft",
              reach: 0,
              conversions: 0,
              budget: campaign.budget,
              spent: 0,
            },
            ...prev,
          ])
        }}
      />
    </div>
  )
}
