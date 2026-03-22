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
    Loader2,
} from "lucide-react"
import { useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import { toast } from "sonner"
import { activitiesService } from "@/lib/services/activities"
import { authService } from "@/lib/services/auth"
import { businessesService } from "@/lib/services/businesses"
import { messagesService } from "@/lib/services/messages"
import { getApiErrorMessage } from "@/lib/api-errors"
import { TicketModal } from "@/components/sporgates/attendance/ticket-modal"
import { DetailPageSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { ParticipantsModal } from "@/components/sporgates/activities/participants-modal"
import type { PageRoute } from "@/lib/navigation"

interface ActivityDetailPageProps {
  activityId: string
  onNavigate: (page: PageRoute, id?: string) => void
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
  const [ticketCode, setTicketCode] = useState<string | undefined>()
  const [joining, setJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [followingOrganizer, setFollowingOrganizer] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [messagingOrganizer, setMessagingOrganizer] = useState(false)

  const { data: activity, error, isLoading: loading, mutate } = useSWR(
    activityId ? `/activities/${activityId}` : null,
    () => activitiesService.getById(activityId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const currentUser = authService.getCurrentUser()

  useSWR(
    currentUser?.id && activityId ? `/attendance/${activityId}/status` : null,
    () => activitiesService.checkAttendanceStatus(activityId),
    {
      onSuccess: (data) => {
        setHasJoined(data.isRegistered)
        if (data.ticketCode) {
          setTicketCode(data.ticketCode)
        }
      },
      revalidateOnFocus: false
    }
  )

  useSWR(
    currentUser?.id && activity?.organizerId ? `/businesses/${activity.organizerId}/follow/status` : null,
    () => businessesService.checkFollowStatus(activity!.organizerId),
    {
      onSuccess: (data) => setIsFollowed(data.isFollowing),
      revalidateOnFocus: false
    }
  )

  const { data: participantsList } = useSWR(
    activityId ? `/v1/activities/${activityId}/participants` : null,
    () => activitiesService.getActivityParticipants(activityId),
    { revalidateOnFocus: false }
  )

  const hasJoinedOrRegistered = hasJoined

  const handleFollowOrganizer = async () => {
    if (!currentUser?.id || !activity?.organizerId || followingOrganizer) return
    setFollowingOrganizer(true)
    try {
      if (isFollowed) {
        await businessesService.unfollowBusiness(activity.organizerId)
        setIsFollowed(false)
        toast.success("Unfollowed organizer")
      } else {
        await businessesService.followBusiness(activity.organizerId)
        setIsFollowed(true)
        toast.success("Following organizer! 🎉")
      }
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, "Failed to update follow status"))
    } finally {
      setFollowingOrganizer(false)
    }
  }

  const handleJoinActivity = async () => {
    if (joining) return
    setJoining(true)
    try {
      const response = await activitiesService.bookActivity(activityId)
      setTicketCode(response.ticketCode)
      setHasJoined(true)
      setShowTicket(true)
      toast.success("You're in! 🎉 Your ticket is ready.")
      // Refresh activity data to update participant count
      mutate()
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, "Failed to join activity"))
    } finally {
      setJoining(false)
    }
  }

  const handleMessageOrganizer = async () => {
    if (!currentUser?.id || !activity?.organizerId || messagingOrganizer) return
    setMessagingOrganizer(true)
    try {
      const conv = await messagesService.createDirectConversation({ targetUserId: activity.organizerId })
      if (conv?.id) {
        onNavigate("conversation", conv.id)
      } else {
        toast.error("Failed to open conversation")
      }
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, "Could not start chat with organizer"))
    } finally {
      setMessagingOrganizer(false)
    }
  }

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

  const isFull = spotsLeft <= 0

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
                onClick={handleFollowOrganizer}
                disabled={followingOrganizer}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isFollowed
                  ? "border border-border bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                  : "border border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
              >
                {followingOrganizer ? "..." : isFollowed ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          {/* Participants */}
          <div 
            className="rounded-2xl border border-border bg-card p-4 shadow-sm cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => setShowParticipantsModal(true)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">
                Participants ({currentParticipants}/{maxParticipants})
              </h3>
              <span className="text-xs text-primary hover:underline font-medium">View All</span>
            </div>
            
            <div className="flex items-center -space-x-2">
              {participantsList ? (
                participantsList.slice(0, 7).map((user: any) => (
                  <div
                    key={user.id}
                    className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-card gradient-primary text-[10px] font-bold text-white shadow-sm"
                  >
                    {user.profilePicture && (user.profilePicture.startsWith("/") || user.profilePicture.startsWith("http")) ? (
                      <Image
                        src={user.profilePicture}
                        alt={user.username}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    ) : (
                      <span>{user.username?.slice(0, 2).toUpperCase() || "U"}</span>
                    )}
                  </div>
                ))
              ) : (
                Array.from({ length: Math.min(currentParticipants, 7) }).map((_, i) => (
                  <div
                    key={i}
                    className="gradient-primary flex h-9 w-9 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white"
                  >
                    P{i + 1}
                  </div>
                ))
              )}

              {currentParticipants > 7 && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium text-muted-foreground z-10">
                  +{currentParticipants - 7}
                </div>
              )}
              {currentParticipants === 0 && (
                <span className="text-xs text-muted-foreground ml-3">Be the first to join!</span>
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
            {hasJoinedOrRegistered ? (
              <button
                type="button"
                onClick={() => setShowTicket(true)}
                className="mb-3 w-full rounded-xl border-2 border-primary bg-primary/10 py-3 text-sm font-bold text-primary transition-opacity hover:opacity-90"
              >
                View My Ticket
              </button>
            ) : (
              <button
                type="button"
                onClick={handleJoinActivity}
                disabled={joining || isFull}
                className="gradient-primary mb-3 w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? "Joining..." : isFull ? "Activity Full" : "Join Activity"}
              </button>
            )}
            <button
              type="button"
              onClick={handleMessageOrganizer}
              disabled={messagingOrganizer || !currentUser}
              className="w-full rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {messagingOrganizer && <Loader2 className="h-4 w-4 animate-spin" />}
              {messagingOrganizer ? "Opening chat..." : "Message Organizer"}
            </button>
          </div>
        </div>
      </div>

      <TicketModal
        isOpen={showTicket}
        onClose={() => setShowTicket(false)}
        activityId={activity.id}
        userId={currentUser?.id || "user"}
        activityTitle={title}
        activityDate={date}
        activityTime={time}
        location={location}
        userName={currentUser ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "User" : "User"}
        ticketCode={ticketCode}
      />

      <ParticipantsModal
        activityId={activity.id}
        isOpen={showParticipantsModal}
        setIsOpen={setShowParticipantsModal}
        currentParticipants={currentParticipants}
        maxParticipants={maxParticipants}
      />
    </div>
  )
}

