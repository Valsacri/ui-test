"use client"

import { useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import { ArrowLeft, Users, MapPin, Trophy, Calendar, BadgeCheck, Star, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { userService, activitiesService, squadService, authService } from "@/lib/services"
import { ProfileSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface PersonDetailPageProps {
  personId: string
  onNavigate: (page: PageRoute, id?: string) => void
}

const achievements = [
  { title: "Early Bird", detail: "10 morning sessions", icon: Trophy },
  { title: "Team Player", detail: "Joined 15 team events", icon: Users },
  { title: "Consistency", detail: "6-week activity streak", icon: Calendar },
]

export function PersonDetailPage({ personId, onNavigate }: PersonDetailPageProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const { data: person, isLoading } = useSWR(
    personId ? `/users/${personId}` : null,
    () => userService.getUserById(personId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: allActivities = [] } = useSWR(
    person ? `/activities` : null,
    () => activitiesService.getAll(),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: allSquads = [] } = useSWR(
    person ? `/squads/search` : null,
    () => squadService.search(""),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const relatedActivities = Array.isArray(allActivities) ? allActivities.slice(0, 3) : []
  const relatedSquads = Array.isArray(allSquads) ? allSquads.slice(0, 2) : []

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (!person) {
    return (
      <ErrorState
        title="Person not found"
        message="This profile may no longer be available."
        onRetry={() => onNavigate("explore")}
      />
    )
  }

  const displayName = person.name || [person.firstName, person.lastName].filter(Boolean).join(" ") || person.username || "Unknown"
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("explore")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Explore
      </button>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="gradient-primary h-28" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-4 md:flex-row md:items-end">
            <div className="gradient-primary flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-lg">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
                {person.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{person.sport || "Athlete"}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {person.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {person.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {(person.followers || 0).toLocaleString()} followers
                </span>
                {person.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                    {person.rating} rating
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  const me = authService.getCurrentUser()?.id
                  if (!me) return
                  const prev = isFollowing
                  setIsFollowing(!prev)
                  try {
                    if (prev) await userService.unfollowUser(me, personId)
                    else await userService.followUser(me, personId)
                  } catch {
                    setIsFollowing(prev)
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
                onClick={() => onNavigate("messages")}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
          {person.bio && <p className="mt-4 text-sm text-muted-foreground">{person.bio}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {achievements.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm"
          >
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground">Recent Activities</h2>
          {relatedActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activities</p>
          ) : (
            relatedActivities.map((activity: any) => (
              <button
                key={activity.id}
                type="button"
                onClick={() => onNavigate("activity-detail", activity.id)}
                className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md"
              >
                {activity.image && (
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    width={56}
                    height={56}
                    className="rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{activity.title || activity.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{activity.date || "TBD"}</span>
                    {activity.location && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                        <span>{activity.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground">Related Squads</h2>
          {relatedSquads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No related squads</p>
          ) : (
            relatedSquads.map((squad: any) => (
              <div
                key={squad.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold text-white">
                    {squad.name ? squad.name.slice(0, 2).toUpperCase() : "SQ"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{squad.name}</p>
                    <p className="text-xs text-muted-foreground">{squad.description || squad.sport}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("squad-profile", squad.id)}
                    className="rounded-full border border-primary px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    View
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {squad.members || 0} members
                  </span>
                  {squad.sport && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {squad.sport}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
