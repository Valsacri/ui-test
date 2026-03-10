"use client"

import { useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import {
  MapPin,
  Calendar,
  Users,
  Award,
  Edit3,
  Zap,
  Clock,
  Star,
  TrendingUp,
  CalendarDays,
  ChevronRight,
  Loader2,
  Camera,
  ImagePlus,
  MessageCircle,
} from "lucide-react"
import { userService, authService, activitiesService, postsService } from "@/lib/services"
import { PostCard } from "@/components/sporgates/cards/post-card"
import type { PageRoute } from "@/lib/navigation"
import { ProfileSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { cn, parseBackendDate, formatFeedTime, resolvePostImageUrl } from "@/lib/utils"
import { usePostModal } from "@/lib/post-modal-context"
import type { PostCardData } from "@/lib/types/post"
import { FollowListModal } from "@/components/sporgates/follow-list-modal"

interface ProfilePageProps {
  onNavigate: (page: PageRoute, id?: string) => void
}

const tabs = ["Overview", "Feed", "Activity", "Achievements"]

const recentActivity = [
  { id: "1", type: "joined", title: "5v5 Basketball Pickup Game", date: "Feb 7, 2026", sport: "Basketball" },
  { id: "2", type: "completed", title: "Swimming Laps at Asphalt Green", date: "Feb 5, 2026", sport: "Swimming" },
  { id: "3", type: "booked", title: "Tennis Court at Central Park", date: "Feb 3, 2026", sport: "Tennis" },
  { id: "4", type: "joined", title: "Sunday Soccer League", date: "Feb 1, 2026", sport: "Soccer" },
  { id: "5", type: "completed", title: "Boxing Fundamentals Class", date: "Jan 30, 2026", sport: "Boxing" },
  { id: "6", type: "booked", title: "Personal Basketball Training", date: "Jan 28, 2026", sport: "Basketball" },
]

const achievements = [
  { name: "Early Bird", description: "10 morning activities completed", icon: "sunrise", unlocked: true, date: "Jan 2026" },
  { name: "Team Player", description: "Join 5 team sports events", icon: "users", unlocked: true, date: "Dec 2025" },
  { name: "Marathon Runner", description: "Run a total of 50 miles", icon: "medal", unlocked: true, date: "Feb 2026" },
  { name: "Social Butterfly", description: "Connect with 100 athletes", icon: "heart", unlocked: true, date: "Jan 2026" },
  { name: "Multi-Sport", description: "Play 5 different sports", icon: "trophy", unlocked: true, date: "Nov 2025" },
  { name: "Streak Master", description: "7-day activity streak", icon: "flame", unlocked: false, progress: 5, target: 7 },
  { name: "Century Club", description: "100 total activities", icon: "star", unlocked: false, progress: 48, target: 100 },
  { name: "Top Rated", description: "Maintain 4.9+ rating", icon: "sparkle", unlocked: false, progress: 4.8, target: 4.9 },
]

const weeklyData = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.0 },
  { day: "Wed", hours: 0 },
  { day: "Thu", hours: 1.0 },
  { day: "Fri", hours: 2.5 },
  { day: "Sat", hours: 3.0 },
  { day: "Sun", hours: 1.5 },
]

const apiBase = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api") : ""

const defaultProfile = {
  name: "Athlete",
  username: "@athlete",
  bio: "Sports enthusiast",
  location: "Unknown",
  memberSince: "2025",
  avatar: "A",
  profilePicture: null as string | null,
  coverImage: null as string | null,
  followers: 0,
  following: 0,
  activitiesJoined: 0,
  favoriteSports: [] as string[],
  stats: { totalActivities: 0, hoursPlayed: 0, sportsPlayed: 0, avgRating: 0 },
}

