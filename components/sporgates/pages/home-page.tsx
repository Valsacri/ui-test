"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Zap, Trophy, TrendingUp, Target, Users, Calendar } from "lucide-react"
import { FeedSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { activitiesService, postsService, servicesService, facilitiesService, userService, feedService } from "@/lib/services"
import { authService } from "@/lib/services"
import type { FeedItem } from "@/lib/services/feed"
import { FeedComposer } from "@/components/sporgates/feed-composer"
import { resolvePostImageUrl, formatFeedTime } from "@/lib/utils"
import type { PostCardData } from "@/lib/types/post"
import { toast } from "sonner"
import { mapFacility, mapService } from "@/lib/mappers/explore-mappers"
import type { FacilityCardData, ServiceCardData } from "@/lib/types/explore"
import { ActivityCard } from "@/components/sporgates/cards/activity-card"
import { FacilityCard } from "@/components/sporgates/cards/facility-card"
import { PostCard } from "@/components/sporgates/cards/post-card"
import { ServiceCard } from "@/components/sporgates/cards/service-card"
import { Stories } from "@/components/sporgates/stories"
import type { PageRoute } from "@/lib/navigation"

interface HomePageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [feedTab, setFeedTab] = useState<"foryou" | "following">("foryou")
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [services, setServices] = useState<ServiceCardData[]>([])
  const [facilities, setFacilities] = useState<FacilityCardData[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<Error | null>(null)
  const currentUser = authService.getCurrentUser()
  const userId = currentUser?.id
  const initials = (currentUser?.firstName?.[0] ?? "") + (currentUser?.lastName?.[0] ?? "") || (currentUser?.username?.[0] ?? "?").toUpperCase()
  const currentUserForComment = currentUser
    ? {
        id: currentUser.id,
        authorName: [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") || currentUser.username || "User",
        authorAvatar: (userProfile?.profilePicture ? resolvePostImageUrl(userProfile.profilePicture) : null) || initials,
      }
    : null

  const fetchData = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
        const [activitiesData, postsData, servicesData, facilitiesData] = await Promise.allSettled([
          activitiesService.getAll(),
          postsService.getAll(undefined, userId),
          servicesService.getAll(),
          facilitiesService.getAll(),
        ])

        if (activitiesData.status === "fulfilled" && Array.isArray(activitiesData.value)) {
          setActivities(activitiesData.value.map((a: any) => {
            const parseDate = (d: any) => {
              if (Array.isArray(d)) return new Date(d[0], d[1] - 1, d[2], d[3] || 0, d[4] || 0)
              return new Date(d)
            }
            const startDate = parseDate(a.startDateTime)
            return {
              id: a.id,
              title: a.name,
              sport: a.sportId || "Sport",
              date: startDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }),
              time: startDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' }),
              location: a.location || a.city || "TBD",
              price: a.pricePerPerson || 0,
              currency: a.currency || "USD",
              spots: (a.maxParticipants || 0) - (a.currentParticipants || 0),
              totalSpots: a.maxParticipants || 0,
              image: a.coverImage || "/placeholder.svg",
              rating: a.rating || 0,
              reviews: a.reviewCount || 0,
              organizer: a.organizerName || "Organizer",
              organizerAvatar: a.organizerAvatar || "",
              tags: a.tags || []
            }
          }))
        }

        if (postsData.status === "fulfilled" && postsData.value) {
          const postsPage = postsData.value as { content?: unknown[] }
          setPosts(Array.isArray(postsPage.content) ? postsPage.content : [])
        }

        if (servicesData.status === "fulfilled" && Array.isArray(servicesData.value)) {
          setServices(servicesData.value.map((s: any) => mapService(s)))
        }

        if (facilitiesData.status === "fulfilled" && Array.isArray(facilitiesData.value)) {
          setFacilities(facilitiesData.value.map((f: any) => mapFacility(f)))
        }

        // Fetch user profile and personalized feed (paginated)
        if (userId) {
          try {
            const [userData, feedData] = await Promise.all([
              userService.getUserById(userId),
              feedService.getFeed(userId, 0, 20),
            ])
            if (userData) setUserProfile(userData)
            if (feedData?.content) setFeedItems(feedData.content)
          } catch { /* User profile / feed fetch is non-critical */ }
        }
      } catch (err) {
        setLoadError(err instanceof Error ? err : new Error("Failed to load home"))
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    fetchData()
  }, [])

  const displayedPosts = feedTab === "foryou" ? posts.slice(0, 3) : posts.slice(0, 2)
  const forYouFeedItems = feedTab === "foryou" ? feedItems : []
  const showFeedApi = forYouFeedItems.length > 0

  const userName = userProfile?.firstName || userProfile?.name?.split(" ")[0] || "Athlete"
  const stats = {
    totalActivities: userProfile?.stats?.totalActivities ?? userProfile?.totalActivities ?? 0,
    hoursPlayed: userProfile?.stats?.hoursPlayed ?? userProfile?.hoursPlayed ?? 0,
    sportsPlayed: userProfile?.stats?.sportsPlayed ?? userProfile?.sportsPlayed ?? 0,
    avgRating: userProfile?.stats?.avgRating ?? userProfile?.avgRating ?? 0,
  }

  if (isLoading) {
    return <FeedSkeleton count={4} />
  }

  if (loadError) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <ErrorState
          title="Couldn't load home"
          message={loadError.message || "Something went wrong. Please try again."}
          onRetry={() => fetchData()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Hero Banner */}
      <div className="gradient-hero relative overflow-hidden rounded-2xl p-6 text-white shadow-lg md:p-8">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-white/5" />
        <div className="relative max-w-lg">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/80">
            Welcome back
          </p>
          <h1 className="mb-2 text-2xl font-bold text-balance md:text-3xl">
            Hey, {userName}!
          </h1>
          <p className="mb-4 text-sm leading-relaxed text-white/80">
            {activities.length > 0
              ? `You have ${activities.length} activities to explore. Keep up the momentum!`
              : "Discover activities and join the community today!"}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate("explore")}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#003C66] transition-opacity hover:opacity-90"
            >
              Explore Now
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("activities")}
              className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Calendar className="h-4 w-4" />
              My Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Stories */}
      <div>
        <h2 className="mb-3 text-base font-bold text-foreground">Stories</h2>
        <Stories />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            label: "Activities Joined",
            value: stats.totalActivities,
            icon: Zap,
            color: "text-secondary",
            bg: "bg-secondary/10",
          },
          {
            label: "Hours Played",
            value: stats.hoursPlayed,
            icon: Trophy,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Sports Played",
            value: stats.sportsPlayed,
            icon: TrendingUp,
            color: "text-secondary",
            bg: "bg-secondary/10",
          },
          {
            label: "Avg Rating",
            value: stats.avgRating,
            icon: Target,
            color: "text-primary",
            bg: "bg-primary/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Social Feed */}
      <div>
        {userProfile && (
          <div className="mb-4">
            <FeedComposer
              userDisplayName={userName}
              userAvatar={userProfile.profilePicture ? resolvePostImageUrl(userProfile.profilePicture) : (userProfile.firstName?.[0] ?? "") + (userProfile.lastName?.[0] ?? "")}
              placeholder="What's on your mind?"
              onSubmit={async (payload) => {
                const currentUser = authService.getCurrentUser()
                if (!currentUser?.id) throw new Error("You must be logged in to post")
                const name = [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") || currentUser.username || "User"
                const avatar = (userProfile?.profilePicture ? resolvePostImageUrl(userProfile.profilePicture) : null) || (currentUser.firstName?.[0] ?? "") + (currentUser.lastName?.[0] ?? "") || (currentUser.username?.[0] ?? "?").toUpperCase()
                const created = await postsService.create({
                  authorId: currentUser.id,
                  authorName: name,
                  authorAvatar: avatar,
                  content: payload.content,
                  image: payload.image,
                  sport: payload.sport,
                }) as { id: string; authorName?: string; authorAvatar?: string; content?: string; image?: string; likes?: number; comments?: number; shares?: number; sport?: string; createdAt?: string }
                const newFeedItem: FeedItem = {
                  id: created.id,
                  type: "post",
                  summary: created.content,
                  authorName: created.authorName ?? name,
                  authorAvatar: created.authorAvatar ?? avatar,
                  image: created.image,
                  likes: created.likes ?? 0,
                  comments: created.comments ?? 0,
                  shares: created.shares ?? 0,
                  sport: created.sport,
                  createdAt: created.createdAt,
                }
                setFeedItems((prev) => [newFeedItem, ...prev])
              }}
              onSuccess={() => toast.success("Post shared")}
            />
          </div>
        )}

      {(posts.length > 0 || showFeedApi) && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Community Feed</h2>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Community</span>
            </div>
          </div>
          <div className="mb-4 flex gap-2">
            {(["foryou", "following"] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setFeedTab(tab)}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${feedTab === tab
                  ? "gradient-primary text-white shadow-md"
                  : "bg-card text-foreground border border-border hover:bg-muted"
                  }`}
              >
                {tab === "foryou" ? "For You" : "Following"}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {showFeedApi
                ? forYouFeedItems.map((item) => {
                  if (item.type === "post") {
                    const post: PostCardData = {
                      id: item.id,
                      author: item.authorName ?? "User",
                      authorAvatar: item.authorAvatar ?? "?",
                      time: formatFeedTime(item.createdAt),
                      content: item.summary ?? "",
                      image: resolvePostImageUrl(item.image) || item.image,
                      likes: item.likes ?? 0,
                      comments: item.comments ?? 0,
                      shares: item.shares ?? 0,
                      liked: false,
                      saved: false,
                      sport: item.sport,
                    }
                    return (
                      <PostCard
                        key={item.id}
                        post={post}
                        userId={userId}
                        currentUser={currentUserForComment}
                      />
                    )
                  }
                  if (item.type === "activity") {
                    const activity = {
                      id: item.id,
                      title: item.title ?? "Activity",
                      sport: item.sport ?? "Sport",
                      date: item.createdAt ?? "",
                      time: "",
                      location: "",
                      price: 0,
                      currency: "USD",
                      spots: 0,
                      totalSpots: 0,
                      image: item.image ?? "/placeholder.svg",
                      rating: 0,
                      reviews: 0,
                      organizer: item.authorName ?? "",
                      organizerAvatar: item.authorAvatar ?? "",
                      tags: item.sport ? [item.sport] : [],
                    }
                    return (
                      <ActivityCard
                        key={item.id}
                        activity={activity}
                        onClick={() => onNavigate("activity-detail", item.id)}
                      />
                    )
                  }
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-border bg-card p-4"
                    >
                      {item.title && <h3 className="font-semibold text-foreground">{item.title}</h3>}
                      {item.summary && <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>}
                    </div>
                  )
                })
              : displayedPosts.map((p: any) => {
                  const post: PostCardData = {
                    id: p.id,
                    author: p.authorName ?? p.author ?? "User",
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
                  }
                  return (
                    <PostCard
                      key={p.id}
                      post={post}
                      userId={userId}
                      currentUser={currentUserForComment}
                    />
                  )
                })}
          </div>
        </>
      )}
      </div>

      {/* Featured Activities */}
      {activities.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Featured Activities</h2>
            <button
              type="button"
              onClick={() => onNavigate("activities")}
              className="flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
            >
              See All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activities.slice(0, 3).map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => onNavigate("activity-detail", activity.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Popular Services */}
      {services.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Popular Services</h2>
            <button
              type="button"
              onClick={() => onNavigate("services")}
              className="flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
            >
              See All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => onNavigate("service-detail", service.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Facilities */}
      {facilities.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Top Facilities</h2>
            <button
              type="button"
              onClick={() => onNavigate("facilities")}
              className="flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
            >
              See All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {facilities.slice(0, 2).map((facility) => (
              <FacilityCard
                key={facility.id}
                facility={facility}
                onClick={() => onNavigate("facility-detail", facility.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state when nothing loaded */}
      {activities.length === 0 && posts.length === 0 && services.length === 0 && facilities.length === 0 && feedItems.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-foreground">No Content Yet</h3>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            Start exploring activities, services and facilities to build your personalized feed.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Explore Now
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
