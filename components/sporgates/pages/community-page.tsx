"use client"

import { useState, useMemo, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import useSWR, { mutate as swrMutate } from "swr"
import {
  MessageCircle,
  Users,
  Plus,
  Search,
  MapPin,
  UserPlus,
  ChevronRight,
  Trophy,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { fetcher } from "@/lib/fetcher"
import { userService } from "@/lib/services/user"
import { authService } from "@/lib/services/auth"
import { messagesService } from "@/lib/services/messages"
import { groupService, type InterestGroupDto } from "@/lib/services/groups"
import { PullToRefresh } from "@/components/sporgates/ux/pull-to-refresh"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import type { PageRoute } from "@/lib/navigation"
import { resolvePostImageUrl } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface CommunityPageProps {
  onNavigate: (page: PageRoute, id?: string) => void
}

interface CommunityPerson {
  id: string
  name: string
  avatar: string
  profilePicture: string | null
  location: string
  bio: string
  sports: string[]
  level: string
  activities: number
  followersCount: number
  isFollowing: boolean
  sport: string
}

const levelColors: Record<string, string> = {
  Expert: "bg-violet-100 text-violet-700",
  Advanced: "bg-amber-100 text-amber-700",
  Intermediate: "bg-sky-100 text-sky-700",
  Beginner: "bg-slate-100 text-slate-600",
}


/** People → Squads → Leagues → Groups (feed and stories live on Home). */
const COMMUNITY_TABS = ["People", "Squads", "Leagues", "Groups"] as const
type CommunityTab = (typeof COMMUNITY_TABS)[number]

function parseCommunityTabParam(raw: string | null): CommunityTab {
  if (!raw) return "People"
  const legacy = raw.toLowerCase()
  if (legacy === "feed" || legacy === "discover") return "People"
  const found = COMMUNITY_TABS.find((t) => t.toLowerCase() === raw.toLowerCase())
  return found ?? "People"
}


export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabFromUrl = useMemo(() => parseCommunityTabParam(searchParams.get("tab")), [searchParams])
  const [activeTab, setActiveTab] = useState<CommunityTab>("People")
  const [searchQuery, setSearchQuery] = useState("")
  const [groupFilter, setGroupFilter] = useState<"all" | "mine">("all")
  const [followingInProgress, setFollowingInProgress] = useState<Set<string>>(new Set())
  const [messagingUser, setMessagingUser] = useState<string | null>(null)

  const currentUser = authService.getCurrentUser()

  const { data: squads = [], mutate: mutateSquads, isLoading: squadsLoading, error: squadsError } = useSWR<any[]>(
    activeTab === "Squads" ? "/v1/squads/search?query=" : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  useEffect(() => {
    setActiveTab(tabFromUrl)
  }, [tabFromUrl])

  const goToTab = (tab: CommunityTab) => {
    setActiveTab(tab)
    setSearchQuery("")
    const params = new URLSearchParams(searchParams.toString())
    if (tab === "People") {
      params.delete("tab")
    } else {
      params.set("tab", tab)
    }
    const q = params.toString()
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false })
  }

  const { data: leaguesRaw, mutate: mutateLeagues, isLoading: leaguesLoading, error: leaguesError } = useSWR(
    activeTab === "Leagues" ? "/v1/leagues" : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: groupsRaw, mutate: mutateGroups, isLoading: groupsLoading, error: groupsError } = useSWR<InterestGroupDto[]>(
    activeTab === "Groups" ? "/v1/groups" : null,
    () => groupService.getAll(),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  const [joiningGroup, setJoiningGroup] = useState<string | null>(null)

  const { data: peopleRaw, mutate: mutatePeople } = useSWR(
    activeTab === "People" ? '/v1/users/browse' : null,
    () => userService.browseUsers({ size: 50 }),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const peopleList = Array.isArray(peopleRaw) ? peopleRaw : (peopleRaw?.content ?? [])
  const communityPeople: CommunityPerson[] = peopleList
    .filter((p: any) => p.id !== currentUser?.id)
    .map((p: any) => ({
      id: p.id,
      name: [p.firstName, p.lastName].filter(Boolean).join(" ") || p.username || "Unknown",
      avatar: (p.firstName?.[0] || "") + (p.lastName?.[0] || "") || (p.username?.[0] || "?").toUpperCase(),
      profilePicture: p.profilePicture || null,
      location: p.location || "",
      bio: p.bio || "",
      sports: p.sportsPreferences?.map((s: any) => s.sportName) || [],
      level: p.level || "Intermediate",
      activities: p.activitiesCount ?? 0,
      followersCount: p.followersCount ?? 0,
      isFollowing: p.isFollowing ?? false,
      sport: p.sportsPreferences?.[0]?.sportName || "Athlete",
    }))

  const leaguesList = Array.isArray(leaguesRaw) ? leaguesRaw : (leaguesRaw as { content?: unknown[] })?.content ?? []

  const handleRefresh = async () => {
    await Promise.all([mutateSquads(), swrMutate("/v1/leagues"), mutatePeople(), mutateGroups()])
  }

  const handleToggleFollow = async (person: CommunityPerson) => {
    if (!currentUser?.id || followingInProgress.has(person.id)) return
    setFollowingInProgress((s) => new Set(s).add(person.id))
    try {
      if (person.isFollowing) {
        await userService.unfollowUser(currentUser.id, person.id)
        toast.success(`Unfollowed ${person.name}`)
      } else {
        await userService.followUser(currentUser.id, person.id)
        toast.success(`Following ${person.name}`)
      }
      await mutatePeople()
    } catch {
      toast.error(person.isFollowing ? "Could not unfollow" : "Could not follow")
    } finally {
      setFollowingInProgress((s) => {
        const next = new Set(s)
        next.delete(person.id)
        return next
      })
    }
  }

  const handleMessage = async (person: CommunityPerson) => {
    if (!currentUser?.id) return
    setMessagingUser(person.id)
    try {
      const conv = await messagesService.createDirectConversation({ targetUserId: person.id })
      onNavigate("conversation", conv?.id ?? person.id)
    } catch {
      toast.error("Could not start conversation")
    } finally {
      setMessagingUser(null)
    }
  }

  const handleToggleGroup = async (group: InterestGroupDto) => {
    if (!currentUser?.id || joiningGroup) return
    setJoiningGroup(group.id)
    try {
      if (group.isMember) {
        await groupService.leave(group.id)
        toast.success(`Left ${group.name}`)
      } else {
        await groupService.join(group.id)
        toast.success(`Joined ${group.name}`)
      }
      await mutateGroups()
    } catch {
      toast.error(group.isMember ? "Could not leave group" : "Could not join group")
    } finally {
      setJoiningGroup(null)
    }
  }

  const tabs = [...COMMUNITY_TABS]

  const filteredPeople = useMemo(() => {
    if (!searchQuery) return communityPeople
    const q = searchQuery.toLowerCase()
    return communityPeople.filter(
      (p: any) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.sports.some((s: string) => s.toLowerCase().includes(q))
    )
  }, [searchQuery, communityPeople])

  const groupsList = Array.isArray(groupsRaw) ? groupsRaw : []
  const filteredGroups = useMemo(() => {
    let list = groupsList
    if (groupFilter === "mine") list = list.filter((g) => g.isMember)
    if (!searchQuery) return list
    const q = searchQuery.toLowerCase()
    return list.filter(
      (g) =>
        (g.name ?? "").toLowerCase().includes(q) ||
        (g.sportName ?? "").toLowerCase().includes(q) ||
        (g.description ?? "").toLowerCase().includes(q)
    )
  }, [groupsList, searchQuery, groupFilter])

  const filteredLeagues = useMemo(() => {
    if (!searchQuery) return leaguesList
    const q = searchQuery.toLowerCase()
    return leaguesList.filter((L: any) => {
      const name = String(L.name ?? "")
      const desc = String(L.description ?? "")
      const status = String(L.status ?? "")
      return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || status.toLowerCase().includes(q)
    })
  }, [leaguesList, searchQuery])

  const showSearch = activeTab === "People" || activeTab === "Groups" || activeTab === "Leagues"

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6 pb-20 lg:pb-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Community</h1>
            <p className="text-sm text-muted-foreground">Squads, leagues, people, and interest groups</p>
          </div>
        </div>

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
              onClick={() => goToTab(tab as CommunityTab)}
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
        {/* ====== SQUADS TAB ====== */}
        {activeTab === "Squads" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-foreground">Your Squads</h2>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate("league-list")}
                  className="text-xs font-semibold text-muted-foreground hover:text-primary"
                >
                  Leagues
                </button>
                <button type="button" onClick={() => onNavigate("create-squad")} className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Plus className="h-3.5 w-3.5" />
                  Create Squad
                </button>
              </div>
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
              squads.map((squad: Record<string, unknown>) => {
                const id = String(squad.id ?? "")
                const name = String(squad.name ?? "Squad")
                const logoUrl =
                  typeof squad.logoUrl === "string" && squad.logoUrl.length > 0 ? squad.logoUrl : null
                const initials = name
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase() || name.slice(0, 2).toUpperCase() || "SQ"
                const memberCount =
                  typeof squad.memberCount === "number"
                    ? squad.memberCount
                    : Array.isArray(squad.memberList)
                      ? squad.memberList.length
                      : 0
                const sportLabel = String(squad.sportName ?? squad.sport ?? "Sport")
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => onNavigate("squad-detail", id)}
                    className="w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      {logoUrl ? (
                        <img
                          src={resolvePostImageUrl(logoUrl)}
                          alt=""
                          className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="gradient-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-foreground">{name}</h3>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {squad.description != null ? String(squad.description) : ""}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {memberCount} members
                          </span>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            {sportLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        )}

        {/* ====== LEAGUES TAB ====== */}
        {activeTab === "Leagues" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="gradient-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-foreground">Competitive leagues</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Leagues are structured competitions with standings and seasons. Casual hangouts live under{" "}
                    <span className="font-medium text-foreground">Groups</span>.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate("league-list")}
                      className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      Browse all leagues
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate("my-leagues")}
                      className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground"
                    >
                      My leagues (organizer)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {leaguesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 animate-pulse">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-full max-w-xs" />
                    </div>
                  </div>
                ))}
              </div>
            ) : leaguesError ? (
              <ErrorState
                title="Couldn't load leagues"
                message="Unable to fetch leagues right now."
                onRetry={() => mutateLeagues()}
              />
            ) : filteredLeagues.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <Trophy className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-semibold text-foreground">
                  {leaguesList.length === 0 ? "No leagues listed yet" : "No leagues match your search"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {leaguesList.length === 0
                    ? "Create one from My leagues if you are an organizer, or check back soon."
                    : "Try another keyword or clear search."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeagues.map((L: any) => (
                  <button
                    type="button"
                    key={L.id}
                    onClick={() => onNavigate("league-detail", L.id)}
                    className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-secondary/40 hover:shadow-md"
                  >
                    {L.logoUrl ? (
                      <img src={resolvePostImageUrl(L.logoUrl)} alt={L.name} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <div className="gradient-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white">
                        <Trophy className="h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground truncate">{L.name ?? "League"}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{L.description || "Season competition"}</p>
                      <p className="mt-1 text-[10px] font-medium text-primary">
                        {L.status ? String(L.status) : ""}
                        {L.format ? ` · ${L.format}` : ""}
                        {L.totalTeams != null ? ` · ${L.totalTeams} teams` : ""}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
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
                {filteredPeople.map((person: CommunityPerson) => {
                  const busy = followingInProgress.has(person.id)
                  const avatarUrl = person.profilePicture ? resolvePostImageUrl(person.profilePicture) : null
                  return (
                    <div
                      key={person.id}
                      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-primary/40"
                    >
                      <div className="relative h-24 bg-gradient-to-br from-[#003C66] to-[#005A99]">
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={person.name}
                              className="h-16 w-16 rounded-full border-4 border-card object-cover shadow-lg"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-secondary to-secondary/70 text-lg font-bold text-white shadow-lg">
                              {person.avatar}
                            </div>
                          )}
                        </div>
                        {person.isFollowing && (
                          <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                            Following
                          </span>
                        )}
                      </div>

                      <div className="px-5 pb-5 pt-10 text-center">
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {person.name}
                        </h3>
                        {person.location && (
                          <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {person.location}
                          </div>
                        )}
                        {person.bio && (
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{person.bio}</p>
                        )}

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

                        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                          <span>{person.activities} activities</span>
                          <span>{person.followersCount} followers</span>
                        </div>

                        <div className="mt-4 flex gap-2">
                          {person.isFollowing ? (
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
                                disabled={messagingUser === person.id}
                                onClick={() => handleMessage(person)}
                                className="flex items-center justify-center rounded-xl border border-border px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                              >
                                {messagingUser === person.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MessageCircle className="h-4 w-4" />
                                )}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleToggleFollow(person)}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-secondary py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                              >
                                {busy ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <UserPlus className="h-3.5 w-3.5" />
                                )}
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
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ====== GROUPS TAB ====== */}
        {activeTab === "Groups" && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Interest groups and casual meetups — not the same as competitive leagues under the Leagues tab.
            </p>
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
                onClick={() => onNavigate("create-group" as PageRoute)}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Group
              </button>
            </div>

            {groupsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
                    <Skeleton className="mb-3 h-28 w-full rounded-xl" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-2 h-3 w-48" />
                  </div>
                ))}
              </div>
            ) : groupsError ? (
              <ErrorState
                title="Couldn't load groups"
                message="Unable to fetch interest groups right now."
                onRetry={() => mutateGroups()}
              />
            ) : filteredGroups.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-semibold text-foreground">No groups found</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {groupFilter === "mine" ? "Join a group to see it here" : "Try adjusting your search or create a new group"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredGroups.map((group) => {
                  const busy = joiningGroup === group.id
                  return (
                    <div
                      key={group.id}
                      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-secondary/40"
                    >
                      <div className="relative h-28 bg-gradient-to-br from-[#003C66] to-[#005A99] p-4">
                        {group.coverImage && (
                          <img src={resolvePostImageUrl(group.coverImage)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        )}
                        <span className="relative rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                          {group.sportName || "General"}
                        </span>
                        {group.isMember && (
                          <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                            Joined
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-start gap-3">
                          {group.logoUrl && (
                            <img src={resolvePostImageUrl(group.logoUrl)} alt={group.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                          )}
                          <h3 className="text-sm font-bold text-foreground group-hover:text-secondary transition-colors">
                            {group.name}
                          </h3>
                        </div>
                        {group.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{group.description}</p>
                        )}

                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span>{group.memberCount ?? 0} members</span>
                        </div>

                        <div className="mt-4">
                          {group.isMember ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleToggleGroup(group)}
                              className="w-full rounded-xl bg-muted py-2 text-xs font-semibold text-foreground transition-opacity hover:opacity-80 disabled:opacity-60"
                            >
                              {busy ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Leave Group"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleToggleGroup(group)}
                              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-secondary py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                            >
                              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                              Join Group
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ====== DISCOVER TAB ====== */}
      </div>
    </PullToRefresh>
  )
}
