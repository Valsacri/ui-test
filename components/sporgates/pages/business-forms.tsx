"use client"

import { useEffect, useMemo, useState, useRef, useCallback } from "react"
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Upload,
  TrendingUp,
  BarChart3,
  Search,
  MoreHorizontal,
  Mail,
  QrCode,
  CheckCircle,
  XCircle,
  UserPlus,
  Shield,
  Star,
  Building2,
  Megaphone,
  Target,
  ImageIcon,
  Package,
  Edit3,
  Trash2,
  Eye,
  BadgeCheck,
  Check,
  Trophy,
  Wrench,
  X,
  Loader2,
  ChevronsUpDown,
} from "lucide-react"
import { toast } from "sonner"

import { QRScanner } from "@/components/sporgates/attendance/qr-scanner"
import { DateTimePicker } from "@/components/sporgates/date-time-picker"
import {
  CampaignCreateTour,
  CampaignTourHelpButton,
  CAMPAIGN_CREATE_TOUR_STEPS,
  useCampaignCreateTour,
} from "@/components/sporgates/campaign/campaign-create-tour"
import { CommunicationPhaseContent } from "@/components/sporgates/business/communication-phase-content"
import { MapView } from "@/components/sporgates/map-view"
import { SponsorshipTierBuilder, type SponsorshipTier } from "@/components/sporgates/business/sponsorship-tier-builder"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api-errors"
import { activitiesService } from "@/lib/services/activities"
import { businessesService } from "@/lib/services/businesses"
import { facilitiesService } from "@/lib/services/facilities"
import { marketplaceService } from "@/lib/services/marketplace"
import { servicesService } from "@/lib/services/services"
import { useBusinessContext } from "@/lib/business-context"
import { TourGuide, type TourStep, TourHelpButton, useTour } from "@/components/ui/tour-guide"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface BusinessFormPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

const sports = [
  { id: "basketball", name: "Basketball" },
  { id: "football", name: "Football" },
  { id: "tennis", name: "Tennis" },
  { id: "swimming", name: "Swimming" },
  { id: "soccer", name: "Soccer" },
  { id: "running", name: "Running" },
  { id: "volleyball", name: "Volleyball" },
  { id: "yoga", name: "Yoga" },
]

const experienceLevels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "professional", label: "Professional" },
]

