"use client"

import { useState } from "react"
import { ArrowLeft, Search, UserX, ShieldOff } from "lucide-react"

interface SettingsBlockedPageProps {
  onBack: () => void
}

const initialBlockedUsers = [
  { id: "1", name: "Jordan Rivera", avatar: "JR", reason: "Spam", blockedDate: "Jan 15, 2026" },
  { id: "2", name: "Maya Chen", avatar: "MC", reason: "Harassment", blockedDate: "Dec 20, 2025" },
  { id: "3", name: "Tom Wilson", avatar: "TW", reason: "Inappropriate content", blockedDate: "Nov 10, 2025" },
]

export function SettingsBlockedPage({ onBack }: SettingsBlockedPageProps) {
  const [blockedUsers, setBlockedUsers] = useState(initialBlockedUsers)
  const [query, setQuery] = useState("")

  const filteredUsers = blockedUsers.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  )

  const unblock = (id: string) => {
    setBlockedUsers((prev) => prev.filter((u) => u.id !== id))
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Reason: {user.reason}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>Blocked {user.blockedDate}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => unblock(user.id)}
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
    </div>
  )
}
