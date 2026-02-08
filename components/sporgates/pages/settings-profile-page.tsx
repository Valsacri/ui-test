"use client"

import type { PageRoute } from "@/lib/navigation"
import { userProfile } from "@/lib/mock-data"

interface SettingsProfilePageProps {
  onNavigate: (page: PageRoute) => void
}

export function SettingsProfilePage({ onNavigate }: SettingsProfilePageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Information</h1>
        <p className="text-sm text-muted-foreground">Update your personal details</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
          <input
            type="text"
            defaultValue={userProfile.name}
            className="mt-1 h-11 w-full rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Username</label>
          <input
            type="text"
            defaultValue={userProfile.username}
            className="mt-1 h-11 w-full rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Bio</label>
          <textarea
            rows={3}
            defaultValue={userProfile.bio}
            className="mt-1 w-full rounded-2xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          type="button"
          onClick={() => onNavigate("settings")}
          className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
