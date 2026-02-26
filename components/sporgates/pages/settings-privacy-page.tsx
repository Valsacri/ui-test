"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Shield, Eye, Lock, UserX, Key } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { userService } from "@/lib/services/user"
import { authService } from "@/lib/services/auth"

interface SettingsPrivacyPageProps {
  onBack: () => void
}

const visibilityOptions = [
  { label: "Public", description: "Anyone can see your profile and activity", value: "public" },
  { label: "Friends Only", description: "Only people you follow can see your activity", value: "friends" },
  { label: "Private", description: "Only you can see your profile details", value: "private" },
]

export function SettingsPrivacyPage({ onBack }: SettingsPrivacyPageProps) {
  const [visibility, setVisibility] = useState("public")
  const [settings, setSettings] = useState({
    showLocation: true,
    showActivity: true,
    showGoals: true,
    showOnlineStatus: false,
    twoFactor: true,
    loginAlerts: true,
    dataSharing: false,
  })
  const [saving, setSaving] = useState(false)

  // Load from user profile
  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user?.id) {
      userService.getUserById(user.id).then((data: any) => {
        if (data?.privacySettings) {
          const ps = data.privacySettings
          const vis = (ps.profileVisibility ?? 'PUBLIC').toLowerCase()
          setVisibility(vis === 'followers_only' ? 'friends' : vis)
          setSettings((prev) => ({
            ...prev,
            showOnlineStatus: ps.showOnlineStatus ?? prev.showOnlineStatus,
            showActivity: ps.showActivityHistory ?? prev.showActivity,
            dataSharing: ps.showEmail ?? prev.dataSharing,
          }))
        }
      }).catch(() => { })
    }
  }, [])

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    const user = authService.getCurrentUser()
    if (!user?.id) return
    setSaving(true)
    try {
      const vis = visibility === 'friends' ? 'FOLLOWERS_ONLY' : visibility.toUpperCase()
      await userService.updatePrivacySettings(user.id, {
        profileVisibility: vis,
        showOnlineStatus: settings.showOnlineStatus,
        showActivityHistory: settings.showActivity,
        allowDirectMessages: true,
      })
      toast.success('Privacy settings saved')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
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
        <h1 className="text-2xl font-bold text-foreground">Privacy & Security</h1>
        <p className="text-sm text-muted-foreground">Control who can see your information</p>
      </div>

      {/* Profile Visibility */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Profile Visibility</h2>
        </div>
        <div className="space-y-2">
          {visibilityOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setVisibility(option.value)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all",
                visibility === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2",
                  visibility === option.value ? "border-primary bg-primary" : "border-border"
                )}
              >
                {visibility === option.value && (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Toggles */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Privacy Controls</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { key: "showLocation" as const, label: "Show Location", description: "Display your city on your profile" },
            { key: "showActivity" as const, label: "Show Activity", description: "Let others see your recent activities" },
            { key: "showGoals" as const, label: "Show Goals", description: "Share your goals progress publicly" },
            { key: "showOnlineStatus" as const, label: "Online Status", description: "Show when you are active" },
            { key: "dataSharing" as const, label: "Data Sharing", description: "Share anonymized data to improve the platform" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings[item.key]}
                aria-label={item.label}
                onClick={() => toggle(item.key)}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  settings[item.key] ? "bg-primary" : "bg-border"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                    settings[item.key] ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Lock className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Account Security</h2>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Change Password</p>
                <p className="text-xs text-muted-foreground">Last updated 3 weeks ago</p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Update
            </button>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Extra security for your account</p>
            </div>
            <button
              type="button"
              onClick={() => toggle("twoFactor")}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                settings.twoFactor ? "bg-primary" : "bg-border"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                  settings.twoFactor ? "translate-x-5" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Login Alerts</p>
              <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
            </div>
            <button
              type="button"
              onClick={() => toggle("loginAlerts")}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                settings.loginAlerts ? "bg-primary" : "bg-border"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                  settings.loginAlerts ? "translate-x-5" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Privacy Settings'}
      </button>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-destructive/20 bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <UserX className="h-5 w-5 text-destructive" />
          <h2 className="text-sm font-bold text-destructive">Danger Zone</h2>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          These actions are permanent and cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => toast.error("Account deactivation is not available yet. Contact support.")}
            className="rounded-xl border border-destructive/20 px-4 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/5"
          >
            Deactivate Account
          </button>
          <button
            type="button"
            onClick={() => toast.error("Account deletion is not available yet. Contact support.")}
            className="rounded-xl border border-destructive/20 px-4 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/5"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
