"use client"

import { useMemo, useState } from "react"
import { Calendar, DollarSign, MapPin, Target, Users } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface AddCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (campaign: {
    name: string
    budget: number
    duration: number
    location: string
    radius: number
    sports: string[]
  }) => void
}

const sportsOptions = ["Running", "Cycling", "Basketball", "Soccer", "Yoga", "Swimming", "Tennis"]

export function AddCampaignModal({ isOpen, onClose, onCreate }: AddCampaignModalProps) {
  const [campaignName, setCampaignName] = useState("")
  const [budget, setBudget] = useState(1200)
  const [duration, setDuration] = useState(30)
  const [location, setLocation] = useState("New York, NY")
  const [radius, setRadius] = useState(20)
  const [selectedSports, setSelectedSports] = useState<string[]>(["Running", "Cycling"])

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
      budget,
      duration,
      location,
      radius,
      sports: selectedSports,
    })
    setCampaignName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0">
        <DialogTitle className="sr-only">Create Campaign</DialogTitle>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Create Campaign</p>
            <p className="text-xs text-muted-foreground">Target the right audience for your events</p>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-5 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Campaign Name</label>
              <input
                value={campaignName}
                onChange={(event) => setCampaignName(event.target.value)}
                placeholder="Spring Sports Push"
                className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Start Date</label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <input type="date" className="w-full bg-transparent text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Duration (days)</label>
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value) || 1)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Budget ($)</label>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value) || 0)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Location</label>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <div className="mt-3">
                <label className="text-[11px] text-muted-foreground">Radius: {radius} miles</label>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={radius}
                  onChange={(event) => setRadius(Number(event.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Target Sports</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {sportsOptions.map((sport) => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                      selectedSports.includes(sport)
                        ? "bg-secondary text-white"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="gradient-primary flex-1 rounded-xl py-2 text-xs font-semibold text-white"
              >
                Save Campaign
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Forecast</p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Daily Budget</span>
                  <span className="font-semibold text-foreground">${forecasts.dailyBudget.toFixed(0)}</span>
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
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                <p className="text-sm font-semibold text-foreground">Audience Snapshot</p>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Focused on {selectedSports.length} sports within {radius} miles of {location}.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
