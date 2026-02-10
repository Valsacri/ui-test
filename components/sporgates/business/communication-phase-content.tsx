"use client"

import { useState } from "react"
import {
  DollarSign,
  Globe,
  Instagram,
  Megaphone,
  Printer,
  Radio,
  Upload,
  UserCheck,
  Youtube,
  Twitter,
  Facebook,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { AthleteCollaborationSelector } from "@/components/sporgates/business/athlete-collaboration-selector"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AthleteOption {
  id: string
  name: string
  sport: string
  followers: number
  ranking?: string
  avatar: string
  verified?: boolean
}

interface CommunicationPhaseContentProps {
  phase: "pre" | "during" | "post"
  printMedia: boolean
  onPrintMediaChange: (value: boolean) => void
  athleteCollab: boolean
  onAthleteCollabChange: (value: boolean) => void
  selectedAthlete?: string
  onSelectAthlete: (athleteId?: string) => void
  athleteSearchQuery: string
  onAthleteSearchChange: (query: string) => void
  selectedDeliverables: string[]
  onDeliverablesChange: (deliverables: string[]) => void
  athletes?: AthleteOption[]
}

const phaseConfig = {
  pre: {
    title: "Pre-Event",
    color: "blue",
    contentPlaceholder: "Share event poster, athlete training videos, countdown posts",
    mediaLabel: "Upload Media Content",
    mediaPlaceholder: "Images, videos (max 50MB)",
    printOptions: ["Flyers", "Posters", "Banners", "Brochures", "Business Cards"],
    budgetLabel: "Digital Marketing Budget",
    budgetNote: "Content creation, ads (excl. influencer fees)",
  },
  during: {
    title: "During Event",
    color: "green",
    contentPlaceholder: "Live stories, real-time updates, sponsor visibility posts",
    mediaLabel: "Upload Live Event Media",
    mediaPlaceholder: "Live event templates, graphics",
    printOptions: ["Signage", "Badges", "Programs", "Sponsor Boards", "Wayfinding Signs"],
    budgetLabel: "Live Coverage Budget",
    budgetNote: "Photography, videography, live streaming (excl. influencer fees)",
  },
  post: {
    title: "Post-Event",
    color: "purple",
    contentPlaceholder: "Recap video, thank you posts, sponsor appreciation",
    mediaLabel: "Upload Recap Media",
    mediaPlaceholder: "Recap templates, thank you graphics",
    printOptions: ["Thank You Cards", "Certificates", "Event Photos", "Sponsor Reports", "Recap Booklets"],
    budgetLabel: "Post-Event Budget",
    budgetNote: "Video editing, report design, follow-up (excl. influencer fees)",
  },
}

const socialPlatforms = [
  { name: "Instagram", icon: Instagram, color: "text-pink-600" },
  { name: "Facebook", icon: Facebook, color: "text-blue-600" },
  { name: "Twitter", icon: Twitter, color: "text-sky-500" },
  { name: "YouTube", icon: Youtube, color: "text-red-600" },
  { name: "Website", icon: Globe, color: "text-muted-foreground" },
]

export function CommunicationPhaseContent({
  phase,
  printMedia,
  onPrintMediaChange,
  athleteCollab,
  onAthleteCollabChange,
  selectedAthlete,
  onSelectAthlete,
  athleteSearchQuery,
  onAthleteSearchChange,
  selectedDeliverables,
  onDeliverablesChange,
  athletes = [],
}: CommunicationPhaseContentProps) {
  const config = phaseConfig[phase]
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [frequency, setFrequency] = useState("Daily")
  const [duration, setDuration] = useState("1 week")
  const [printType, setPrintType] = useState(phaseConfig[phase].printOptions[0])
  const [provider, setProvider] = useState("")

  const togglePlatform = (name: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Megaphone className="h-4 w-4" />
          </div>
          <div>
            <h6 className="text-sm font-semibold text-foreground">Communication Strategy</h6>
            <p className="text-xs text-muted-foreground">What's your message and content plan?</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor={`${phase}-content`} className="text-xs">
              Content & Messaging Plan
            </Label>
            <textarea
              id={`${phase}-content`}
              className="mt-1 min-h-[90px] w-full rounded-xl border border-border bg-muted p-3 text-xs"
              placeholder={config.contentPlaceholder}
            />
          </div>

          <div>
            <Label htmlFor={`${phase}-media`} className="text-xs">
              {config.mediaLabel}
            </Label>
            <label
              htmlFor={`${phase}-media`}
              className="mt-2 flex h-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-muted/40"
            >
              <div className="text-center text-xs text-muted-foreground">
                <Upload className="mx-auto mb-1 h-4 w-4" />
                <span className="font-semibold text-secondary">Click to upload</span> or drag and drop
                <p className="text-[10px]">{config.mediaPlaceholder}</p>
              </div>
              <input id={`${phase}-media`} type="file" className="hidden" multiple accept="image/*,video/*" />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <h6 className="text-sm font-semibold text-foreground">Channels & Frequency</h6>
            <p className="text-xs text-muted-foreground">Where and how often will you communicate?</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-xs">Social Media Platforms</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon
                const isSelected = selectedPlatforms.includes(platform.name)
                return (
                  <button
                    key={platform.name}
                    type="button"
                    onClick={() => togglePlatform(platform.name)}
                    className={
                      "flex flex-col items-center justify-center rounded-xl border px-2 py-2 text-xs transition-colors " +
                      (isSelected ? "border-primary bg-primary/10" : "border-border hover:bg-muted")
                    }
                  >
                    <Icon className={`h-4 w-4 ${platform.color}`} />
                    <span className="mt-1 text-[10px]">{platform.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`${phase}-frequency`} className="text-xs">
                Posting Frequency
              </Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="mt-1 h-9 w-full rounded-xl border border-border bg-muted px-3 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Every 2 days">Every 2 days</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor={`${phase}-duration`} className="text-xs">
                Campaign Duration
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="mt-1 h-9 w-full rounded-xl border border-border bg-muted px-3 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 week">1 week</SelectItem>
                  <SelectItem value="2 weeks">2 weeks</SelectItem>
                  <SelectItem value="1 month">1 month</SelectItem>
                  <SelectItem value="2 months">2 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <h6 className="text-sm font-semibold text-foreground">Budget & Resources</h6>
            <p className="text-xs text-muted-foreground">Cost estimates and service providers</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor={`${phase}-budget`} className="text-xs">
              {config.budgetLabel}
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
              <Input id={`${phase}-budget`} type="number" placeholder="0.00" className="h-9 pl-6 text-xs" />
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">{config.budgetNote}</p>
          </div>

          <div className={printMedia ? "rounded-xl border border-primary/20 bg-primary/5 p-3" : "rounded-xl border border-border p-3"}>
            <div className="flex items-center justify-between">
              <Label htmlFor={`${phase}-print-toggle`} className="text-xs">
                <span className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Print Media Materials
                </span>
                <span className="block text-[10px] text-muted-foreground">Physical promotional materials</span>
              </Label>
              <Switch id={`${phase}-print-toggle`} checked={printMedia} onCheckedChange={onPrintMediaChange} />
            </div>
            {printMedia && (
              <div className="mt-3 space-y-3 border-t border-border pt-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`${phase}-print-type`} className="text-xs">Type</Label>
                    <Select value={printType} onValueChange={setPrintType}>
                      <SelectTrigger className="mt-1 h-9 w-full rounded-xl border border-border bg-muted px-2 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {config.printOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`${phase}-print-units`} className="text-xs">Quantity</Label>
                    <Input id={`${phase}-print-units`} type="number" placeholder="0" className="mt-1 h-9 text-xs" />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`${phase}-print-provider`} className="text-xs">Service Provider</Label>
                  <Select value={provider} onValueChange={setProvider}>
                    <SelectTrigger className="mt-1 h-9 w-full rounded-xl border border-border bg-muted px-2 text-xs">
                      <SelectValue placeholder="Select provider..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PrintHub Co.">PrintHub Co.</SelectItem>
                      <SelectItem value="QuickPrint Services">QuickPrint Services</SelectItem>
                      <SelectItem value="ProDesign Printing">ProDesign Printing</SelectItem>
                      <SelectItem value="FastTrack Media">FastTrack Media</SelectItem>
                      <SelectItem value="Custom Provider">Custom Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`${phase}-print-cost`} className="text-xs">Print Cost</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                    <Input id={`${phase}-print-cost`} type="number" placeholder="0.00" className="h-9 pl-6 text-xs" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={athleteCollab ? "rounded-xl border border-secondary/20 bg-secondary/10 p-3" : "rounded-xl border border-border p-3"}>
            <div className="flex items-center justify-between">
              <Label htmlFor={`${phase}-athlete-toggle`} className="text-xs">
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Athlete/Influencer Collaboration
                </span>
                <span className="block text-[10px] text-muted-foreground">Partner with athletes or influencers</span>
              </Label>
              <Switch id={`${phase}-athlete-toggle`} checked={athleteCollab} onCheckedChange={onAthleteCollabChange} />
            </div>
            {athleteCollab && (
              <div className="mt-3 border-t border-border pt-3">
                <AthleteCollaborationSelector
                  phase={phase}
                  athletes={athletes}
                  selectedAthlete={selectedAthlete}
                  onSelectAthlete={onSelectAthlete}
                  searchQuery={athleteSearchQuery}
                  onSearchChange={onAthleteSearchChange}
                  selectedDeliverables={selectedDeliverables}
                  onDeliverablesChange={onDeliverablesChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