const goals = [
  { id: "1", title: "Play 20 games", sport: "Basketball", progress: 12, target: 20, unit: "games", deadline: "Mar 2026" },
  { id: "2", title: "Swim 50 laps", sport: "Swimming", progress: 35, target: 50, unit: "laps", deadline: "Apr 2026" },
  { id: "3", title: "Run 100km", sport: "Running", progress: 68, target: 100, unit: "km", deadline: "Jun 2026" },
]

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState("Overview")
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [followListModal, setFollowListModal] = useState<"followers" | "following" | null>(null)
  const maxHours = Math.max(...weeklyData.map((d) => d.hours))
  const { openPost } = usePostModal()

  const user = authService.getCurrentUser()
  const userId = user?.id
  const initials =
    (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") || (user?.username?.[0] ?? "?").toUpperCase()
  const currentUserForComment = user
    ? {
        id: user.id,
        authorName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "User",
        authorAvatar: initials,
      }
    : null

  const { data: userData, error: userError, isLoading: userLoading, mutate: mutateUser } = useSWR(
    userId ? `/users/${userId}` : null,
    () => userService.getUserById(userId!),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: actData = [], error: actError, isLoading: actLoading } = useSWR(
    `/activities`,
    () => activitiesService.getAll(),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: postsPage, mutate: mutatePosts } = useSWR(
    userId ? `/posts/user/${userId}` : null,
    () => postsService.getByUser(userId!, userId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  const userPostsList = postsPage?.content ?? []

  const isLoading = userLoading || (actLoading && actData.length === 0)
  const error = userError || actError

  const userProfile = {
    ...defaultProfile,
    ...(userData ? {
      name: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : defaultProfile.name,
      bio: userData.bio || defaultProfile.bio,
      location: userData.location || defaultProfile.location,
      avatar: userData.firstName?.charAt(0) || defaultProfile.avatar,
      profilePicture: userData.profilePicture || null,
      coverImage: userData.coverImage || null,
      username: userData.username ? `@${userData.username}` : defaultProfile.username,
      followers: userData.followersCount ?? defaultProfile.followers,
      following: userData.followingCount ?? defaultProfile.following,
      favoriteSports: userData.sportsPreferences?.map((s: any) => s.sportName) || defaultProfile.favoriteSports,
    } : {}),
  }

  const resolveImageUrl = (path: string | null | undefined) => {
    if (!path) return null
    if (path.startsWith("http")) return path
    return path.startsWith("/") ? `${apiBase}${path}` : path
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    e.target.value = ""
    setUploadingCover(true)
    try {
      const { url } = await userService.uploadCoverImage(file)
      await userService.updateProfile(userId, { coverImage: url })
      await mutateUser()
    } finally {
      setUploadingCover(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    e.target.value = ""
    setUploadingAvatar(true)
    try {
      const { url } = await userService.uploadProfileImage(file)
      await userService.updateProfile(userId, { profilePicture: url })
      await mutateUser()
    } finally {
      setUploadingAvatar(false)
    }
  }

  const coverImageUrl = resolveImageUrl(userProfile.coverImage)
  const profilePictureUrl = resolveImageUrl(userProfile.profilePicture)

  const parseDate = (d: any) => Array.isArray(d) ? new Date(d[0], d[1] - 1, d[2], d[3] || 0, d[4] || 0) : new Date(d)
  const activities = Array.isArray(actData)
    ? actData.map((a: any) => {
      const startDate = parseDate(a.startDateTime)
      return {
        id: a.id,
        title: a.name,
        sport: a.sportId || "Sport",
        date: startDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }),
        time: startDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' }),
        image: a.coverImage || "/placeholder.svg",
      }
    })
    : []

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load profile"
        message="We ran into an issue fetching your profile data."
        onRetry={() => {
          // Both will be retried by SWR
        }}
      />
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Cover */}
        <div className="relative h-32 bg-muted">
          {coverImageUrl ? (
            <Image src={coverImageUrl} alt="Cover" fill className="object-cover" sizes="800px" unoptimized />
          ) : (
            <div className="gradient-primary h-full w-full" />
          )}
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
            <input type="file" accept="image/*" className="sr-only" onChange={handleCoverUpload} disabled={uploadingCover} />
            {uploadingCover ? (
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            ) : (
              <span className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white">
                <ImagePlus className="h-4 w-4" /> Change cover
              </span>
            )}
          </label>
        </div>
        <div className="px-6 pb-6 pt-6">
          <div className="-mt-12 flex items-end gap-4">
            {/* Avatar */}
            <div className="relative group">
              <div className={cn(
                "relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-lg",
                !profilePictureUrl && "gradient-primary"
              )}>
                {profilePictureUrl ? (
                  <Image src={profilePictureUrl} alt={userProfile.name} fill className="object-cover" sizes="96px" unoptimized />
                ) : (
                  userProfile.avatar
                )}
              </div>
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                {uploadingAvatar ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </label>
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{userProfile.name}</h1>
                <button
                  type="button"
                  onClick={() => onNavigate("settings-profile")}
                  className="rounded-full p-1.5 transition-colors hover:bg-muted"
                >
                  <Edit3 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{userProfile.username}</p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => onNavigate("profile-enhanced")}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                View Insights
              </button>
              <button
                type="button"
                onClick={() => onNavigate("profile-information")}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Profile Info
              </button>
              <button
                type="button"
                onClick={() => onNavigate("settings")}
                className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Edit Profile
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground">{userProfile.bio}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {userProfile.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Joined {userProfile.memberSince}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <button
              type="button"
              onClick={() => userId && setFollowListModal("followers")}
              className="text-left transition-opacity hover:opacity-80 disabled:pointer-events-none disabled:opacity-50"
              disabled={!userId}
            >
              <strong className="text-foreground">{userProfile.followers}</strong>{" "}
              <span className="text-muted-foreground">Followers</span>
            </button>
            <button
              type="button"
              onClick={() => userId && setFollowListModal("following")}
              className="text-left transition-opacity hover:opacity-80 disabled:pointer-events-none disabled:opacity-50"
              disabled={!userId}
            >
              <strong className="text-foreground">{userProfile.following}</strong>{" "}
              <span className="text-muted-foreground">Following</span>
            </button>
            <span>
              <strong className="text-foreground">{userProfile.activitiesJoined}</strong>{" "}
              <span className="text-muted-foreground">Activities</span>
            </span>
          </div>
          {userId && followListModal && (
            <FollowListModal
              open={!!followListModal}
              onOpenChange={(open) => !open && setFollowListModal(null)}
              userId={userId}
              mode={followListModal}
              onNavigate={onNavigate}
              onUnfollow={() => mutateUser()}
            />
          )}
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
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total Activities", value: userProfile.stats.totalActivities, icon: Zap, color: "text-secondary", bg: "bg-secondary/10" },
              { label: "Hours Played", value: userProfile.stats.hoursPlayed, icon: Clock, color: "text-primary", bg: "bg-primary/10" },
              { label: "Sports Played", value: userProfile.stats.sportsPlayed, icon: Users, color: "text-secondary", bg: "bg-secondary/10" },
              { label: "Avg Rating", value: userProfile.stats.avgRating, icon: Star, color: "text-primary", bg: "bg-primary/10" },
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

          {/* Weekly Activity Chart */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Weekly Activity</h2>
                <p className="text-xs text-muted-foreground">Hours per day this week</p>
              </div>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex items-end gap-3" style={{ height: 140 }}>
              {weeklyData.map((day) => (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-foreground">
                    {day.hours > 0 ? `${day.hours}h` : ""}
                  </span>
                  <div
                    className={cn(
                      "w-full rounded-t-lg transition-all duration-500",
                      day.hours > 0 ? "gradient-primary" : "bg-muted"
                    )}
                    style={{
                      height: day.hours > 0 ? `${(day.hours / maxHours) * 100}px` : "8px",
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals Progress */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-foreground">Goals Progress</h2>
            <div className="space-y-4">
              {goals.map((goal) => {
                const percentage = (goal.progress / goal.target) * 100
                return (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {goal.sport}
                        </span>
                        <span className="text-xs font-medium text-foreground">{goal.title}</span>
                      </div>
                      <span className="text-xs font-semibold text-secondary">{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="gradient-secondary h-full rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Favorite Sports */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-foreground">Favorite Sports</h2>
            <div className="flex flex-wrap gap-2">
              {userProfile.favoriteSports.map((sport: string) => (
                <span
                  key={sport}
                  className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>

          {/* My Posts (from API) */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-foreground">My Posts</h2>
            {userPostsList.length > 0 ? (
              <div className="space-y-3">
                {userPostsList.slice(0, 5).map((post: any) => (
                  <div
                    key={post.id}
                    className="rounded-xl border border-border bg-muted/50 p-3"
                  >
                    <p className="text-sm text-foreground line-clamp-2">{post.content || post.text || post.body}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {post.createdAt ? (() => { const d = parseBackendDate(post.createdAt as string | number[]); return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""; })() : ""}
                      {(post.likesCount ?? post.likeCount) != null && ` · ${post.likesCount ?? post.likeCount} likes`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No posts yet. Share something with the community!</p>
            )}
          </div>
        </div>
      )}

      {/* Feed Tab */}
      {activeTab === "Feed" && (
        <div className="space-y-4 animate-fade-in">
          {userPostsList.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <MessageCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-semibold text-foreground">No posts yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Share something with the community!</p>
            </div>
          ) : (
            userPostsList.map((p: any) => {
              const postCard: PostCardData = {
                id: p.id,
                author: p.authorName ?? userProfile.name ?? "User",
                authorAvatar: p.authorAvatar ?? userProfile.avatar ?? "?",
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
                    canDelete
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

      {/* Activity Tab */}
      {activeTab === "Activity" && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-base font-bold text-foreground">Recent Activity</h2>
              <p className="text-xs text-muted-foreground">Your activity timeline</p>
            </div>
            <div className="divide-y divide-border">
              {(activities.length > 0 ? activities.slice(0, 8).map((activity) => ({
                id: activity.id,
                type: "joined" as const,
                title: activity.title,
                date: activity.date,
                sport: activity.sport,
              })) : recentActivity).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      item.type === "joined" && "bg-primary/10 text-primary",
                      item.type === "completed" && "bg-green-100 text-green-600",
                      item.type === "booked" && "bg-secondary/10 text-secondary"
                    )}
                  >
                    {item.type === "joined" && <Users className="h-4 w-4" />}
                    {item.type === "completed" && <Star className="h-4 w-4" />}
                    {item.type === "booked" && <CalendarDays className="h-4 w-4" />}
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
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Activities */}
          <div>
            <h2 className="mb-3 text-base font-bold text-foreground">Upcoming Activities</h2>
            <div className="space-y-3">
              {activities.slice(0, 3).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    width={56}
                    height={56}
                    className="rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>{activity.date}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-semibold text-secondary">
                    {activity.sport}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "Achievements" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">5</p>
              <p className="text-[11px] text-muted-foreground">Unlocked</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">3</p>
              <p className="text-[11px] text-muted-foreground">In Progress</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">8</p>
              <p className="text-[11px] text-muted-foreground">Total</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">62%</p>
              <p className="text-[11px] text-muted-foreground">Completion</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
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
                    <div className="mt-1.5">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="gradient-secondary h-full rounded-full"
                          style={{
                            width: `${((achievement.progress || 0) / (achievement.target || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {achievement.progress}/{achievement.target}
                      </p>
                    </div>
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
