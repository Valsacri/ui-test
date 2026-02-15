"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Mail, Phone, MapPin, Lock, Camera, Pencil } from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { authService, userService } from "@/lib/services"

interface ProfileInformationPageProps {
  onNavigate: (page: PageRoute) => void
}

export function ProfileInformationPage({ onNavigate }: ProfileInformationPageProps) {
  const [profile, setProfile] = useState({
    name: "", username: "", avatar: "", email: "", phone: "", location: "",
    memberSince: "", profilePicture: "",
  })

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user?.id) {
      userService.getUserById(user.id).then((data: any) => {
        if (data) {
          const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ")
          const initials = [data.firstName?.[0], data.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "U"
          setProfile({
            name: fullName || user.email || "",
            username: data.username ? `@${data.username}` : "",
            avatar: initials,
            email: data.email || user.email || "",
            phone: data.phone || "",
            location: data.location || "",
            memberSince: data.createdAt ? new Date(data.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
            profilePicture: data.profilePicture || "",
          })
        }
      }).catch(() => {
        setProfile({
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "",
          username: user.username ? `@${user.username}` : "",
          avatar: [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "U",
          email: user.email || "",
          phone: "", location: "", memberSince: "", profilePicture: "",
        })
      })
    }
  }, [])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("settings")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Information</h1>
        <p className="text-sm text-muted-foreground">Review your personal and account details</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt={profile.name}
              className="h-16 w-16 rounded-2xl object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="gradient-primary flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white">
              {profile.avatar}
            </div>
          )}
          <div className="flex-1">
            <p className="text-base font-bold text-foreground">{profile.name || "Loading..."}</p>
            {profile.username && <p className="text-sm text-muted-foreground">{profile.username}</p>}
            {profile.memberSince && <p className="mt-1 text-xs text-muted-foreground">Member since {profile.memberSince}</p>}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Camera className="h-3.5 w-3.5" />
              Update Photo
            </button>
            <button
              type="button"
              onClick={() => onNavigate("settings-profile")}
              className="flex items-center gap-2 rounded-full border border-primary px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Mail className="h-4 w-4 text-primary" />
          Contact Details
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-muted p-3">
            <p className="text-[10px] text-muted-foreground">Email</p>
            <p className="text-sm font-semibold text-foreground">{profile.email || "—"}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted p-3">
            <p className="text-[10px] text-muted-foreground">Phone</p>
            <p className="text-sm font-semibold text-foreground">{profile.phone || "Not set"}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted p-3">
            <p className="text-[10px] text-muted-foreground">Location</p>
            <p className="text-sm font-semibold text-foreground">{profile.location || "Not set"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          This information is visible to your connections.
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lock className="h-4 w-4 text-primary" />
          Security
        </div>
        <div className="rounded-xl border border-border bg-muted p-3">
          <p className="text-[10px] text-muted-foreground">Password</p>
          <p className="text-sm font-semibold text-foreground">••••••••••</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("settings-profile")}
          className="w-full rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Change Password
        </button>
      </div>
    </div>
  )
}
