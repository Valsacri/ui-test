"use client"

import { useEffect, useMemo, useState } from "react"
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
  onCreate: (campaign: {
    name: string
    objective: "AWARENESS" | "ACTIVITY_BOOKINGS" | "EVENT_ATTENDEES" | "PARTNER_LEADS"
    budget: number
    duration: number
    startDate: string
    location: string
    radius: number
    ageMin: number
    ageMax: number
    gender: string
    sports: string[]
  }) => void
}

const sportsOptions = ["Running", "Cycling", "Basketball", "Soccer", "Yoga", "Swimming", "Tennis"]
const retargetingOptions = ["site_visitors", "past_bookers", "event_engagers", "abandoned_checkout"]

export function AddCampaignModal({ isOpen, businessId, onClose, onCreate }: AddCampaignModalProps) {
  const [campaignName, setCampaignName] = useState("")
  const [budget, setBudget] = useState(1200)
  const [duration, setDuration] = useState(30)
  const [objective, setObjective] = useState<"AWARENESS" | "ACTIVITY_BOOKINGS" | "EVENT_ATTENDEES" | "PARTNER_LEADS">("ACTIVITY_BOOKINGS")
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [location, setLocation] = useState("New York, NY")
  const [radius, setRadius] = useState(20)
  const [ageMin, setAgeMin] = useState(18)
  const [ageMax, setAgeMax] = useState(45)
  const [gender, setGender] = useState<"all" | "male" | "female">("all")
  const [selectedSports, setSelectedSports] = useState<string[]>(["Running", "Cycling"])
  const [segmentType, setSegmentType] = useState<"cold" | "warm" | "retargeting">("cold")
  const [retargetingSources, setRetargetingSources] = useState<string[]>([])
  const [lookalikeEnabled, setLookalikeEnabled] = useState(false)
  const [audienceQualityScore, setAudienceQualityScore] = useState(50)
  const [serverForecastDailyBudget, setServerForecastDailyBudget] = useState<number | null>(null)
  const [governanceWarning, setGovernanceWarning] = useState<string | null>(null)
  const [objectiveOpen, setObjectiveOpen] = useState(false)
  const [genderOpen, setGenderOpen] = useState(false)
  const selectedStartDate = startDate ? new Date(startDate) : undefined

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
      duration,
      startDate,
      location,
      radius,
      ageMin,
      ageMax,
      gender,
      sports: selectedSports,
    })
    setCampaignName("")
    setRetargetingSources([])
    setSegmentType("cold")
    setLookalikeEnabled(false)
    setAudienceQualityScore(50)
    onClose()
  }

  const toggleRetargetingSource = (source: string) => {
    setRetargetingSources((prev) =>
      prev.includes(source) ? prev.filter((item) => item !== source) : [...prev, source]
    )
  }

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
        startDate,
        endDate: endDate.toISOString().slice(0, 10),
        location,
        radiusMiles: radius,
        ageMin,
        ageMax,
        gender,
        sports: selectedSports,
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
  }, [businessId, isOpen, campaignName, objective, budget, duration, startDate, location, radius, ageMin, ageMax, gender, selectedSports])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const clickedInsideSelectContent = !!target.closest("[data-radix-select-content]")
      const clickedObjectiveTrigger = !!target.closest('[data-select-trigger="objective"]')
      const clickedGenderTrigger = !!target.closest('[data-select-trigger="gender"]')

      if (objectiveOpen && !clickedInsideSelectContent && !clickedObjectiveTrigger) {
        setObjectiveOpen(false)
      }

      if (genderOpen && !clickedInsideSelectContent && !clickedGenderTrigger) {
        setGenderOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown, true)
    return () => document.removeEventListener("mousedown", handlePointerDown, true)
  }, [objectiveOpen, genderOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-4xl overflow-y-auto overflow-x-hidden rounded-2xl border-0 p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">Create Campaign</DialogTitle>
        <div className="gradient-primary relative flex items-start justify-between px-4 py-4 text-white sm:px-6 sm:py-5">
          <div>
            <p className="text-lg font-semibold">Create Campaign</p>
            <p className="text-sm text-white/75">Target the right audience for your events</p>
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
                <Select value={segmentType} onValueChange={(value) => setSegmentType(value as typeof segmentType)}>
                  <SelectTrigger className="mt-1 h-11 w-full rounded-xl">
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
                <Select value={lookalikeEnabled ? "enabled" : "disabled"} onValueChange={(value) => setLookalikeEnabled(value === "enabled")}>
                  <SelectTrigger className="mt-1 h-11 w-full rounded-xl">
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

            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Budget ($)</Label>
              <Input
                type="number"
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value) || 0)}
                className="mt-1 h-11 rounded-xl bg-background"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Location</Label>
              <Input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="mt-1 h-11 rounded-xl bg-background"
              />
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-[11px] text-muted-foreground">Radius</Label>
                  <Badge variant="outline" className="h-5 border-primary/30 px-2 text-[10px] text-primary">{radius} miles</Badge>
                </div>
                <Slider
                  min={5}
                  max={50}
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
                      ${serverForecastDailyBudget != null ? serverForecastDailyBudget.toFixed(0) : forecasts.dailyBudget.toFixed(0)}
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
                  Focused on {selectedSports.length} sports within {radius} miles of {location}.
                </p>
                <p className="mt-1 break-words text-[11px] leading-5 text-muted-foreground">
                  Segment: {segmentType}. Lookalike: {lookalikeEnabled ? "enabled" : "disabled"}. Retargeting sources: {retargetingSources.length || 0}.
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${Math.min(100, Math.max(10, (radius / 50) * 100))}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Audience breadth</span>
                  <span>{Math.min(100, Math.max(10, Math.round((radius / 50) * 100)))}%</span>
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
            Save Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
