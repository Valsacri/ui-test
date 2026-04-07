"use client"

import { useState, useEffect, useMemo } from "react"
import useSWR from "swr"
import Image from "next/image"
import {
  ArrowLeft,
  Users,
  MapPin,
  Trophy,
  Calendar,
  BadgeCheck,
  Star,
  MessageCircle,
  Zap,
  Clock,
  Award,
  ChevronRight,
  CalendarDays,
} from "lucide-react"
import { toast } from "sonner"
import { userService, activitiesService, squadService, authService, messagesService, postsService } from "@/lib/services"
import { ProfileSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { PostCard } from "@/components/sporgates/cards/post-card"
import type { PageRoute } from "@/lib/navigation"
import { cn, resolvePostImageUrl, isAvatarImageUrl, formatFeedTime } from "@/lib/utils"
import { usePostModal } from "@/lib/post-modal-context"
import type { PostCardData } from "@/lib/types/post"

interface PersonDetailPageProps {
  personId: string
  onNavigate: (page: PageRoute, id?: string) => void
}

const tabs = ["Overview", "Feed", "Activity", "Achievements"]

const achievementsList = [
  { name: "Early Bird", description: "10 morning sessions", unlocked: true, date: "Jan 2026" },
  { name: "Team Player", description: "Joined 15 team events", unlocked: true, date: "Dec 2025" },
  { name: "Consistency", description: "6-week activity streak", unlocked: true, date: "Nov 2025" },
  { name: "Multi-Sport", description: "Play 3+ different sports", unlocked: false, progress: 2, target: 3 },
  { name: "Century Club", description: "100 total activities", unlocked: false, progress: 48, target: 100 },
]

export function PersonDetailPage({ personId, onNavigate }: PersonDetailPageProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Overview")
  const { openPost } = usePostModal()

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

  const { data: organizerActivities = [] } = useSWR(
    personId ? `/activities/organizer/${personId}` : null,
    () => activitiesService.getByOrganizer(personId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: participations = [] } = useSWR(
    personId ? `/activities/user/${personId}/participations` : null,
    () => activitiesService.getUserParticipations(personId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: postsPage, mutate: mutatePosts } = useSWR(
    personId ? `/posts/user/${personId}` : null,
    () => postsService.getByUser(personId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: allSquads = [] } = useSWR(
    person ? `/squads/search` : null,
    () => squadService.search(""),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const user = authService.getCurrentUser()
  const currentUserForComment = user
    ? {
        id: user.id,
        authorName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "User",
        authorAvatar: [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?",
      }
    : null

  const personPostsList = postsPage?.content ?? []
  const relatedActivities = Array.isArray(allActivities) ? allActivities.slice(0, 3) : []
  const relatedSquads = Array.isArray(allSquads) ? allSquads.slice(0, 2) : []

  const parseDate = (d: any) => {
    if (!d) return null
    if (Array.isArray(d)) return new Date(d[0], (d[1] ?? 1) - 1, d[2] ?? 1, d[3] ?? 0, d[4] ?? 0)
    return new Date(d)
  }

  const activityTimeline = useMemo(() => {
    const organized = (Array.isArray(organizerActivities) ? organizerActivities : []).map((a: any) => ({
      id: a.id,
      type: "organized" as const,
      title: a.name || a.title || "Activity",
      date: parseDate(a.startDateTime)?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) ?? "TBD",
      sport: a.sportId || a.sport || "Sport",
      raw: a,
    }))
    const joined = (Array.isArray(participations) ? participations : []).map((a: any) => ({
      id: a.id,
      type: "joined" as const,
      title: a.name || a.title || "Activity",
      date: parseDate(a.startDateTime)?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) ?? "TBD",
      sport: a.sportId || a.sport || "Sport",
      raw: a,
    }))
    const combined = [...organized.map((x) => ({ ...x, sortKey: parseDate((x.raw as any).startDateTime)?.getTime() ?? 0 })), ...joined.map((x) => ({ ...x, sortKey: parseDate((x.raw as any).startDateTime)?.getTime() ?? 0 }))]
    combined.sort((a, b) => b.sortKey - a.sortKey)
    return combined.slice(0, 20).map(({ id, type, title, date, sport }) => ({ id, type, title, date, sport }))
  }, [organizerActivities, participations])

  // Check real follow status
  useEffect(() => {
    const me = authService.getCurrentUser()?.id
    if (!me || !personId) {
      setFollowLoading(false)
      return
    }
    userService.getUserById(me)
      .then((userData: any) => {
        const followingList = userData?.following ?? []
        setIsFollowing(followingList.includes(personId))
      })
      .catch(() => { })
      .finally(() => setFollowLoading(false))
  }, [personId])

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

  const displayName = [person.firstName, person.lastName].filter(Boolean).join(" ") || person.username || "Unknown"
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"
  const profilePictureUrl = person.profilePicture ? resolvePostImageUrl(person.profilePicture) : null
  const coverImageUrl = person.coverImage ? resolvePostImageUrl(person.coverImage) : null
  const followersCount = person.followersCount ?? 0
  const followingCount = person.followingCount ?? 0
  const sportLabel = person.sportsPreferences?.[0]?.sportName || (person as any).sport || "Athlete"

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
        {/* Cover: same as profile (h-32) */}
        <div className="relative h-32 bg-muted">
          {coverImageUrl && isAvatarImageUrl(coverImageUrl) ? (
            <Image
              src={coverImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          ) : (
            <div className="gradient-primary h-full w-full" />
          )}
        </div>
        <div className="px-6 pb-6 pt-6">
          <div className="-mt-12 flex items-end gap-4">
            {/* Avatar: same size and style as profile (h-24) */}
            <div className={cn(
              "relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-lg",
              !(profilePictureUrl && isAvatarImageUrl(profilePictureUrl)) && "gradient-primary"
            )}>
              {profilePictureUrl && isAvatarImageUrl(profilePictureUrl) ? (
                <Image
                  src={profilePictureUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
                {(person as any).verified && <BadgeCheck className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">
                {person.username ? `@${person.username}` : sportLabel}
              </p>
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
                disabled={followLoading}
                className={cn(
                  "rounded-full px-5 py-2 text-xs font-semibold transition-all",
                  isFollowing
                    ? "border border-primary bg-primary/10 text-primary"
                    : "gradient-primary text-white shadow-md"
                )}
              >
                {followLoading ? "…" : isFollowing ? "Following" : "Follow"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const conv = await messagesService.createDirectConversation({ targetUserId: personId })
                    onNavigate("conversation", conv.id)
                  } catch {
                    toast.error("Could not start conversation")
                  }
                }}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                title="Message"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
          {person.bio && <p className="mt-3 text-sm text-foreground">{person.bio}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {(person as any).location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {(person as any).location}
              </span>
            )}
            <span className="flex items-center gap-1">
              {sportLabel}
            </span>
            {(person as any).rating != null && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                {(person as any).rating} rating
              </span>
            )}
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <span>
              <strong className="text-foreground">{followersCount.toLocaleString()}</strong>{" "}
              <span className="text-muted-foreground">Followers</span>
            </span>
            <span>
              <strong className="text-foreground">{followingCount.toLocaleString()}</strong>{" "}
              <span className="text-muted-foreground">Following</span>
            </span>
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

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total Activities", value: activityTimeline.length, icon: Zap, color: "text-secondary", bg: "bg-secondary/10" },
              { label: "Organized", value: Array.isArray(organizerActivities) ? organizerActivities.length : 0, icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
              { label: "Posts", value: personPostsList.length, icon: MessageCircle, color: "text-primary", bg: "bg-primary/10" },
              { label: "Rating", value: (person as any)?.rating ?? "—", icon: Star, color: "text-secondary", bg: "bg-secondary/10" },
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

          {/* Favorite Sports */}
          {(person?.sportsPreferences?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-foreground">Sports</h2>
              <div className="flex flex-wrap gap-2">
                {person.sportsPreferences?.map((s: any) => (
                  <span
                    key={s.sportName ?? s}
                    className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                  >
                    {s.sportName ?? s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activities */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Recent Activities</h2>
            {activityTimeline.length === 0 ? (
              <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No recent activities</p>
            ) : (
              <div className="space-y-3">
                {activityTimeline.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate("activity-detail", item.id)}
                    className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        item.type === "organized" && "bg-primary/10 text-primary",
                        item.type === "joined" && "bg-secondary/10 text-secondary"
                      )}
                    >
                      {item.type === "organized" ? <Calendar className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{item.type}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                      {item.sport}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Related Squads */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Related Squads</h2>
            {relatedSquads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No related squads</p>
            ) : (
              <div className="space-y-3">
                {relatedSquads.map((squad: any) => (
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
                        onClick={() => onNavigate("squad-detail", squad.id)}
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
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feed Tab */}
      {activeTab === "Feed" && (
        <div className="space-y-4 animate-fade-in">
          {personPostsList.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <MessageCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-semibold text-foreground">No posts yet</p>
              <p className="mt-1 text-xs text-muted-foreground">This user hasn&apos;t shared anything yet.</p>
            </div>
          ) : (
            personPostsList.map((p: any) => {
              const postCard: PostCardData = {
                id: p.id,
                author: p.authorName ?? displayName,
                authorAvatar: p.authorAvatar ?? initials,
                time: formatFeedTime(p.createdAt),
                content: p.content ?? p.text ?? p.body ?? "",
                image: resolvePostImageUrl(p.image) || p.image,
                likes: p.likes ?? p.likesCount ?? 0,
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
                    userId={user?.id}
                    currentUser={currentUserForComment}
                    onCountChange={() => mutatePosts()}
                    canDelete={false}
                  />
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "Activity" && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-base font-bold text-foreground">Activity timeline</h2>
              <p className="text-xs text-muted-foreground">Organized and joined activities</p>
            </div>
            <div className="divide-y divide-border">
              {activityTimeline.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-muted-foreground">No activities yet</div>
              ) : (
                activityTimeline.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate("activity-detail", item.id)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        item.type === "organized" && "bg-primary/10 text-primary",
                        item.type === "joined" && "bg-secondary/10 text-secondary"
                      )}
                    >
                      {item.type === "organized" ? <CalendarDays className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{item.type}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                      {item.sport}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "Achievements" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">
                {achievementsList.filter((a) => a.unlocked).length}
              </p>
              <p className="text-[11px] text-muted-foreground">Unlocked</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">
                {achievementsList.filter((a) => !a.unlocked).length}
              </p>
              <p className="text-[11px] text-muted-foreground">In Progress</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{achievementsList.length}</p>
              <p className="text-[11px] text-muted-foreground">Total</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">
                {Math.round((achievementsList.filter((a) => a.unlocked).length / achievementsList.length) * 100)}%
              </p>
              <p className="text-[11px] text-muted-foreground">Completion</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {achievementsList.map((achievement) => (
              <div
                key={achievement.name}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
                  achievement.unlocked ? "border-border" : "border-border opacity-75"
                )}
              >
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
                    achievement.unlocked ? "gradient-secondary" : "bg-muted"
                  )}
                >
                  <Award className={cn("h-6 w-6", achievement.unlocked ? "text-white" : "text-muted-foreground")} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked ? (
                    <p className="mt-1 text-[10px] font-medium text-secondary">
                      Unlocked {achievement.date}
                    </p>
                  ) : (
                    "progress" in achievement && achievement.target != null && (
                      <div className="mt-1.5">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="gradient-secondary h-full rounded-full"
                            style={{
                              width: `${((achievement.progress ?? 0) / achievement.target) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {achievement.progress}/{achievement.target}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
