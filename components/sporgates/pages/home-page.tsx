"use client"

import { useState, useEffect } from "react"
import { Zap, ArrowRight } from "lucide-react"
import { FeedSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { ErrorBoundary } from "@/components/sporgates/ux/error-boundary"
import { activitiesService, servicesService, facilitiesService, userService } from "@/lib/services"
import { authService } from "@/lib/services"
import { resolvePostImageUrl } from "@/lib/utils"
import { mapFacility, mapService } from "@/lib/mappers/explore-mappers"
import type { FacilityCardData, ServiceCardData, ServiceListingDto, FacilityDto } from "@/lib/types/explore"
import { Stories } from "@/components/sporgates/stories"
import { useFeed } from "@/hooks/use-feed"
import { useAppRouter } from "@/lib/route-map"

// ─── Extracted components ────────────────────────────────────────
import { HeroBanner } from "@/components/sporgates/feed/hero-banner"
import { QuickStats } from "@/components/sporgates/feed/quick-stats"
import { FeedSection } from "@/components/sporgates/feed/feed-section"
import { FeaturedContent } from "@/components/sporgates/feed/featured-content"

// ─── Types ───────────────────────────────────────────────────────
interface ActivityCardItem {
  id: string
  title: string
  sport: string
  date: string
  time: string
  location: string
  price: number
  currency: string
  spots: number
  totalSpots: number
  image: string
  rating: number
  reviews: number
  organizer: string
  organizerAvatar: string
  tags: string[]
}

interface UserProfile {
  firstName?: string
  lastName?: string
  username?: string
  profilePicture?: string
  stats?: {
    totalActivities?: number
    hoursPlayed?: number
    sportsPlayed?: number
    avgRating?: number
  }
  totalActivities?: number
  hoursPlayed?: number
  sportsPlayed?: number
  avgRating?: number
}

export function HomePage() {
  const { navigate } = useAppRouter()
  // ─── Feed state (centralized hook) ──────────────────────────────
  const feed = useFeed({ pageSize: 20 })

  // ─── Sidebar content state ──────────────────────────────────────
  const [activities, setActivities] = useState<ActivityCardItem[]>([])
  const [services, setServices] = useState<ServiceCardData[]>([])
  const [facilities, setFacilities] = useState<FacilityCardData[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isSidebarLoading, setIsSidebarLoading] = useState(true)
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

  // ─── Fetch sidebar data ─────────────────────────────────────────
  const fetchSidebarData = async () => {
    setIsSidebarLoading(true)
    setLoadError(null)
    try {
      const [activitiesData, servicesData, facilitiesData] = await Promise.allSettled([
        activitiesService.getAll(),
        servicesService.getAll(),
        facilitiesService.getAll(),
      ])

      if (activitiesData.status === "fulfilled" && Array.isArray(activitiesData.value)) {
        setActivities(activitiesData.value.map((a: Record<string, unknown>) => {
          const parseDate = (d: unknown) => {
            if (Array.isArray(d)) return new Date(d[0] as number, (d[1] as number) - 1, d[2] as number, (d[3] as number) || 0, (d[4] as number) || 0)
            return new Date(d as string | number)
          }
          const startDate = parseDate(a.startDateTime)
          return {
            id: a.id as string,
            title: a.name as string,
            sport: (a.sportId as string) || "Sport",
            date: startDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }),
            time: startDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' }),
            location: (a.location as string) || (a.city as string) || "TBD",
            price: (a.pricePerPerson as number) || 0,
            currency: (a.currency as string) || "USD",
            spots: ((a.maxParticipants as number) || 0) - ((a.currentParticipants as number) || 0),
            totalSpots: (a.maxParticipants as number) || 0,
            image: (a.coverImage as string) || "/placeholder.svg",
            rating: (a.rating as number) || 0,
            reviews: (a.reviewCount as number) || 0,
            organizer: (a.organizerName as string) || "Organizer",
            organizerAvatar: (a.organizerAvatar as string) || "",
            tags: (a.tags as string[]) || []
          }
        }))
      }

      if (servicesData.status === "fulfilled" && Array.isArray(servicesData.value)) {
        setServices(servicesData.value.map((s) => mapService(s as ServiceListingDto)))
      }

      if (facilitiesData.status === "fulfilled" && Array.isArray(facilitiesData.value)) {
        setFacilities(facilitiesData.value.map((f) => mapFacility(f as FacilityDto)))
      }

      // Fetch user profile
      if (userId) {
        try {
          const userData = await userService.getUserById(userId)
          if (userData) setUserProfile(userData as UserProfile)
        } catch { /* User profile fetch is non-critical */ }
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err : new Error("Failed to load home"))
    } finally {
      setIsSidebarLoading(false)
    }
  }

  useEffect(() => {
    fetchSidebarData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const userName = userProfile?.firstName || "Athlete"
  const stats = {
    totalActivities: userProfile?.stats?.totalActivities ?? userProfile?.totalActivities ?? 0,
    hoursPlayed: userProfile?.stats?.hoursPlayed ?? userProfile?.hoursPlayed ?? 0,
    sportsPlayed: userProfile?.stats?.sportsPlayed ?? userProfile?.sportsPlayed ?? 0,
    avgRating: userProfile?.stats?.avgRating ?? userProfile?.avgRating ?? 0,
  }

  const isLoading = feed.isLoading && isSidebarLoading

  if (isLoading) {
    return <FeedSkeleton count={4} />
  }

  if (loadError) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <ErrorState
          title="Couldn't load home"
          message={loadError.message || "Something went wrong. Please try again."}
          onRetry={() => { fetchSidebarData(); feed.refresh() }}
        />
      </div>
    )
  }

  // Composer data (only show when user profile loaded)
  const composerData = userProfile
    ? {
      displayName: userName,
      avatar: userProfile.profilePicture
        ? resolvePostImageUrl(userProfile.profilePicture) || initials
        : (userProfile.firstName?.[0] ?? "") + (userProfile.lastName?.[0] ?? ""),
    }
    : null

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <HeroBanner userName={userName} activityCount={activities.length} />

      {/* Stories */}
      <div>
        <h2 className="mb-3 text-base font-bold text-foreground">Stories</h2>
        <Stories />
      </div>

      <QuickStats {...stats} />

      <ErrorBoundary>
        <FeedSection
          feed={feed}
          userId={userId}
          currentUser={currentUserForComment}
          composer={composerData}
        />
      </ErrorBoundary>

      <FeaturedContent
        activities={activities}
        services={services}
        facilities={facilities}
      />

      {/* Empty state */}
      {activities.length === 0 && feed.items.length === 0 && services.length === 0 && facilities.length === 0 && (
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
            onClick={() => navigate("explore")}
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
