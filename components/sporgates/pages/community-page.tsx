"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Plus,
  ImageIcon,
  Search,
  MapPin,
  UserPlus,
  ChevronRight,
  Zap,
  Loader2,
} from "lucide-react"
import { fetcher } from "@/lib/fetcher"
import { userService } from "@/lib/services/user"
import { Stories } from "@/components/sporgates/stories"
import { PostCard } from "@/components/sporgates/cards/post-card"
import { resolvePostImageUrl, formatFeedTime } from "@/lib/utils"
import type { PostCardData } from "@/lib/types/post"
import { authService } from "@/lib/services"
import { PullToRefresh } from "@/components/sporgates/ux/pull-to-refresh"
import { FeedSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import type { PageRoute } from "@/lib/navigation"
import { usePostModal } from "@/lib/post-modal-context"
import { cn } from "@/lib/utils"

interface CommunityPageProps {
  onNavigate: (page: PageRoute, id?: string) => void
}

interface CommunityPerson {
  id: string
  name: string
  avatar: string
  location: string
  bio: string
  sports: string[]
  level: string
  activities: number
  mutualConnections: number
  isConnected: boolean
  sport: string
}

const levelColors: Record<string, string> = {
  Expert: "bg-violet-100 text-violet-700",
  Advanced: "bg-amber-100 text-amber-700",
  Intermediate: "bg-sky-100 text-sky-700",
  Beginner: "bg-slate-100 text-slate-600",
}

const activityLevelColors: Record<string, string> = {
  "Very High": "bg-rose-100 text-rose-700",
  High: "bg-amber-100 text-amber-700",
  Moderate: "bg-sky-100 text-sky-700",
  Low: "bg-slate-100 text-slate-600",
}

const communityGroups: any[] = [
  { id: "1", name: "NYC Basketball League", description: "Weekly pickup games across NYC", sport: "Basketball", members: 156, activityLevel: "Very High", isJoined: true },
  { id: "2", name: "Manhattan Runners", description: "Morning runs through Central Park", sport: "Running", members: 89, activityLevel: "High", isJoined: false },
  { id: "3", name: "Brooklyn Soccer Club", description: "Competitive and casual soccer matches", sport: "Soccer", members: 112, activityLevel: "Moderate", isJoined: true },
]

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const { openPost } = usePostModal()
  const [activeTab, setActiveTab] = useState("Feed")
  const [newPost, setNewPost] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [groupFilter, setGroupFilter] = useState<"all" | "mine">("all")

  const { data: postsRaw, mutate: mutatePosts, isLoading: postsLoading, error: postsError } = useSWR<{ content?: unknown[] } | unknown[]>('/v1/posts?page=0&size=20', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })
  const posts = useMemo(() => {
    if (!postsRaw) return []
    if (Array.isArray(postsRaw)) return postsRaw
    return (postsRaw as { content?: unknown[] }).content ?? []
  }, [postsRaw])

  const { data: squads = [], mutate: mutateSquads, isLoading: squadsLoading, error: squadsError } = useSWR<any[]>('/v1/squads/search?query=', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  const { data: peopleRaw } = useSWR(
    activeTab === "People" ? '/v1/users/browse' : null,
    () => userService.browseUsers({ size: 50 }),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const currentUser = authService.getCurrentUser()
  const { data: currentUserProfile } = useSWR(
    currentUser?.id ? `/v1/users/${currentUser.id}` : null,
    () => (currentUser?.id ? userService.getUserById(currentUser.id) : null),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  const peopleList = Array.isArray(peopleRaw) ? peopleRaw : (peopleRaw?.content ?? [])
  const communityPeople = peopleList.map((p: any) => ({
    id: p.id,
    name: [p.firstName, p.lastName].filter(Boolean).join(" ") || p.username || "Unknown",
    avatar: (p.firstName?.[0] || "") + (p.lastName?.[0] || "") || (p.username?.[0] || "?").toUpperCase(),
    location: p.location || "",
    bio: p.bio || "",
    sports: p.sportsPreferences?.map((s: any) => s.sportName) || [],
    level: "Intermediate",
    activities: 0,
    mutualConnections: 0,
    isConnected: false,
    sport: p.sportsPreferences?.[0]?.sportName || "Athlete",
  }))

  const isLoading = (postsLoading && activeTab === "Feed") || (squadsLoading && activeTab === "Squads")
  const hasError = (postsError && activeTab === "Feed") || (squadsError && activeTab === "Squads")

  const handleRefresh = async () => {
    await Promise.all([mutatePosts(), mutateSquads()])
  }

  const tabs = ["Feed", "Squads", "People", "Groups", "Discover"]

  const filteredPeople = useMemo(() => {
    if (!searchQuery) return communityPeople
    const q = searchQuery.toLowerCase()
    return communityPeople.filter(
      (p: any) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.sports.some((s: string) => s.toLowerCase().includes(q))
    )
  }, [searchQuery])

  const filteredGroups = useMemo(() => {
    let list = communityGroups
    if (groupFilter === "mine") list = list.filter((g: any) => g.isJoined)
    if (!searchQuery) return list
    const q = searchQuery.toLowerCase()
    return list.filter(
      (g: any) =>
        g.name.toLowerCase().includes(q) ||
        g.sport.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
    )
  }, [searchQuery, groupFilter])

  const showSearch = activeTab === "People" || activeTab === "Groups"

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6 pb-20 lg:pb-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Community</h1>
            <p className="text-sm text-muted-foreground">Connect with athletes and squads</p>
          </div>
        </div>

        <Stories />

        {/* Search bar (for People / Groups tabs) */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              className="h-10 w-full rounded-full border border-border bg-muted pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setSearchQuery("")
              }}
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

        {/* ====== FEED TAB ====== */}
        {activeTab === "Feed" && (
          <div className="space-y-4">
            {/* Posts */}
            {postsLoading ? (
              <FeedSkeleton count={3} />
            ) : postsError ? (
              <ErrorState
                title="Couldn't load feed"
                message="We're having trouble reaching the community feed."
                onRetry={() => mutatePosts()}
              />
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card">
                <EmptyState
                  icon={ImageIcon}
                  title="No posts yet"
                  description="Be the first to share something with the community."
                  action={{ label: "Go to Home", onClick: () => onNavigate("home"), variant: "primary" }}
                  size="md"
                />
              </div>
            ) : (
              posts.map((p: any) => {
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
                const u = currentUser
                const avatarUrl = currentUserProfile?.profilePicture ? resolvePostImageUrl(currentUserProfile.profilePicture) : null
                const currentUserForComment = u
                  ? { id: u.id, authorName: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "User", authorAvatar: avatarUrl || (u.firstName?.[0] ?? "") + (u.lastName?.[0] ?? "") || (u.username?.[0] ?? "?").toUpperCase() }
                  : null
                return (
                  <div
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openPost(p.id)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return
                      const tag = (e.target as HTMLElement).tagName
                      if (tag === "INPUT" || tag === "TEXTAREA") return
                      openPost(p.id)
                    }}
                    className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                  >
                    <PostCard post={post} userId={u?.id} currentUser={currentUserForComment} />
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ====== SQUADS TAB ====== */}
        {activeTab === "Squads" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Your Squads</h2>
              <button type="button" onClick={() => onNavigate("create-squad")} className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Plus className="h-3.5 w-3.5" />
                Create Squad
              </button>
            </div>
            {squadsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 animate-pulse">
                    <Skeleton className="h-14 w-14 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                      <div className="flex gap-3">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : squadsError ? (
              <ErrorState
                title="Couldn't load squads"
                message="Unable to fetch your squads right now."
                onRetry={() => mutateSquads()}
              />
            ) : squads.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card">
                <EmptyState
                  icon={Users}
                  title="No squads yet"
                  description="Join a squad or create your own to connect with other athletes."
                  action={{ label: "Create Squad", onClick: () => onNavigate("create-squad"), variant: "primary" }}
                  size="md"
                />
              </div>
            ) : (
              squads.map((squad) => (
                <button
                  type="button"
                  key={squad.id}
                  onClick={() => onNavigate("squad-detail", squad.id)}
                  className="w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="gradient-primary flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white">
                      {squad.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-foreground">{squad.name}</h3>
                      <p className="text-xs text-muted-foreground">{squad.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {squad.members}/{squad.maxMembers} members
                        </span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {squad.sport}
                        </span>
                        <span>{squad.upcomingEvents} upcoming</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* ====== PEOPLE TAB ====== */}
        {activeTab === "People" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                {filteredPeople.length} {filteredPeople.length === 1 ? "Person" : "People"}
              </h2>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-secondary px-3 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-secondary hover:text-white"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Invite Friends
              </button>
            </div>

            {filteredPeople.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <UserPlus className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-semibold text-foreground">No people found</p>
                <p className="mt-1 text-xs text-muted-foreground">Try adjusting your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredPeople.map((person: CommunityPerson) => (
                  <div
                    key={person.id}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-primary/40"
                  >
                    {/* Profile Header */}
                    <div className="relative h-24 bg-gradient-to-br from-[#003C66] to-[#005A99]">
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-secondary to-secondary/70 text-lg font-bold text-white shadow-lg">
                          {person.avatar}
                        </div>
                      </div>
                      {person.isConnected && (
                        <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Connected
                        </span>
                      )}
                    </div>

                    {/* Person Info */}
                    <div className="px-5 pb-5 pt-10 text-center">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {person.name}
                      </h3>
                      <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {person.location}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{person.bio}</p>

                      {/* Level + Sports */}
                      <div className="mt-3 space-y-2">
                        <span
                          className={cn(
                            "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                            levelColors[person.level] || levelColors.Beginner
                          )}
                        >
                          {person.level}
                        </span>
                        <div className="flex flex-wrap justify-center gap-1">
                          {person.sports.slice(0, 3).map((sport: string) => (
                            <span
                              key={sport}
                              className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                            >
                              {sport}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                        <span>{person.activities} activities</span>
                        <span>{person.mutualConnections} mutual</span>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex gap-2">
                        {person.isConnected ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onNavigate("person-detail", person.id)}
                              className="flex-1 rounded-xl bg-primary py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                            >
                              View Profile
                            </button>
                            <button
                              type="button"
                              className="flex items-center justify-center rounded-xl border border-border px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-secondary py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                            >
                              <UserPlus className="h-3.5 w-3.5" />
                              Connect
                            </button>
                            <button
                              type="button"
                              onClick={() => onNavigate("person-detail", person.id)}
                              className="flex items-center justify-center rounded-xl border border-border px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== GROUPS TAB ====== */}
        {activeTab === "Groups" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">Groups</h2>
                <div className="flex rounded-full border border-border bg-card text-[10px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setGroupFilter("all")}
                    className={cn(
                      "rounded-full px-3 py-1 transition-all",
                      groupFilter === "all" ? "gradient-primary text-white" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroupFilter("mine")}
                    className={cn(
                      "rounded-full px-3 py-1 transition-all",
                      groupFilter === "mine" ? "gradient-primary text-white" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    My Groups
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-semibold text-primary"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Group
              </button>
            </div>

            {filteredGroups.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-semibold text-foreground">No groups found</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {groupFilter === "mine" ? "Join a group to see it here" : "Try adjusting your search"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-secondary/40"
                  >
                    {/* Group header */}
                    <div className="relative h-28 bg-gradient-to-br from-[#003C66] to-[#005A99] p-4">
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                        {group.sport}
                      </span>
                      {group.isJoined && (
                        <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Joined
                        </span>
                      )}
                    </div>

                    {/* Group info */}
                    <div className="p-5">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-secondary transition-colors">
                        {group.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{group.description}</p>

                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                              activityLevelColors[group.activityLevel] || activityLevelColors.Low
                            )}
                          >
                            {group.activityLevel}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        {group.isJoined ? (
                          <button
                            type="button"
                            className="w-full rounded-xl bg-primary py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                          >
                            View Group
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-secondary py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Join Group
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== DISCOVER TAB ====== */}
        {activeTab === "Discover" && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Suggested Squads</h2>
            {squads.map((squad) => (
              <div
                key={squad.id}
                role="button"
                tabIndex={0}
                onClick={() => onNavigate("squad-profile", squad.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onNavigate("squad-profile", squad.id)
                  }
                }}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="gradient-secondary flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white">
                  {squad.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{squad.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {squad.members} members - {squad.sport}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                  className="rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PullToRefresh>
  )
}
