"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Phone, Lock, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { PageRoute } from "@/lib/navigation"
import { authService, userService } from "@/lib/services"

interface SettingsProfilePageProps {
  onNavigate: (page: PageRoute) => void
}

export function SettingsProfilePage({ onNavigate }: SettingsProfilePageProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "", username: "", bio: "", email: "", phone: "",
  })
  const [passwords, setPasswords] = useState({
    current: "", newPwd: "", confirm: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user?.id) {
      userService.getUserById(user.id).then((data: any) => {
        if (data) {
          setProfileData({
            name: [data.firstName, data.lastName].filter(Boolean).join(" ") || "",
            username: data.username || "",
            bio: data.bio || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
          })
        }
      }).catch(() => {
        setProfileData((prev) => ({
          ...prev,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "",
          email: user.email || "",
          username: user.username || "",
        }))
      })
    }
  }, [])

  const handleSave = async () => {
    const user = authService.getCurrentUser()
    if (!user?.id) { toast.error("Not authenticated"); return }
    if (passwords.newPwd && passwords.newPwd.length < 8) {
      toast.error("New password must be at least 8 characters"); return
    }
    if (passwords.newPwd && passwords.newPwd !== passwords.confirm) {
      toast.error("Passwords do not match"); return
    }
    setSaving(true)
    try {
      const nameParts = profileData.name.trim().split(/\s+/)
      await userService.updateProfile(user.id, {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        username: profileData.username,
        bio: profileData.bio,
        phone: profileData.phone,
      })
      toast.success("Profile updated successfully")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

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
            value={profileData.name}
            onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
            className="mt-1 h-11 w-full rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Username</label>
          <input
            type="text"
            value={profileData.username}
            onChange={(e) => setProfileData((prev) => ({ ...prev, username: e.target.value }))}
            className="mt-1 h-11 w-full rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Bio</label>
          <textarea
            rows={3}
            value={profileData.bio}
            onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
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
            value={profileData.email}
            disabled
            className="mt-1 h-11 w-full rounded-full border border-border bg-muted px-4 text-sm text-muted-foreground outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
          <div className="mt-1 flex gap-2">
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
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
              value={passwords.current}
              onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
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
              value={passwords.newPwd}
              onChange={(e) => setPasswords((prev) => ({ ...prev, newPwd: e.target.value }))}
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
              value={passwords.confirm}
              onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
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
        onClick={handleSave}
        disabled={saving}
        className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Save Changes"}
      </button>
    </div>
  )
}
