"use client"

import { useState } from "react"
import {
  Calendar,
  Eye,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  MapPin,
  Plus,
  TrendingUp,
  Upload,
  Users,
  X,
} from "lucide-react"

interface PastEvent {
  id: string
  name: string
  date: string
  location: string
  metrics: {
    attendance: number
    mediaReach: number
    engagementRate: number
    geographicReach: string[]
  }
  proof: {
    photos: string[]
    mediaLinks: string[]
    socialMediaLinks: string[]
    documents: string[]
  }
  testimonials: Array<{
    author: string
    role: string
    text: string
  }>
}

interface OrganizerPortfolioProps {
  onClose?: () => void
}

const formatNumber = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

// Inline placeholder data — no BE endpoint for organizer portfolio
const defaultPortfolioEvents: PastEvent[] = [
  {
    id: "pe1",
    name: "Summer Basketball Championship",
    date: "2024-07-15",
    location: "City Sports Arena",
    metrics: { attendance: 2500, mediaReach: 150000, engagementRate: 8.5, geographicReach: ["New York", "New Jersey", "Connecticut"] },
    proof: { photos: ["photo1.jpg", "photo2.jpg"], mediaLinks: ["https://sportsnews.com/article"], socialMediaLinks: [], documents: ["report.pdf"] },
    testimonials: [{ author: "John Smith", role: "Team Captain", text: "Best organized tournament I've attended." }],
  },
  {
    id: "pe2",
    name: "Community Soccer League",
    date: "2024-05-01",
    location: "Riverside Fields",
    metrics: { attendance: 800, mediaReach: 45000, engagementRate: 12.3, geographicReach: ["Brooklyn", "Queens"] },
    proof: { photos: ["photo3.jpg"], mediaLinks: [], socialMediaLinks: [], documents: [] },
    testimonials: [],
  },
]

export function OrganizerPortfolio({ onClose }: OrganizerPortfolioProps) {
  const [pastEvents] = useState<PastEvent[]>(defaultPortfolioEvents)

  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)

  const totalAttendance = pastEvents.reduce((sum, event) => sum + event.metrics.attendance, 0)
  const totalReach = pastEvents.reduce((sum, event) => sum + event.metrics.mediaReach, 0)
  const avgEngagement =
    pastEvents.reduce((sum, event) => sum + event.metrics.engagementRate, 0) / pastEvents.length

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-4 shadow-sm lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Organizer Portfolio</p>
          <h1 className="text-lg font-bold text-foreground">Prove your event track record</h1>
          <p className="text-xs text-muted-foreground">Showcase results and proof points for sponsors.</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Close portfolio"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground">Portfolio Overview</h2>
              <p className="text-xs text-muted-foreground">Aggregate impact across all events</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingEvent(true)}
              className="gradient-primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Event
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-muted/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> Total Events
              </div>
              <p className="text-xl font-bold text-foreground">{pastEvents.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> Attendance
              </div>
              <p className="text-xl font-bold text-foreground">{formatNumber(totalAttendance)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Eye className="h-3.5 w-3.5" /> Media Reach
              </div>
              <p className="text-xl font-bold text-foreground">{formatNumber(totalReach)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" /> Avg Engagement
              </div>
              <p className="text-xl font-bold text-foreground">{avgEngagement.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {isAddingEvent && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Add Past Event</h3>
                <p className="text-xs text-muted-foreground">Capture proof and key metrics</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingEvent(false)}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Event Name</label>
                <input
                  type="text"
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                  placeholder="e.g., Summer Basketball Championship"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">Date</label>
                  <input
                    type="date"
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Location</label>
                  <input
                    type="text"
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                    placeholder="Venue name"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-foreground">Event Metrics</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Attendance</label>
                    <input
                      type="number"
                      className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Media Reach</label>
                    <input
                      type="number"
                      className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Engagement Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-foreground">Upload Proof</h4>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted/70">
                    <Upload className="h-4 w-4" />
                    Photos
                  </button>
                  <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted/70">
                    <LinkIcon className="h-4 w-4" />
                    Media Links
                  </button>
                  <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted/70">
                    <FileText className="h-4 w-4" />
                    Documents
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button type="button" className="gradient-primary flex-1 rounded-xl py-2.5 text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90">
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Past Events</h2>
            <p className="text-xs text-muted-foreground">{pastEvents.length} tracked events</p>
          </div>

          {pastEvents.map((event) => (
            <div key={event.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">{event.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {event.location}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  {expandedEvent === event.id ? "Hide Details" : "View Details"}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Users className="h-3 w-3" /> Attendance
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatNumber(event.metrics.attendance)}</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Eye className="h-3 w-3" /> Media Reach
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatNumber(event.metrics.mediaReach)}</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <TrendingUp className="h-3 w-3" /> Engagement
                  </div>
                  <p className="text-sm font-semibold text-foreground">{event.metrics.engagementRate}%</p>
                </div>
              </div>

              {expandedEvent === event.id && (
                <div className="mt-4 space-y-4 border-t border-border pt-4">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Geographic Reach</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.metrics.geographicReach.map((location) => (
                        <span
                          key={location}
                          className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Event Proof</h4>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <ImageIcon className="h-3.5 w-3.5" /> Photos ({event.proof.photos.length})
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {event.proof.photos.slice(0, 3).map((_, index) => (
                            <div key={index} className="flex aspect-square items-center justify-center rounded-lg bg-muted">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <LinkIcon className="h-3.5 w-3.5" /> Media Coverage
                        </div>
                        <div className="space-y-2">
                          {event.proof.mediaLinks.map((link) => (
                            <a
                              key={link}
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="block truncate text-[11px] font-semibold text-primary hover:underline"
                            >
                              {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {event.proof.documents.length > 0 && (
                      <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3">
                        <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" /> Documents
                        </div>
                        <div className="space-y-2">
                          {event.proof.documents.map((doc) => (
                            <div key={doc} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-[11px]">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {event.testimonials.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">Testimonials</h4>
                      <div className="mt-2 grid gap-3 md:grid-cols-2">
                        {event.testimonials.map((testimonial, index) => (
                          <div key={index} className="rounded-xl bg-muted p-3 text-[11px]">
                            <p className="text-foreground">"{testimonial.text}"</p>
                            <div className="mt-2 text-[10px] text-muted-foreground">
                              <span className="font-semibold text-foreground">{testimonial.author}</span>
                              <span> · {testimonial.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