// ==================== CreateActivity ====================
export function CreateActivityPage({ onNavigate }: BusinessFormPageProps) {
  const { activeBusinessId } = useBusinessContext()
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    type: "EVENT",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    capacity: 10,
    price: 0,
    description: "",
    sponsorship: false,
    sponsorBudget: 0,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateActivity = async () => {
    if (!formData.title.trim()) { setError("Activity title is required"); toast.error("Activity title is required"); return }
    if (!formData.sport) { setError("Please select a sport"); toast.error("Please select a sport"); return }
    if (!formData.date) { setError("Date is required"); toast.error("Date is required"); return }
    setSubmitting(true)
    setError(null)
    try {
      const startDateTime = formData.date && formData.startTime
        ? `${formData.date}T${formData.startTime}:00` : undefined
      const endDateTime = formData.date && formData.endTime
        ? `${formData.date}T${formData.endTime}:00` : undefined

      await activitiesService.create({
        name: formData.title,
        description: formData.description,
        sportId: formData.sport,
        type: formData.type,
        startDateTime,
        endDateTime,
        location: formData.location,
        maxParticipants: formData.capacity,
        pricePerPerson: formData.price,
        organizerId: activeBusinessId,
      })
      onNavigate("business-activities")
      toast.success("Activity created successfully!")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create activity"
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const estimatedReach = formData.capacity * 12
  const estimatedRevenue = formData.capacity * formData.price
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], [])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate("business-activities")} className="rounded-full p-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Activity</h1>
            <p className="text-sm text-muted-foreground">Set up a new sports activity or event</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("create-activity-steps")}
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Guided Builder
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Activity Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., 5v5 Basketball Pickup Game"
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Sport</label>
                  <Select
                    value={formData.sport}
                    onValueChange={(val) => setFormData({ ...formData, sport: val })}
                  >
                    <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sports.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EVENT">Event</SelectItem>
                      <SelectItem value="SESSION">Session</SelectItem>
                      <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                      <SelectItem value="COMPETITION">Competition</SelectItem>
                      <SelectItem value="EXPERIENCE">Experience</SelectItem>
                      <SelectItem value="ADVENTURE">Adventure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your activity..."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Cover Image</label>
                <div className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/40">
                  <div className="text-center">
                    <Upload className="mx-auto mb-1 h-6 w-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Click to upload image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Schedule & Location</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <DateTimePicker
                  label="Date"
                  type="date"
                  value={formData.date}
                  minDate={minDate}
                  onChange={(value) => setFormData({ ...formData, date: value })}
                />
                <DateTimePicker
                  label="Start"
                  type="time"
                  value={formData.startTime}
                  onChange={(value) => setFormData({ ...formData, startTime: value })}
                />
                <DateTimePicker
                  label="End"
                  type="time"
                  value={formData.endTime}
                  onChange={(value) => setFormData({ ...formData, endTime: value })}
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5" /> Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Chelsea Piers, NYC"
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Capacity & Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <Users className="h-3.5 w-3.5" /> Max Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <DollarSign className="h-3.5 w-3.5" /> Price per person
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Sponsorship Settings</h3>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, sponsorship: !formData.sponsorship })}
                className={`relative h-6 w-11 rounded-full transition-colors ${formData.sponsorship ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${formData.sponsorship ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            {formData.sponsorship && (
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-foreground">Sponsor Budget ($)</label>
                <input
                  type="number"
                  value={formData.sponsorBudget}
                  onChange={(e) => setFormData({ ...formData, sponsorBudget: parseInt(e.target.value) || 0 })}
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onNavigate("business-activities")}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateActivity}
              disabled={submitting}
              className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Activity"}
            </button>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>

        {/* Live Impact Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Live Impact Preview</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{estimatedReach.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Estimated Reach</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                  <DollarSign className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">${estimatedRevenue.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Estimated Revenue</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formData.capacity}</p>
                  <p className="text-[10px] text-muted-foreground">Max Participants</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Tips</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Add a compelling cover image to attract more participants</li>
              <li>Set a competitive price based on similar activities in your area</li>
              <li>Enable sponsorship to boost your reach and visibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== CreateActivitySteps ====================
const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  MAD: "MAD",
}

interface CreateActivityStepsPageProps extends BusinessFormPageProps {
  activityId?: string
}

export function CreateActivityStepsPage({ onNavigate, activityId }: CreateActivityStepsPageProps) {
  const CREATE_ACTIVITY_TOUR_STORAGE_KEY = "sporgates.createActivityTour.v1"
  const CREATE_ACTIVITY_TOUR_STEPS: TourStep[] = [
    {
      target: "header",
      title: "Create an activity (step-by-step)",
      body: "This wizard saves your activity as a draft while you fill it out. Use the steps at the top to move through info, schedule, location, resources, sponsorship, and review.",
    },
    {
      target: "stepper",
      title: "Step tracker",
      body: "Click completed steps to jump back and edit. The current step is highlighted so you always know where you are.",
    },
    {
      target: "content",
      title: "Fill in the details",
      body: "Complete the fields for the current step. Keep the title and description clear—this is what athletes will see when deciding to join.",
    },
    {
      target: "actions",
      title: "Save and continue",
      body: "Use Back/Next to move through steps, and save/publish from the review step when everything looks right.",
    },
  ]
  const { tourActive, hydrated, startTour, endTour } = useTour(CREATE_ACTIVITY_TOUR_STORAGE_KEY)

  const steps = [
    { id: 1, label: "Basic Info", icon: ImageIcon },
    { id: 2, label: "Schedule", icon: Calendar },
    { id: 3, label: "Location", icon: MapPin },
    { id: 4, label: "Resources", icon: Package },
    { id: 5, label: "Sponsorship", icon: Target },
    { id: 6, label: "Review", icon: CheckCircle },
  ]

  const { activeBusinessId, businesses } = useBusinessContext()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    type: "EVENT",
    level: "",
    description: "",
    location: {
      address: "",
      city: "",
      neighborhood: "",
      state: "",
      country: "",
      lat: 40.758,
      lng: -73.9855,
    },
    date: "",
    time: "",
    duration: 90,
    maxParticipants: 10,
    price: 0,
    currency: "USD",
    tags: "" as string,
    selectedResources: [] as string[],
    customTiers: [] as SponsorshipTier[],
    eventPoster: "",
    coverImage: "",
    visibility: "public",
    scheduleMode: "single" as "single" | "multiple",
    sessions: [] as Array<{ id: string; date: string; startTime: string; endTime: string }>,
    staffAssignments: [] as Array<{ id: string; roleType: string; userId?: string; userName: string; notes: string }>,
  })
  const [skipMapGeocode, setSkipMapGeocode] = useState(false)
  const minScheduleDate = useMemo(() => new Date().toISOString().split("T")[0], [])

  // Fetch activity if in Edit mode
  useEffect(() => {
    if (!activityId) return
    if (formData.title) return // Already loaded or edited
    const parseActivityDate = (dtValue: unknown): Date | null => {
      if (!dtValue) return null;
      // Handle array format [year, month, day, hour, minute] from Jackson
      if (Array.isArray(dtValue)) {
        const [y, m, d, h = 0, min = 0] = dtValue;
        const date = new Date(y, m - 1, d, h, min);
        return isNaN(date.getTime()) ? null : date;
      }
      // Handle ISO string
      const date = new Date(dtValue as string);
      return isNaN(date.getTime()) ? null : date;
    };

    const loadActivity = async () => {
      try {
        const activity = await activitiesService.getById(activityId)
        const startDate = parseActivityDate(activity.startDateTime);

        // Map backend sponsorship tiers to frontend SponsorshipTier shape
        const mappedTiers: SponsorshipTier[] = (activity.sponsorshipTiers || []).map(
          (t: { id?: string; name?: string; price?: number; description?: string }) => ({
            id: t.id || crypto.randomUUID(),
            name: t.name || "",
            price: t.price || 0,
            benefits: t.description ? t.description.split(",").map((s: string) => s.trim()) : [],
            logoPositions: [] as string[],
          })
        );

        // Set coverPreview if the activity already has a cover image
        if (activity.coverImage) {
          setCoverPreview(activity.coverImage);
        }

        setFormData({
          title: activity.name || "",
          sport: activity.sportId || "",
          type: activity.type || "EVENT",
          level: activity.difficultyLevel || "",
          description: activity.description || "",
          location: {
            address: activity.address || activity.location || "",
            city: activity.city || "",
            neighborhood: activity.neighborhood || activity.state || "",
            state: activity.state || "",
            country: activity.country || "",
            lat: activity.latitude || 40.758,
            lng: activity.longitude || -73.9855,
          },
          date: startDate ? startDate.toISOString().split('T')[0] : "",
          time: startDate
            ? startDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
            : "",
          duration: activity.duration || 90,
          maxParticipants: activity.maxParticipants || 20,
          price: activity.pricePerPerson || 0,
          currency: activity.currency || "USD",
          tags: Array.isArray(activity.tags) ? activity.tags.join(", ") : (activity.tags || ""),
          selectedResources: activity.resourceIds || [],
          customTiers: mappedTiers,
          eventPoster: activity.eventPoster || "",
          coverImage: activity.coverImage || "",
          visibility: "public",
          scheduleMode: (activity.sessions && activity.sessions.length > 0) ? "multiple" : "single",
          sessions: (activity.sessions || []).map((s: { id?: string; startDateTime?: unknown; endDateTime?: unknown }) => {
            const startD = parseActivityDate(s.startDateTime)
            const endD = parseActivityDate(s.endDateTime)
            return {
              id: s.id || crypto.randomUUID(),
              date: startD ? startD.toISOString().split("T")[0] : "",
              startTime: startD
                ? startD.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
                : "",
              endTime: endD
                ? endD.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
                : "",
            }
          }),
          staffAssignments: (activity.staffAssignments || []).map((sa: any) => ({
            id: sa.id || crypto.randomUUID(),
            roleType: sa.roleType || "",
            userId: sa.userId,
            userName: sa.userName || "",
            notes: sa.notes || "",
          })),
        })

        // Restore facility selection if the activity had one
        if (activity.facilityId) {
          setSelectedFacilityId(activity.facilityId)
          setLocationMode("facility")
        }
      } catch (err) {
        console.error("Failed to load activity", err)
        toast.error("Could not load activity details")
      }
    }
    loadActivity()
  }, [activityId])

  // Fetch real resources
  const [availableResources, setAvailableResources] = useState<any[]>([])
  const [loadingResources, setLoadingResources] = useState(false)
  const [resourceCategory, setResourceCategory] = useState<"all" | "facility" | "product" | "service">("all")
  const [resourceSearch, setResourceSearch] = useState("")

  useEffect(() => {
    const loadResources = async () => {
      if (!activeBusinessId) return
      setLoadingResources(true)
      try {
        const [facilities, products, services] = await Promise.all([
          facilitiesService.getAll({ businessId: activeBusinessId }),
          marketplaceService.getAll({ sellerId: activeBusinessId }),
          servicesService.getAll({ providerId: activeBusinessId })
        ])

        const combined = [
          ...(Array.isArray(facilities) ? facilities.map((f: any) => ({ ...f, resourceType: "facility", type: "Facility" })) : []),
          ...(Array.isArray(products) ? products.map((p: any) => ({ ...p, resourceType: "product", type: "Product" })) : []),
          ...(Array.isArray(services) ? services.map((s: any) => ({ ...s, resourceType: "service", type: "Service" })) : [])
        ]
        setAvailableResources(combined)
      } catch (e) {
        console.error("Failed to load resources", e)
      } finally {
        setLoadingResources(false)
      }
    }
    loadResources()
  }, [activeBusinessId])

  // Fetch available facilities for activity sessions (Location step)
  const [availableFacilities, setAvailableFacilities] = useState<any[]>([])
  const [loadingFacilities, setLoadingFacilities] = useState(false)
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null)
  const [locationMode, setLocationMode] = useState<"facility" | "custom">("custom")

  useEffect(() => {
    if (currentStep !== 3) return
    const hasSessionRanges = formData.scheduleMode === "multiple" && formData.sessions.length > 0
      && formData.sessions.every(s => s.date && s.startTime && s.endTime)
    const hasSingleRange = formData.scheduleMode === "single" && formData.date && formData.time && formData.duration > 0

    if (!hasSessionRanges && !hasSingleRange) {
      // No time ranges yet — fetch all facilities so the user can still choose
      const fetchAll = async () => {
        setLoadingFacilities(true)
        try {
          const result = await facilitiesService.getAll()
          setAvailableFacilities(Array.isArray(result) ? result : [])
        } catch {
          setAvailableFacilities([])
        } finally {
          setLoadingFacilities(false)
        }
      }
      fetchAll()
      return
    }

    const fetchFacilities = async () => {
      setLoadingFacilities(true)
      try {
        let ranges: Array<{ startDateTime: string; endDateTime: string }> = []
        if (hasSessionRanges) {
          ranges = formData.sessions.map(s => ({
            startDateTime: `${s.date}T${s.startTime}:00`,
            endDateTime: `${s.date}T${s.endTime}:00`,
          }))
        } else if (hasSingleRange) {
          const startDt = `${formData.date}T${formData.time}:00`
          const endDate = new Date(new Date(startDt).getTime() + formData.duration * 60000)
          ranges = [{ startDateTime: startDt, endDateTime: endDate.toISOString().slice(0, 19) }]
        }
        const result = await facilitiesService.getAvailableForSlots({ ranges })
        setAvailableFacilities(Array.isArray(result) ? result : [])
      } catch (err) {
        console.error("Failed to fetch available facilities", err)
        setAvailableFacilities([])
      } finally {
        setLoadingFacilities(false)
      }
    }
    fetchFacilities()
  }, [currentStep])



  const toggleResource = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedResources: prev.selectedResources.includes(id)
        ? prev.selectedResources.filter((item) => item !== id)
        : [...prev.selectedResources, id],
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.sport && formData.level
      case 2:
        if (formData.scheduleMode === "multiple") {
          return formData.sessions.length > 0 && formData.sessions.every(s => s.date && s.startTime && s.endTime)
        }
        return formData.date && formData.time
      case 3:
        return formData.location.address && formData.location.city
      default:
        return true
    }
  }

  const parseLocalDateTime = (dateStr: string, timeStr: string) => {
    // Avoid Date parsing timezone quirks: construct as local time.
    // Expected inputs: dateStr = "YYYY-MM-DD", timeStr = "HH:mm" (or "HH:mm:ss").
    const [y, m, d] = dateStr.split("-").map((x) => Number(x))
    const [hh, mm, ss] = timeStr.split(":").map((x) => Number(x))
    return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, ss || 0, 0)
  }

  const handleNext = () => {
    if (!canProceed()) return

    if (currentStep === 2) {
      const now = new Date()
      // Small grace window so "this minute" doesn't fail due to seconds.
      const minFutureMs = 30 * 1000
      if (formData.scheduleMode === "single") {
        if (!formData.date || !formData.time) return
        const startDateTime = parseLocalDateTime(formData.date, `${formData.time}:00`)
        if (startDateTime < now) {
          toast.error("Activity start time must be in the future")
          return
        }
        if (formData.duration <= 0) {
          toast.error("Duration must be greater than 0")
          return
        }
        const endDateTime = new Date(startDateTime.getTime() + formData.duration * 60000)
        if (endDateTime < now) {
          toast.error("Activity end time must be in the future")
          return
        }
        if (endDateTime <= startDateTime) {
          toast.error("End time must be after start time")
          return
        }
        if (startDateTime.getTime() < now.getTime() + minFutureMs) {
          toast.error("Start time must be at least 1 minute from now")
          return
        }
      } else {
        if (formData.sessions.length === 0) {
          toast.error("Add at least one session")
          return
        }
        // Validate each session (future + end-after-start) before allowing the user to proceed.
        for (let i = 0; i < formData.sessions.length; i++) {
          const s = formData.sessions[i]
          if (!s?.date || !s?.startTime || !s?.endTime) {
            toast.error(`Session ${i + 1}: date and times are required`)
            return
          }
          const start = parseLocalDateTime(s.date, `${s.startTime}:00`)
          const end = parseLocalDateTime(s.date, `${s.endTime}:00`)
          if (start < now) {
            toast.error(`Session ${i + 1}: start time must be in the future`)
            return
          }
          if (end < now) {
            toast.error(`Session ${i + 1}: end time must be in the future`)
            return
          }
          if (end <= start) {
            toast.error(`Session ${i + 1}: end time must be after start time`)
            return
          }
          if (start.getTime() < now.getTime() + minFutureMs) {
            toast.error(`Session ${i + 1}: start time must be at least 1 minute from now`)
            return
          }
        }
      }
      if (formData.maxParticipants <= 0) {
        toast.error("Max participants must be greater than 0")
        return
      }
      if (formData.price < 0) {
        toast.error("Price cannot be negative")
        return
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }

  const handleBack = () => {
    if (currentStep === 1) {
      onNavigate("business-activities")
      return
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    const objectUrl = URL.createObjectURL(file)
    setCoverPreview(objectUrl)
  }

  const estimatedReach = useMemo(() => {
    // Base reach from participants + multiplier for social sharing
    return formData.maxParticipants * 15
  }, [formData.maxParticipants])

  const estimatedRevenue = useMemo(() => {
    const ticketRevenue = formData.maxParticipants * formData.price
    const sponsorshipRevenue = formData.customTiers.reduce((acc, tier) => acc + (tier.price || 0), 0)
    return ticketRevenue + sponsorshipRevenue
  }, [formData.maxParticipants, formData.price, formData.customTiers])

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError("")
    try {
      // Compute startDateTime / endDateTime
      let startDateTime: string | undefined = undefined
      let endDateTime: string | undefined = undefined

      if (formData.scheduleMode === "multiple" && formData.sessions.length > 0) {
        // Use first session as primary start/end
        const firstSession = formData.sessions[0]
        startDateTime = `${firstSession.date}T${firstSession.startTime}:00`
        endDateTime = `${firstSession.date}T${firstSession.endTime}:00`
      } else if (formData.date && formData.time) {
        startDateTime = `${formData.date}T${formData.time}:00`
        if (formData.duration) {
          const startDate = new Date(startDateTime)
          const endDate = new Date(startDate.getTime() + formData.duration * 60000)
          endDateTime = endDate.toISOString().slice(0, 19)
        }
      }

      // Frontend guardrails (mirror backend validation): start/end must be in the future.
      const now = new Date()
      if (startDateTime) {
        const start = parseLocalDateTime(startDateTime.slice(0, 10), startDateTime.slice(11, 19))
        if (start < now) {
          toast.error("Activity start time must be in the future")
          return
        }
      }
      if (endDateTime) {
        const end = parseLocalDateTime(endDateTime.slice(0, 10), endDateTime.slice(11, 19))
        if (end < now) {
          toast.error("Activity end time must be in the future")
          return
        }
      }
      if (startDateTime && endDateTime) {
        const start = parseLocalDateTime(startDateTime.slice(0, 10), startDateTime.slice(11, 19))
        const end = parseLocalDateTime(endDateTime.slice(0, 10), endDateTime.slice(11, 19))
        if (end <= start) {
          toast.error("End time must be after start time")
          return
        }
      }

      // Use facility from Location step (selectedFacilityId) or from selected resources
      const facilityId = selectedFacilityId
        || availableResources.filter(r => r.resourceType === 'facility' && formData.selectedResources.includes(r.id))[0]?.id
        || undefined

      const currentBusiness = businesses.find(b => b.id === activeBusinessId)

      // Upload cover image if selected
      let coverImageUrl = undefined
      if (coverFile) {
        setUploadingCover(true)
        try {
          const uploadResult = await activitiesService.uploadCover(coverFile)
          coverImageUrl = uploadResult.url
        } finally {
          setUploadingCover(false)
        }
      }

      const payload = {
        name: formData.title,
        sportId: formData.sport,
        type: formData.type,
        difficultyLevel: formData.level,
        description: formData.description,
        location: formData.location.address,
        address: formData.location.address,
        city: formData.location.city,
        neighborhood: formData.location.neighborhood,
        state: formData.location.state || "NY",
        country: formData.location.country || "US",
        latitude: formData.location.lat,
        longitude: formData.location.lng,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        maxParticipants: formData.maxParticipants,
        pricePerPerson: formData.price,
        currency: formData.currency,
        tags: formData.tags ? formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        coverImage: coverImageUrl || formData.coverImage,
        organizerId: activeBusinessId,
        organizerName: currentBusiness?.name || "",
        facilityId: facilityId,
        resourceIds: formData.selectedResources,
        sessions: formData.scheduleMode === "multiple" ? formData.sessions.map(s => ({
          startDateTime: `${s.date}T${s.startTime}:00`,
          endDateTime: `${s.date}T${s.endTime}:00`,
        })) : undefined,
        staffAssignments: formData.staffAssignments.length > 0 ? formData.staffAssignments.map(sa => ({
          id: sa.id,
          roleType: sa.roleType,
          userId: sa.userId || null,
          userName: sa.userName,
          notes: sa.notes,
        })) : undefined,
        sponsorshipTiers: formData.customTiers.map(t => ({
          id: t.id,
          name: t.name,
          price: t.price,
          description: (t.benefits || []).join(", "),
          includedVisibility: (t.logoPositions || []).length > 0,
        })),
        eventPoster: formData.eventPoster,
        visibility: formData.visibility.toUpperCase(),
      }

      if (activityId) {
        await activitiesService.update(activityId, payload)
        toast.success("Activity updated successfully!")
      } else {
        await activitiesService.create(payload)
        toast.success("Activity saved as draft. Publish it from your activities list when you are ready.")
      }
      onNavigate("business-activities")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save activity"
      setSubmitError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {hydrated && (
        <TourGuide
          active={tourActive}
          steps={CREATE_ACTIVITY_TOUR_STEPS}
          onClose={endTour}
          storageKey={CREATE_ACTIVITY_TOUR_STORAGE_KEY}
          targetAttribute="data-tour"
        />
      )}
      <div className="flex items-center gap-3 mb-6" data-tour="header">
        <button type="button" onClick={handleBack} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-foreground">{activityId ? "Edit Activity" : "Create New Activity"}</h1>
          <p className="text-xs text-muted-foreground">{activityId ? "Update your activity details" : "Follow the steps to create your event (saved as draft until you publish)"}</p>
        </div>
        <TourHelpButton onClick={startTour} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3" data-tour="content">
        <div className="space-y-6 lg:col-span-2">
          {/* Stepper */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-8 relative overflow-hidden" data-tour="stepper">
            <div className="absolute top-[45px] left-0 w-full h-[2px] bg-border/50 z-0" />
            <div className="relative z-10 flex justify-between w-full px-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = currentStep > step.id
                const isCurrent = currentStep === step.id

                return (
                  <div key={step.id} className="flex flex-col items-center group cursor-pointer lg:w-20" onClick={() => (isCompleted || isCurrent) ? setCurrentStep(step.id) : null}>
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-card z-10",
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground shadow-md scale-105"
                          : isCurrent
                            ? "border-primary text-primary shadow-[0_0_0_4px_rgba(59,130,246,0.1)] scale-110"
                            : "border-border text-muted-foreground group-hover:border-primary/50"
                      )}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span
                      className={cn(
                        "mt-3 text-[10px] uppercase font-bold tracking-wider transition-colors duration-300 bg-card px-2 rounded-full text-center whitespace-nowrap",
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {currentStep === 1 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-6 text-base font-bold text-foreground">Basic Information</h3>
              <div className="space-y-6">

                {/* Activity Title */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Activity Title</label>
                  <input
                    value={formData.title}
                    onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                    placeholder="e.g., Summer Basketball League 2024"
                    className="h-12 w-full rounded-xl border border-border bg-muted/50 px-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Activity Type */}
                <div>
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Activity Type</label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                      { id: "EVENT", label: "Event", icon: Calendar, desc: "One-time" },
                      { id: "SESSION", label: "Session", icon: Users, desc: "Recurring" },
                      { id: "COMPETITION", label: "Competition", icon: Target, desc: "Multi-day" },
                      { id: "TOURNAMENT", label: "Tournament", icon: Trophy, desc: "Competitive" },
                    ].map((type) => {
                      const Icon = type.icon
                      const isSelected = formData.type === type.id
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.id })}
                          className={cn(
                            "group flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all duration-200 hover:border-primary/50 hover:bg-muted/50",
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                              : "border-border bg-card"
                          )}
                        >
                          <div className={cn(
                            "mb-3 flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                            isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className={cn("text-xs font-bold", isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>{type.label}</span>
                          <span className="mt-1 text-[10px] text-muted-foreground/80">{type.desc}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Sport & Level */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sport</label>
                    <Select
                      value={formData.sport}
                      onValueChange={(val) => setFormData({ ...formData, sport: val })}
                    >
                      <SelectTrigger className="h-12 w-full rounded-xl border border-border bg-muted/50 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10">
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {sports.map((sport) => (
                          <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skill Level</label>
                    <Select
                      value={formData.level}
                      onValueChange={(val) => setFormData({ ...formData, level: val })}
                    >
                      <SelectTrigger className="h-12 w-full rounded-xl border border-border bg-muted/50 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level.id} value={level.id}>{level.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                    rows={4}
                    placeholder="Tell participants what to expect regarding the atmosphere, rules, and vibe."
                    className="w-full rounded-xl border border-border bg-muted/50 p-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tags</label>
                  <div className="relative">
                    <input
                      value={formData.tags}
                      onChange={(event) => setFormData({ ...formData, tags: event.target.value })}
                      placeholder="e.g., outdoor, competitive, beginner-friendly"
                      className="h-12 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                    />
                    <BadgeCheck className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-foreground">Separate tags with commas</p>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cover Image</label>
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/30 transition-all hover:border-primary/50 hover:bg-muted/50">
                    {coverPreview ? (
                      <div className="relative h-48 w-full">
                        <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            className="rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-xs font-bold text-white hover:bg-white/30"
                          >
                            Change Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="flex h-48 w-full flex-col items-center justify-center p-6 text-center"
                      >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">Click to upload cover image</p>
                        <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
          }

          {
            currentStep === 2 && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-foreground">Schedule</h3>
                <div className="space-y-4">
                  {/* Schedule Mode Toggle */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-foreground">Schedule Mode</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, scheduleMode: "single" })}
                        className={cn(
                          "rounded-xl border px-4 py-2 text-xs font-semibold transition-colors",
                          formData.scheduleMode === "single"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        Single Session
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, scheduleMode: "multiple" })}
                        className={cn(
                          "rounded-xl border px-4 py-2 text-xs font-semibold transition-colors",
                          formData.scheduleMode === "multiple"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        Multiple Sessions
                      </button>
                    </div>
                  </div>

                  {formData.scheduleMode === "single" ? (
                    /* Single session - original fields */
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <DateTimePicker
                          label="Date"
                          type="date"
                          value={formData.date}
                          onChange={(value) => setFormData({ ...formData, date: value })}
                          minDate={minScheduleDate}
                        />
                        <DateTimePicker
                          label="Start Time"
                          type="time"
                          value={formData.time}
                          onChange={(value) => setFormData({ ...formData, time: value })}
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-foreground">Duration (minutes)</label>
                          <input
                            type="number"
                            value={formData.duration}
                            onChange={(event) => setFormData({ ...formData, duration: Number(event.target.value) || 0 })}
                            className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-foreground">Max Participants</label>
                          <input
                            type="number"
                            value={formData.maxParticipants}
                            onChange={(event) => setFormData({ ...formData, maxParticipants: Number(event.target.value) || 0 })}
                            className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Multiple sessions */
                    <>
                      <div className="space-y-3">
                        {formData.sessions.map((session, idx) => (
                          <div key={session.id} className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3">
                            <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{idx + 1}</span>
                            <div className="grid flex-1 gap-2 sm:grid-cols-3">
                              <DateTimePicker
                                label="Date"
                                type="date"
                                value={session.date}
                                minDate={minScheduleDate}
                                onChange={(value) => {
                                  const updated = [...formData.sessions]
                                  updated[idx] = { ...updated[idx], date: value }
                                  setFormData({ ...formData, sessions: updated })
                                }}
                                id={`session-${session.id}-date`}
                              />
                              <DateTimePicker
                                label="Start"
                                type="time"
                                value={session.startTime}
                                onChange={(value) => {
                                  const updated = [...formData.sessions]
                                  updated[idx] = { ...updated[idx], startTime: value }
                                  setFormData({ ...formData, sessions: updated })
                                }}
                                id={`session-${session.id}-start`}
                              />
                              <DateTimePicker
                                label="End"
                                type="time"
                                value={session.endTime}
                                onChange={(value) => {
                                  const updated = [...formData.sessions]
                                  updated[idx] = { ...updated[idx], endTime: value }
                                  setFormData({ ...formData, sessions: updated })
                                }}
                                id={`session-${session.id}-end`}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, sessions: formData.sessions.filter((_, i) => i !== idx) })}
                              className="mt-1 rounded-full p-1 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            sessions: [...formData.sessions, { id: crypto.randomUUID(), date: "", startTime: "", endTime: "" }]
                          })}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 py-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
                        >
                          <Plus className="h-4 w-4" />
                          Add Session
                        </button>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-foreground">Max Participants (applies to all sessions)</label>
                        <input
                          type="number"
                          value={formData.maxParticipants}
                          onChange={(event) => setFormData({ ...formData, maxParticipants: Number(event.target.value) || 0 })}
                          className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Price per participant</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(event) => setFormData({ ...formData, price: Number(event.target.value) || 0 })}
                        className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Currency</label>
                      <Select
                        value={formData.currency}
                        onValueChange={(val) => setFormData({ ...formData, currency: val })}
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="MAD">MAD (د.م.)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          {
            currentStep === 3 && (
              <div className="space-y-4">
                {/* Available Facilities Picker */}
                {(availableFacilities.length > 0 || loadingFacilities) && (
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-bold text-foreground">Available Facilities</h3>
                    <p className="mb-4 text-xs text-muted-foreground">These facilities are available for your scheduled time slots. Select one to use its location.</p>
                    {loadingFacilities ? (
                      <div className="py-6 text-center text-xs text-muted-foreground">Checking facility availability...</div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2">
                        {availableFacilities.map((f: any) => {
                          const isSelected = selectedFacilityId === f.id
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedFacilityId(null)
                                  setLocationMode("custom")
                                  return
                                }
                                setSelectedFacilityId(f.id)
                                setLocationMode("facility")
                                setSkipMapGeocode(true)
                                setFormData(prev => ({
                                  ...prev,
                                  location: {
                                    address: f.address || f.location || prev.location.address,
                                    city: f.city || prev.location.city,
                                    neighborhood: f.neighborhood || prev.location.neighborhood,
                                    state: f.state || prev.location.state,
                                    country: f.country || prev.location.country,
                                    lat: f.latitude || prev.location.lat,
                                    lng: f.longitude || prev.location.lng,
                                  },
                                }))
                              }}
                              className={cn(
                                "flex items-center gap-3 rounded-2xl border p-3 text-left transition-all hover:border-primary/50",
                                isSelected
                                  ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                                  : "border-border bg-card"
                              )}
                            >
                              <img
                                src={f.coverImage || f.image || "/placeholder.svg"}
                                alt={f.name}
                                className="h-12 w-12 rounded-xl object-cover bg-muted"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{f.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{f.address || f.location}</p>
                                {f.pricePerHour != null && (
                                  <p className="mt-0.5 text-xs font-medium text-primary">${f.pricePerHour}/hr</p>
                                )}
                              </div>
                              {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Location / Custom Location */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-foreground">
                      {locationMode === "facility" ? "Facility Location" : "Location Details"}
                    </h3>
                    {selectedFacilityId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFacilityId(null)
                          setLocationMode("custom")
                        }}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Use custom location instead
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Address</label>
                      <input
                        value={formData.location.address}
                        onChange={(event) => {
                          setSkipMapGeocode(false)
                          setSelectedFacilityId(null)
                          setLocationMode("custom")
                          setFormData({
                            ...formData,
                            location: { ...formData.location, address: event.target.value },
                          })
                        }}
                        placeholder="Venue address"
                        className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-foreground">City</label>
                        <input
                          value={formData.location.city}
                          onChange={(event) => {
                            setSkipMapGeocode(false)
                            setSelectedFacilityId(null)
                            setLocationMode("custom")
                            setFormData({
                              ...formData,
                              location: { ...formData.location, city: event.target.value },
                            })
                          }}
                          placeholder="e.g. New York"
                          className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-blue-50/50 px-3 py-2 text-xs text-blue-600/80 border border-blue-100">
                      <MapPin className="h-3.5 w-3.5" />
                      <p>You can drag the map marker to pinpoint the exact location.</p>
                    </div>
                    <MapView
                      center={[formData.location.lat, formData.location.lng]}
                      markerLabel={formData.location.address || "Select a location"}
                      height="220px"
                      addressQuery={locationMode === "custom" ? [formData.location.address, formData.location.city].filter(Boolean).join(", ") : undefined}
                      onLocationSelect={(lat, lng) =>
                        setFormData({
                          ...formData,
                          location: { ...formData.location, lat, lng }
                        })
                      }
                      skipGeocode={skipMapGeocode || locationMode === "facility"}
                      onAddressFound={(address, source) => {
                        if (!address) return
                        setSkipMapGeocode(true)
                        setFormData(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            address: source === 'map'
                              ? [address.house_number, address.road].filter(Boolean).join(" ")
                              : prev.location.address,
                            city: address.city || address.town || address.village || address.county || prev.location.city,
                            neighborhood: address.suburb || address.neighbourhood || prev.location.neighborhood,
                            state: address.state || prev.location.state,
                            country: address.country_code?.toUpperCase() || prev.location.country,
                          }
                        }))
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          }

          {
            currentStep === 4 && (
              <>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold text-foreground">Select Resources</h3>

                  {/* Resource Controls */}
                  <div className="mb-4 space-y-3">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {[
                        { id: "all", label: "All" },
                        { id: "product", label: "Products" },
                        { id: "service", label: "Services" },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setResourceCategory(cat.id as any)}
                          className={cn(
                            "whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                            resourceCategory === cat.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={resourceSearch}
                        onChange={(e) => setResourceSearch(e.target.value)}
                        placeholder="Search resources..."
                        className="h-10 w-full rounded-xl border border-border bg-muted pl-9 pr-4 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {loadingResources ? (
                      <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">Loading resources...</div>
                    ) : availableResources.length === 0 ? (
                      <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">No resources found. Create facilities or products first.</div>
                    ) : (
                      availableResources
                        .filter(r => {
                          if (r.resourceType === "facility") return false
                          const matchesCategory = resourceCategory === "all" || r.resourceType === resourceCategory
                          const matchesSearch = r.name.toLowerCase().includes(resourceSearch.toLowerCase())
                          return matchesCategory && matchesSearch
                        })
                        .map((resource) => {
                          const selected = formData.selectedResources.includes(resource.id)
                          return (
                            <button
                              key={resource.id}
                              type="button"
                              onClick={() => toggleResource(resource.id)}
                              className={cn(
                                "flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-all hover:border-primary/50",
                                selected && "border-secondary bg-secondary/5 ring-1 ring-secondary"
                              )}
                            >
                              <img
                                src={resource.image || resource.coverImage || "/placeholder.svg"}
                                alt={resource.name}
                                className="h-12 w-12 rounded-xl object-cover bg-muted"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <p className="text-sm font-semibold text-foreground truncate max-w-[120px]">{resource.name}</p>
                                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground capitalize">{resource.resourceType}</span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{resource.description}</p>
                                <p className="mt-1 text-xs font-medium text-primary">
                                  {resource.resourceType === 'facility' && resource.pricePerHour ? `$${resource.pricePerHour}/hr` :
                                    resource.price ? `$${resource.price}` : 'Free'}
                                </p>
                              </div>
                              {selected && <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />}
                            </button>
                          )
                        })
                    )}
                  </div>
                </div>

                {/* Human Resources / Staff Section */}
                <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="mb-3 text-sm font-bold text-foreground">Staff & Human Resources</h3>
                  <p className="mb-4 text-xs text-muted-foreground">Assign roles like Referee, Coach, or Photographer to your event.</p>
                  <div className="space-y-3">
                    {formData.staffAssignments.map((staff, idx) => (
                      <div key={staff.id} className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3">
                        <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">{idx + 1}</span>
                        <div className="grid flex-1 gap-2 sm:grid-cols-3">
                          <Select
                            value={staff.roleType}
                            onValueChange={(val) => {
                              const updated = [...formData.staffAssignments]
                              updated[idx] = { ...updated[idx], roleType: val }
                              setFormData({ ...formData, staffAssignments: updated })
                            }}
                          >
                            <SelectTrigger className="h-9 rounded-lg border border-border bg-muted text-xs">
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                { value: "REFEREE", label: "Referee" },
                                { value: "COACH", label: "Coach" },
                                { value: "STAFF", label: "Staff" },
                                { value: "FIRST_AID", label: "First Aid" },
                                { value: "EQUIPMENT_MANAGER", label: "Equipment Manager" },
                                { value: "SCOREKEEPER", label: "Scorekeeper" },
                                { value: "TIMEKEEPER", label: "Timekeeper" },
                                { value: "PHOTOGRAPHER", label: "Photographer" },
                                { value: "SECURITY", label: "Security" },
                                { value: "MEDICAL", label: "Medical" },
                                { value: "VOLUNTEER", label: "Volunteer" },
                              ].map(role => (
                                <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <input
                            type="text"
                            value={staff.userName}
                            onChange={(e) => {
                              const updated = [...formData.staffAssignments]
                              updated[idx] = { ...updated[idx], userName: e.target.value }
                              setFormData({ ...formData, staffAssignments: updated })
                            }}
                            placeholder="Name (optional)"
                            className="h-9 rounded-lg border border-border bg-muted px-3 text-xs outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={staff.notes}
                            onChange={(e) => {
                              const updated = [...formData.staffAssignments]
                              updated[idx] = { ...updated[idx], notes: e.target.value }
                              setFormData({ ...formData, staffAssignments: updated })
                            }}
                            placeholder="Notes"
                            className="h-9 rounded-lg border border-border bg-muted px-3 text-xs outline-none focus:border-primary"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, staffAssignments: formData.staffAssignments.filter((_, i) => i !== idx) })}
                          className="mt-1 rounded-full p-1 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        staffAssignments: [...formData.staffAssignments, { id: crypto.randomUUID(), roleType: "", userName: "", notes: "" }]
                      })}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-secondary/40 py-3 text-xs font-semibold text-secondary transition-colors hover:bg-secondary/5"
                    >
                      <Plus className="h-4 w-4" />
                      Add Staff Member
                    </button>
                  </div>
                </div>
              </>
            )
          }

          {
            currentStep === 5 && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="mb-2 text-sm font-bold text-foreground">Sponsorship Packages</h3>
                  <p className="text-xs text-muted-foreground">Create tiered packages for event sponsors.</p>
                </div>
                <SponsorshipTierBuilder
                  tiers={formData.customTiers}
                  onChange={(tiers) => setFormData({ ...formData, customTiers: tiers })}
                  eventPoster={formData.eventPoster}
                  onPosterUpload={async (fileOrUrl) => {
                    if (typeof fileOrUrl === 'string') {
                      setFormData(prev => ({ ...prev, eventPoster: fileOrUrl }))
                      return
                    }

                    try {
                      const response = await activitiesService.uploadCover(fileOrUrl)
                      setFormData(prev => ({ ...prev, eventPoster: response.url }))
                      toast.success("Poster uploaded successfully")
                    } catch (error) {
                      console.error("Failed to upload poster:", error)
                      toast.error("Failed to upload poster. Please try again.")
                    }
                  }}
                />
              </div>
            )
          }

          {
            currentStep === 6 && (
              <div className="space-y-5 animate-fade-in">
                {/* Hero Banner */}
                <div className="rounded-2xl overflow-hidden shadow-lg border border-border">
                  <div className="h-56 relative">
                    {/* Background */}
                    {coverPreview ? (
                      <img src={coverPreview} className="absolute inset-0 w-full h-full object-cover" alt="Cover" />
                    ) : formData.eventPoster ? (
                      <img src={formData.eventPoster} className="absolute inset-0 w-full h-full object-cover blur-sm scale-105" alt="Background" />
                    ) : (
                      <div className="absolute inset-0 gradient-hero" />
                    )}
                    {/* Navy gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003C66] via-[#003C66]/60 to-[#003C66]/20" />

                    {/* Event Poster Inset */}
                    {formData.eventPoster && (
                      <div className="absolute top-4 right-4 z-10 w-20 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 ring-1 ring-white/10">
                        <img src={formData.eventPoster} className="w-full h-full object-cover" alt="Poster" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <div className="flex gap-2 mb-3">
                        {formData.type && (
                          <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-[10px] uppercase font-bold text-white/90 border border-white/10 tracking-wider">
                            {formData.type}
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-lg bg-[#FC8936]/25 backdrop-blur-sm text-[10px] uppercase font-bold text-orange-100 border border-[#FC8936]/20 tracking-wider">
                          {sports.find(s => s.id === formData.sport)?.name || "Unspecified Sport"}
                        </span>
                        {formData.visibility && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-sm text-[10px] uppercase font-bold text-emerald-100 border border-emerald-400/20 tracking-wider">
                            {formData.visibility}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg leading-tight">{formData.title || "Untitled Activity"}</h3>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{formData.date || "Not set"}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">at {formData.time || "—"}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-xl gradient-secondary flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{formData.duration} min</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Duration</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{formData.price > 0 ? `${formData.price} ${formData.currency}` : "Free"}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Per person</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-xl bg-[#005A99] flex items-center justify-center mx-auto mb-2">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{formData.maxParticipants}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Max Participants</p>
                  </div>
                </div>

                {/* Location Card with Map */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="gradient-primary px-5 py-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                      <MapPin className="w-4 h-4" />
                      Location
                    </h4>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">{formData.location.address || "Not set"}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formData.location.city || "City not specified"}</p>
                      </div>
                      {formData.location.lat !== 0 && formData.location.lng !== 0 && (
                        <span className="text-[10px] font-bold gradient-primary text-white px-2.5 py-1 rounded-full shrink-0">
                          📍 GPS Set
                        </span>
                      )}
                    </div>
                    {formData.location.lat !== 0 && formData.location.lng !== 0 && (
                      <div className="rounded-xl overflow-hidden border border-border">
                        <MapView
                          center={[formData.location.lat, formData.location.lng]}
                          markerLabel={formData.location.address || "Activity Location"}
                          height="180px"
                          skipGeocode
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="gradient-primary px-5 py-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                      <TrendingUp className="w-4 h-4" />
                      Financial Projection
                    </h4>
                  </div>
                  <div className="p-5 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{currencySymbols[formData.currency] || formData.currency}{estimatedRevenue.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">Estimated Revenue</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{estimatedReach.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">Estimated Reach</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Edit3 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    About This Activity
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground bg-muted/20 p-4 rounded-xl border border-border/50">
                    {formData.description || "No description provided."}
                  </p>
                  {formData.tags && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.tags.split(",").filter(Boolean).map((tag, index) => (
                        <span key={`${tag}-${index}`} className="text-[10px] px-2.5 py-1 rounded-lg bg-primary/8 border border-primary/15 text-primary font-semibold">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resources & Sponsorship */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Resources */}
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-3.5 h-3.5 text-primary" />
                        </div>
                        Resources
                      </h4>
                      <span className="text-[10px] font-bold gradient-primary text-white px-2.5 py-1 rounded-full">{formData.selectedResources.length} Selected</span>
                    </div>
                    {formData.selectedResources.length > 0 ? (
                      <div className="space-y-2">
                        {availableResources
                          .filter(r => formData.selectedResources.includes(r.id))
                          .slice(0, 3)
                          .map(r => (
                            <div key={r.id} className="text-xs flex items-center gap-2.5 text-foreground bg-muted/30 p-2.5 rounded-xl border border-border/50">
                              <div className="w-2 h-2 rounded-full gradient-primary shrink-0" />
                              <span className="truncate flex-1 font-medium">{r.name}</span>
                            </div>
                          ))
                        }
                        {formData.selectedResources.length > 3 && (
                          <p className="text-[10px] font-medium text-muted-foreground pl-1">+ {formData.selectedResources.length - 3} more resources</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-muted/20 rounded-xl border border-dashed border-border">
                        <Package className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No resources added</p>
                      </div>
                    )}
                  </div>

                  {/* Sponsorship */}
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                        <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Target className="w-3.5 h-3.5 text-secondary" />
                        </div>
                        Sponsorship
                      </h4>
                      <span className="text-[10px] font-bold gradient-secondary text-white px-2.5 py-1 rounded-full">{formData.customTiers.length} Tiers</span>
                    </div>
                    {formData.customTiers.length > 0 ? (
                      <div className="space-y-2">
                        {formData.customTiers.map(t => {
                          const tierColor = t.name.toLowerCase().includes('gold')
                            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700'
                            : t.name.toLowerCase().includes('silver')
                              ? 'bg-slate-200/50 border-slate-300/50 text-slate-600'
                              : t.name.toLowerCase().includes('bronze')
                                ? 'bg-orange-500/10 border-orange-500/20 text-orange-700'
                                : 'bg-primary/5 border-primary/15 text-primary';
                          return (
                            <div key={t.id} className={`text-xs px-3 py-2.5 rounded-xl border flex items-center justify-between ${tierColor}`}>
                              <div className="flex items-center gap-2 font-semibold">
                                <span className={`w-2 h-2 rounded-full ${t.name.toLowerCase().includes('gold') ? 'bg-yellow-500' :
                                  t.name.toLowerCase().includes('silver') ? 'bg-slate-400' :
                                    t.name.toLowerCase().includes('bronze') ? 'bg-orange-500' : 'bg-primary'
                                  }`} />
                                {t.name}
                              </div>
                              <span className="font-bold">${t.price}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-muted/20 rounded-xl border border-dashed border-border">
                        <Target className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No sponsorship tiers</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Staff & Human Resources */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="gradient-secondary px-5 py-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                      <Shield className="w-4 h-4" />
                      Staff & Human Resources
                    </h4>
                  </div>
                  <div className="p-5">
                    {formData.staffAssignments.length > 0 ? (
                      <div className="space-y-2">
                        {formData.staffAssignments.map(sa => {
                          const roleLabel = {
                            REFEREE: "Referee", COACH: "Coach", STAFF: "Staff",
                            FIRST_AID: "First Aid", EQUIPMENT_MANAGER: "Equipment Manager",
                            SCOREKEEPER: "Scorekeeper", TIMEKEEPER: "Timekeeper",
                            PHOTOGRAPHER: "Photographer", SECURITY: "Security",
                            MEDICAL: "Medical", VOLUNTEER: "Volunteer",
                          }[sa.roleType] || sa.roleType
                          return (
                            <div key={sa.id} className="flex items-center gap-3 text-xs bg-muted/30 p-3 rounded-xl border border-border/50">
                              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                                <Shield className="w-3.5 h-3.5 text-secondary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground">{roleLabel}</p>
                                {sa.userName && <p className="text-muted-foreground truncate">{sa.userName}</p>}
                              </div>
                              {sa.notes && (
                                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-lg shrink-0 max-w-[120px] truncate">{sa.notes}</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-muted/20 rounded-xl border border-dashed border-border">
                        <Shield className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No staff assigned</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          }

          <div className="mt-8 flex flex-wrap gap-3" data-tour="actions">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Back
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="gradient-primary rounded-full px-8 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50 disabled:shadow-none"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="gradient-primary rounded-full px-8 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50"
              >
                {submitting
                  ? (activityId ? "Saving..." : "Creating...")
                  : (activityId ? "Save changes" : "Create activity")}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sticky top-24">
            <h3 className="mb-4 text-sm font-bold text-foreground">Live Impact Preview</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{estimatedReach.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Estimated Reach</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                  <DollarSign className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{currencySymbols[formData.currency] || formData.currency}{estimatedRevenue.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Estimated Revenue</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formData.maxParticipants}</p>
                  <p className="text-[10px] text-muted-foreground">Max Participants</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="mb-3 text-sm font-bold text-foreground">Tips</h3>
              <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4">
                <li>Add a compelling cover image to attract more participants</li>
                <li>Set a competitive price based on similar activities in your area</li>
                <li>Enable sponsorship to boost your reach and visibility</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div >
  )
}

// ==================== CreateCampaign ====================
export function CreateCampaignPage({ onNavigate }: BusinessFormPageProps) {
  const { tourActive, hydrated, startTour, endTour } = useCampaignCreateTour()
  const [formData, setFormData] = useState({
    name: "",
    goal: "awareness",
    budget: 300,
    startDate: "",
    endDate: "",
    targetAudience: "all",
    description: "",
  })
  const [activePhase, setActivePhase] = useState<"pre" | "during" | "post">("pre")
  const [phaseState, setPhaseState] = useState({
    pre: { printMedia: false, athleteCollab: false, selectedAthlete: undefined as string | undefined, search: "", deliverables: [] as string[] },
    during: { printMedia: false, athleteCollab: false, selectedAthlete: undefined as string | undefined, search: "", deliverables: [] as string[] },
    post: { printMedia: false, athleteCollab: false, selectedAthlete: undefined as string | undefined, search: "", deliverables: [] as string[] },
  })

  const updatePhaseState = (phase: "pre" | "during" | "post", updates: Partial<typeof phaseState.pre>) => {
    setPhaseState((prev) => ({
      ...prev,
      [phase]: { ...prev[phase], ...updates },
    }))
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {hydrated && (
        <CampaignCreateTour
          active={tourActive}
          steps={CAMPAIGN_CREATE_TOUR_STEPS}
          onClose={endTour}
        />
      )}
      <div className="flex items-center gap-3" data-campaign-tour="header">
        <button type="button" onClick={() => onNavigate("business-campaigns")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-foreground">Create Campaign</h1>
          <p className="text-sm text-muted-foreground">Launch a marketing campaign</p>
        </div>
        <CampaignTourHelpButton onClick={startTour} />
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm" data-campaign-tour="details">
          <h3 className="mb-4 text-sm font-bold text-foreground">Campaign Details</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Campaign Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Sports Fest"
                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Campaign Goal</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "awareness", label: "Awareness", icon: Eye },
                  { value: "bookings", label: "Bookings", icon: Calendar },
                  { value: "engagement", label: "Engagement", icon: Users },
                ].map((goal) => (
                  <button
                    type="button"
                    key={goal.value}
                    onClick={() => setFormData({ ...formData, goal: goal.value })}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                      formData.goal === goal.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <goal.icon className={cn("h-5 w-5", formData.goal === goal.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-semibold", formData.goal === goal.value ? "text-primary" : "text-foreground")}>
                      {goal.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your campaign objectives..."
                rows={3}
                className="w-full rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm" data-campaign-tour="budget">
          <h3 className="mb-4 text-sm font-bold text-foreground">Budget & Schedule</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              />
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="gradient-secondary h-full rounded-full" style={{ width: `${Math.min((formData.budget / 1000) * 100, 100)}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Estimated reach: {(formData.budget * 10).toLocaleString()} people</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm" data-campaign-tour="audience">
          <h3 className="mb-4 text-sm font-bold text-foreground">Target Audience</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { value: "all", label: "Everyone" },
              { value: "athletes", label: "Athletes" },
              { value: "beginners", label: "Beginners" },
              { value: "local", label: "Local Area" },
            ].map((audience) => (
              <button
                type="button"
                key={audience.value}
                onClick={() => setFormData({ ...formData, targetAudience: audience.value })}
                className={cn(
                  "rounded-xl border-2 px-4 py-3 text-xs font-semibold transition-all",
                  formData.targetAudience === audience.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-foreground hover:border-primary/40"
                )}
              >
                {audience.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm" data-campaign-tour="communication">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Communication Plan</h3>
              <p className="text-xs text-muted-foreground">Plan pre, during, and post-event messaging</p>
            </div>
            <div className="flex gap-1 rounded-full border border-border p-1 text-[10px]">
              {(["pre", "during", "post"] as const).map((phase) => (
                <button
                  key={phase}
                  type="button"
                  onClick={() => setActivePhase(phase)}
                  className={cn(
                    "rounded-full px-3 py-1 font-semibold",
                    activePhase === phase ? "bg-secondary text-white" : "text-muted-foreground"
                  )}
                >
                  {phase}
                </button>
              ))}
            </div>
          </div>

          <CommunicationPhaseContent
            phase={activePhase}
            printMedia={phaseState[activePhase].printMedia}
            onPrintMediaChange={(value) => updatePhaseState(activePhase, { printMedia: value })}
            athleteCollab={phaseState[activePhase].athleteCollab}
            onAthleteCollabChange={(value) => updatePhaseState(activePhase, { athleteCollab: value })}
            selectedAthlete={phaseState[activePhase].selectedAthlete}
            onSelectAthlete={(id) => updatePhaseState(activePhase, { selectedAthlete: id })}
            athleteSearchQuery={phaseState[activePhase].search}
            onAthleteSearchChange={(value) => updatePhaseState(activePhase, { search: value })}
            selectedDeliverables={phaseState[activePhase].deliverables}
            onDeliverablesChange={(deliverables) => updatePhaseState(activePhase, { deliverables })}
            athletes={athletes.map((athlete) => ({
              id: athlete.id,
              name: athlete.name,
              sport: athlete.sport,
              followers: athlete.followers,
              ranking: athlete.ranking,
              avatar: athlete.avatar,
              verified: athlete.status === "active",
            }))}
          />
        </div>

        <div className="flex gap-3" data-campaign-tour="actions">
          <button type="button" onClick={() => onNavigate("business-campaigns")} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            Cancel
          </button>
          <button type="button" onClick={() => onNavigate("business-campaigns")} className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90">
            Launch Campaign
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== CreateBusiness ====================
export function CreateBusinessPage({ onNavigate }: BusinessFormPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "gym", // Default value for UI state
    description: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    avatar: "", // Keep these for existing URLs if handling edits/pre-fills
    cover: "",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedType = localStorage.getItem("businessType")
    if (savedType) {
      setFormData(prev => ({ ...prev, type: savedType }))
    }
  }, [])

  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Helper to get full image URL
  const getImageUrl = (url: string | null, preview: string | null) => {
    if (preview) return preview
    if (!url) return null
    if (url.startsWith("http")) return url
    // remove /api from base url if present for static files
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api").replace(/\/api\/?$/, "")
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show immediate preview
    const objectUrl = URL.createObjectURL(file)
    setAvatarPreview(objectUrl)
    setAvatarFile(file)
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show immediate preview
    const objectUrl = URL.createObjectURL(file)
    setCoverPreview(objectUrl)
    setCoverFile(file)
  }

  // Error key to user-friendly message mapping
  const errorKeyMessages: Record<string, string> = {
    "business.name.exists": "A business with this name already exists",
    "business.username.exists": "This business username is already taken",
    "business.email.exists": "A business with this email already exists",
    "validation.error": "Please fill in all required fields",
    "user.not.found": "User account not found. Please log in again",
    "file.storage.failed": "Failed to upload images. Please try again",
  }

  const { addBusiness } = useBusinessContext()

  const handleCreateBusiness = async () => {
    if (!formData.name.trim()) { setError("Business name is required"); toast.error("Business name is required"); return }
    if (!formData.email.trim()) { setError("Email is required"); toast.error("Email is required"); return }
    setSubmitting(true)
    setError(null)
    try {
      const username = formData.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').slice(0, 30)

      const created = await businessesService.create({
        name: formData.name,
        username,
        bio: formData.description,
        address: formData.location,
        phoneNumber: formData.phone,
        email: formData.email,
        website: formData.website,
        type: formData.type,
      }, avatarFile, coverFile)

      // Push the new business into context so topbar dropdown updates instantly
      if (created && created.id) {
        addBusiness({
          id: created.id,
          name: created.name || formData.name,
          type: created.bio || formData.description || "Business",
          avatar: created.avatar || undefined,
          location: [created.city, created.state].filter(Boolean).join(", ") || created.address || formData.location || "",
          rating: 0,
          followers: 0,
        })
      }

      onNavigate("business-dashboard")
      toast.success("Business created successfully!")
    } catch (err: any) {
      // Extract error key from backend structured response
      const errorKey = err?.response?.data?.key
      const msg = (errorKey && errorKeyMessages[errorKey])
        || (err instanceof Error ? err.message : "Failed to create business")
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-dashboard")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Business</h1>
          <p className="text-sm text-muted-foreground">Set up your business profile</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Branding</h3>
          <div className="flex items-center gap-6">
            {/* Logo Upload */}
            <input
              type="file"
              ref={logoInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => logoInputRef.current?.click()}
              className={cn(
                "flex h-24 w-24 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/40 overflow-hidden relative",
                (avatarPreview || formData.avatar) && "border-solid border-primary/20"
              )}
            >
              {getImageUrl(formData.avatar, avatarPreview) ? (
                <>
                  <img src={getImageUrl(formData.avatar, avatarPreview)!} alt="Logo" className="h-full w-full object-cover" />
                </>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-1 text-[10px] text-muted-foreground">Logo</p>
                </div>
              )}
            </div>

            {/* Cover Upload */}
            <input
              type="file"
              ref={coverInputRef}
              onChange={handleCoverUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="flex-1">
              <div
                onClick={() => coverInputRef.current?.click()}
                className={cn(
                  "flex h-24 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/40 overflow-hidden relative",
                  (coverPreview || formData.cover) && "border-solid border-primary/20"
                )}
              >
                {getImageUrl(formData.cover, coverPreview) ? (
                  <>
                    <img src={getImageUrl(formData.cover, coverPreview)!} alt="Cover" className="h-full w-full object-cover" />
                  </>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                    <p className="mt-1 text-[10px] text-muted-foreground">Cover Image</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Business Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Business Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chelsea Piers Sports"
                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Business Type</label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gym">Gym & Training</SelectItem>
                  <SelectItem value="sports-complex">Sports Complex</SelectItem>
                  <SelectItem value="academy">Academy</SelectItem>
                  <SelectItem value="wellness">Wellness Center</SelectItem>
                  <SelectItem value="retail">Sports Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell people about your business..."
                rows={3}
                className="w-full rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Contact & Location</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Address</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Street address" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="contact@business.com" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Website</label>
              <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://www.yourbusiness.com" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => onNavigate("business-dashboard")} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            Cancel
          </button>
          <button type="button" onClick={handleCreateBusiness} disabled={submitting} className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50">
            {submitting ? "Creating..." : "Create Business"}
          </button>
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </div>
    </div>
  )
}

// ==================== AddResource ====================

const addResourceTypes = [
  { key: "facility" as const, label: "Facility", sub: "Gyms, courts, studios", icon: Building2 },
  { key: "product" as const, label: "Product", sub: "Equipment, gear, apparel", icon: Package },
  { key: "service" as const, label: "Service", sub: "Training, coaching, therapy", icon: Wrench },
]
const addResourceSportOptions = ["Football", "Basketball", "Tennis", "Swimming", "Boxing", "Yoga", "Cricket", "Badminton", "Volleyball", "Other"]
const addResourceProductCategories = [
  "Equipment", "Apparel", "Footwear", "Accessories", "Nutrition", "Recovery",
  "Hydration", "Technology", "Safety", "Awards & Trophies", "Other",
]
const addResourceProductSubcategories: Record<string, string[]> = {
  Equipment: ["Fitness", "Training", "Sports Gear", "Mats", "Weights", "Balls", "Rackets", "Nets"],
  Apparel: ["Jerseys", "Jackets", "Shorts", "Trousers", "Compression Wear", "Swimwear"],
  Footwear: ["Running Shoes", "Training Shoes", "Cleats", "Indoor Court", "Sandals"],
  Accessories: ["Bags", "Watches", "Towels", "Bands", "Gloves", "Headbands", "Knee Pads"],
  Nutrition: ["Protein", "Supplements", "Energy Bars", "Drinks", "Snacks"],
  Recovery: ["Foam Rollers", "Massage Guns", "Ice Packs", "Compression Sleeves"],
  Hydration: ["Water Bottles", "Shakers", "Hydration Packs"],
  Technology: ["Fitness Trackers", "Heart Rate Monitors", "GPS Watches", "Smart Scales"],
  Safety: ["First Aid Kits", "Protective Gear", "Helmets", "Mouthguards"],
}
const addResourceBrandPresets = [
  "Nike", "Adidas", "Under Armour", "Puma", "Reebok", "Decathlon",
  "New Balance", "Lululemon", "Garmin", "Hydro Flask", "Wilson", "Spalding",
  "Everlast", "Yonex", "Head", "Speedo", "Asics", "Mizuno",
]
const addResourceProductFeaturePresets = [
  "Lightweight", "Breathable", "Waterproof", "Durable", "Anti-Slip",
  "Quick-Dry", "UV Protection", "Adjustable", "Ergonomic", "Eco-Friendly",
  "Machine Washable", "Padded", "Reflective", "Sweat-Wicking",
  "Shock Absorbing", "Foldable", "Portable", "Rechargeable",
  "Bluetooth Enabled", "App Connected",
]
const addResourceServiceCategories = [
  "Training", "Coaching", "Therapy", "Fitness Classes", "Nutrition",
  "Rehabilitation", "Recovery", "Media & Photography", "Event Services",
  "Wellness", "Safety & Medical", "Marketing", "Other",
]
const addResourceServiceOfferingPresets = [
  "One-on-One Sessions", "Group Sessions", "Online / Virtual", "On-Site",
  "Personalized Plan", "Progress Tracking", "Video Analysis",
  "Certified Professional", "Flexible Scheduling", "Free Consultation",
  "Equipment Provided", "Home Visits", "Weekend Availability",
  "Monthly Subscription", "Package Deals", "Corporate Plans",
  "Beginner Friendly", "Advanced Level", "Competition Prep",
  "Injury Prevention", "Post-Surgery Rehab", "Diet Plan Included",
]
const addResourceDurationOptions = ["15 min", "30 min", "45 min", "1 hour", "1.5 hours", "2 hours", "3 hours", "Half Day", "Full Day", "Monthly"]
const timeSlotOptions = (() => {
  const slots: string[] = []
  for (let h = 0; h < 24; h++) {
    for (const m of ["00", "30"]) {
      slots.push(`${String(h).padStart(2, "0")}:${m}`)
    }
  }
  return slots
})()
const addResourceCurrencyOptions = [
  { value: "$", label: "USD ($)" },
  { value: "€", label: "EUR (€)" },
  { value: "£", label: "GBP (£)" },
  { value: "د.م.", label: "MAD (د.م.)" },
]

const facilityFloorPresets = [
  "Indoor Court", "Outdoor Court", "Artificial Turf", "Natural Grass",
  "Rubber Flooring", "Wooden Flooring", "Clay Surface", "Hardcourt",
  "Synthetic Surface", "Concrete", "Sand", "Tartan Track",
  "Sprung Floor", "Tatami Mat", "Boxing Canvas", "Ice Rink",
  "Covered / Roofed", "Open Air",
]

const facilityAmenityPresets = [
  "Parking", "Free WiFi", "Locker Rooms", "Showers", "Towel Service",
  "Air Conditioning", "Heating", "Lighting (Floodlights)", "Scoreboard",
  "Sound System", "First Aid Kit", "Defibrillator (AED)", "Water Fountain",
  "Vending Machines", "Cafeteria / Snack Bar", "Pro Shop", "Equipment Rental",
  "Seating / Bleachers", "VIP Lounge", "Wheelchair Accessible", "Restrooms",
  "CCTV / Security", "24/7 Access", "Reception / Front Desk", "Sauna",
  "Steam Room", "Jacuzzi / Hot Tub", "Swimming Pool", "Ice Bath",
  "Massage Room", "Physiotherapy Room", "Stretching Area", "Warm-Up Zone",
  "Changing Rooms", "Personal Lockers", "Shoe Rental", "Ball Rental",
  "Racket Rental", "Coaching Available", "Kids Area", "Spectator Gallery",
  "Live Streaming", "Instant Replay Screen", "Online Booking", "Mobile App",
  "Event Hosting", "Birthday Packages", "Corporate Packages", "Night Lighting",
  "Barrier-Free Entry", "EV Charging Station", "Bike Rack",
  "Pet Friendly", "Family Friendly", "Women Only Hours", "Prayer Room",
]

async function uploadResourceImage(file: File): Promise<string> {
  const apiClient = (await import("@/lib/api")).default
  const formData = new FormData()
  formData.append("file", file)
  const res = await apiClient.post<{ url: string }>("/v1/upload/resource/image", formData, {
    headers: { "Content-Type": null as unknown as string },
  })
  return res.data.url
}

type AddResourceType = "facility" | "product" | "service"

interface AddResourcePageProps extends BusinessFormPageProps {
  resourceId?: string
  editResourceType?: AddResourceType
}

export function AddResourcePage({ onNavigate, resourceId, editResourceType }: AddResourcePageProps) {
  const { activeBusinessId } = useBusinessContext()
  const isEditMode = !!resourceId
  const [resourceType, setResourceType] = useState<AddResourceType>(editResourceType || "facility")
  const resourceTourKey = `sporgates.addResourceTour.${resourceType}.v1`
  const { tourActive, hydrated, startTour, endTour } = useTour(resourceTourKey)
  const resourceTypeLabel = resourceType === "facility" ? "Facility" : resourceType === "product" ? "Product" : "Service"
  const resourceTourSteps = useMemo<TourStep[]>(() => {
    const typeSummary =
      resourceType === "facility"
        ? "Facilities are bookable places with location, hours, and amenities."
        : resourceType === "product"
          ? "Products are items you sell with pricing, category, stock, and features."
          : "Services are offerings you provide with pricing, category, duration, and address."
    return [
      {
        target: "resource-header",
        title: `Create a ${resourceTypeLabel}`,
        body: `Use this flow to add a new ${resourceType.toLowerCase()} to your business. ${typeSummary}`,
      },
      {
        target: "resource-type",
        title: "Choose the resource type",
        body: "Pick Facility, Product, or Service before filling details. In edit mode, type is locked to avoid invalid data transitions.",
      },
      {
        target: "resource-basic",
        title: "Basic details",
        body: "Add clear name, description, and key pricing/category fields. This information powers how users discover and understand your offering.",
      },
      {
        target: "resource-images",
        title: "Upload images",
        body: "Add quality visuals. The first image is used as cover and strongly affects click-through and bookings/purchases.",
      },
      {
        target: "resource-actions",
        title: "Save your resource",
        body: "Use Cancel to discard or Create to publish this resource to your business catalog.",
      },
    ]
  }, [resourceType, resourceTypeLabel])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [imageFiles, setImageFiles] = useState<{ file: File; preview: string }[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [currentFeature, setCurrentFeature] = useState("")
  // Facility
  const [pricePerHour, setPricePerHour] = useState(0)
  const [capacity, setCapacity] = useState(0)
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [facilityState, setFacilityState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [minReservationMinutes, setMinReservationMinutes] = useState(0)
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [isSportsPopoverOpen, setIsSportsPopoverOpen] = useState(false)
  const [grounds, setGrounds] = useState<string[]>([])
  const [groundsSearch, setGroundsSearch] = useState("")
  const [amenitiesSearch, setAmenitiesSearch] = useState("")
  const [openingHours, setOpeningHours] = useState<Record<string, { enabled: boolean; open: string; close: string }>>({
    Monday: { enabled: false, open: "09:00", close: "18:00" },
    Tuesday: { enabled: false, open: "09:00", close: "18:00" },
    Wednesday: { enabled: false, open: "09:00", close: "18:00" },
    Thursday: { enabled: false, open: "09:00", close: "18:00" },
    Friday: { enabled: false, open: "09:00", close: "18:00" },
    Saturday: { enabled: false, open: "10:00", close: "16:00" },
    Sunday: { enabled: false, open: "10:00", close: "16:00" },
  })
  // Product
  const [price, setPrice] = useState(0)
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [originalPrice, setOriginalPrice] = useState(0)
  const [inStock, setInStock] = useState(true)
  const [currency, setCurrency] = useState("$")
  // Service
  const [servicePrice, setServicePrice] = useState(0)
  const [serviceCategory, setServiceCategory] = useState("")
  const [duration, setDuration] = useState("")
  const [serviceCurrency, setServiceCurrency] = useState("$")
  const [serviceAddress, setServiceAddress] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [loadingResource, setLoadingResource] = useState(!!resourceId)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (!resourceId || !editResourceType) return
    let cancelled = false
    const load = async () => {
      setLoadingResource(true)
      try {
        let data: any
        if (editResourceType === "facility") {
          data = await facilitiesService.getById(resourceId)
          if (cancelled) return
          setName(data.name || "")
          setDescription(data.description || "")
          setPricePerHour(data.pricePerHour || 0)
          setCapacity(data.capacity || 0)
          setAddress(data.address || "")
          setCity(data.city || "")
          setFacilityState(data.state || "")
          setPostalCode(data.postalCode || "")
          setCountry(data.country || "")
          setPhoneNumber(data.phoneNumber || "")
          setEmail(data.email || "")
          setWebsite(data.website || "")
          setMinReservationMinutes(data.minReservationMinutes || 0)
          setSelectedSports(Array.isArray(data.sports) ? data.sports : [])
          setGrounds(Array.isArray(data.grounds) ? data.grounds : [])
          setFeatures(Array.isArray(data.amenities) ? data.amenities : [])
          const imgs: string[] = []
          if (data.coverImage) imgs.push(data.coverImage)
          if (Array.isArray(data.imageUrls)) {
            data.imageUrls.forEach((u: string) => { if (!imgs.includes(u)) imgs.push(u) })
          }
          setExistingImages(imgs)
          if (data.openingHours && typeof data.openingHours === "object") {
            setOpeningHours(prev => {
              const updated = { ...prev }
              for (const [day, val] of Object.entries(data.openingHours as Record<string, string>)) {
                if (updated[day] && typeof val === "string" && val.includes("-")) {
                  const [open, close] = val.split("-")
                  updated[day] = { enabled: true, open, close }
                }
              }
              return updated
            })
          }
        } else if (editResourceType === "product") {
          data = await marketplaceService.getById(resourceId)
          if (cancelled) return
          setName(data.name || "")
          setDescription(data.description || "")
          setPrice(data.price || 0)
          setOriginalPrice(data.originalPrice || 0)
          setBrand(data.brand || "")
          setCategory(data.category || "")
          setSubcategory(data.subcategory || "")
          setCurrency(data.currency || "$")
          setInStock(data.inStock !== false)
          setFeatures(Array.isArray(data.features) ? data.features : [])
          const imgs: string[] = []
          if (data.image) imgs.push(data.image)
          if (Array.isArray(data.imageUrls)) {
            data.imageUrls.forEach((u: string) => { if (!imgs.includes(u)) imgs.push(u) })
          }
          setExistingImages(imgs)
        } else {
          data = await servicesService.getById(resourceId)
          if (cancelled) return
          setName(data.name || "")
          setDescription(data.description || "")
          setServicePrice(data.price || 0)
          setServiceCategory(data.category || "")
          setDuration(data.duration || "")
          setServiceCurrency(data.currency || "$")
          setServiceAddress(data.address || "")
          setFeatures(Array.isArray(data.offerings) ? data.offerings : [])
          const imgs: string[] = []
          if (data.image) imgs.push(data.image)
          if (Array.isArray(data.imageUrls)) {
            data.imageUrls.forEach((u: string) => { if (!imgs.includes(u)) imgs.push(u) })
          }
          setExistingImages(imgs)
        }
      } catch (err: any) {
        if (!cancelled) {
          const msg = getApiErrorMessage(err, "Unknown error")
          console.error("Failed to load resource:", err)
          setError(`Failed to load resource: ${msg}`)
        }
      } finally {
        if (!cancelled) setLoadingResource(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [resourceId, editResourceType])

  const handleFilesSelect = useCallback((files: FileList | File[]) => {
    const newEntries: { file: File; preview: string }[] = []
    const toProcess = Array.from(files).filter((f) => f.type.startsWith("image/"))
    let processed = 0
    if (toProcess.length === 0) return
    toProcess.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newEntries.push({ file, preview: e.target?.result as string })
        processed++
        if (processed === toProcess.length) {
          setImageFiles((prev) => [...prev, ...newEntries])
        }
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) handleFilesSelect(e.dataTransfer.files)
  }, [handleFilesSelect])

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    const val = currentFeature.trim()
    if (val && !features.includes(val)) {
      setFeatures((prev) => [...prev, val])
      setCurrentFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Name is required"); return }
    if (!activeBusinessId) { setError("No active business selected"); return }
    setSubmitting(true)
    setError("")

    const uploadedUrls: string[] = []
    if (imageFiles.length > 0) {
      try {
        for (const entry of imageFiles) {
          const url = await uploadResourceImage(entry.file)
          uploadedUrls.push(url)
        }
      } catch {
        setError("Failed to upload one or more images")
        setSubmitting(false)
        return
      }
    }

    const allImages = [...existingImages, ...uploadedUrls]

    try {
      if (resourceType === "facility") {
        const payload = {
          name: name.trim(),
          description: description.trim(),
          coverImage: allImages[0] || undefined,
          imageUrls: allImages.length > 0 ? allImages : undefined,
          pricePerHour: pricePerHour || undefined,
          capacity: capacity || undefined,
          address: address.trim() || undefined,
          city: city.trim() || undefined,
          state: facilityState.trim() || undefined,
          postalCode: postalCode.trim() || undefined,
          country: country.trim() || undefined,
          phoneNumber: phoneNumber.trim() || undefined,
          email: email.trim() || undefined,
          website: website.trim() || undefined,
          minReservationMinutes: minReservationMinutes || undefined,
          sports: selectedSports,
          grounds: grounds.length > 0 ? grounds : undefined,
          amenities: features,
          openingHours: (() => {
            const mapped: Record<string, string> = {}
            for (const [day, val] of Object.entries(openingHours)) {
              if (val.enabled) mapped[day] = `${val.open}-${val.close}`
            }
            return Object.keys(mapped).length > 0 ? mapped : undefined
          })(),
          businessId: activeBusinessId,
        }
        if (isEditMode) await facilitiesService.update(resourceId, payload)
        else await facilitiesService.create(payload)
      } else if (resourceType === "product") {
        const payload = {
          name: name.trim(),
          description: description.trim(),
          image: allImages[0] || undefined,
          imageUrls: allImages.length > 0 ? allImages : undefined,
          price,
          currency,
          brand: brand.trim() || undefined,
          category: category || "General",
          subcategory: subcategory || undefined,
          originalPrice: originalPrice || undefined,
          inStock,
          features: features.length > 0 ? features : undefined,
          sellerId: activeBusinessId,
        }
        if (isEditMode) await marketplaceService.update(resourceId, payload)
        else await marketplaceService.create(payload)
      } else {
        const payload = {
          name: name.trim(),
          description: description.trim(),
          image: allImages[0] || undefined,
          imageUrls: allImages.length > 0 ? allImages : undefined,
          price: servicePrice,
          currency: serviceCurrency,
          category: serviceCategory || "General",
          duration: duration || undefined,
          address: serviceAddress.trim() || undefined,
          offerings: features.length > 0 ? features : undefined,
          providerId: activeBusinessId,
        }
        if (isEditMode) await servicesService.update(resourceId, payload)
        else await servicesService.create(payload)
      }
      onNavigate("business-resources", resourceType)
      toast.success(`${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} ${isEditMode ? "updated" : "created"} successfully!`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to ${isEditMode ? "update" : "create"} resource`
      setError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary transition-colors"
  const featuresLabel = resourceType === "facility" ? "Amenities" : resourceType === "product" ? "Features" : "Offerings"

  if (loadingResource) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isEditMode && error && !name) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate("business-resources", resourceType)} className="rounded-full p-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Edit Resource</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base font-semibold text-foreground">Could not load resource</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => onNavigate("business-resources", resourceType)}
            className="mt-6 rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Back to Resources
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {!isEditMode && hydrated && (
        <TourGuide
          active={tourActive}
          steps={resourceTourSteps}
          onClose={endTour}
          storageKey={resourceTourKey}
          targetAttribute="data-tour"
        />
      )}
      {/* Header */}
      <div className="flex items-center gap-3" data-tour="resource-header">
        <button type="button" onClick={() => onNavigate("business-resources", resourceType)} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-foreground">{isEditMode ? "Edit Resource" : "Add New Resource"}</h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? `Update your ${resourceType === "facility" ? "facility" : resourceType === "product" ? "product" : "service"} details`
              : "Create a new facility, product, or service"}
          </p>
        </div>
        {!isEditMode && <TourHelpButton onClick={startTour} />}
      </div>

      {/* Resource Type Selection — locked in edit mode */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm" data-tour="resource-type">
        <h3 className="mb-4 text-sm font-bold text-foreground">Resource Type</h3>
        <div className="grid grid-cols-3 gap-3">
          {addResourceTypes.map((rt) => {
            const active = resourceType === rt.key
            return (
              <button
                key={rt.key}
                type="button"
                onClick={() => { if (!isEditMode) setResourceType(rt.key) }}
                disabled={isEditMode && rt.key !== resourceType}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border-2 p-5 transition-all",
                  active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                  isEditMode && rt.key !== resourceType && "opacity-40 cursor-not-allowed"
                )}
              >
                <rt.icon className={cn("h-7 w-7", active ? "text-primary" : "text-muted-foreground")} />
                <p className={cn("text-xs font-semibold", active ? "text-primary" : "text-foreground")}>{rt.label}</p>
                <p className="text-[10px] text-muted-foreground">{rt.sub}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Basic Information */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm" data-tour="resource-basic">
        <h3 className="mb-4 text-sm font-bold text-foreground">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              {resourceType === "facility" ? "Facility" : resourceType === "product" ? "Product" : "Service"} Name *
            </label>
            <input
              type="text"
              placeholder={`e.g., ${resourceType === "facility" ? "Basketball Court A" : resourceType === "product" ? "Professional Tennis Racket" : "Personal Training Session"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Description *</label>
            <textarea
              rows={3}
              placeholder="Provide a detailed description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary resize-none transition-colors"
            />
          </div>
          {resourceType === "facility" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Price per Hour ($) *</label>
                <input type="number" min={0} step={0.01} placeholder="0.00" value={pricePerHour || ""} onChange={(e) => setPricePerHour(Number(e.target.value) || 0)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Sports</label>
                <Popover open={isSportsPopoverOpen} onOpenChange={setIsSportsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex h-11 w-full items-center justify-between rounded-xl border bg-muted px-4 text-sm outline-none transition-colors",
                        isSportsPopoverOpen ? "border-primary" : "border-border"
                      )}
                    >
                      <span className={cn("truncate", selectedSports.length === 0 ? "text-muted-foreground" : "text-foreground")}>
                        {selectedSports.length > 0 ? `${selectedSports.length} sport${selectedSports.length > 1 ? "s" : ""} selected` : "Select one or more sports..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] rounded-xl border border-border bg-card p-0 shadow-lg" align="start" sideOffset={6}>
                    <Command className="rounded-xl">
                      <CommandInput placeholder="Search sports..." className="text-sm" />
                      <CommandList className="max-h-56">
                        <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">No sport found.</CommandEmpty>
                        <CommandGroup className="p-1.5">
                          {addResourceSportOptions.map((sportOption) => {
                            const selected = selectedSports.includes(sportOption)
                            return (
                              <CommandItem
                                key={sportOption}
                                value={sportOption}
                                onSelect={() => {
                                  setSelectedSports((prev) =>
                                    prev.includes(sportOption)
                                      ? prev.filter((item) => item !== sportOption)
                                      : [...prev, sportOption]
                                  )
                                }}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors",
                                  "data-[selected='true']:bg-primary/10 data-[selected=true]:text-foreground",
                                  selected ? "bg-primary/5 text-primary font-medium" : "text-foreground"
                                )}
                              >
                                <span
                                  className={cn(
                                    "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                                    selected ? "border-primary bg-primary" : "border-border"
                                  )}
                                >
                                  {selected && <Check className="h-3 w-3 text-white" />}
                                </span>
                                {sportOption}
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedSports.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedSports.map((selectedSport) => (
                      <span
                        key={selectedSport}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary"
                      >
                        {selectedSport}
                        <button
                          type="button"
                          onClick={() => setSelectedSports((prev) => prev.filter((item) => item !== selectedSport))}
                          className="text-primary/70 transition-colors hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {resourceType === "product" && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Price *</label>
                  <input type="number" min={0} step={0.01} placeholder="0.00" value={price || ""} onChange={(e) => setPrice(Number(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Original Price</label>
                  <input type="number" min={0} step={0.01} placeholder="Strikethrough" value={originalPrice || ""} onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Currency</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {addResourceCurrencyOptions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Category *</label>
                  <Select value={category} onValueChange={(val) => { setCategory(val); setSubcategory("") }}>
                    <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {addResourceProductCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {category && addResourceProductSubcategories[category] && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">Subcategory</label>
                    <Select value={subcategory} onValueChange={setSubcategory}>
                      <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm">
                        <SelectValue placeholder="Select subcategory..." />
                      </SelectTrigger>
                      <SelectContent>
                        {addResourceProductSubcategories[category].map((sc) => <SelectItem key={sc} value={sc}>{sc}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </>
          )}

          {resourceType === "service" && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Price *</label>
                <input type="number" min={0} step={0.01} placeholder="0.00" value={servicePrice || ""} onChange={(e) => setServicePrice(Number(e.target.value) || 0)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Currency</label>
                <Select value={serviceCurrency} onValueChange={setServiceCurrency}>
                  <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {addResourceCurrencyOptions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Category *</label>
                <Select value={serviceCategory} onValueChange={setServiceCategory}>
                  <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {addResourceServiceCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Upload (multi) */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm" data-tour="resource-images">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Images</h3>
          {(existingImages.length + imageFiles.length) > 0 && (
            <span className="text-[11px] text-muted-foreground">{existingImages.length + imageFiles.length} image{(existingImages.length + imageFiles.length) !== 1 ? "s" : ""}</span>
          )}
        </div>
        {(existingImages.length + imageFiles.length) > 0 && (
          <div className="mb-4 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
            {existingImages.map((url, idx) => (
              <div key={`existing-${idx}`} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                <img src={url} alt={`Existing ${idx + 1}`} className="h-full w-full object-cover" />
                {idx === 0 && imageFiles.length === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-primary/80 px-1 py-0.5 text-[8px] font-bold leading-none text-white">Cover</span>
                )}
                <button
                  type="button"
                  onClick={() => setExistingImages((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
            {imageFiles.map((entry, idx) => (
              <div key={`new-${idx}`} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                <img src={entry.preview} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                {idx === 0 && existingImages.length === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-primary/80 px-1 py-0.5 text-[8px] font-bold leading-none text-white">Cover</span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter") fileInputRef.current?.click() }}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors cursor-pointer",
            imageFiles.length > 0 ? "p-5" : "p-10",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
          )}
        >
          <div className={cn("flex items-center justify-center rounded-full bg-muted", imageFiles.length > 0 ? "h-10 w-10" : "h-14 w-14")}>
            <Upload className={cn("text-muted-foreground", imageFiles.length > 0 ? "h-4 w-4" : "h-6 w-6")} />
          </div>
          <p className="text-xs font-medium text-foreground">{imageFiles.length > 0 ? "Add more images" : "Click to upload or drag and drop"}</p>
          <p className="text-[10px] text-muted-foreground">PNG, JPG, WEBP up to 10MB each</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) handleFilesSelect(e.target.files)
            e.target.value = ""
          }}
        />
      </div>

      {/* Type-specific Details */}
      {resourceType === "facility" && (
        <>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Location</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Address</label>
                <input type="text" placeholder="123 Main St" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">City</label>
                  <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">State / Province</label>
                  <input type="text" placeholder="State" value={facilityState} onChange={(e) => setFacilityState(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Postal Code</label>
                  <input type="text" placeholder="e.g., 10001" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Country</label>
                  <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Facility Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Capacity</label>
                  <input type="number" min={0} placeholder="Max number of people" value={capacity || ""} onChange={(e) => setCapacity(Number(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Min Reservation (minutes)</label>
                  <input type="number" min={0} step={15} placeholder="e.g., 60" value={minReservationMinutes || ""} onChange={(e) => setMinReservationMinutes(Number(e.target.value) || 0)} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Opening Hours</h3>
            <div className="space-y-2">
              {Object.entries(openingHours).map(([day, val]) => (
                <div key={day} className="flex items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={val.enabled}
                    onClick={() => setOpeningHours((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }))}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
                      val.enabled ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  >
                    <span className={cn("inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform", val.enabled ? "translate-x-[18px]" : "translate-x-[3px]")} />
                  </button>
                  <span className={cn("w-24 text-xs font-medium", val.enabled ? "text-foreground" : "text-muted-foreground")}>{day}</span>
                  {val.enabled ? (
                    <div className="flex items-center gap-2">
                      <Select value={val.open} onValueChange={(v) => setOpeningHours((prev) => ({ ...prev, [day]: { ...prev[day], open: v } }))}>
                        <SelectTrigger className="h-9 w-[100px] rounded-lg border border-border bg-muted px-2.5 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-52">
                          {timeSlotOptions.map((t) => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <span className="text-xs text-muted-foreground">to</span>
                      <Select value={val.close} onValueChange={(v) => setOpeningHours((prev) => ({ ...prev, [day]: { ...prev[day], close: v } }))}>
                        <SelectTrigger className="h-9 w-[100px] rounded-lg border border-border bg-muted px-2.5 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-52">
                          {timeSlotOptions.map((t) => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Closed</span>
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpeningHours((prev) => {
                    const updated = { ...prev }
                    for (const day of Object.keys(updated)) updated[day] = { ...updated[day], enabled: true }
                    return updated
                  })}
                  className="rounded-lg border border-border px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  Enable all
                </button>
                <button
                  type="button"
                  onClick={() => setOpeningHours((prev) => {
                    const updated = { ...prev }
                    for (const day of Object.keys(updated)) updated[day] = { ...updated[day], enabled: false }
                    return updated
                  })}
                  className="rounded-lg border border-border px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  Disable all
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Contact Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Phone</label>
                  <input type="tel" placeholder="+1 234 567 890" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Email</label>
                  <input type="email" placeholder="facility@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Website</label>
                <input type="url" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Floors / Grounds</h3>
            {grounds.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-[11px] font-medium text-muted-foreground">Selected</p>
                <div className="flex flex-wrap gap-2">
                  {grounds.map((g, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-primary">
                      {g}
                      <button type="button" onClick={() => setGrounds((prev) => prev.filter((_, i) => i !== idx))} className="text-primary/60 hover:text-destructive transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search floors / grounds..."
                value={groundsSearch}
                onChange={(e) => setGroundsSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-muted pl-8 pr-3 text-xs outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto pr-1">
              {facilityFloorPresets
                .filter((f) => !grounds.includes(f) && f.toLowerCase().includes(groundsSearch.toLowerCase()))
                .map((floor) => (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => setGrounds((prev) => [...prev, floor])}
                    className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    + {floor}
                  </button>
                ))}
            </div>
          </div>
        </>
      )}

      {resourceType === "product" && (
        <>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Brand</h3>
            <div>
              <input type="text" placeholder="Type or select a brand..." value={brand} onChange={(e) => setBrand(e.target.value)} className={cn(inputClass, "mb-3")} />
              <div className="flex flex-wrap gap-1.5">
                {addResourceBrandPresets.filter((b) => b !== brand).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    {b}
                  </button>
                ))}
              </div>
              {brand && addResourceBrandPresets.includes(brand) && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-primary">
                    {brand}
                    <button type="button" onClick={() => setBrand("")} className="text-primary/60 hover:text-destructive transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Availability</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={inStock}
                onClick={() => setInStock(!inStock)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                  inStock ? "bg-primary" : "bg-muted-foreground/30"
                )}
              >
                <span className={cn("inline-block h-4 w-4 rounded-full bg-white shadow transition-transform", inStock ? "translate-x-6" : "translate-x-1")} />
              </button>
              <span className="text-xs font-medium text-foreground">In Stock</span>
            </label>
          </div>
        </>
      )}

      {resourceType === "service" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Service Details</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Duration</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm">
                  <SelectValue placeholder="Select duration..." />
                </SelectTrigger>
                <SelectContent>
                  {addResourceDurationOptions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Address</label>
              <input
                type="text"
                placeholder="e.g., 123 Main St, City, State"
                value={serviceAddress}
                onChange={(e) => setServiceAddress(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* Features / Amenities / Offerings */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">{featuresLabel}</h3>

        {features.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-[11px] font-medium text-muted-foreground">Selected</p>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-primary"
                >
                  {feature}
                  <button type="button" onClick={() => removeFeature(index)} className="text-primary/60 hover:text-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {(() => {
          const presets =
            resourceType === "facility" ? facilityAmenityPresets :
              resourceType === "product" ? addResourceProductFeaturePresets :
                addResourceServiceOfferingPresets
          const label =
            resourceType === "facility" ? "Common amenities" :
              resourceType === "product" ? "Common features" :
                "Common offerings"
          const available = presets.filter((p) => !features.includes(p) && p.toLowerCase().includes(amenitiesSearch.toLowerCase()))
          return (
            <div className="mb-4">
              <p className="mb-2 text-[11px] font-medium text-muted-foreground">{label} — click to add</p>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={`Search ${featuresLabel.toLowerCase()}...`}
                  value={amenitiesSearch}
                  onChange={(e) => setAmenitiesSearch(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-muted pl-8 pr-3 text-xs outline-none focus:border-primary transition-colors"
                />
              </div>
              {available.length > 0 ? (
                <div className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto pr-1">
                  {available.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFeatures((prev) => [...prev, item])}
                      className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No matches found</p>
              )}
            </div>
          )
        })()}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Add custom ${featuresLabel.toLowerCase().slice(0, -1)}...`}
            value={currentFeature}
            onChange={(e) => setCurrentFeature(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature() } }}
            className={inputClass}
          />
          <button
            type="button"
            onClick={addFeature}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted transition-colors hover:bg-primary/10 hover:border-primary"
          >
            <Plus className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3" data-tour="resource-actions">
        <button type="button" onClick={() => onNavigate("business-resources", resourceType)} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!name.trim() || submitting}
          className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting
            ? (isEditMode ? "Saving..." : "Creating...")
            : (isEditMode
              ? `Save ${resourceType === "facility" ? "Facility" : resourceType === "product" ? "Product" : "Service"}`
              : `Create ${resourceType === "facility" ? "Facility" : resourceType === "product" ? "Product" : "Service"}`)
          }
        </button>
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  )
}

// ==================== AddTeamMember ====================
export function AddTeamMemberPage({ onNavigate }: BusinessFormPageProps) {
  const [formData, setFormData] = useState({ name: "", email: "", role: "trainer", permissions: ["view-bookings"] })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSendInvite = async () => {
    if (!formData.email.trim()) { setError("Email is required"); return }
    setSubmitting(true)
    setError("")
    try {
      const businesses = await businessesService.getMyBusinesses()
      const bizList = businesses?.content || (Array.isArray(businesses) ? businesses : [])
      if (bizList.length === 0) { setError("No business found"); setSubmitting(false); return }
      await businessesService.addStaff(bizList[0].id, formData.email.trim())
      onNavigate("business-team")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send invite"
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const roles = [
    { value: "admin", label: "Admin", description: "Full access to all features" },
    { value: "manager", label: "Manager", description: "Manage activities and bookings" },
    { value: "trainer", label: "Trainer", description: "View and manage assigned activities" },
    { value: "instructor", label: "Instructor", description: "View schedule and check in attendees" },
  ]

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-team")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Team Member</h1>
          <p className="text-sm text-muted-foreground">Invite someone to your team</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Member Information</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="name@email.com" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Role Assignment</h3>
        <div className="space-y-3">
          {roles.map((role) => (
            <button
              type="button"
              key={role.value}
              onClick={() => setFormData({ ...formData, role: role.value })}
              className={cn(
                "flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all",
                formData.role === role.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              )}
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", formData.role === role.value ? "bg-primary/10" : "bg-muted")}>
                <Shield className={cn("h-5 w-5", formData.role === role.value ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div>
                <p className={cn("text-sm font-semibold", formData.role === role.value ? "text-primary" : "text-foreground")}>{role.label}</p>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => onNavigate("business-team")} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted">Cancel</button>
        <button type="button" onClick={handleSendInvite} disabled={submitting} className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50">{submitting ? "Sending..." : "Send Invite"}</button>
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  )
}

// ==================== Inline placeholder data (no BE endpoint) ====================
const businessPartners = [
  { id: "bp1", name: "SportySponsors Inc.", type: "Sponsor", tier: "Gold", avatar: "SS" },
  { id: "bp2", name: "Nike Regional", type: "Sponsor", tier: "Silver", avatar: "NR" },
  { id: "bp3", name: "Alex Johnson", type: "Athlete", sport: "Basketball", avatar: "AJ" },
  { id: "bp4", name: "Sarah Williams", type: "Athlete", sport: "Tennis", avatar: "SW" },
]

const athletes: Array<{ id: string; name: string; sport: string; ranking: string; avatar: string; followers: number; engagement: number; collaborations: number; status: string }> = [
  { id: "ath1", name: "Alex Johnson", sport: "Basketball", ranking: "#12 National", avatar: "AJ", followers: 125000, engagement: 8.5, collaborations: 5, status: "active" },
  { id: "ath2", name: "Sam Lee", sport: "Tennis", ranking: "#28 Regional", avatar: "SL", followers: 89000, engagement: 7.2, collaborations: 3, status: "active" },
  { id: "ath3", name: "Maria Gonzalez", sport: "Soccer", ranking: "#5 International", avatar: "MG", followers: 200000, engagement: 9.1, collaborations: 8, status: "pending" },
]

const businessResources = [
  { id: "r1", name: "Main Court", type: "Court", status: "available", image: "/placeholder.svg", revenue: 1200 },
  { id: "r2", name: "Training Room A", type: "Room", status: "maintenance", image: "/placeholder.svg", revenue: 800 },
  { id: "r3", name: "Swimming Pool", type: "Pool", status: "available", image: "/placeholder.svg", revenue: 2500 },
  { id: "r4", name: "Tennis Court 1", type: "Court", status: "booked", image: "/placeholder.svg", revenue: 950 },
]

const businessDashboardData = {
  totalRevenue: 45600,
  totalBookings: 312,
  activeActivities: 15,
  teamMembers: [
    { name: "Coach Miller", role: "Head Coach", avatar: "CM", status: "active" as const },
    { name: "Jane Ops", role: "Manager", avatar: "JO", status: "active" as const },
    { name: "Tom Trainer", role: "Trainer", avatar: "TT", status: "active" as const },
  ],
  topActivities: [
    { name: "Basketball Practice", bookings: 48, revenue: 2400 },
    { name: "Swimming Lessons", bookings: 36, revenue: 3200 },
    { name: "Tennis Coaching", bookings: 28, revenue: 1800 },
  ],
}

// ==================== AddCollaboration ====================
export function AddCollaborationPage({ onNavigate }: BusinessFormPageProps) {
  const [formData, setFormData] = useState({ partnerType: "sponsor", search: "", message: "" })

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-partners")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Collaboration</h1>
          <p className="text-sm text-muted-foreground">Find and propose partnerships</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Partner Type</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "sponsor", label: "Sponsor", icon: DollarSign },
            { value: "athlete", label: "Athlete", icon: Star },
            { value: "business", label: "Business", icon: Building2 },
          ].map((type) => (
            <button
              type="button"
              key={type.value}
              onClick={() => setFormData({ ...formData, partnerType: type.value })}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                formData.partnerType === type.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              )}
            >
              <type.icon className={cn("h-5 w-5", formData.partnerType === type.value ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-xs font-semibold", formData.partnerType === type.value ? "text-primary" : "text-foreground")}>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Find Partner</h3>
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={formData.search} onChange={(e) => setFormData({ ...formData, search: e.target.value })} placeholder="Search by name..." className="h-11 w-full rounded-full border border-border bg-muted pl-10 pr-4 text-sm outline-none focus:border-primary" />
        </div>
        <div className="space-y-2">
          {businessPartners.filter((p) => formData.partnerType === "sponsor" ? p.type === "Sponsor" : p.type === "Athlete").map((partner) => (
            <div key={partner.id} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50">
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">{partner.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{partner.name}</p>
                <p className="text-xs text-muted-foreground">{partner.type}{partner.tier ? ` - ${partner.tier}` : ""}{partner.sport ? ` - ${partner.sport}` : ""}</p>
              </div>
              <button type="button" className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary hover:bg-primary/20">Select</button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Proposal Message</h3>
        <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Write your collaboration proposal..." rows={4} className="w-full rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary resize-none" />
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => onNavigate("business-partners")} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted">Cancel</button>
        <button type="button" onClick={() => onNavigate("business-partners")} className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md hover:opacity-90">Send Proposal</button>
      </div>
    </div>
  )
}

// ==================== BusinessAthletes ====================
export function BusinessAthletesPage({ onNavigate }: BusinessFormPageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Athletes</h1>
          <p className="text-sm text-muted-foreground">Manage influencer and athlete partnerships</p>
        </div>
        <button type="button" onClick={() => onNavigate("add-collaboration")} className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Athlete
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Users className="mb-2 h-5 w-5 text-primary" />
          <p className="text-xl font-bold text-foreground">{athletes.length}</p>
          <p className="text-[11px] text-muted-foreground">Total Athletes</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <TrendingUp className="mb-2 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold text-foreground">{athletes.reduce((sum, a) => sum + a.collaborations, 0)}</p>
          <p className="text-[11px] text-muted-foreground">Collaborations</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Star className="mb-2 h-5 w-5 text-primary" />
          <p className="text-xl font-bold text-foreground">{(athletes.reduce((sum, a) => sum + a.engagement, 0) / athletes.length).toFixed(1)}%</p>
          <p className="text-[11px] text-muted-foreground">Avg Engagement</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <BarChart3 className="mb-2 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold text-foreground">{(athletes.reduce((sum, a) => sum + a.followers, 0) / 1000).toFixed(1)}K</p>
          <p className="text-[11px] text-muted-foreground">Total Reach</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Search athletes..." className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary" />
      </div>

      <div className="space-y-3">
        {athletes.map((athlete) => (
          <div key={athlete.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50">
            <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-xl text-xs font-bold text-white">{athlete.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-foreground">{athlete.name}</p>
                <BadgeCheck className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">{athlete.sport} - {athlete.ranking}</p>
            </div>
            <div className="hidden items-center gap-6 text-xs md:flex">
              <div className="text-center">
                <p className="font-semibold text-foreground">{athlete.followers.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">{athlete.engagement}%</p>
                <p className="text-[10px] text-muted-foreground">Engagement</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">{athlete.collaborations}</p>
                <p className="text-[10px] text-muted-foreground">Collabs</p>
              </div>
            </div>
            <span className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
              athlete.status === "active" ? "bg-green-100 text-green-700" : athlete.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-muted text-muted-foreground"
            )}>{athlete.status}</span>
            <button type="button" className="rounded-full p-2 hover:bg-muted"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== ManageResources ====================
export function ManageResourcesPage({ onNavigate }: BusinessFormPageProps) {
  const [resources, setResources] = useState(
    businessResources.map((r) => ({ ...r, pricePerHour: Math.floor(Math.random() * 50) + 30, available: r.status === "available" }))
  )

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Resources</h1>
          <p className="text-sm text-muted-foreground">Edit pricing and availability</p>
        </div>
        <button type="button" onClick={() => onNavigate("add-resource")} className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Resource</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Price/hr</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Revenue</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={resource.image} alt={resource.name} className="h-10 w-10 rounded-lg object-cover" />
                    <span className="text-xs font-semibold text-foreground">{resource.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{resource.type}</td>
                <td className="px-5 py-3 text-xs font-semibold text-foreground">${resource.pricePerHour}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                    resource.status === "available" ? "bg-green-100 text-green-700" : resource.status === "maintenance" ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"
                  )}>{resource.status}</span>
                </td>
                <td className="px-5 py-3 text-xs font-semibold text-foreground">${resource.revenue}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    <button type="button" className="rounded-full p-1 hover:bg-muted"><Edit3 className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button type="button" className="rounded-full p-1 hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ==================== ManageCustomers ====================
export function ManageCustomersPage({ onNavigate }: BusinessFormPageProps) {
  const customers = [
    { name: "Jordan Rivera", email: "jordan@email.com", bookings: 12, spent: 340, avatar: "JR", notes: "VIP member, prefers morning sessions", lastVisit: "Feb 7, 2026" },
    { name: "Emily Park", email: "emily@email.com", bookings: 8, spent: 220, avatar: "EP", notes: "Interested in swimming programs", lastVisit: "Feb 5, 2026" },
    { name: "David Kim", email: "david@email.com", bookings: 15, spent: 450, avatar: "DK", notes: "Team lead for corporate bookings", lastVisit: "Feb 6, 2026" },
    { name: "Lisa Chen", email: "lisa@email.com", bookings: 5, spent: 125, avatar: "LC", notes: "New member, needs orientation", lastVisit: "Jan 28, 2026" },
    { name: "Mark Brown", email: "mark@email.com", bookings: 3, spent: 75, avatar: "MB", notes: "", lastVisit: "Jan 15, 2026" },
  ]

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Customers</h1>
        <p className="text-sm text-muted-foreground">CRM-style customer management with notes</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Search customers..." className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary" />
      </div>

      <div className="space-y-3">
        {customers.map((customer) => (
          <div key={customer.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white">{customer.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              </div>
              <div className="hidden items-center gap-4 text-xs md:flex">
                <div className="text-center">
                  <p className="font-semibold text-foreground">{customer.bookings}</p>
                  <p className="text-[10px] text-muted-foreground">Bookings</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">${customer.spent}</p>
                  <p className="text-[10px] text-muted-foreground">Spent</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button type="button" className="rounded-full p-2 hover:bg-muted"><Mail className="h-4 w-4 text-muted-foreground" /></button>
                <button type="button" className="rounded-full p-2 hover:bg-muted"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
              </div>
            </div>
            {customer.notes && (
              <div className="mt-3 rounded-xl bg-muted p-3">
                <p className="text-[10px] font-semibold text-muted-foreground">Notes</p>
                <p className="text-xs text-foreground">{customer.notes}</p>
              </div>
            )}
            <p className="mt-2 text-[10px] text-muted-foreground">Last visit: {customer.lastVisit}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== TeamManagement ====================
export function TeamManagementPage({ onNavigate }: BusinessFormPageProps) {
  const teamMembers = businessDashboardData.teamMembers.map((m) => ({
    ...m,
    permissions: m.role === "Head Coach" ? ["all"] : m.role === "Manager" ? ["bookings", "activities", "reports"] : ["bookings", "activities"],
  }))

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
          <p className="text-sm text-muted-foreground">Manage permissions and roles</p>
        </div>
        <button type="button" onClick={() => onNavigate("add-team-member")} className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90">
          <UserPlus className="h-4 w-4" />
          Invite
        </button>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div key={member.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white">{member.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
              <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold", member.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>{member.status}</span>
              <button type="button" className="rounded-full p-2 hover:bg-muted"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="mt-3">
              <p className="mb-2 text-[10px] font-semibold text-muted-foreground">Permissions</p>
              <div className="flex flex-wrap gap-1.5">
                {member.permissions.map((perm) => (
                  <span key={perm} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">{perm}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== BusinessProfile ====================
export function BusinessProfilePage({ onNavigate }: BusinessFormPageProps) {
  const data = businessDashboardData
  const [activeTab, setActiveTab] = useState("overview")
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [businessInfo, setBusinessInfo] = useState({
    name: "Chelsea Piers Sports",
    type: "Sports Complex",
    description: "Premier multi-sport complex in NYC offering basketball, swimming, tennis, and more.",
    location: "Chelsea, NYC",
    phone: "+1 (212) 555-0199",
    email: "info@chelseapierssports.com",
    website: "www.chelseapierssports.com",
    openingHours: "Mon-Fri: 6:00 AM - 10:00 PM",
  })

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const businesses = await businessesService.getMyBusinesses()
        const bizList = businesses?.content || (Array.isArray(businesses) ? businesses : [])
        if (bizList.length > 0) {
          const biz = bizList[0]
          setBusinessId(biz.id)
          setBusinessInfo({
            name: biz.name || '',
            type: biz.type || biz.category || 'Sports Complex',
            description: biz.bio || biz.description || '',
            location: biz.address || biz.city || '',
            phone: biz.phoneNumber || '',
            email: biz.email || '',
            website: biz.website || '',
            openingHours: biz.openingHours || 'Mon-Fri: 6:00 AM - 10:00 PM',
          })
        }
      } catch {
        // Keep defaults on error
      }
    }
    fetchBusiness()
  }, [])

  const handleSave = async () => {
    if (!businessId) {
      setActiveTab("overview")
      return
    }
    setSaving(true)
    try {
      await businessesService.update(businessId, {
        name: businessInfo.name,
        bio: businessInfo.description,
        address: businessInfo.location,
        phoneNumber: businessInfo.phone,
        email: businessInfo.email,
        website: businessInfo.website,
      })
      setActiveTab("overview")
      toast.success("Business profile updated!")
    } catch {
      toast.error("Failed to update business profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="gradient-primary h-32" />
        <div className="px-6 pb-6 pt-6">
          <div className="-mt-12 flex items-end gap-4">
            <div className="gradient-secondary flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-lg">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1 pt-4">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-bold text-foreground">{businessInfo.name}</h1>
                <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{businessInfo.type}</p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => onNavigate("create-activity")}
                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
              >
                Create Activity
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground">{businessInfo.description}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{businessInfo.location}</span>
            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-secondary text-secondary" />4.8 (312 reviews)</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />2,450 followers</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 md:hidden">
            <button
              type="button"
              onClick={() => onNavigate("create-activity")}
              className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              Create Activity
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { key: "overview", label: "Overview" },
          { key: "edit", label: "Edit Profile" },
        ].map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all",
              activeTab === tab.key
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-4 animate-fade-in">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-xl font-bold text-primary">${(data.totalRevenue / 1000).toFixed(1)}K</p>
              <p className="text-[11px] text-muted-foreground">Revenue</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-xl font-bold text-secondary">{data.totalBookings}</p>
              <p className="text-[11px] text-muted-foreground">Bookings</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-xl font-bold text-primary">{data.activeActivities}</p>
              <p className="text-[11px] text-muted-foreground">Activities</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-xl font-bold text-secondary">{data.teamMembers.length}</p>
              <p className="text-[11px] text-muted-foreground">Team</p>
            </div>
          </div>

          {/* Business Info Summary */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Business Information</h3>
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
              >
                <Edit3 className="h-3 w-3" />
                Edit
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: "Phone", value: businessInfo.phone },
                { label: "Email", value: businessInfo.email },
                { label: "Website", value: businessInfo.website },
                { label: "Hours", value: businessInfo.openingHours },
                { label: "Location", value: businessInfo.location },
                { label: "Type", value: businessInfo.type },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
                  <p className="text-xs font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Activities */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Top Activities</h3>
            <div className="space-y-3">
              {data.topActivities.map((activity) => (
                <div key={activity.name} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{activity.name}</span>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{activity.bookings} bookings</span>
                    <span className="font-semibold text-primary">${activity.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "edit" && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-5 text-sm font-bold text-foreground">Edit Business Information</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Business Name</label>
                <input
                  type="text"
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Business Type</label>
                <Select value={businessInfo.type} onValueChange={(val) => setBusinessInfo({ ...businessInfo, type: val })}>
                  <SelectTrigger className="h-10 w-full rounded-xl border border-border bg-background text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Sports Complex", "Gym", "Training Center", "Club", "Academy", "Studio", "Outdoor Facility"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Description</label>
                <textarea
                  value={businessInfo.description}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Location</label>
                  <input
                    type="text"
                    value={businessInfo.location}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, location: e.target.value })}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Phone</label>
                  <input
                    type="tel"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Website</label>
                  <input
                    type="url"
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Opening Hours</label>
                <input
                  type="text"
                  value={businessInfo.openingHours}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, openingHours: e.target.value })}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== AttendanceManagement ====================
export function AttendanceManagementPage({ onNavigate }: BusinessFormPageProps) {
  const [showScanner, setShowScanner] = useState(false)
  const [attendees, setAttendees] = useState([
    { id: "U-1", name: "Jordan Rivera", avatar: "JR", checkedIn: true, time: "5:45 PM" },
    { id: "U-2", name: "Emily Park", avatar: "EP", checkedIn: true, time: "5:50 PM" },
    { id: "U-3", name: "David Kim", avatar: "DK", checkedIn: false, time: "" },
    { id: "U-4", name: "Lisa Chen", avatar: "LC", checkedIn: true, time: "5:55 PM" },
    { id: "U-5", name: "Mark Brown", avatar: "MB", checkedIn: false, time: "" },
    { id: "U-6", name: "Carlos Rivera", avatar: "CR", checkedIn: true, time: "5:58 PM" },
    { id: "U-7", name: "Sarah Lee", avatar: "SL", checkedIn: false, time: "" },
    { id: "U-8", name: "Alex Chen", avatar: "AC", checkedIn: true, time: "6:01 PM" },
  ])

  const checkedInCount = attendees.filter((a) => a.checkedIn).length
  const checkedInUsers = attendees.filter((a) => a.checkedIn).map((a) => a.id)

  const handleScanSuccess = (result: { userId: string }) => {
    setAttendees((prev) =>
      prev.map((attendee) =>
        attendee.id === result.userId
          ? { ...attendee, checkedIn: true, time: "Just now" }
          : attendee
      )
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-activities")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground">5v5 Basketball Pickup Game - Feb 10, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-primary">{checkedInCount}</p>
          <p className="text-[11px] text-muted-foreground">Checked In</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-secondary">{attendees.length - checkedInCount}</p>
          <p className="text-[11px] text-muted-foreground">Pending</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">{attendees.length}</p>
          <p className="text-[11px] text-muted-foreground">Total</p>
        </div>
      </div>

      {/* QR Scan */}
      <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <QrCode className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground">QR Code Scanner</h3>
          <p className="mt-1 text-xs text-muted-foreground">Scan attendee QR codes for quick check-in</p>
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="gradient-primary mt-4 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90"
          >
            Open Scanner
          </button>
        </div>
      </div>

      {/* Attendee List */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-bold text-foreground">Attendees</h3>
        </div>
        <div className="divide-y divide-border">
          {attendees.map((attendee) => (
            <div key={attendee.name} className="flex items-center gap-4 px-5 py-3">
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">{attendee.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{attendee.name}</p>
                {attendee.checkedIn && <p className="text-[10px] text-muted-foreground">Checked in at {attendee.time}</p>}
              </div>
              {attendee.checkedIn ? (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold text-green-700">
                  <CheckCircle className="h-3 w-3" /> Present
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleScanSuccess({ userId: attendee.id })}
                  className="rounded-full border border-primary px-3 py-1 text-[10px] font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  Check In
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="max-w-xl">
          <QRScanner
            activityId="1"
            checkedInUsers={checkedInUsers}
            onScanSuccess={handleScanSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
