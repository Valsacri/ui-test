"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Calendar, Target, Users } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as DateCalendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { campaignsService } from "@/lib/services/campaigns"

interface AddCampaignModalProps {
  isOpen: boolean
  businessId?: string
  onClose: () => void
  submitLabel?: string
  title?: string
  subtitle?: string
  initialValues?: {
    name: string
    objective: "AWARENESS" | "ACTIVITY_BOOKINGS" | "EVENT_ATTENDEES" | "PARTNER_LEADS"
    budget: number
    budgetCurrency: string
    duration: number
    startDate: string
    location: string
    radiusMiles: number
    ageMin: number
    ageMax: number
    gender: "all" | "male" | "female"
    sports: string[]
    segmentType: "cold" | "warm" | "retargeting"
    retargetingSources: string[]
    lookalikeEnabled: boolean
    audienceQualityScore: number
  }
  onCreate: (campaign: {
    name: string
    objective: "AWARENESS" | "ACTIVITY_BOOKINGS" | "EVENT_ATTENDEES" | "PARTNER_LEADS"
    budget: number
    budgetCurrency: string
    duration: number
    startDate: string
    location: string
    radiusMiles: number
    ageMin: number
    ageMax: number
    gender: string
    sports: string[]
    segmentType: "cold" | "warm" | "retargeting"
    retargetingSources: string[]
    lookalikeEnabled: boolean
    audienceQualityScore: number
  }) => void
}

const sportsOptions = ["Running", "Cycling", "Basketball", "Soccer", "Yoga", "Swimming", "Tennis"]
const retargetingOptions = ["site_visitors", "past_bookers", "event_engagers", "abandoned_checkout"]
const budgetCurrencyOptions = ["USD", "EUR", "MAD", "GBP", "CAD", "AUD"]
const DEFAULT_START_DATE = new Date().toISOString().slice(0, 10)

type LocationSuggestion = {
  id: string
  label: string
}

