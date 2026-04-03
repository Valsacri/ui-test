"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { postsService, activitiesService, marketplaceService, servicesService, facilitiesService, campaignsService } from "@/lib/services"
import type { CampaignCreativeDestinationType, CreateCampaignCreativeCommand } from "@/lib/types/campaign"
import { toast } from "sonner"

type DestinationChoice = {
  id: string
  title: string
  subtitle?: string
  imageUrl?: string
}

type Props = {
  open: boolean
  onClose: () => void
  businessId: string
  campaignId: string
  /** Used for BUSINESS_PROFILE destination */
  activeBusinessId: string
  onCreated?: () => void
}

const DESTINATION_OPTIONS: Array<{ value: CampaignCreativeDestinationType; label: string }> = [
  { value: "BUSINESS_PROFILE", label: "Business profile" },
  { value: "POST", label: "Post" },
  { value: "ACTIVITY", label: "Activity" },
  { value: "PRODUCT", label: "Product" },
  { value: "SERVICE", label: "Service" },
  { value: "FACILITY", label: "Facility" },
]

export function AddCampaignCreativeModal({ open, onClose, businessId, campaignId, activeBusinessId, onCreated }: Props) {
  const [submitting, setSubmitting] = useState(false)

  const [destinationType, setDestinationType] = useState<CampaignCreativeDestinationType>("BUSINESS_PROFILE")
  const [destinationQuery, setDestinationQuery] = useState("")
  const [destinationId, setDestinationId] = useState<string | undefined>(undefined)
  const [destinationChoices, setDestinationChoices] = useState<DestinationChoice[]>([])
  const [destinationLoading, setDestinationLoading] = useState(false)

  const [angle, setAngle] = useState("Outcome")
  const [hook, setHook] = useState("")
  const [headline, setHeadline] = useState("")
  const [primaryText, setPrimaryText] = useState("")
  const [cta, setCta] = useState("Learn More")
  const [control, setControl] = useState(false)

  const [hookTouched, setHookTouched] = useState(false)
  const [headlineTouched, setHeadlineTouched] = useState(false)
  const [primaryTextTouched, setPrimaryTextTouched] = useState(false)
  const [ctaTouched, setCtaTouched] = useState(false)
  const [angleTouched, setAngleTouched] = useState(false)

  const selectedChoice = useMemo(
    () => destinationChoices.find((c) => c.id === destinationId) ?? null,
    [destinationChoices, destinationId]
  )

  const suggestedCta = useMemo(() => {
    if (destinationType === "ACTIVITY" || destinationType === "FACILITY") return "Book Now"
    if (destinationType === "PRODUCT") return "Shop Now"
    if (destinationType === "SERVICE") return "View Details"
    if (destinationType === "POST") return "View Post"
    return "Learn More"
  }, [destinationType])

  const resetSuggestions = () => {
    setAngleTouched(false)
    setHookTouched(false)
    setHeadlineTouched(false)
    setPrimaryTextTouched(false)
    setCtaTouched(false)
    setAngle("")
    setHook("")
    setHeadline("")
    setPrimaryText("")
    setCta("")
  }

  useEffect(() => {
    if (!open) return
    // Reset picker state each open.
    setDestinationQuery("")
    setDestinationLoading(false)
    setAngleTouched(false)
    setHookTouched(false)
    setHeadlineTouched(false)
    setPrimaryTextTouched(false)
    setCtaTouched(false)
    if (destinationType === "BUSINESS_PROFILE") {
      setDestinationId(activeBusinessId)
      setDestinationChoices([
        { id: activeBusinessId, title: "Business profile", subtitle: "Send users to your business page" },
      ])
    } else {
      setDestinationId(undefined)
      setDestinationChoices([])
    }
  }, [open, destinationType, activeBusinessId])

  useEffect(() => {
    if (!open) return
    if (destinationType === "BUSINESS_PROFILE") return

    let cancelled = false
    const run = async () => {
      setDestinationLoading(true)
      try {
        const q = destinationQuery.trim().toLowerCase()
        const matches = (items: DestinationChoice[]) =>
          q ? items.filter((i) => (i.title + " " + (i.subtitle ?? "")).toLowerCase().includes(q)) : items

        let items: DestinationChoice[] = []

        if (destinationType === "POST") {
          const page = await postsService.getByBusiness(activeBusinessId, 0, 30)
          items = (page?.content ?? []).map((p: any) => ({
            id: String(p.id),
            title: (p.content ? String(p.content).slice(0, 64) : "Post").trim() || "Post",
            subtitle: p.postKind ? String(p.postKind).replaceAll("_", " ") : undefined,
            imageUrl: (Array.isArray(p.images) ? p.images[0] : undefined) || p.image || p.coverImage || undefined,
          }))
        } else if (destinationType === "PRODUCT") {
          const list = await marketplaceService.getAll({ sellerId: activeBusinessId })
          items = (Array.isArray(list) ? list : list?.content ?? []).slice(0, 50).map((p: any) => ({
            id: String(p.id),
            title: String(p.name ?? "Product"),
            subtitle: p.category ? String(p.category) : undefined,
            imageUrl: p.image || p.coverImage || (Array.isArray(p.imageUrls) ? p.imageUrls[0] : undefined) || undefined,
          }))
        } else if (destinationType === "SERVICE") {
          const list = await servicesService.getAll({ providerId: activeBusinessId })
          items = (Array.isArray(list) ? list : list?.content ?? []).slice(0, 50).map((s: any) => ({
            id: String(s.id),
            title: String(s.name ?? "Service"),
            subtitle: s.category ? String(s.category) : undefined,
            imageUrl: s.image || s.coverImage || (Array.isArray(s.imageUrls) ? s.imageUrls[0] : undefined) || undefined,
          }))
        } else if (destinationType === "FACILITY") {
          const list = await facilitiesService.getAll({ businessId: activeBusinessId })
          items = (Array.isArray(list) ? list : list?.content ?? []).slice(0, 50).map((f: any) => ({
            id: String(f.id),
            title: String(f.name ?? "Facility"),
            subtitle: [f.city, f.state].filter(Boolean).join(", ") || undefined,
            imageUrl: f.coverImage || (Array.isArray(f.imageUrls) ? f.imageUrls[0] : undefined) || f.image || undefined,
          }))
        } else if (destinationType === "ACTIVITY") {
          // Load activities scoped to organizer when supported.
          const list = await activitiesService.getAll({ organizerId: activeBusinessId })
          const arr = Array.isArray(list) ? list : list?.content ?? []
          items = arr
            .slice(0, 50)
            .map((a: any) => ({
              id: String(a.id),
              title: String(a.name ?? a.title ?? "Activity"),
              subtitle: a.sportId ? String(a.sportId) : undefined,
              imageUrl: a.coverImage || (Array.isArray(a.imageUrls) ? a.imageUrls[0] : undefined) || a.image || undefined,
            }))
        }

        const final = matches(items)
        if (!cancelled) setDestinationChoices(final)
      } catch (e) {
        if (!cancelled) setDestinationChoices([])
      } finally {
        if (!cancelled) setDestinationLoading(false)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [open, destinationType, destinationQuery, activeBusinessId])

  // Auto-fill suggestions when a destination is selected (without overwriting user edits).
  useEffect(() => {
    if (!open) return

    const postKind = (selectedChoice?.subtitle ?? "").toUpperCase().replaceAll(" ", "_")

    // Type-level defaults apply immediately when destination type changes,
    // even before selecting a specific destination item.
    if (!angleTouched && !angle.trim()) {
      if (destinationType === "BUSINESS_PROFILE") setAngle("Awareness")
      else if (destinationType === "ACTIVITY") setAngle("Bookings")
      else if (destinationType === "FACILITY") setAngle("Reservations")
      else if (destinationType === "PRODUCT") setAngle("Sales")
      else if (destinationType === "SERVICE") setAngle("Leads")
      else if (destinationType === "POST") setAngle("Engagement")
      else setAngle("Outcome")
    }
    if (!ctaTouched) {
      if (destinationType === "BUSINESS_PROFILE") setCta("Learn More")
      else if (destinationType === "ACTIVITY") setCta("View Activity")
      else if (destinationType === "FACILITY") setCta("View Facility")
      else if (destinationType === "PRODUCT") setCta("View Product")
      else if (destinationType === "SERVICE") setCta("View Service")
      else if (destinationType === "POST") setCta("View Post")
      else setCta(suggestedCta)
    }
    if (!headlineTouched && !headline.trim()) {
      if (destinationType === "BUSINESS_PROFILE") setHeadline("Visit our business profile")
      else if (destinationType === "ACTIVITY") setHeadline("Find your next activity")
      else if (destinationType === "FACILITY") setHeadline("Discover our facilities")
      else if (destinationType === "PRODUCT") setHeadline("Explore our products")
      else if (destinationType === "SERVICE") setHeadline("Discover our services")
      else if (destinationType === "POST") setHeadline("Check out our latest post")
    }
    if (!hookTouched && !hook.trim()) {
      if (destinationType === "BUSINESS_PROFILE") setHook("Discover what we offer")
      else if (destinationType === "ACTIVITY") setHook("Discover this activity and join today")
      else if (destinationType === "FACILITY") setHook("Discover this facility and reserve your slot")
      else if (destinationType === "PRODUCT") setHook("Discover this product and level up your game")
      else if (destinationType === "SERVICE") setHook("Discover this service built for your goals")
      else if (destinationType === "POST") setHook("Discover this post and what’s new")
    }
    if (!primaryTextTouched && !primaryText.trim()) {
      if (destinationType === "BUSINESS_PROFILE") {
        setPrimaryText("Tap to see our latest activities, services, and updates.")
      } else if (destinationType === "ACTIVITY") {
        setPrimaryText("Tap to view this activity, check details, and book your spot.")
      } else if (destinationType === "FACILITY") {
        setPrimaryText("Tap to view this facility, explore features, and reserve your time.")
      } else if (destinationType === "PRODUCT") {
        setPrimaryText("Tap to view this product, check pricing, and see availability.")
      } else if (destinationType === "SERVICE") {
        setPrimaryText("Tap to view this service, what’s included, and how to book.")
      } else if (destinationType === "POST") {
        setPrimaryText("Tap to view this post and learn more.")
      }
    }

    if (destinationType === "BUSINESS_PROFILE") return
    if (!selectedChoice) return

    const name = selectedChoice.title
    const meta = selectedChoice.subtitle ? ` (${selectedChoice.subtitle})` : ""
    const isPost = destinationType === "POST"
    const isPostNewProduct = isPost && postKind === "NEW_PRODUCT"
    const isPostNewService = isPost && postKind === "NEW_SERVICE"
    const isPostNewFacility = isPost && postKind === "NEW_FACILITY"
    const isPostUpcomingEvent = isPost && postKind === "UPCOMING_EVENT"

    if (!angleTouched) {
      if (destinationType === "ACTIVITY") setAngle("Bookings")
      else if (destinationType === "FACILITY") setAngle("Reservations")
      else if (destinationType === "PRODUCT") setAngle("Sales")
      else if (destinationType === "SERVICE") setAngle("Leads")
      else if (isPostNewProduct) setAngle("Sales")
      else if (isPostNewService) setAngle("Leads")
      else if (isPostNewFacility) setAngle("Reservations")
      else if (isPostUpcomingEvent) setAngle("Event Attendees")
      else if (isPost) setAngle("Engagement")
      else setAngle("Outcome")
    }

    if (!ctaTouched) {
      if (destinationType === "ACTIVITY" || isPostUpcomingEvent) setCta("Book Now")
      else if (destinationType === "FACILITY" || isPostNewFacility) setCta("Book Now")
      else if (destinationType === "PRODUCT" || isPostNewProduct) setCta("Shop Now")
      else if (destinationType === "SERVICE" || isPostNewService) setCta("View Details")
      else if (isPost) setCta("View Post")
      else setCta(suggestedCta)
    }

    if (!headlineTouched) {
      let h = name
      if (destinationType === "ACTIVITY") h = `Book ${name}`
      else if (destinationType === "FACILITY") h = `Reserve ${name}`
      else if (destinationType === "PRODUCT") h = `${name} is available now`
      else if (destinationType === "SERVICE") h = `Discover ${name}`
      else if (isPostNewProduct) h = `New product: ${name}`
      else if (isPostNewService) h = `New service: ${name}`
      else if (isPostNewFacility) h = `New facility: ${name}`
      else if (isPostUpcomingEvent) h = `Upcoming event: ${name}`
      else if (isPost) h = `See this post: ${name}`
      if (h.length > 55) h = `${h.slice(0, 52)}…`
      setHeadline(h)
    }
    if (!hookTouched) {
      if (destinationType === "ACTIVITY") setHook("Limited spots — book today")
      else if (destinationType === "FACILITY") setHook("Reserve your slot in minutes")
      else if (destinationType === "PRODUCT") setHook("New gear drop — don’t miss out")
      else if (destinationType === "SERVICE") setHook("Upgrade your performance")
      else if (isPostNewProduct) setHook("Fresh drop just landed")
      else if (isPostNewService) setHook("Try our newest service")
      else if (isPostNewFacility) setHook("Train in our newest space")
      else if (isPostUpcomingEvent) setHook("Spots are filling fast")
      else if (isPost) setHook("See what’s new")
      else setHook("Learn more")
    }
    if (!primaryTextTouched) {
      if (destinationType === "ACTIVITY") setPrimaryText(`Join "${name}"${meta}. Tap to view details and book your spot.`)
      else if (destinationType === "FACILITY") setPrimaryText(`Book "${name}"${meta} now. Tap to view availability and reserve your time.`)
      else if (destinationType === "PRODUCT") setPrimaryText(`Shop "${name}"${meta}. Tap to see pricing, details, and availability.`)
      else if (destinationType === "SERVICE") setPrimaryText(`Explore "${name}"${meta}. Tap to see what’s included and how to book.`)
      else if (isPostNewProduct) setPrimaryText(`Check out our new product "${name}"${meta}. See specs, pricing, and availability.`)
      else if (isPostNewService) setPrimaryText(`Discover our new service "${name}"${meta}. Tap for details and booking options.`)
      else if (isPostNewFacility) setPrimaryText(`Explore our new facility "${name}"${meta}. Tap to see features and reserve a slot.`)
      else if (isPostUpcomingEvent) setPrimaryText(`Don’t miss "${name}"${meta}. Tap to view event details and secure your place.`)
      else if (isPost) setPrimaryText(`Tap to view the post: "${name}".`)
      else setPrimaryText(`Tap to learn more about "${name}".`)
    }
  }, [
    open,
    destinationType,
    selectedChoice,
    suggestedCta,
    ctaTouched,
    angleTouched,
    headlineTouched,
    hookTouched,
    primaryTextTouched,
    headline,
    hook,
    primaryText,
    angle,
  ])

  const canSubmit = angle.trim() && hook.trim() && headline.trim() && primaryText.trim() && cta.trim() && destinationType && (destinationType === "BUSINESS_PROFILE" || !!destinationId)

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const payload: CreateCampaignCreativeCommand = {
        angle: angle.trim(),
        hook: hook.trim(),
        headline: headline.trim(),
        primaryText: primaryText.trim(),
        cta: cta.trim(),
        control,
        destinationType,
        destinationId: destinationType === "BUSINESS_PROFILE" ? activeBusinessId : destinationId,
      }
      await campaignsService.addCreative(businessId, campaignId, payload)
      toast.success("Creative added")
      onCreated?.()
      onClose()
    } catch (e) {
      toast.error("Failed to add creative")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-3xl overflow-y-auto overflow-x-hidden rounded-2xl border-0 p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">Add Creative</DialogTitle>
        <div className="gradient-primary px-5 py-4 text-white">
          <p className="text-lg font-semibold">Add Ad Creative</p>
          <p className="text-sm text-white/75">Choose what you’re promoting and write the ad copy</p>
        </div>

        <div className="space-y-6 px-5 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Promote</Label>
              <Select value={destinationType} onValueChange={(v) => setDestinationType(v as CampaignCreativeDestinationType)}>
                <SelectTrigger className="mt-1 h-11 rounded-xl">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {destinationType !== "BUSINESS_PROFILE" ? (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Search</Label>
                <Input
                  value={destinationQuery}
                  onChange={(e) => setDestinationQuery(e.target.value)}
                  placeholder="Type to filter…"
                  className="mt-1 h-11 rounded-xl bg-background"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-muted/30 p-3">
                <p className="text-xs font-semibold text-foreground">Business profile</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Users will land on your business page.</p>
              </div>
            )}
          </div>

          {destinationType !== "BUSINESS_PROFILE" && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-foreground">Select destination</p>
              <div className="mt-3 space-y-2">
                {destinationLoading ? (
                  <p className="text-xs text-muted-foreground">Loading…</p>
                ) : destinationChoices.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No matches. Try another keyword.</p>
                ) : (
                  destinationChoices.slice(0, 8).map((choice) => {
                    const selected = choice.id === destinationId
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => setDestinationId(choice.id)}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left transition-colors",
                          selected ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            {choice.imageUrl ? (
                              <img src={choice.imageUrl} alt={choice.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className={cn("truncate text-sm font-semibold", selected ? "text-primary" : "text-foreground")}>
                              {choice.title}
                            </p>
                            {choice.subtitle && <p className="mt-1 truncate text-xs text-muted-foreground">{choice.subtitle}</p>}
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Angle</Label>
              <Input
                value={angle}
                onChange={(e) => {
                  setAngleTouched(true)
                  setAngle(e.target.value)
                }}
                className="mt-1 h-11 rounded-xl bg-background"
              />
            </div>
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <input type="checkbox" checked={control} onChange={(e) => setControl(e.target.checked)} />
                Control (A/B test baseline)
              </label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Hook</Label>
              <Input
                value={hook}
                onChange={(e) => {
                  setHookTouched(true)
                  setHook(e.target.value)
                }}
                placeholder="Grab attention fast"
                className="mt-1 h-11 rounded-xl bg-background"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Headline</Label>
              <Input
                value={headline}
                onChange={(e) => {
                  setHeadlineTouched(true)
                  setHeadline(e.target.value)
                }}
                placeholder="Short, clear benefit"
                className="mt-1 h-11 rounded-xl bg-background"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-muted-foreground">Primary text</Label>
            <textarea
              value={primaryText}
              onChange={(e) => {
                setPrimaryTextTouched(true)
                setPrimaryText(e.target.value)
              }}
              rows={4}
              placeholder="Explain what it is and why it matters…"
              className="mt-1 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">CTA</Label>
              <Input
                value={cta}
                onChange={(e) => {
                  setCtaTouched(true)
                  setCta(e.target.value)
                }}
                className="mt-1 h-11 rounded-xl bg-background"
              />
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-foreground">Preview</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetSuggestions}
                  className="h-7 rounded-md px-2 text-[10px]"
                >
                  Reset suggestions
                </Button>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">{headline || "Headline"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{primaryText || "Primary text"}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Destination: {destinationType}{selectedChoice?.title ? ` • ${selectedChoice.title}` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border bg-background px-5 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" className="gradient-primary rounded-xl text-white" onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? "Saving…" : "Add Creative"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

