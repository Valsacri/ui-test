"use client"

import { useEffect, useMemo, useState, useRef } from "react"
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
} from "lucide-react"
import { toast } from "sonner"
import { sports, activities, businessResources, businessPartners, athletes, businessDashboardData, experienceLevels } from "@/lib/mock-data"
import { QRScanner } from "@/components/sporgates/attendance/qr-scanner"
import { DateTimePicker } from "@/components/sporgates/date-time-picker"
import { CommunicationPhaseContent } from "@/components/sporgates/business/communication-phase-content"
import { MapView } from "@/components/sporgates/map-view"
import { SponsorshipTierBuilder, type SponsorshipTier } from "@/components/sporgates/business/sponsorship-tier-builder"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { activitiesService } from "@/lib/services/activities"
import { businessesService } from "@/lib/services/businesses"
import { facilitiesService } from "@/lib/services/facilities"
import { marketplaceService } from "@/lib/services/marketplace"
import { servicesService } from "@/lib/services/services"
import { useBusinessContext } from "@/lib/business-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BusinessFormPageProps {
  onNavigate: (page: PageRoute) => void
}

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create activity")
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
  const steps = [
    { id: 1, label: "Basic Info", icon: ImageIcon },
    { id: 2, label: "Location", icon: MapPin },
    { id: 3, label: "Schedule", icon: Calendar },
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
  })
  const [skipMapGeocode, setSkipMapGeocode] = useState(false)

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
        })
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
        return formData.location.address && formData.location.city
      case 3:
        return formData.date && formData.time
      default:
        return true
    }
  }

  const handleNext = () => {
    if (!canProceed()) return

    if (currentStep === 3) {
      if (!formData.date || !formData.time) return
      const startDateTime = new Date(`${formData.date}T${formData.time}`)
      const now = new Date()
      if (startDateTime < now) {
        toast.error("Activity start time must be in the future")
        return
      }
      if (formData.duration <= 0) {
        toast.error("Duration must be greater than 0")
        return
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
      const startDateTime = formData.date && formData.time ? `${formData.date}T${formData.time}:00` : undefined

      // Calculate endDateTime based on duration
      let endDateTime = undefined
      if (startDateTime && formData.duration) {
        const startDate = new Date(startDateTime)
        const endDate = new Date(startDate.getTime() + formData.duration * 60000)
        endDateTime = endDate.toISOString().slice(0, 19) // Format as YYYY-MM-DDTHH:mm:ss
      }

      // Find facilityId from selected resources
      const selectedFacilities = availableResources.filter(r => r.resourceType === 'facility' && formData.selectedResources.includes(r.id))
      const facilityId = selectedFacilities.length > 0 ? selectedFacilities[0].id : undefined

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
        toast.success("Activity published successfully!")
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
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={handleBack} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Create New Activity</h1>
          <p className="text-xs text-muted-foreground">Follow the steps to publish a new event</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Stepper */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-8 relative overflow-hidden">
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
                <h3 className="mb-4 text-sm font-bold text-foreground">Location Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">Address</label>
                    <input
                      value={formData.location.address}
                      onChange={(event) => {
                        setSkipMapGeocode(false)
                        setFormData({
                          ...formData,
                          location: { ...formData.location, address: event.target.value },
                        })
                      }
                      }
                      placeholder="Venue address"
                      className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">City</label>
                      <input
                        value={formData.location.city}
                        onChange={(event) => {
                          setSkipMapGeocode(false)
                          setFormData({
                            ...formData,
                            location: { ...formData.location, city: event.target.value },
                          })
                        }
                        }
                        placeholder="e.g. New York"
                        className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Neighborhood</label>
                      <input
                        value={formData.location.neighborhood}
                        onChange={(event) => {
                          setSkipMapGeocode(false)
                          setFormData({
                            ...formData,
                            location: { ...formData.location, neighborhood: event.target.value },
                          })
                        }
                        }
                        placeholder="e.g. Manhattan"
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
                    addressQuery={[formData.location.address, formData.location.city].filter(Boolean).join(", ")}
                    onLocationSelect={(lat, lng) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, lat, lng }
                      })
                    }
                    skipGeocode={skipMapGeocode}
                    onAddressFound={(address, source) => {
                      if (!address) return
                      setSkipMapGeocode(true)
                      setFormData(prev => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          // Only update address text if the update comes from map interaction (drag/click)
                          // If it comes from search/typing, keep the user's input
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
            )
          }

          {
            currentStep === 3 && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-foreground">Schedule</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <DateTimePicker
                      label="Date"
                      type="date"
                      value={formData.date}
                      onChange={(value) => setFormData({ ...formData, date: value })}
                      minDate={new Date().toISOString().split('T')[0]}
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
            currentStep === 4 && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-foreground">Select Resources</h3>

                {/* Resource Controls */}
                <div className="mb-4 space-y-3">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      { id: "all", label: "All" },
                      { id: "facility", label: "Facilities" },
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
                              crossOrigin="anonymous"
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

                {/* Location Card */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
                    <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    Location
                  </h4>
                  <div className="flex items-start gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{formData.location.address || "Not set"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{[formData.location.city, formData.neighborhood].filter(Boolean).join(", ") || "City not specified"}</p>
                    </div>
                    {formData.location.lat && formData.location.lng && (
                      <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-1 rounded-lg shrink-0">
                        📍 GPS Set
                      </span>
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
              </div>
            )
          }

          <div className="mt-8 flex flex-wrap gap-3">
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
                {submitting ? "Publishing..." : "Publish Activity"}
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
    </div>
  )
}

// ==================== CreateCampaign ====================
export function CreateCampaignPage({ onNavigate }: BusinessFormPageProps) {
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
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-campaigns")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Campaign</h1>
          <p className="text-sm text-muted-foreground">Launch a marketing campaign</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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

        <div className="flex gap-3">
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

  const handleCreateBusiness = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const username = formData.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').slice(0, 30)

      await businessesService.create({
        name: formData.name,
        username,
        bio: formData.description,
        address: formData.location, // Map location to address
        phoneNumber: formData.phone,
        email: formData.email,
        website: formData.website,
        type: formData.type,
      }, avatarFile, coverFile)

      onNavigate("business-dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create business")
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
export function AddResourcePage({ onNavigate }: BusinessFormPageProps) {
  const { activeBusinessId } = useBusinessContext()
  const [formData, setFormData] = useState({ name: "", type: "court", pricePerHour: 0, capacity: 0, description: "" })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleAddResource = async () => {
    if (!formData.name.trim()) { setError("Name is required"); return }
    if (!activeBusinessId) { setError("No active business selected"); return }
    setSubmitting(true)
    setError("")
    try {
      await facilitiesService.create({
        name: formData.name.trim(),
        description: formData.description.trim(),
        pricePerHour: formData.pricePerHour,
        capacity: formData.capacity,
        type: formData.type,
        businessId: activeBusinessId,
      })
      onNavigate("business-resources")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add resource"
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-resources")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Resource</h1>
          <p className="text-sm text-muted-foreground">Add a new facility resource</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Resource Type</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {["Court", "Pool", "Studio", "Ring", "Field", "Track", "Gym", "Room"].map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setFormData({ ...formData, type: type.toLowerCase() })}
              className={cn(
                "rounded-xl border-2 px-4 py-3 text-xs font-semibold transition-all",
                formData.type === type.toLowerCase() ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:border-primary/40"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Details</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Resource Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Basketball Court A" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Price per Hour ($)</label>
              <input type="number" value={formData.pricePerHour} onChange={(e) => setFormData({ ...formData, pricePerHour: parseInt(e.target.value) || 0 })} className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Capacity</label>
              <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the resource..." rows={3} className="w-full rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Photo</label>
            <div className="flex h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted hover:border-primary/40">
              <div className="text-center">
                <Upload className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">Upload photo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => onNavigate("business-resources")} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted">Cancel</button>
        <button type="button" onClick={handleAddResource} disabled={submitting} className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50">{submitting ? "Adding..." : "Add Resource"}</button>
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
                    <img src={resource.image} alt={resource.name} className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
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
    } catch {
      // Fail silently for now
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