export function AddCampaignModal({
  isOpen,
  businessId,
  onClose,
  onCreate,
  initialValues,
  submitLabel = "Save Campaign",
  title = "Create Campaign",
  subtitle = "Target the right audience for your events",
}: AddCampaignModalProps) {
  const [campaignName, setCampaignName] = useState("")
  const [budget, setBudget] = useState(1200)
  const [budgetCurrency, setBudgetCurrency] = useState("USD")
  const [duration, setDuration] = useState(30)
  const [objective, setObjective] = useState<"AWARENESS" | "ACTIVITY_BOOKINGS" | "EVENT_ATTENDEES" | "PARTNER_LEADS">("ACTIVITY_BOOKINGS")
  const [startDate, setStartDate] = useState(DEFAULT_START_DATE)
  const [location, setLocation] = useState("Casablanca")
  const [radiusUnit, setRadiusUnit] = useState<"miles" | "km">("miles")
  const [radius, setRadius] = useState(20)
  const [ageMin, setAgeMin] = useState(18)
  const [ageMax, setAgeMax] = useState(45)
  const [gender, setGender] = useState<"all" | "male" | "female">("all")
  const [selectedSports, setSelectedSports] = useState<string[]>(["Running", "Cycling"])
  const [segmentType, setSegmentType] = useState<"cold" | "warm" | "retargeting">("cold")
  const [retargetingSources, setRetargetingSources] = useState<string[]>([])
  const [lookalikeEnabled, setLookalikeEnabled] = useState(false)
  const [audienceQualityScore, setAudienceQualityScore] = useState(50)
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [locationOpen, setLocationOpen] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationApiError, setLocationApiError] = useState<string | null>(null)
  const [serverForecastDailyBudget, setServerForecastDailyBudget] = useState<number | null>(null)
  const [governanceWarning, setGovernanceWarning] = useState<string | null>(null)
  const [objectiveOpen, setObjectiveOpen] = useState(false)
  const [genderOpen, setGenderOpen] = useState(false)
  const [segmentOpen, setSegmentOpen] = useState(false)
  const [lookalikeOpen, setLookalikeOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const locationContainerRef = useRef<HTMLDivElement | null>(null)
  const suppressNextLocationLookupRef = useRef(false)
  const selectedStartDate = startDate ? new Date(startDate) : undefined

  const radiusMiles = useMemo(() => {
    const miles = radiusUnit === "km" ? radius / 1.609344 : radius
    return Math.max(5, Math.min(200, Math.round(miles)))
  }, [radius, radiusUnit])

  const setRadiusUnitAndConvert = (nextUnit: "miles" | "km") => {
    if (nextUnit === radiusUnit) return
    const currentMiles = radiusMiles
    const nextValue = nextUnit === "km" ? Math.round(currentMiles * 1.609344) : currentMiles
    setRadiusUnit(nextUnit)
    setRadius(nextValue)
  }

  const forecasts = useMemo(() => {
    const dailyBudget = budget / Math.max(1, duration)
    const reach = Math.round(budget * 45)
    const conversions = Math.round(budget / 20)
    return { dailyBudget, reach, conversions }
  }, [budget, duration])

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((item) => item !== sport) : [...prev, sport]
    )
  }

  const handleSubmit = () => {
    const name = campaignName.trim() || "New Campaign"
    onCreate({
      name,
      objective,
      budget,
      budgetCurrency,
      duration,
      startDate,
      location,
      radiusMiles,
      ageMin,
      ageMax,
      gender,
      sports: selectedSports,
      segmentType,
      retargetingSources,
      lookalikeEnabled,
      audienceQualityScore,
    })
    setCampaignName("")
    setRetargetingSources([])
    setSegmentType("cold")
    setLookalikeEnabled(false)
    setAudienceQualityScore(50)
    setBudgetCurrency("USD")
    setRadiusUnit("miles")
    onClose()
  }

  const toggleRetargetingSource = (source: string) => {
    setRetargetingSources((prev) =>
      prev.includes(source) ? prev.filter((item) => item !== source) : [...prev, source]
    )
  }

  useEffect(() => {
    if (!isOpen) return
    if (initialValues) {
      setCampaignName(initialValues.name)
      setBudget(initialValues.budget)
      setBudgetCurrency(initialValues.budgetCurrency)
      setDuration(initialValues.duration)
      setObjective(initialValues.objective)
      setStartDate(initialValues.startDate)
      setLocation(initialValues.location)
      setRadiusUnit("miles")
      setRadius(initialValues.radiusMiles)
      setAgeMin(initialValues.ageMin)
      setAgeMax(initialValues.ageMax)
      setGender(initialValues.gender)
      setSelectedSports(initialValues.sports)
      setSegmentType(initialValues.segmentType)
      setRetargetingSources(initialValues.retargetingSources)
      setLookalikeEnabled(initialValues.lookalikeEnabled)
      setAudienceQualityScore(initialValues.audienceQualityScore)
      return
    }
    setCampaignName("")
    setBudget(1200)
    setBudgetCurrency("USD")
    setDuration(30)
    setObjective("ACTIVITY_BOOKINGS")
    setStartDate(DEFAULT_START_DATE)
    setLocation("Casablanca")
    setRadiusUnit("miles")
    setRadius(20)
    setAgeMin(18)
    setAgeMax(45)
    setGender("all")
    setSelectedSports(["Running", "Cycling"])
    setSegmentType("cold")
    setRetargetingSources([])
    setLookalikeEnabled(false)
    setAudienceQualityScore(50)
  }, [isOpen, initialValues])

  useEffect(() => {
    if (!isOpen) return
    if (!businessId) {
      setLocationSuggestions([])
      setLocationOpen(false)
      setLocationLoading(false)
      setLocationApiError(null)
      return
    }

    if (suppressNextLocationLookupRef.current) {
      suppressNextLocationLookupRef.current = false
      setLocationSuggestions([])
      setLocationOpen(false)
      setLocationLoading(false)
      setLocationApiError(null)
      return
    }

    const query = location.trim()
    if (query.length < 3) {
      setLocationSuggestions([])
      setLocationOpen(false)
      setLocationLoading(false)
      setLocationApiError(null)
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      setLocationLoading(true)
      setLocationApiError(null)
      try {
        const suggestions = await campaignsService.locationSuggestions(businessId, query)
        setLocationSuggestions(suggestions)
        setLocationOpen(suggestions.length > 0)
      } catch (error) {
        if (controller.signal.aborted) return
        console.error("Location autocomplete failed", error)
        setLocationSuggestions([])
        setLocationOpen(false)
        setLocationApiError("Could not load suggestions right now.")
      } finally {
        if (!controller.signal.aborted) {
          setLocationLoading(false)
        }
      }
    }, 300)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [businessId, isOpen, location])

  useEffect(() => {
    if (!businessId || !isOpen) return
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + duration)

    campaignsService
      .draftForecast(businessId, {
        name: campaignName.trim() || "Draft Campaign",
        objective,
        budgetType: "LIFETIME",
        budgetAmount: budget,
        budgetCurrency,
        startDate,
        endDate: endDate.toISOString().slice(0, 10),
        location,
        radiusMiles,
        ageMin,
        ageMax,
        gender,
        sports: selectedSports,
        segmentType,
        retargetingSources,
        lookalikeEnabled,
        audienceQualityScore,
        utmSource: "sporgates",
        utmMedium: "paid_placement",
        utmCampaign: (campaignName.trim() || "draft_campaign").toLowerCase().replace(/\s+/g, "_").slice(0, 50),
        utmContent: "campaign_builder",
        utmTerm: selectedSports[0]?.toLowerCase(),
        primaryConversionEvent:
          objective === "AWARENESS"
            ? "PROFILE_VISIT"
            : objective === "EVENT_ATTENDEES"
              ? "EVENT_RSVP_CONFIRMED"
              : objective === "PARTNER_LEADS"
                ? "PARTNER_LEAD_SUBMITTED"
                : "ACTIVITY_BOOKED",
        attributionModel: "LAST_TOUCH",
      })
      .then((forecast) => {
        setServerForecastDailyBudget(forecast.dailyBudget)
        setGovernanceWarning(
          forecast.significantEditLikelyToResetLearning
            ? "Frequent significant edits may reset campaign learning."
            : null
        )
      })
      .catch(() => {
        setServerForecastDailyBudget(null)
      })
  }, [
    businessId,
    isOpen,
    campaignName,
    objective,
    budget,
    budgetCurrency,
    duration,
    startDate,
    location,
    radiusMiles,
    ageMin,
    ageMax,
    gender,
    selectedSports,
    segmentType,
    retargetingSources,
    lookalikeEnabled,
    audienceQualityScore,
  ])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const clickedInsideSelectContent = !!target.closest("[data-radix-select-content]")
      const clickedObjectiveTrigger = !!target.closest('[data-select-trigger="objective"]')
      const clickedGenderTrigger = !!target.closest('[data-select-trigger="gender"]')
      const clickedSegmentTrigger = !!target.closest('[data-select-trigger="segment"]')
      const clickedLookalikeTrigger = !!target.closest('[data-select-trigger="lookalike"]')
      const clickedCurrencyTrigger = !!target.closest('[data-select-trigger="currency"]')

      if (objectiveOpen && !clickedInsideSelectContent && !clickedObjectiveTrigger) {
        setObjectiveOpen(false)
      }

      if (genderOpen && !clickedInsideSelectContent && !clickedGenderTrigger) {
        setGenderOpen(false)
      }

      if (segmentOpen && !clickedInsideSelectContent && !clickedSegmentTrigger) {
        setSegmentOpen(false)
      }

      if (lookalikeOpen && !clickedInsideSelectContent && !clickedLookalikeTrigger) {
        setLookalikeOpen(false)
      }

      if (currencyOpen && !clickedInsideSelectContent && !clickedCurrencyTrigger) {
        setCurrencyOpen(false)
      }

      if (locationOpen && locationContainerRef.current && !locationContainerRef.current.contains(target)) {
        setLocationOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown, true)
    return () => document.removeEventListener("mousedown", handlePointerDown, true)
  }, [objectiveOpen, genderOpen, segmentOpen, lookalikeOpen, currencyOpen, locationOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-4xl overflow-y-auto overflow-x-hidden rounded-2xl border-0 p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">Create Campaign</DialogTitle>
        <div className="gradient-primary relative flex items-start justify-between px-4 py-4 text-white sm:px-6 sm:py-5">
          <div>
            <p className="text-lg font-semibold">{title}</p>
            <p className="text-sm text-white/75">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden border-white/30 bg-white/10 text-white sm:inline-flex">
              Draft Setup
            </Badge>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 rounded-full text-white/80 hover:bg-white/15 hover:text-white"
            >
              <span className="text-lg leading-none">&times;</span>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-5 border-b border-border px-4 py-4 sm:px-6 sm:py-5 lg:border-b-0 lg:border-r">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Campaign Name</Label>
              <Input
                value={campaignName}
                onChange={(event) => setCampaignName(event.target.value)}
                placeholder="Spring Sports Push"
                className="mt-1 h-11 rounded-xl bg-background"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Objective</Label>
                <Select
                  open={objectiveOpen}
                  onOpenChange={setObjectiveOpen}
                  value={objective}
                  onValueChange={(value) => {
                    setObjective(value as typeof objective)
                    setObjectiveOpen(false)
                  }}
                >
                  <SelectTrigger data-select-trigger="objective" className="mt-1 h-11 w-full rounded-xl">
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AWARENESS">Awareness</SelectItem>
                    <SelectItem value="ACTIVITY_BOOKINGS">Activity Bookings</SelectItem>
                    <SelectItem value="EVENT_ATTENDEES">Event Attendees</SelectItem>
                    <SelectItem value="PARTNER_LEADS">Partner Leads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-1 h-11 w-full justify-between rounded-xl border-input bg-background font-normal hover:bg-primary/10 hover:text-primary"
                    >
                      <span className={cn("text-sm", startDate ? "text-foreground" : "text-muted-foreground")}>
                        {startDate
                          ? selectedStartDate?.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Select date"}
                      </span>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <DateCalendar
                      mode="single"
                      selected={selectedStartDate}
                      onSelect={(date) => {
                        if (!date) return
                        const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                          .toISOString()
                          .slice(0, 10)
                        setStartDate(dateString)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Duration (days)</Label>
                <Input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value) || 1)}
                  className="mt-1 h-11 rounded-xl bg-background"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Min Age</Label>
                <Input
                  type="number"
                  min={13}
                  max={64}
                  value={ageMin}
                  onChange={(event) => setAgeMin(Number(event.target.value) || 18)}
                  className="mt-1 h-11 rounded-xl bg-background"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Max Age</Label>
                <Input
                  type="number"
                  min={14}
                  max={65}
                  value={ageMax}
                  onChange={(event) => setAgeMax(Number(event.target.value) || 45)}
                  className="mt-1 h-11 rounded-xl bg-background"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Gender</Label>
                <Select
                  open={genderOpen}
                  onOpenChange={setGenderOpen}
                  value={gender}
                  onValueChange={(value) => {
                    setGender(value as typeof gender)
                    setGenderOpen(false)
                  }}
                >
                  <SelectTrigger data-select-trigger="gender" className="mt-1 h-11 w-full rounded-xl">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Audience Segment</Label>
                <Select
                  open={segmentOpen}
                  onOpenChange={setSegmentOpen}
                  value={segmentType}
                  onValueChange={(value) => {
                    setSegmentType(value as typeof segmentType)
                    setSegmentOpen(false)
                  }}
                >
                  <SelectTrigger data-select-trigger="segment" className="mt-1 h-11 w-full rounded-xl">
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cold">Cold Prospecting</SelectItem>
                    <SelectItem value="warm">Warm Audience</SelectItem>
                    <SelectItem value="retargeting">Retargeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Lookalike</Label>
                <Select
                  open={lookalikeOpen}
                  onOpenChange={setLookalikeOpen}
                  value={lookalikeEnabled ? "enabled" : "disabled"}
                  onValueChange={(value) => {
                    setLookalikeEnabled(value === "enabled")
                    setLookalikeOpen(false)
                  }}
                >
                  <SelectTrigger data-select-trigger="lookalike" className="mt-1 h-11 w-full rounded-xl">
                    <SelectValue placeholder="Lookalike status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">Disabled</SelectItem>
                    <SelectItem value="enabled">Enabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Audience Quality</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={audienceQualityScore}
                  onChange={(event) => setAudienceQualityScore(Math.max(0, Math.min(100, Number(event.target.value) || 0)))}
                  className="mt-1 h-11 rounded-xl bg-background"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <Label className="text-xs font-semibold text-muted-foreground">Budget currency</Label>
                <Select
                  open={currencyOpen}
                  onOpenChange={setCurrencyOpen}
                  value={budgetCurrency}
                  onValueChange={(value) => {
                    setBudgetCurrency(value)
                    setCurrencyOpen(false)
                  }}
                >
                  <SelectTrigger data-select-trigger="currency" className="mt-1 h-11 w-full rounded-xl">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetCurrencyOptions.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground">Budget</Label>
                <Input
                  type="number"
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value) || 0)}
                  className="mt-1 h-11 rounded-xl bg-background"
                />
              </div>
            </div>

            <div ref={locationContainerRef} className="relative">
              <Label className="text-xs font-semibold text-muted-foreground">Location</Label>
              <Input
                value={location}
                onFocus={() => {
                  if (locationSuggestions.length > 0) {
                    setLocationOpen(true)
                  }
                }}
                onChange={(event) => {
                  setLocation(event.target.value)
                  if (locationApiError) {
                    setLocationApiError(null)
                  }
                }}
                className="mt-1 h-11 rounded-xl bg-background"
                placeholder="Type city or address (e.g. Casablanca)"
              />
              {locationLoading && (
                <p className="mt-1 text-[11px] text-muted-foreground">Searching suggestions...</p>
              )}
              {locationApiError && (
                <p className="mt-1 text-[11px] text-primary">{locationApiError}</p>
              )}
              {!businessId && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Select a business to enable address suggestions.
                </p>
              )}
              {locationOpen && locationSuggestions.length > 0 && (
                <div className="absolute z-30 mt-1 w-full rounded-xl border border-border bg-popover p-1 shadow-md">
                  {locationSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-accent"
                      onClick={() => {
                        suppressNextLocationLookupRef.current = true
                        setLocation(suggestion.label)
                        setLocationSuggestions([])
                        setLocationOpen(false)
                      }}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-[11px] text-muted-foreground">Radius</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex overflow-hidden rounded-lg border border-border">
                      <Button
                        type="button"
                        variant={radiusUnit === "miles" ? "default" : "ghost"}
                        size="sm"
                        className={cn("h-7 rounded-none px-2 text-[10px]", radiusUnit !== "miles" && "text-muted-foreground")}
                        onClick={() => setRadiusUnitAndConvert("miles")}
                      >
                        miles
                      </Button>
                      <Button
                        type="button"
                        variant={radiusUnit === "km" ? "default" : "ghost"}
                        size="sm"
                        className={cn("h-7 rounded-none px-2 text-[10px]", radiusUnit !== "km" && "text-muted-foreground")}
                        onClick={() => setRadiusUnitAndConvert("km")}
                      >
                        km
                      </Button>
                    </div>
                    <Badge variant="outline" className="h-5 border-primary/30 px-2 text-[10px] text-primary">
                      {radius} {radiusUnit}
                    </Badge>
                  </div>
                </div>
                <Slider
                  min={radiusUnit === "km" ? 8 : 5}
                  max={radiusUnit === "km" ? 80 : 50}
                  step={1}
                  value={[radius]}
                  onValueChange={(value) => setRadius(value[0] ?? radius)}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Target Sports</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {sportsOptions.map((sport) => (
                  <Button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    size="sm"
                    variant={selectedSports.includes(sport) ? "default" : "outline"}
                    className={cn(
                      "h-8 rounded-full px-3 text-[11px] font-medium transition-all",
                      selectedSports.includes(sport)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    {sport}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Retargeting Sources</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {retargetingOptions.map((source) => (
                  <Button
                    key={source}
                    type="button"
                    onClick={() => toggleRetargetingSource(source)}
                    size="sm"
                    variant={retargetingSources.includes(source) ? "default" : "outline"}
                    className={cn(
                      "h-8 rounded-full px-3 text-[11px] font-medium transition-all",
                      retargetingSources.includes(source)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    {source.replaceAll("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
            {budget < 500 && (
              <p className="text-xs text-primary">
                Budget is very low. Campaigns with low spend may stay in learning longer.
              </p>
            )}
            {(segmentType === "retargeting" && retargetingSources.length === 0) && (
              <p className="text-xs text-primary">Retargeting segment selected. Add at least one source before launch.</p>
            )}
            {audienceQualityScore < 35 && (
              <p className="text-xs text-primary">Audience quality is low. Expand sports/location or enable lookalike before launching.</p>
            )}
            {governanceWarning && (
              <p className="text-xs text-primary">{governanceWarning}</p>
            )}
          </div>

          <div className="space-y-4 bg-muted/30 px-4 py-4 sm:px-6 sm:py-5">
            <Card className="rounded-2xl border-border/80 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Forecast</p>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Daily Budget</span>
                    <span className="font-semibold text-foreground">
                      {budgetCurrency}{" "}
                      {serverForecastDailyBudget != null ? serverForecastDailyBudget.toFixed(0) : forecasts.dailyBudget.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Estimated Reach</span>
                    <span className="font-semibold text-foreground">{forecasts.reach.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Expected Conversions</span>
                    <span className="font-semibold text-foreground">{forecasts.conversions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/80 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex min-w-0 items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <p className="truncate text-sm font-semibold text-foreground">Audience Snapshot</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {selectedSports.length} sports
                  </Badge>
                </div>
                <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">
                  Focused on {selectedSports.length} sports within {radius} {radiusUnit} of {location}.
                </p>
                <p className="mt-1 break-words text-[11px] leading-5 text-muted-foreground">
                  Segment: {segmentType}. Lookalike: {lookalikeEnabled ? "enabled" : "disabled"}. Retargeting sources: {retargetingSources.length || 0}.
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(10, (radius / (radiusUnit === "km" ? 80 : 50)) * 100)
                      )}%`,
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Audience breadth</span>
                  <span>
                    {Math.min(
                      100,
                      Math.max(10, Math.round((radius / (radiusUnit === "km" ? 80 : 50)) * 100))
                    )}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border bg-background px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="rounded-xl sm:min-w-[120px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="gradient-primary rounded-xl text-white sm:min-w-[150px]"
          >
            {submitLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
