"use client"

import { useMemo, useState, useCallback } from "react"
import useSWR from "swr"
import Image from "next/image"
import { ArrowLeft, Users, Trophy, Calendar, ChevronRight, Loader2, UserPlus, Search, X } from "lucide-react"
import { toast } from "sonner"
import { squadService, activitiesService } from "@/lib/services"
import { userService } from "@/lib/services/user"
import { authService } from "@/lib/services/auth"
import { getApiErrorMessage } from "@/lib/api-errors"
import type { PageRoute } from "@/lib/navigation"
import { ProfileSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { resolvePostImageUrl, cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

interface SquadDetailPageProps {
  squadId: string
  onNavigate: (page: PageRoute, id?: string) => void
}

export function SquadDetailPage({ squadId, onNavigate }: SquadDetailPageProps) {
  const [activeTab, setActiveTab] = useState("Overview")
  const [leaveBusy, setLeaveBusy] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteSearch, setInviteSearch] = useState("")
  const [invitingUser, setInvitingUser] = useState<string | null>(null)
  const [sentInvites, setSentInvites] = useState<Set<string>>(new Set())
  const [joinRequestBusy, setJoinRequestBusy] = useState(false)
  const [kickConfirmOpen, setKickConfirmOpen] = useState(false)
  const [kickTarget, setKickTarget] = useState<{ userId: string; userName: string } | null>(null)
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false)
  const tabs = ["Overview", "Members", "Events", "Timeline"]

  const currentUser = authService.getCurrentUser()

  const { data: squad, error: squadError, isLoading: squadLoading, mutate: mutateSquad } = useSWR(
    squadId ? `/squads/${squadId}` : null,
    () => squadService.getById(squadId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: mySquads = [], mutate: mutateMySquads } = useSWR(
    currentUser?.id ? `/v1/squads/user/${currentUser.id}/detail` : null,
    () => squadService.getByUser(currentUser!.id),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: actRaw = [], isLoading: actLoading } = useSWR(
    squadId ? `/activities/squad-detail/${squadId}` : null,
    () => activitiesService.getAll({ hostSquadId: squadId }),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: usersRaw } = useSWR(
    inviteOpen ? "/v1/users/browse-for-invite" : null,
    () => userService.browseUsers({ size: 100 }),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )
  const allUsers = Array.isArray(usersRaw) ? usersRaw : (usersRaw as { content?: unknown[] })?.content ?? []

  const { data: joinRequestPending, mutate: mutateJoinRequestPending } = useSWR<boolean>(
    currentUser?.id && squadId ? `/v1/squads/${squadId}/join-request/status` : null,
    () => squadService.getJoinRequestStatus(squadId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const handleInviteMember = useCallback(async (userId: string, userName: string) => {
    setInvitingUser(userId)
    try {
      await squadService.addMember(squadId, { userId, userName, role: "Member" })
      toast.success(`Invitation sent to ${userName}`)
      setSentInvites((prev) => new Set(prev).add(userId))
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Could not add member"))
    } finally {
      setInvitingUser(null)
    }
  }, [squadId])

  const handleUnsendInvite = useCallback(async (userId: string, userName: string) => {
    setInvitingUser(userId)
    try {
      await squadService.unsendInvite(squadId, userId)
      toast.success(`Invitation unsent for ${userName}`)
      setSentInvites((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Could not unsend invite"))
    } finally {
      setInvitingUser(null)
    }
  }, [squadId])

  const handleKickMember = useCallback(async (userId: string, userName: string) => {
    setInvitingUser(userId)
    try {
      await squadService.removeMember(squadId, userId)
      toast.success(`${userName} removed from squad`)
      await Promise.all([mutateSquad(), mutateMySquads()])
      setSentInvites((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Could not remove member"))
    } finally {
      setInvitingUser(null)
    }
  }, [squadId, mutateSquad, mutateMySquads])

  const openKickConfirm = useCallback((userId: string, userName: string) => {
    setKickTarget({ userId, userName })
    setKickConfirmOpen(true)
  }, [])

  const handleLeaveSquad = useCallback(async () => {
    if (!currentUser) return
    setLeaveBusy(true)
    try {
      await squadService.removeMember(squadId, currentUser.id)
      toast.success("You left the squad")
      await Promise.all([mutateSquad(), mutateMySquads()])
      setLeaveConfirmOpen(false)
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Could not leave squad"))
    } finally {
      setLeaveBusy(false)
    }
  }, [currentUser, mutateMySquads, mutateSquad, squadId])

  const activities = useMemo(() => {
    if (!Array.isArray(actRaw)) return []
    return actRaw.slice(0, 24).map((a: Record<string, unknown>) => {
      const raw = a.startDateTime as string | number[] | undefined
      const parseDate = (d: string | number[] | undefined) => {
        if (d == null) return new Date()
        if (Array.isArray(d)) {
          return new Date(d[0] as number, (d[1] as number) - 1, d[2] as number, (d[3] as number) || 0, (d[4] as number) || 0)
        }
        return new Date(d as string)
      }
      const start = parseDate(raw)
      return {
        id: a.id as string,
        title: (a.name as string) || "Activity",
        name: a.name as string,
        image: (a.coverImage as string) || "/placeholder.svg",
        date: start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        time: start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      }
    })
  }, [actRaw])

  const memberListRaw = squad?.memberList || squad?.members_list || (Array.isArray(squad?.members) ? squad.members : [])
  const memberList = Array.isArray(memberListRaw) ? memberListRaw : []
  const wins = squad?.wins ?? squad?.totalWins ?? 0
  const losses = squad?.losses ?? squad?.totalLosses ?? 0
  const memberTotal = squad?.members ?? squad?.memberCount ?? memberList.length
  /** Backend should send real names; we only add captain here if the list is empty but captain is known. */
  const displayMembers = useMemo(() => {
    const normalized = memberList.map((member: any) => ({
      userId: member.userId || member.id || member.user_id || undefined,
      userName: member.userName || member.name || "Member",
      role: member.role || "Member",
      profilePicture: member.profilePicture || member.profile_picture || null,
    }))
    const hasCaptain = normalized.some((m: any) => m.role === "Captain")
    if (normalized.length === 0 && !hasCaptain && (squad?.captainName || squad?.captainId)) {
      normalized.unshift({
        userId: squad?.captainId || undefined,
        userName: squad?.captainName || "Captain",
        role: "Captain",
        profilePicture: null,
      })
    }
    return normalized
  }, [memberList, squad?.captainId, squad?.captainName])

  const renderMemberAvatar = (member: { userName?: string; name?: string; profilePicture?: string | null }) => {
    const memberName = member.userName || member.name || "Member"
    const avatarUrl = member.profilePicture ? resolvePostImageUrl(member.profilePicture) : null
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={memberName}
          className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
        />
      )
    }
    return (
      <div className="gradient-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
        {(memberName || "?").slice(0, 2).toUpperCase()}
      </div>
    )
  }

  const isLoading = squadLoading

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (squadError) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button
          type="button"
          onClick={() => onNavigate("community")}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </button>
        <ErrorState
          title="Couldn't load squad"
          message={squadError?.message || "Something went wrong. Please try again."}
          onRetry={() => mutateSquad()}
        />
      </div>
    )
  }

  if (!squad) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button
          type="button"
          onClick={() => onNavigate("community")}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </button>
        <ErrorState
          title="Squad not found"
          message="The squad you're looking for doesn't exist or is no longer available."
          onRetry={() => onNavigate("community")}
        />
      </div>
    )
  }

  const currentUserId =
    currentUser?.id ?? (currentUser as { userId?: string } | null)?.userId ?? null
  const isCaptain = !!(
    currentUserId &&
    squad.captainId &&
    String(currentUserId).trim() === String(squad.captainId).trim()
  )
  const isMember = (Array.isArray(mySquads) ? mySquads : []).some((s: { id: string }) => s.id === squadId)

  const btnDesktop =
    "hidden rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white md:inline-flex md:items-center md:justify-center"
  const btnMobile = "w-full rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white md:hidden"

  const renderMembershipCta = (variant: "desktop" | "mobile") => {
    const className = variant === "desktop" ? btnDesktop : btnMobile
    if (!currentUser) {
      return (
        <button
          type="button"
          onClick={() => toast.message("Sign in to see membership options")}
          className={className}
        >
          Join Squad
        </button>
      )
    }
    if (isCaptain) {
      return (
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className={cn(className, "gap-1.5")}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Invite Member
        </button>
      )
    }
    if (isMember) {
      return (
        <button
          type="button"
          disabled={leaveBusy}
          onClick={() => setLeaveConfirmOpen(true)}
          className={className}
        >
          {leaveBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Leave squad"}
        </button>
      )
    }
    return (
      <button
        type="button"
        disabled={joinRequestBusy}
        onClick={async () => {
          setJoinRequestBusy(true)
          try {
            if (joinRequestPending) {
              await squadService.cancelJoinRequest(squadId)
              toast.success("Join request cancelled")
            } else {
              await squadService.requestJoin(squadId)
              toast.success("Join request sent to captain")
            }
            await mutateJoinRequestPending()
          } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, joinRequestPending ? "Could not cancel join request" : "Could not send join request"))
          } finally {
            setJoinRequestBusy(false)
          }
        }}
        className={className}
      >
        {joinRequestBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : joinRequestPending ? "Cancel request" : "Request to Join"}
      </button>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("community")}
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Community
      </button>

      {/* Squad Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {squad.coverImage ? (
          <img src={resolvePostImageUrl(squad.coverImage)} alt="Cover" className="h-28 w-full object-cover" />
        ) : (
          <div className="gradient-primary h-28" />
        )}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4">
            {squad.logoUrl ? (
              <img src={resolvePostImageUrl(squad.logoUrl)} alt={squad.name} className="-mt-10 h-20 w-20 rounded-2xl border-4 border-card object-cover shadow-lg" />
            ) : (
              <div className="gradient-primary -mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-lg">
                {squad.name ? squad.name.slice(0, 2).toUpperCase() : "SQ"}
              </div>
            )}
            <div className="flex-1 pb-1">
              <h1 className="text-xl font-bold text-foreground">{squad.name}</h1>
              <p className="text-sm text-muted-foreground">{squad.description}</p>
            </div>
            {renderMembershipCta("desktop")}
          </div>
          <div className="mt-3 md:hidden">{renderMembershipCta("mobile")}</div>
          <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {memberTotal} Members
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" />
              {wins}W - {losses}L
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {squad.upcomingEvents || 0} Upcoming Events
            </span>
            {squad.sport && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                {squad.sport}
              </span>
            )}
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

      {activeTab === "Overview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{memberTotal}</p>
              <p className="text-[11px] text-muted-foreground">Members</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">{wins}</p>
              <p className="text-[11px] text-muted-foreground">Wins</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{squad.upcomingEvents || 0}</p>
              <p className="text-[11px] text-muted-foreground">Events</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">
                {wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0}%
              </p>
              <p className="text-[11px] text-muted-foreground">Win Rate</p>
            </div>
          </div>

          {squad.recentActivity && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-foreground">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">{squad.recentActivity}</p>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Captain</h3>
            <div className="flex items-center gap-3">
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">
                {squad.captainAvatar || squad.captain?.slice(0, 2)?.toUpperCase() || "CP"}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{squad.captainName || squad.captain || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">Squad Captain</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Members" && (
        <div className="space-y-3 animate-fade-in">
          {displayMembers.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No members listed</p>
          ) : (
            <>
              {displayMembers.map((member: any) => {
                const memberName = member.userName || member.name || "Member"
                const memberRole = member.role || "Member"
                const memberKey = member.userId || member.id || memberName
                const uid = (member.userId || member.id || member.user_id) as string | undefined
                const canOpenProfile =
                  !!currentUser &&
                  uid &&
                  typeof uid === "string" &&
                  !uid.startsWith("placeholder")
                const isTargetCaptain =
                  (uid && squad.captainId && String(uid) === String(squad.captainId).trim()) ||
                  memberRole === "Captain"
                const canKickMember =
                  isCaptain &&
                  uid &&
                  typeof uid === "string" &&
                  !uid.startsWith("placeholder") &&
                  !isTargetCaptain &&
                  currentUserId != null &&
                  String(uid) !== String(currentUserId)
                const rowClass = cn(
                  "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:gap-4"
                )
                return (
                  <div key={memberKey} className={rowClass}>
                    {renderMemberAvatar(member)}
                    <div className="min-w-0 flex-1 basis-[40%] sm:basis-auto">
                      <p className="text-sm font-semibold text-foreground">{memberName}</p>
                      <p className="text-xs text-muted-foreground">{memberRole}</p>
                    </div>
                    <span className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                      memberRole === "Captain" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                    )}>
                      {memberRole}
                    </span>
                    <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2">
                      {canOpenProfile ? (
                        <button
                          type="button"
                          onClick={() => onNavigate("person-detail", uid)}
                          className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                        >
                          View profile
                        </button>
                      ) : null}
                      {canKickMember ? (
                        <button
                          type="button"
                          disabled={invitingUser === uid}
                          onClick={() => {
                            openKickConfirm(uid, memberName)
                          }}
                          className="rounded-full border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-[11px] font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-60"
                        >
                          {invitingUser === uid ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Kick"
                          )}
                        </button>
                      ) : null}
                    </div>
                  </div>
                )
              })}
              {typeof memberTotal === "number" && memberTotal > displayMembers.length ? (
                <p className="text-center text-xs text-muted-foreground">
                  Showing {displayMembers.length} of {memberTotal} members — roster data may be out of sync. Refresh the page after the backend restarts.
                </p>
              ) : null}
            </>
          )}
        </div>
      )}

      {activeTab === "Events" && (
        <div className="space-y-3 animate-fade-in">
          {actLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : activities.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No squad-hosted activities yet</p>
          ) : (
            activities.map((activity: any) => (
              <button
                type="button"
                key={activity.id}
                onClick={() => onNavigate("activity-detail", activity.id)}
                className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm text-left transition-all hover:shadow-md"
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
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{activity.date || "TBD"}</span>
                    {activity.time && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                        <span>{activity.time}</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))
          )}
        </div>
      )}

      {activeTab === "Timeline" && (
        <div className="space-y-4 animate-fade-in">
          {[
            { date: "Feb 8, 2026", event: "Won against Brooklyn Ballers 78-65", type: "win" },
            { date: "Feb 5, 2026", event: "New member Carlos Rivera joined", type: "member" },
            { date: "Feb 1, 2026", event: "Lost to Manhattan Hoops 52-58", type: "loss" },
            { date: "Jan 28, 2026", event: "Squad created", type: "milestone" },
          ].map((item) => (
            <div key={item.date + item.event} className="flex items-start gap-3">
              <div className={cn(
                "mt-1 h-3 w-3 shrink-0 rounded-full",
                item.type === "win" && "bg-green-500",
                item.type === "loss" && "bg-red-400",
                item.type === "member" && "bg-primary",
                item.type === "milestone" && "bg-secondary"
              )} />
              <div>
                <p className="text-sm font-medium text-foreground">{item.event}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Member Modal (captain only) */}
      <AlertDialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Invite a member</AlertDialogTitle>
            <AlertDialogDescription>Search for users to add to your squad.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={inviteSearch}
              onChange={(e) => setInviteSearch(e.target.value)}
              placeholder="Search by name..."
              className="h-10 w-full rounded-xl border border-border bg-muted pl-9 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {allUsers
              .filter((u: any) => {
                const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username || ""
                if (!inviteSearch) return true
                return name.toLowerCase().includes(inviteSearch.toLowerCase())
              })
              .slice(0, 10)
              .map((u: any) => {
                const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username || "User"
                const initials = ((u.firstName?.[0] || "") + (u.lastName?.[0] || "")) || (u.username?.[0] || "?")
                const avatar = u.profilePicture ? resolvePostImageUrl(u.profilePicture) : null
                const busy = invitingUser === u.id
                const sent = sentInvites.has(u.id)
                const existingMember = memberList.find((m: any) => (m.userId || m.id) === u.id)
                const isCaptainUser = squad.captainId === u.id
                return (
                  <div key={u.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted">
                    {avatar ? (
                      <img src={avatar} alt={name} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
                        {initials.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{name}</p>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        if (isCaptainUser) return
                        if (existingMember) {
                          void handleKickMember(u.id, name)
                          return
                        }
                        if (sent) {
                          void handleUnsendInvite(u.id, name)
                          return
                        }
                        void handleInviteMember(u.id, name)
                      }}
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-60",
                        isCaptainUser || existingMember || sent
                          ? "border border-border bg-card text-foreground hover:bg-muted"
                          : "bg-primary text-white"
                      )}
                    >
                      {busy ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : isCaptainUser ? (
                        "Captain"
                      ) : existingMember ? (
                        "Kick"
                      ) : sent ? (
                        "Unsend"
                      ) : (
                        "Add"
                      )}
                    </button>
                  </div>
                )
              })}
            {allUsers.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">Loading users...</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Kick confirm modal */}
      <AlertDialog
        open={kickConfirmOpen}
        onOpenChange={(open) => {
          setKickConfirmOpen(open)
          if (!open) setKickTarget(null)
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              {kickTarget
                ? `Remove ${kickTarget.userName} from this squad? They will lose access immediately.`
                : "Remove this member from the squad? They will lose access immediately."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!kickTarget && invitingUser === kickTarget.userId}>Cancel</AlertDialogCancel>
            <button
              type="button"
              disabled={!kickTarget || invitingUser === kickTarget.userId}
              onClick={async () => {
                if (!kickTarget) return
                await handleKickMember(kickTarget.userId, kickTarget.userName)
                setKickConfirmOpen(false)
                setKickTarget(null)
              }}
              className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {kickTarget && invitingUser === kickTarget.userId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Kick"
              )}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave squad confirm modal */}
      <AlertDialog open={leaveConfirmOpen} onOpenChange={setLeaveConfirmOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave squad?</AlertDialogTitle>
            <AlertDialogDescription>
              You’ll be removed from this squad and may need a new invite to rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={leaveBusy}>Cancel</AlertDialogCancel>
            <button
              type="button"
              disabled={leaveBusy}
              onClick={async () => {
                await handleLeaveSquad()
              }}
              className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {leaveBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Leave"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
