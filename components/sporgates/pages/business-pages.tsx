"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
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
  MapPin,
  Trash2,
  Eye,
  Edit3,
  Clock,
} from "lucide-react"

import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { AddCampaignModal } from "@/components/sporgates/business/add-campaign-modal"

import { AddTeamMemberModal } from "@/components/sporgates/business/add-team-member-modal"
import { PersonCardSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { SponsorshipTierBuilder, type SponsorshipTier } from "@/components/sporgates/business/sponsorship-tier-builder"
import { AthleteCollaborationSelector } from "@/components/sporgates/business/athlete-collaboration-selector"
import { facilitiesService } from "@/lib/services/facilities"
import { marketplaceService } from "@/lib/services/marketplace"
import { servicesService } from "@/lib/services/services"
import { activitiesService } from "@/lib/services/activities"
import { businessesService } from "@/lib/services/businesses"
import { useBusinessContext } from "@/lib/business-context"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"


interface BusinessSubPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

export function BusinessActivitiesPage({ onNavigate }: BusinessSubPageProps) {
  const { activeBusinessId } = useBusinessContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null)

  const { data: actRaw = [], isLoading: loading, mutate } = useSWR(
    activeBusinessId ? `/business/${activeBusinessId}/activities-page` : null,
    async () => {
      const data = await activitiesService.getAll({ organizerId: activeBusinessId! })
      return Array.isArray(data) ? data : []
    },
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const activityList: Array<{
    id: string; name: string; sportName?: string; startDateTime?: string; pricePerPerson?: number;
    currentParticipants?: number; maxParticipants?: number; coverImage?: string; status?: string;
    location?: string; currency?: string;
  }> = actRaw

  const handleDeleteClick = (id: string) => {
    setActivityToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!activityToDelete) return
    try {
      await activitiesService.delete(activityToDelete)
      toast.success("Activity deleted successfully")
      mutate()
    } catch (error) {
      console.error("Failed to delete activity", error)
      toast.error("Failed to delete activity")
    } finally {
      setDeleteDialogOpen(false)
      setActivityToDelete(null)
    }
  }

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredActivities.map((activity) => {
            // ... date parsing ...
            // Safe date parsing code remains same
            let parsedDate: Date | null = null;
            if (activity.startDateTime) {
              if (Array.isArray(activity.startDateTime)) {
                const [y, m, day, h = 0, min = 0] = activity.startDateTime;
                const d = new Date(y, m - 1, day, h, min);
                if (!isNaN(d.getTime())) parsedDate = d;
              } else {
                const d = new Date(activity.startDateTime);
                if (!isNaN(d.getTime())) parsedDate = d;
              }
            }

            return (
              <div
                key={activity.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
                style={{ WebkitMaskImage: "radial-gradient(white 100%, black 100%)" }} // Fixes radius overflow on scale
              >
                {/* Cover Image */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={activity.coverImage || "/placeholder.svg"}
                    alt={activity.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    crossOrigin="anonymous"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003C66]/90 via-[#003C66]/20 to-transparent" />

                  {/* Status badge - top left */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={`backdrop-blur-md shadow-sm border-none ${activity.status === 'PUBLISHED'
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : activity.status === 'DRAFT'
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                    >
                      {activity.status || "Active"}
                    </Badge>
                  </div>

                  {/* Action buttons - top right */}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => onNavigate("edit-activity", activity.id)}
                      className="rounded-full bg-white/20 backdrop-blur-md p-2 text-white hover:bg-white/40 transition-colors shadow-sm"
                      title="Edit"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(activity.id)}
                      className="rounded-full bg-red-500/80 backdrop-blur-md p-2 text-white hover:bg-red-600 transition-colors shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Activity info - bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white text-sm line-clamp-1 drop-shadow-sm mb-2">{activity.name}</h3>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {activity.sportName && (
                        <Badge variant="secondary" className="text-[10px] h-5 px-2 bg-[#003C66] text-white hover:bg-[#003C66]/90 border-none shadow-sm">
                          {activity.sportName}
                        </Badge>
                      )}
                      {activity.status && (
                        <Badge variant="secondary" className="text-[10px] h-5 px-2 bg-[#FC8936] text-white hover:bg-[#FC8936]/90 border-none shadow-sm">
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-3 space-y-2.5">
                  {/* Date & Location row */}
                  <div className="flex items-center gap-3 text-xs">
                    {parsedDate && (
                      <div className="flex items-center gap-1.5 text-foreground font-medium shrink-0">
                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        <span>{parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-muted-foreground flex-1 min-w-0">
                      <MapPin className="h-3.5 w-3.5 text-secondary shrink-0" />
                      <span className="truncate">{activity.location || "No location"}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border" />

                  {/* Price & Participants row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-foreground">
                        {activity.pricePerPerson
                          ? `${activity.currency === 'MAD' ? '' : '$'}${activity.pricePerPerson}${activity.currency === 'MAD' ? ' MAD' : ''}`
                          : "Free"}
                      </span>
                      {(activity.pricePerPerson ?? 0) > 0 && (
                        <span className="text-[10px] text-muted-foreground font-medium">/person</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span className="font-medium">
                        <span className="text-foreground">{activity.currentParticipants || 0}</span>
                        <span className="mx-0.5">/</span>
                        <span>{activity.maxParticipants || "∞"}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the activity and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

  const { data: staffRaw = [], isLoading: loading } = useSWR(
    activeBusinessId ? `/business/${activeBusinessId}/staff-team` : null,
    async () => {
      const staff = await businessesService.getStaff(activeBusinessId!)
      const staffList = Array.isArray(staff) ? staff : []
      return staffList.map((s: { id?: string; firstName?: string; lastName?: string; email?: string; role?: string; username?: string }) => ({
        id: s.id,
        name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.username || 'Unknown',
        avatar: `${(s.firstName || '?')[0]}${(s.lastName || '?')[0]}`,
        role: s.role || 'Staff',
        status: 'active',
        email: s.email,
      }))
    },
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const teamMembers: Array<{
    id?: string; name: string; avatar: string; role?: string; status: string; email?: string
  }> = staffRaw

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PersonCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && teamMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">No team members yet. Add your first team member.</p>
        </div>
      )}

      {!loading && (
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
      )}

      <AddTeamMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
    </div>
  )
}

export function BusinessResourcesPage({ onNavigate, initialTab }: BusinessSubPageProps & { initialTab?: "facility" | "product" | "service" }) {
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

  const [activeTab, setActiveTab] = useState<ResourceType>(initialTab || "facility")
  const [dropdownResourceId, setDropdownResourceId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<BusinessResource | null>(null)



  const resolveResourceType = (type: string): ResourceType => {
    const normalized = type.toLowerCase()
    if (["court", "pool", "studio", "ring", "facility"].some((item) => normalized.includes(item))) return "facility"
    if (["product", "gear", "item"].some((item) => normalized.includes(item))) return "product"
    return "service"
  }

  const { data: facilitiesRaw = [], mutate: mutateFacilities } = useSWR(
    activeBusinessId ? `/business/${activeBusinessId}/facilities` : null,
    async () => {
      const data = await facilitiesService.getAll({ businessId: activeBusinessId! })
      const list = Array.isArray(data) ? data : []
      return list.map((f: Record<string, unknown>) => ({
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
      })) as BusinessResource[]
    },
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: productsRaw = [], mutate: mutateProducts } = useSWR(
    activeBusinessId ? `/business/${activeBusinessId}/products` : null,
    async () => {
      const data = await marketplaceService.getAll({ sellerId: activeBusinessId! })
      const list = Array.isArray(data) ? data : []
      return list.map((p: Record<string, unknown>) => ({
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
      })) as BusinessResource[]
    },
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: servicesRaw = [], mutate: mutateServices } = useSWR(
    activeBusinessId ? `/business/${activeBusinessId}/services` : null,
    async () => {
      const data = await servicesService.getAll({ providerId: activeBusinessId! })
      const list = Array.isArray(data) ? data : []
      return list.map((s: Record<string, unknown>) => ({
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
      })) as BusinessResource[]
    },
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const facilities = facilitiesRaw
  const products = productsRaw
  const services = servicesRaw
  const loading = false

  const tabs: { key: ResourceType; label: string; count: number }[] = [
    { key: "facility", label: "Facilities", count: facilities.length },
    { key: "product", label: "Products", count: products.length },
    { key: "service", label: "Services", count: services.length },
  ]

  const activeResources = activeTab === "facility" ? facilities : activeTab === "product" ? products : services

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownResourceId) return
    const handler = () => setDropdownResourceId(null)
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [dropdownResourceId])

  const handleDeleteResource = async (resource?: BusinessResource) => {
    const target = resource
    if (!target) return
    const resType = target.resourceType

    try {
      if (resType === "facility") await facilitiesService.delete(target.id)
      else if (resType === "product") await marketplaceService.delete(target.id)
      else await servicesService.delete(target.id)
      toast.success(`${resType.charAt(0).toUpperCase() + resType.slice(1)} deleted successfully`)
    } catch {
      toast.error(`Failed to delete ${resType}`)
    }

    if (resType === "facility") mutateFacilities()
    else if (resType === "product") mutateProducts()
    else mutateServices()
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
          onClick={() => onNavigate("add-resource", activeTab)}
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



      {!loading && activeResources.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No {tabLabels[activeTab].toLowerCase()}s yet. Click &quot;Add {tabLabels[activeTab]}&quot; to create one.
          </p>
        </div>
      )}

      {!loading && <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {activeResources.map((resource) => (
          <div
            key={resource.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
            onClick={() => onNavigate("business-resource-detail", `${resource.resourceType}--${resource.id}`)}
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
                      onClick={() => { setDropdownResourceId(null); onNavigate("business-resource-detail", `${resource.resourceType}--${resource.id}`) }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => { setDropdownResourceId(null); onNavigate("edit-resource", `${resource.resourceType}--${resource.id}`) }}
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
      </div>}

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
        {[
          { id: "bp1", name: "SportMax", type: "Equipment Sponsor", avatar: "SM", tier: "Gold", sport: null, since: "2024" },
          { id: "bp2", name: "FitFuel", type: "Nutrition Partner", avatar: "FF", tier: "Silver", sport: null, since: "2023" },
          { id: "bp3", name: "ProCoach", type: "Training Partner", avatar: "PC", tier: null, sport: "Basketball", since: "2024" },
        ].map((partner: { id: string; name: string; type: string; avatar: string; tier: string | null; sport: string | null; since: string }) => (
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
              onPosterUpload={(fileOrUrl) => setTierPoster(typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl))}
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
              athletes={[
                { id: "a1", name: "Alex Johnson", sport: "Basketball", followers: 125000, ranking: "#12", avatar: "AJ", verified: true },
                { id: "a2", name: "Sam Lee", sport: "Tennis", followers: 89000, ranking: "#28", avatar: "SL", verified: true },
                { id: "a3", name: "Maria Gonzalez", sport: "Soccer", followers: 200000, ranking: "#5", avatar: "MG", verified: true },
              ]}
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
  const analyticsData = {
    totalRevenue: 33500,
    totalBookings: 425,
    totalCustomers: 1289,
    monthlyRevenue: [
      { month: "Jan", revenue: 4200 }, { month: "Feb", revenue: 5100 },
      { month: "Mar", revenue: 4800 }, { month: "Apr", revenue: 6300 },
      { month: "May", revenue: 5900 }, { month: "Jun", revenue: 7200 },
    ],
    topActivities: [
      { name: "Morning Yoga", bookings: 45, revenue: 1125 },
      { name: "Basketball Training", bookings: 32, revenue: 1600 },
      { name: "Tennis Session", bookings: 28, revenue: 1120 },
    ],
  }
  const data = analyticsData
  const maxRevenue = Math.max(...data.monthlyRevenue.map((d: { revenue: number }) => d.revenue))

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
