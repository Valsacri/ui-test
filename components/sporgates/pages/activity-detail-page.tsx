"use client"

import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  Users,
  Share2,
  Heart,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import { activitiesService } from "@/lib/services/activities"
import { TicketModal } from "@/components/sporgates/attendance/ticket-modal"
import { DetailPageSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import type { PageRoute } from "@/lib/navigation"

interface ActivityDetailPageProps {
  activityId: string
  onNavigate: (page: PageRoute) => void
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  MAD: "د.م.",
}

const parseDate = (d: any) => {
  if (!d) return null
  if (Array.isArray(d)) {
    return new Date(d[0], d[1] - 1, d[2], d[3] || 0, d[4] || 0)
  }
  return new Date(d)
}

function formatDate(dateVal: any): string {
  const date = parseDate(dateVal)
  if (!date) return "TBD"
  try {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return "Invalid Date"
  }
}

function formatTime(dateVal: any): string {
  const date = parseDate(dateVal)
  if (!date) return "TBD"
  try {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return "Invalid Time"
  }
}

export function ActivityDetailPage({ activityId, onNavigate }: ActivityDetailPageProps) {
  const [showTicket, setShowTicket] = useState(false)

  const { data: activity, error, isLoading: loading } = useSWR(
    activityId ? `/activities/${activityId}` : null,
    () => activitiesService.getById(activityId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  if (loading) {
    return <DetailPageSkeleton />
  }

  if (error || !activity) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button
          type="button"
          onClick={() => onNavigate("activities")}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Activities
        </button>
        <ErrorState
          title="Activity not found"
          message={error || "The activity you're looking for doesn't exist or has been removed."}
          onRetry={() => onNavigate("activities")}
        />
      </div>
    )
  }

  const title = activity.name || "Untitled Activity"
  const description = activity.description || ""
  const sport = activity.sportId || "Sport"
  const date = formatDate(activity.startDateTime)
  const time = formatTime(activity.startDateTime)
  const location = activity.location || activity.city || "Location TBD"
  const price = activity.pricePerPerson ?? 0
  const currency = activity.currency || "USD"
  const currencySymbol = currencySymbols[currency] || currency
  const maxParticipants = activity.maxParticipants || 0
  const currentParticipants = activity.currentParticipants || 0
  const spotsLeft = Math.max(0, maxParticipants - currentParticipants)
  const rating = activity.rating ?? 0
  const reviewCount = activity.reviewCount ?? 0
  const tags = Array.from(new Set(activity.tags || [])) as string[]
  const image = activity.coverImage || "/placeholder.svg"
  const organizerName = activity.organizerName || "Organizer"
  const organizerAvatar = activity.organizerAvatar
  const organizerInitials = organizerName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate("activities")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Activities
      </button>

      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card"
          >
            <Heart className="h-5 w-5 text-foreground" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card"
          >
            <Share2 className="h-5 w-5 text-foreground" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {sport}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm border border-border">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Date</p>
                <p className="text-sm font-semibold text-foreground">{date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm border border-border">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Time</p>
                <p className="text-sm font-semibold text-foreground">{time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm border border-border">
              <MapPin className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Location</p>
                <p className="text-sm font-semibold text-foreground">{location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm border border-border">
              <Users className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Spots</p>
                <p className="text-sm font-semibold text-foreground">
                  {spotsLeft} of {maxParticipants} available
                </p>
              </div>
            </div>
          </div>

          {/* Organizer */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Organizer</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {organizerAvatar ? (
                  <Image src={organizerAvatar} alt={organizerName} width={48} height={48} className="rounded-full object-cover" />
                ) : (
                  <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white">
                    {organizerInitials}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">{organizerName}</p>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    <span className="text-xs text-muted-foreground">Verified Organizer</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Follow
              </button>
            </div>
          </div>

          {/* Participants */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">
              Participants ({currentParticipants}/{maxParticipants})
            </h3>
            <div className="flex items-center -space-x-2">
              {Array.from({ length: Math.min(currentParticipants, 7) }).map((_, i) => (
                <div
                  key={i}
                  className="gradient-primary flex h-9 w-9 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white"
                >
                  P{i + 1}
                </div>
              ))}
              {spotsLeft > 0 && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium text-muted-foreground">
                  +{spotsLeft}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-lg">
            <div className="mb-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {price === 0 ? "Free" : `${currencySymbol}${price}`}
              </p>
              <p className="text-xs text-muted-foreground">per person</p>
            </div>
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">{date}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">{time}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <span className="font-medium text-foreground">{spotsLeft} spots</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTicket(true)}
              className="gradient-primary mb-3 w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
            >
              Join Activity
            </button>
            <button
              type="button"
              className="w-full rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Message Organizer
            </button>
          </div>
        </div>
      </div>

      <TicketModal
        isOpen={showTicket}
        onClose={() => setShowTicket(false)}
        activityId={activity.id}
        userId={"user"}
        activityTitle={title}
        activityDate={date}
        activityTime={time}
        location={location}
        userName={"User"}
      />
    </div>
  )
}
