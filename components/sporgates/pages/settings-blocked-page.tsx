"use client"

import { useState } from "react"
import useSWR from "swr"
import { ArrowLeft, Search, UserX, ShieldOff } from "lucide-react"
import { toast } from "sonner"
import { authService, userService } from "@/lib/services"
import { ConfirmDialog } from "@/components/sporgates/ux/confirm-dialog"
import { ErrorState } from "@/components/sporgates/ux/error-state"

interface SettingsBlockedPageProps {
  onBack: () => void
}

export function SettingsBlockedPage({ onBack }: SettingsBlockedPageProps) {
  const [query, setQuery] = useState("")
  const [unblockTarget, setUnblockTarget] = useState<string | null>(null)

  const user = authService.getCurrentUser()
  const userId = user?.id

  const { data: rawList = [], error, isLoading, mutate } = useSWR(
    userId ? `/users/${userId}/blocked` : null,
    () => userService.getBlockedUsers(userId!, { size: 100 }),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const blockedUsers = rawList.map((u: any) => ({
    id: u.id,
    name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "Unknown",
    avatar: (u.firstName?.[0] || "") + (u.lastName?.[0] || "") || (u.username?.[0] || "?").toUpperCase(),
    blockedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
  }))

  const filteredUsers = blockedUsers.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  )

  const unblock = async (id: string) => {
    if (!userId) return
    const target = blockedUsers.find((u) => u.id === id)
    try {
      await userService.unblockUser(userId, id)
      toast.success(`${target?.name || "User"} has been unblocked`)
      mutate()
    } catch {
      toast.error("Failed to unblock user")
    }
    setUnblockTarget(null)
  }

  if (!userId) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Settings
        </button>
        <p className="text-sm text-muted-foreground">Sign in to manage blocked users.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Settings
        </button>
        <ErrorState message="Failed to load blocked users" onRetry={() => mutate()} />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Settings
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blocked Users</h1>
          <p className="text-sm text-muted-foreground">Manage accounts you have blocked</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-border bg-card" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Blocked Users</h1>
        <p className="text-sm text-muted-foreground">Manage accounts you have blocked</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blocked users..."
          className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShieldOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No blocked users</h3>
          <p className="text-sm text-muted-foreground">
            {query ? "No results matching your search" : "You haven't blocked anyone yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="gradient-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                {user.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                {user.blockedDate && (
                  <p className="text-xs text-muted-foreground">Blocked {user.blockedDate}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setUnblockTarget(user.id)}
                className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <UserX className="h-3.5 w-3.5" />
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl bg-muted p-4">
        <p className="text-xs text-muted-foreground">
          Blocked users cannot see your profile, send you messages, or invite you to activities.
          They will not be notified that you blocked them.
        </p>
      </div>

      <ConfirmDialog
        open={!!unblockTarget}
        onOpenChange={(open) => { if (!open) setUnblockTarget(null) }}
        title="Unblock User?"
        description={`This user will be able to see your profile, send you messages, and invite you to activities again.`}
        confirmLabel="Unblock"
        variant="warning"
        onConfirm={() => { if (unblockTarget) unblock(unblockTarget) }}
      />
    </div>
  )
}
