"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Phone, Lock } from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { userProfile } from "@/lib/mock-data"

interface SettingsProfilePageProps {
  onNavigate: (page: PageRoute) => void
}

const defaultEmail = "jordan@example.com"
const defaultPhone = "+1 (555) 123-4567"

export function SettingsProfilePage({ onNavigate }: SettingsProfilePageProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Information</h1>
        <p className="text-sm text-muted-foreground">Update your personal details and security</p>
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
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Contact</h2>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Email</label>
          <input
            type="email"
            defaultValue={defaultEmail}
            disabled
            className="mt-1 h-11 w-full rounded-full border border-border bg-muted px-4 text-sm text-muted-foreground outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
          <div className="mt-1 flex gap-2">
            <input
              type="tel"
              defaultValue={defaultPhone}
              className="h-11 flex-1 rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              className="rounded-full border border-border px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Verify
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Password</h2>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Current Password</label>
          <div className="relative mt-1">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter current password"
              className="h-11 w-full rounded-full border border-border bg-muted px-4 pr-10 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">New Password</label>
          <div className="relative mt-1">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="h-11 w-full rounded-full border border-border bg-muted px-4 pr-10 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Confirm Password</label>
          <div className="relative mt-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="h-11 w-full rounded-full border border-border bg-muted px-4 pr-10 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onNavigate("settings")}
        className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white"
      >
        Save Changes
      </button>
    </div>
  )
}
