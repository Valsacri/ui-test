"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { organizerPortfolioEvents } from "@/lib/mock-data"

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

export function OrganizerPortfolio({ onClose }: OrganizerPortfolioProps) {
  const [pastEvents] = useState<PastEvent[]>(organizerPortfolioEvents)

  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)

  const totalAttendance = pastEvents.reduce((sum, event) => sum + event.metrics.attendance, 0)
  const totalReach = pastEvents.reduce((sum, event) => sum + event.metrics.mediaReach, 0)
  const avgEngagement =
    pastEvents.reduce((sum, event) => sum + event.metrics.engagementRate, 0) / pastEvents.length

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-background">
      <div className="sticky top-0 border-b border-border bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Organizer Portfolio</h1>
            <p className="text-sm text-muted-foreground">Showcase your track record to sponsors</p>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 pb-24">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Total Events</span>
                </div>
                <p className="text-2xl font-semibold text-primary">{pastEvents.length}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Total Attendance</span>
                </div>
                <p className="text-2xl font-semibold text-primary">{formatNumber(totalAttendance)}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>Media Reach</span>
                </div>
                <p className="text-2xl font-semibold text-primary">{formatNumber(totalReach)}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Avg Engagement</span>
                </div>
                <p className="text-2xl font-semibold text-primary">{avgEngagement.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Past Events</h2>
          <Button onClick={() => setIsAddingEvent(true)} size="sm" variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        {pastEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{event.name}</CardTitle>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                >
                  {expandedEvent === event.id ? "Hide Details" : "View Details"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Users className="h-3 w-3" />
                    Attendance
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatNumber(event.metrics.attendance)}</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    Media Reach
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatNumber(event.metrics.mediaReach)}</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    Engagement
                  </div>
                  <p className="text-sm font-semibold text-foreground">{event.metrics.engagementRate}%</p>
                </div>
              </div>

              {expandedEvent === event.id && (
                <div className="space-y-4 border-t border-border pt-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Geographic Reach</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.metrics.geographicReach.map((location) => (
                        <span
                          key={location}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Event Proof</h4>
                    <div className="mt-3 space-y-3">
                      {event.proof.photos.length > 0 && (
                        <div>
                          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                            {event.proof.photos.length} Photos
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {event.proof.photos.slice(0, 3).map((_, index) => (
                              <div
                                key={index}
                                className="flex aspect-square items-center justify-center rounded-xl bg-muted"
                              >
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.proof.mediaLinks.length > 0 && (
                        <div>
                          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <LinkIcon className="h-4 w-4" />
                            Media Coverage ({event.proof.mediaLinks.length})
                          </div>
                          <div className="space-y-2">
                            {event.proof.mediaLinks.map((link) => (
                              <a
                                key={link}
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="block truncate text-xs text-primary hover:underline"
                              >
                                {link}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.proof.documents.length > 0 && (
                        <div>
                          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            Documents ({event.proof.documents.length})
                          </div>
                          <div className="space-y-2">
                            {event.proof.documents.map((doc) => (
                              <div key={doc} className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>{doc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {event.testimonials.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Testimonials</h4>
                      <div className="mt-2 space-y-3">
                        {event.testimonials.map((testimonial, index) => (
                          <div key={index} className="rounded-xl bg-muted p-3 text-xs">
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
            </CardContent>
          </Card>
        ))}

        {isAddingEvent && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Add Past Event</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsAddingEvent(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Event Name</label>
                  <input
                    type="text"
                    className="mt-1 h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm"
                    placeholder="e.g., Summer Basketball Championship"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">Date</label>
                    <input
                      type="date"
                      className="mt-1 h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Location</label>
                    <input
                      type="text"
                      className="mt-1 h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm"
                      placeholder="Venue name"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-semibold text-foreground">Event Metrics</h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Attendance</label>
                      <input
                        type="number"
                        className="mt-1 h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Media Reach</label>
                      <input
                        type="number"
                        className="mt-1 h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Engagement Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="mt-1 h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm"
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-semibold text-foreground">Upload Proof</h4>
                  <div className="mt-3 space-y-3">
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photos
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Add Media Links
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Upload Documents
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsAddingEvent(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1">Add Event</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
