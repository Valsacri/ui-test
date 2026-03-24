"use client"

import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  CalendarDays,
  BadgeCheck,
  Share2,
  Heart,
  MessageCircle,
  Globe,
  Phone,
  Mail,
  Building2,
} from "lucide-react"
import { toast } from "sonner"
import { businessesService, activitiesService, servicesService, authService, postsService, messagesService } from "@/lib/services"
import { ActivityCard } from "@/components/sporgates/cards/activity-card"
import { ServiceCard } from "@/components/sporgates/cards/service-card"
import { PostCard } from "@/components/sporgates/cards/post-card"
import type { PageRoute } from "@/lib/navigation"
import { cn, formatFeedTime, resolvePostImageUrl } from "@/lib/utils"
import { DEFAULT_API_BASE_URL } from "@/lib/constants"
import { useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import { ProfileSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { usePostModal } from "@/lib/post-modal-context"
import type { Post, PostCardData } from "@/lib/types/post"

interface BusinessDetailPageProps {
  businessId: string
  onNavigate: (page: PageRoute, id?: string) => void
}

const tabs = ["Overview", "Feed", "Activities", "Services", "Reviews"]

const reviewsData = [
  { id: "1", author: "Jordan R.", avatar: "JR", rating: 5, date: "Feb 5, 2026", comment: "Excellent facilities and great staff. The basketball courts are top-notch and well-maintained." },
  { id: "2", author: "Emily P.", avatar: "EP", rating: 4, date: "Jan 28, 2026", comment: "Love the variety of activities. The swimming pool is amazing. Would like extended hours on weekends." },
  { id: "3", author: "David K.", avatar: "DK", rating: 5, date: "Jan 20, 2026", comment: "Best sports complex in NYC. Clean, modern equipment and friendly community." },
  { id: "4", author: "Lisa C.", avatar: "LC", rating: 4, date: "Jan 15, 2026", comment: "Great experience overall. The yoga studio is peaceful and the instructors are knowledgeable." },
]

export function BusinessDetailPage({ businessId, onNavigate }: BusinessDetailPageProps) {
  const [activeTab, setActiveTab] = useState("Overview")
  const [following, setFollowing] = useState(false)
  const [messageLoading, setMessageLoading] = useState(false)
  const { openPost } = usePostModal()
  const currentUser = authService.getCurrentUser()
  const userId = currentUser?.id
  const initials =
    (currentUser?.firstName?.[0] ?? "") +
    (currentUser?.lastName?.[0] ?? "") ||
    (currentUser?.username?.[0] ?? "?").toUpperCase()
  const currentUserForComment = currentUser
    ? {
        id: currentUser.id,
        authorName: [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") || currentUser.username || "User",
        authorAvatar: initials,
      }
    : null

  const { data: business, isLoading: loadingBiz, mutate: mutateBusiness } = useSWR(
    businessId ? `/businesses/${businessId}` : null,
    () => businessesService.getById(businessId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const isFollowing = business?.followedByCurrentUser ?? following

  const { data: activitiesRaw = [] } = useSWR(
    businessId ? `/activities?organizerId=${businessId}` : null,
    () => activitiesService.getAll({ organizerId: businessId }),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: servicesRaw = [] } = useSWR(
    businessId ? `/services?providerId=${businessId}` : null,
    () => servicesService.getAll({ providerId: businessId }),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: postsData, mutate: mutatePosts } = useSWR(
    businessId && activeTab === "Feed" ? [`/posts/business/${businessId}`, businessId] : null,
    () => postsService.getByBusiness(businessId, 0, 50),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  const businessPosts = postsData?.content ?? []
  const canDeleteBusinessPost =
    !!userId &&
    !!business &&
    (business.owner?.id === userId ||
      (Array.isArray(business.staff) && business.staff.some((s: { id?: string }) => s.id === userId)))

  const loading = loadingBiz

  const activities = Array.isArray(activitiesRaw)
    ? activitiesRaw.map((a: any) => {
      // Same parseDate as /activities page so date/time display matches exactly
      const parseDate = (d: any) => {
        if (d == null) return null
        if (Array.isArray(d)) {
          return new Date(d[0], d[1] - 1, d[2], d[3] ?? 0, d[4] ?? 0)
        }
        return new Date(d)
      }
      const startDt = parseDate(a.startDateTime)
      const isValidDate = startDt && !Number.isNaN(startDt.getTime())
      return {
        id: a.id,
        title: a.name,
        sport: a.sportName || a.sportId || "Sport",
        date: isValidDate
          ? startDt!.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })
          : "Date TBA",
        time: isValidDate
          ? startDt!.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })
          : "TBD",
        location: a.location || a.city || a.address || "TBD",
        price: a.pricePerPerson ?? 0,
        currency: a.currency || "USD",
        spots: Math.max(0, (a.maxParticipants || 0) - (a.currentParticipants || 0)),
        totalSpots: a.maxParticipants || 0,
        image: a.coverImage || a.eventPoster || (Array.isArray(a.imageUrls) && a.imageUrls[0]) || "/placeholder.svg",
        rating: a.rating ?? 0,
        reviews: a.reviewCount ?? 0,
        organizer: a.organizerName || "Organizer",
        organizerAvatar: a.organizerAvatar || business?.avatar || "",
        tags: Array.isArray(a.tags) ? a.tags : []
      }
    })
    : []

  const services = Array.isArray(servicesRaw)
    ? servicesRaw.map((s: any) => ({
      id: s.id,
      name: s.name,
      provider: s.providerName || "Provider",
      providerAvatar: s.providerAvatar || business?.avatar,
      duration: s.duration || "1h",
      price: s.price || 0,
      currency: s.currency || "USD",
      rating: s.rating || 0,
      reviews: s.reviews || 0,
      image: s.image,
      category: s.category || "Service",
      verified: s.verified || false
    }))
    : []

  const relatedActivities = activities.slice(0, 3)
  const relatedServices = services.slice(0, 2)

  const businessDisplay = business ? {
    ...business,
    image: business.cover,
    location: business.city && business.state ? `${business.city}, ${business.state}` : business.address || "Location unavailable",
    rating: 5.0,
    reviews: 0,
    followers: business.followersCount ?? 0,
    activities: activities.length,
    verified: !!business.verifiedAt,
    type: business.type || "Business"
  } : null

  const apiBase = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL
  const businessAvatarUrl = business?.avatar
    ? (business.avatar.startsWith("/") ? `${apiBase}${business.avatar}` : business.avatar)
    : null

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!businessDisplay) {
    return (
      <ErrorState
        title="Business not found"
        message="The business you're looking for doesn't exist."
        onRetry={() => onNavigate("businesses")}
      />
    )
  }

  if (!businessDisplay) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-bold">Business not found</h2>
        <button onClick={() => onNavigate("businesses")} className="text-primary hover:underline">
          Back to Businesses
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0 animate-fade-in">
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate("businesses")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Businesses
      </button>

      {/* Cover + overlapping avatar + info bar */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative h-56 overflow-hidden rounded-t-2xl md:h-72">
          <Image
            src={businessDisplay.image || "/placeholder.svg"}
            alt={businessDisplay.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
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
        </div>

        <div className="relative z-10 px-4 md:px-6">
          <div className="-mt-14 flex flex-col items-start gap-2">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-card shadow-lg ring-1 ring-black/5">
              {businessAvatarUrl ? (
                <Image
                  src={businessAvatarUrl}
                  alt={businessDisplay.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center gradient-primary">
                  <Building2 className="h-10 w-10 text-white" aria-hidden />
                </div>
              )}
            </div>
            <div className="min-w-0 space-y-0.5 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{businessDisplay.name}</h1>
                {businessDisplay.verified && <BadgeCheck className="h-6 w-6 shrink-0 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{businessDisplay.type}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="text-sm font-bold text-foreground">{businessDisplay.rating}</span>
            <span className="text-xs text-muted-foreground">({businessDisplay.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {businessDisplay.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {businessDisplay.followers.toLocaleString()} followers
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {businessDisplay.activities} activities
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={async () => {
              const me = authService.getCurrentUser()?.id
              if (!me) return
              const prev = isFollowing
              setFollowing(!prev)
              try {
                if (prev) await businessesService.unfollowBusiness(businessId)
                else await businessesService.followBusiness(businessId)
                await mutateBusiness()
              } catch {
                setFollowing(prev)
                toast.error(prev ? "Failed to unfollow" : "Failed to follow")
              }
            }}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-semibold transition-all",
              isFollowing
                ? "border border-primary bg-primary/10 text-primary"
                : "gradient-primary text-white shadow-md"
            )}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          <button
            type="button"
            onClick={async () => {
              const me = authService.getCurrentUser()?.id
              if (!me) {
                toast.error("Please sign in to send a message.")
                return
              }

              const targetBusinessId = businessId?.trim()
              if (!targetBusinessId) {
                toast.error("Business account is unavailable for messaging.")
                return
              }

              setMessageLoading(true)
              try {
                const conv = await messagesService.createDirectConversation({ targetUserId: targetBusinessId })
                if (conv?.id) {
                  onNavigate("conversation", conv.id)
                } else {
                  toast.error("Could not open conversation")
                }
              } catch {
                toast.error("Could not open conversation")
              } finally {
                setMessageLoading(false)
              }
            }}
            disabled={messageLoading}
            className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            title="Message"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all",
              activeTab === tab
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* About */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">About</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {businessDisplay.name} is a premier {businessDisplay.type.toLowerCase()} located in {businessDisplay.location}.
              We offer world-class facilities and a vibrant community of sports enthusiasts. Our mission
              is to make sports accessible, fun, and social for everyone in the community.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                <Globe className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Website</p>
                  <p className="text-xs font-medium text-foreground">
                    {businessDisplay.website || `www.${businessDisplay.name.toLowerCase().replace(/\s/g, "")}.com`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Phone</p>
                  <p className="text-xs font-medium text-foreground">
                    {businessDisplay.phone || `(212) 555-0${businessDisplay.id.slice(0, 2)}42`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Email</p>
                  <p className="text-xs font-medium text-foreground">
                    {businessDisplay.email || `info@${businessDisplay.name.toLowerCase().replace(/\s/g, "")}.com`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{businessDisplay.activities}</p>
              <p className="text-[11px] text-muted-foreground">Active Events</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">{businessDisplay.followers.toLocaleString()}</p>
              <p className="text-[11px] text-muted-foreground">Followers</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{businessDisplay.rating}</p>
              <p className="text-[11px] text-muted-foreground">Avg Rating</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">{businessDisplay.reviews}</p>
              <p className="text-[11px] text-muted-foreground">Total Reviews</p>
            </div>
          </div>

          {/* Featured Activities */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-foreground">Featured Activities</h3>
            {relatedActivities.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {relatedActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onClick={() => onNavigate("activity-detail", activity.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-semibold text-foreground">No activities available</p>
                <p className="mt-1 text-xs text-muted-foreground">This business hasn&apos;t created any activities yet</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Organizer Portfolio</h3>
                <p className="text-xs text-muted-foreground">Showcase past event performance</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("organizer-portfolio", businessId)}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Feed" && (
        <div className="space-y-4 animate-fade-in">
          {businessPosts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <MessageCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-semibold text-foreground">No posts yet</p>
              <p className="mt-1 text-xs text-muted-foreground">This business hasn&apos;t shared any posts</p>
            </div>
          ) : (
            businessPosts.map((p: Post) => {
              const postCard: PostCardData = {
                id: String(p.id),
                author: p.authorName ?? businessDisplay?.name ?? "Business",
                authorAvatar: p.authorAvatar ?? "?",
                time: formatFeedTime(p.createdAt),
                content: p.content ?? "",
                image: resolvePostImageUrl(p.image) || p.image,
                likes: p.likes ?? 0,
                comments: p.comments ?? 0,
                shares: p.shares ?? 0,
                liked: p.likedByCurrentUser ?? false,
                saved: p.savedByCurrentUser ?? false,
                sport: p.sport,
                authorType: p.authorType,
                businessId: p.businessId,
              }
              return (
                <div
                  key={postCard.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openPost(postCard.id)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return
                    openPost(postCard.id)
                  }}
                  className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                >
                  <PostCard
                    post={postCard}
                    userId={userId}
                    currentUser={currentUserForComment}
                    onCountChange={() => mutatePosts()}
                    canDelete={canDeleteBusinessPost}
                    onDelete={async (id) => {
                      await postsService.delete(id)
                      mutatePosts()
                    }}
                  />
                </div>
              )
            })
          )}
        </div>
      )}

      {activeTab === "Activities" && (
        <div className="animate-fade-in">
          {activities.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onClick={() => onNavigate("activity-detail", activity.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <p>No activities scheduled.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "Services" && (
        <div className="animate-fade-in">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => onNavigate("service-detail", service.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <p>No services offered.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "Reviews" && (
        <div className="space-y-4 animate-fade-in">
          {/* Rating Summary */}
          <div className="flex items-center gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{businessDisplay.rating}</p>
              <div className="mt-1 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= Math.round(businessDisplay.rating)
                        ? "fill-secondary text-secondary"
                        : "text-border"
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{businessDisplay.reviews} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 7 : rating === 2 ? 2 : 1
                return (
                  <div key={rating} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-muted-foreground">{rating}</span>
                    <Star className="h-3 w-3 fill-secondary text-secondary" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="gradient-secondary h-full rounded-full"
                        style={{ width: `${count}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{count}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reviews List */}
          {reviewsData.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.author}</p>
                    <p className="text-[10px] text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-3 w-3",
                        star <= review.rating ? "fill-secondary text-secondary" : "text-border"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
