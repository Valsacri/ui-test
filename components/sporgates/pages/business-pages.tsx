"use client"

import { useState, useEffect } from "react"
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
  X,
  MapPin,
  Trash2,
  Eye,
  Edit3,
  Clock,
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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { AddCampaignModal } from "@/components/sporgates/business/add-campaign-modal"
import { AddResourceModal } from "@/components/sporgates/business/add-resource-modal"
import { EditResourceModal, type EditableResource } from "@/components/sporgates/business/edit-resource-modal"
import { AddTeamMemberModal } from "@/components/sporgates/business/add-team-member-modal"
import { SponsorshipTierBuilder, type SponsorshipTier } from "@/components/sporgates/business/sponsorship-tier-builder"
import { AthleteCollaborationSelector } from "@/components/sporgates/business/athlete-collaboration-selector"
import { facilitiesService } from "@/lib/services/facilities"
import { marketplaceService } from "@/lib/services/marketplace"
import { servicesService } from "@/lib/services/services"
import { activitiesService } from "@/lib/services/activities"
import { businessesService } from "@/lib/services/businesses"
import { useBusinessContext } from "@/lib/business-context"

interface BusinessSubPageProps {
  onNavigate: (page: PageRoute) => void
}

export function BusinessActivitiesPage({ onNavigate }: BusinessSubPageProps) {
  const { activeBusinessId } = useBusinessContext()
  const [activityList, setActivityList] = useState<Array<{
    id: string; name: string; sportName?: string; startDateTime?: string; pricePerPerson?: number;
    currentParticipants?: number; maxParticipants?: number; coverImage?: string; status?: string
  }>>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchActivities = async () => {
      if (!activeBusinessId) return
      setLoading(true)
      try {
        const data = await activitiesService.getAll({ organizerId: activeBusinessId })
        const list = Array.isArray(data) ? data : []
        setActivityList(list)
      } catch {
        // Fallback to mock data
        setActivityList(
          activities.map((a) => ({
            id: a.id,
            name: a.title,
            sportName: a.sport,
            startDateTime: a.date,
            pricePerPerson: a.price,
            currentParticipants: a.spots,
            maxParticipants: a.totalSpots,
            coverImage: a.image,
          }))
        )
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [activeBusinessId])

  const filteredActivities = searchQuery
    ? activityList.filter((a) => a.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : activityList

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!loading && filteredActivities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">No activities found. Create your first activity to get started.</p>
        </div>
      )}

      {!loading && filteredActivities.length > 0 && (
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
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={activity.coverImage || "/placeholder.svg"} alt="" className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
                      <span className="text-xs font-semibold text-foreground">{activity.name}</span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3 text-xs text-muted-foreground md:table-cell">{activity.sportName || "â€”"}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{activity.startDateTime ? new Date(activity.startDateTime).toLocaleDateString() : "â€”"}</td>
                  <td className="px-5 py-3 text-xs font-semibold text-foreground">${activity.pricePerPerson ?? 0}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{activity.currentParticipants ?? 0}/{activity.maxParticipants ?? 0}</td>
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
      )}
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
  const { activeBusinessId } = useBusinessContext()
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<Array<{
    id?: string; name: string; avatar: string; role?: string; status: string; email?: string
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      if (!activeBusinessId) return
      setLoading(true)
      try {
        const staff = await businessesService.getStaff(activeBusinessId)
        const staffList = Array.isArray(staff) ? staff : []
        if (staffList.length > 0) {
          setTeamMembers(
            staffList.map((s: { id?: string; firstName?: string; lastName?: string; email?: string; role?: string; username?: string }) => ({
              id: s.id,
              name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.username || 'Unknown',
              avatar: `${(s.firstName || '?')[0]}${(s.lastName || '?')[0]}`,
              role: s.role || 'Staff',
              status: 'active',
              email: s.email,
            }))
          )
        } else {
          setTeamMembers([])
        }
      } catch {
        setTeamMembers([])
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [activeBusinessId])

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

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!loading && teamMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">No team members yet. Add your first team member.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {teamMembers.map((member) => (
          <div
            key={member.id || member.name}
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
  const { activeBusinessId } = useBusinessContext()
  type ResourceType = "facility" | "product" | "service"
  type BusinessResource = {
    id: string
    name: string
    type: string
    resourceType: ResourceType
    status: string
    bookingsToday: number
    revenue: number
    image: string
    description?: string
    price?: number
    pricePerHour?: number
    capacity?: number
    address?: string
    city?: string
    sport?: string
    brand?: string
    category?: string
    originalPrice?: number
    duration?: string
  }

  const [activeTab, setActiveTab] = useState<ResourceType>("facility")
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<BusinessResource | null>(null)
  const [viewingResource, setViewingResource] = useState<BusinessResource | null>(null)
  const [dropdownResourceId, setDropdownResourceId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<BusinessResource | null>(null)
  const [facilities, setFacilities] = useState<BusinessResource[]>([])
  const [products, setProducts] = useState<BusinessResource[]>([])
  const [services, setServices] = useState<BusinessResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const tabs: { key: ResourceType; label: string; count: number }[] = [
    { key: "facility", label: "Facilities", count: facilities.length },
    { key: "product", label: "Products", count: products.length },
    { key: "service", label: "Services", count: services.length },
  ]

  const activeResources = activeTab === "facility" ? facilities : activeTab === "product" ? products : services

  const resolveResourceType = (type: string): ResourceType => {
    const normalized = type.toLowerCase()
    if (["court", "pool", "studio", "ring", "facility"].some((item) => normalized.includes(item))) return "facility"
    if (["product", "gear", "item"].some((item) => normalized.includes(item))) return "product"
    return "service"
  }

  // Fetch all resources on mount
  useEffect(() => {
    const fetchAll = async () => {
      if (!activeBusinessId) return
      setLoading(true)
      setError("")

      try {
        const data = await facilitiesService.getAll({ businessId: activeBusinessId })
        const list = Array.isArray(data) ? data : []
        setFacilities(
          list.map((f: Record<string, unknown>) => ({
            id: f.id as string,
            name: (f.name as string) || "Unnamed Facility",
            type: "Facility",
            resourceType: "facility" as ResourceType,
            status: f.isActive ? "available" : "inactive",
            bookingsToday: 0, revenue: 0,
            image: (f.coverImage as string) || ((f.imageUrls as string[])?.[0]) || "/placeholder.svg",
            description: f.description as string | undefined,
            pricePerHour: f.pricePerHour as number | undefined,
            capacity: f.capacity as number | undefined,
            address: f.address as string | undefined,
            city: f.city as string | undefined,
            sport: ((f.sports as string[]) || [])[0] || undefined,
            category: ((f.sports as string[]) || [])[0] || undefined,
          }))
        )
      } catch { /* skip */ }

      try {
        const data = await marketplaceService.getAll({ sellerId: activeBusinessId })
        const list = Array.isArray(data) ? data : []
        setProducts(
          list.map((p: Record<string, unknown>) => ({
            id: p.id as string,
            name: (p.name as string) || "Unnamed Product",
            type: "Product",
            resourceType: "product" as ResourceType,
            status: p.inStock ? "available" : "inactive",
            bookingsToday: 0, revenue: 0,
            image: (p.image as string) || "/placeholder.svg",
            description: p.description as string | undefined,
            price: p.price as number | undefined,
            brand: p.brand as string | undefined,
            category: p.category as string | undefined,
            originalPrice: p.originalPrice as number | undefined,
          }))
        )
      } catch { /* skip */ }

      try {
        const data = await servicesService.getAll({ providerId: activeBusinessId })
        const list = Array.isArray(data) ? data : []
        setServices(
          list.map((s: Record<string, unknown>) => ({
            id: s.id as string,
            name: (s.name as string) || "Unnamed Service",
            type: "Service",
            resourceType: "service" as ResourceType,
            status: s.verified ? "available" : "inactive",
            bookingsToday: 0, revenue: 0,
            image: (s.image as string) || "/placeholder.svg",
            description: s.description as string | undefined,
            price: s.price as number | undefined,
            category: s.category as string | undefined,
            duration: s.duration as string | undefined,
          }))
        )
      } catch { /* skip */ }

      setLoading(false)
    }
    fetchAll()
  }, [activeBusinessId])

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownResourceId) return
    const handler = () => setDropdownResourceId(null)
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [dropdownResourceId])

  const handleCreateResource = async (resource: {
    name: string
    resourceType: ResourceType
    description: string
    image: string
    pricePerHour?: number
    capacity?: number
    address?: string
    city?: string
    sport?: string
    price?: number
    brand?: string
    category?: string
    originalPrice?: number
    duration?: string
  }) => {
    const newItem: BusinessResource = {
      id: `resource-${Date.now()}`,
      name: resource.name,
      type: resource.resourceType === "facility" ? "Facility" : resource.resourceType === "product" ? "Product" : "Service",
      resourceType: resource.resourceType,
      status: "available",
      bookingsToday: 0, revenue: 0,
      image: resource.image || "/placeholder.svg",
      description: resource.description,
      price: resource.price,
      pricePerHour: resource.pricePerHour,
      capacity: resource.capacity,
      address: resource.address,
      city: resource.city,
      sport: resource.sport,
      brand: resource.brand,
      category: resource.category,
      originalPrice: resource.originalPrice,
      duration: resource.duration,
    }

    try {
      if (resource.resourceType === "facility") {
        const created = await facilitiesService.create({
          name: resource.name,
          description: resource.description,
          coverImage: resource.image,
          pricePerHour: resource.pricePerHour,
          capacity: resource.capacity,
          address: resource.address,
          city: resource.city,
          sports: resource.sport ? [resource.sport] : [],
          businessId: activeBusinessId,
        })
        newItem.id = created.id || newItem.id
        setFacilities((prev) => [newItem, ...prev])
      } else if (resource.resourceType === "product") {
        const created = await marketplaceService.create({
          name: resource.name,
          description: resource.description,
          image: resource.image,
          price: resource.price,
          brand: resource.brand,
          category: resource.category || "General",
          originalPrice: resource.originalPrice,
          sellerId: activeBusinessId,
        })
        newItem.id = created.id || newItem.id
        setProducts((prev) => [newItem, ...prev])
      } else {
        const created = await servicesService.create({
          name: resource.name,
          description: resource.description,
          image: resource.image,
          price: resource.price,
          category: resource.category || "General",
          duration: resource.duration,
          providerId: activeBusinessId,
        })
        newItem.id = created.id || newItem.id
        setServices((prev) => [newItem, ...prev])
      }
    } catch {
      // Fallback: add locally
      if (resource.resourceType === "facility") setFacilities((prev) => [newItem, ...prev])
      else if (resource.resourceType === "product") setProducts((prev) => [newItem, ...prev])
      else setServices((prev) => [newItem, ...prev])
    }
    setActiveTab(resource.resourceType)
  }

  const handleSaveResource = async (updated: EditableResource) => {
    const resType = activeTab
    const id = updated.id as string

    try {
      if (resType === "facility") {
        await facilitiesService.update(id, {
          name: updated.name,
          description: updated.description,
          coverImage: updated.image,
          pricePerHour: updated.pricePerHour,
          capacity: updated.capacity,
          address: updated.address,
          city: updated.city,
          sports: updated.sport ? [updated.sport] : undefined,
        })
      } else if (resType === "product") {
        await marketplaceService.update(id, {
          name: updated.name,
          description: updated.description,
          image: updated.image,
          price: updated.price,
          brand: updated.brand,
          category: updated.category,
          originalPrice: updated.originalPrice,
        })
      } else {
        await servicesService.update(id, {
          name: updated.name,
          description: updated.description,
          image: updated.image,
          price: updated.price,
          category: updated.category,
          duration: updated.duration,
        })
      }
    } catch { /* update locally anyway */ }

    const setter = resType === "facility" ? setFacilities : resType === "product" ? setProducts : setServices
    setter((prev: BusinessResource[]) => prev.map((item) => (item.id === id ? { ...item, ...updated } as BusinessResource : item)))
    setEditingResource(null)
  }

  const handleDeleteResource = async (resource?: BusinessResource) => {
    const target = resource || editingResource
    if (!target) return
    const resType = target.resourceType

    try {
      if (resType === "facility") await facilitiesService.delete(target.id)
      else if (resType === "product") await marketplaceService.delete(target.id)
      else await servicesService.delete(target.id)
    } catch { /* remove locally anyway */ }

    if (resType === "facility") setFacilities((prev) => prev.filter((item) => item.id !== target.id))
    else if (resType === "product") setProducts((prev) => prev.filter((item) => item.id !== target.id))
    else setServices((prev) => prev.filter((item) => item.id !== target.id))
    setEditingResource(null)
    setDeleteConfirm(null)
  }

  const tabLabels: Record<ResourceType, string> = { facility: "Facility", product: "Product", service: "Service" }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resources</h1>
          <p className="text-sm text-muted-foreground">Manage your facilities, products, and services</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddResourceOpen(true)}
          className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add {tabLabels[activeTab]}
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all",
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <span className={cn(
              "ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
              activeTab === tab.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && activeResources.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No {tabLabels[activeTab].toLowerCase()}s yet. Click &quot;Add {tabLabels[activeTab]}&quot; to create one.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {activeResources.map((resource) => (
          <div
            key={resource.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
            onClick={() => setViewingResource(resource)}
          >
            <div className="flex items-center gap-4">
              <img
                src={resource.image}
                alt={resource.name}
                className="h-16 w-16 rounded-xl object-cover"
                crossOrigin="anonymous"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{resource.name}</p>
                <p className="text-xs text-muted-foreground">{resource.type}{resource.category ? ` • ${resource.category}` : ""}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  {resource.pricePerHour != null && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
                      ${resource.pricePerHour}/hr
                    </span>
                  )}
                  {resource.price != null && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
                      ${resource.price}
                    </span>
                  )}
                  {resource.capacity != null && resource.capacity > 0 && (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-foreground">
                      <Users className="mr-1 inline h-3 w-3" />{resource.capacity}
                    </span>
                  )}
                  {resource.duration && (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-foreground">
                      <Clock className="mr-1 inline h-3 w-3" />{resource.duration}
                    </span>
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-semibold shrink-0",
                  resource.status === "available"
                    ? "bg-green-100 text-green-700"
                    : resource.status === "maintenance"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {resource.status}
              </span>
              {/* 3-dot dropdown */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setDropdownResourceId(dropdownResourceId === resource.id ? null : resource.id) }}
                  className="rounded-full p-2 hover:bg-muted"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
                {dropdownResourceId === resource.id && (
                  <div className="absolute right-0 top-10 z-50 min-w-[140px] rounded-xl border border-border bg-card py-1 shadow-lg" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => { setViewingResource(resource); setDropdownResourceId(null) }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingResource(resource); setDropdownResourceId(null) }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => { setDeleteConfirm(resource); setDropdownResourceId(null) }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddResourceOpen}
        onClose={() => setIsAddResourceOpen(false)}
        onCreate={handleCreateResource}
        defaultResourceType={activeTab}
      />

      {/* Edit Resource Modal */}
      {editingResource && (
        <EditResourceModal
          isOpen={!!editingResource}
          onClose={() => setEditingResource(null)}
          onDelete={() => handleDeleteResource(editingResource)}
          onSave={handleSaveResource}
          resource={editingResource}
          resourceType={editingResource.resourceType}
        />
      )}

      {/* View Resource Detail Modal */}
      {viewingResource && (
        <Dialog open={!!viewingResource} onOpenChange={() => setViewingResource(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-0">
            <DialogTitle className="sr-only">Resource Details</DialogTitle>
            {/* Header image */}
            {viewingResource.image && viewingResource.image !== "/placeholder.svg" && (
              <div className="relative">
                <img src={viewingResource.image} alt={viewingResource.name} className="h-48 w-full object-cover" crossOrigin="anonymous" />
                <button type="button" onClick={() => setViewingResource(null)} className="absolute right-3 top-3 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="space-y-4 px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{viewingResource.name}</h2>
                  <p className="text-xs text-muted-foreground">{viewingResource.type}{viewingResource.category ? ` • ${viewingResource.category}` : ""}</p>
                </div>
                <span className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold shrink-0",
                  viewingResource.status === "available" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                )}>
                  {viewingResource.status}
                </span>
              </div>

              {viewingResource.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{viewingResource.description}</p>
              )}

              {/* Detail rows */}
              <div className="space-y-2">
                {viewingResource.pricePerHour != null && (
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <span className="text-xs text-muted-foreground">Price per Hour</span>
                    <span className="text-sm font-semibold text-foreground">${viewingResource.pricePerHour}</span>
                  </div>
                )}
                {viewingResource.price != null && (
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <span className="text-xs text-muted-foreground">Price</span>
                    <span className="text-sm font-semibold text-foreground">${viewingResource.price}</span>
                  </div>
                )}
                {viewingResource.originalPrice != null && viewingResource.originalPrice > 0 && (
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <span className="text-xs text-muted-foreground">Original Price</span>
                    <span className="text-sm font-semibold text-foreground line-through">${viewingResource.originalPrice}</span>
                  </div>
                )}
                {viewingResource.capacity != null && viewingResource.capacity > 0 && (
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <span className="text-xs text-muted-foreground">Capacity</span>
                    <span className="text-sm font-semibold text-foreground">{viewingResource.capacity} people</span>
                  </div>
                )}
                {viewingResource.duration && (
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <span className="text-xs text-muted-foreground">Duration</span>
                    <span className="text-sm font-semibold text-foreground">{viewingResource.duration}</span>
                  </div>
                )}
                {viewingResource.brand && (
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <span className="text-xs text-muted-foreground">Brand</span>
                    <span className="text-sm font-semibold text-foreground">{viewingResource.brand}</span>
                  </div>
                )}
                {viewingResource.sport && (
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <span className="text-xs text-muted-foreground">Sport</span>
                    <span className="text-sm font-semibold text-foreground">{viewingResource.sport}</span>
                  </div>
                )}
                {(viewingResource.address || viewingResource.city) && (
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</span>
                    <span className="text-sm font-semibold text-foreground">{[viewingResource.address, viewingResource.city].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setViewingResource(null)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingResource(viewingResource); setViewingResource(null) }}
                  className="gradient-primary flex-1 rounded-xl py-2.5 text-xs font-semibold text-white"
                >
                  Edit Resource
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="max-w-sm p-0">
            <DialogTitle className="sr-only">Delete Confirmation</DialogTitle>
            <div className="space-y-4 px-5 py-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Delete {deleteConfirm.name}?</p>
                <p className="mt-1 text-xs text-muted-foreground">This action cannot be undone. The resource will be permanently removed.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground hover:bg-muted">
                  Cancel
                </button>
                <button type="button" onClick={() => handleDeleteResource(deleteConfirm)} className="flex-1 rounded-xl bg-destructive py-2.5 text-xs font-semibold text-white hover:bg-destructive/90">
                  Delete
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
