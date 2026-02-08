"use client"

import { ArrowLeft, Mail, Phone, MapPin, Lock, Camera, Pencil } from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { userProfile } from "@/lib/mock-data"

interface ProfileInformationPageProps {
  onNavigate: (page: PageRoute) => void
}

const contactInfo = {
  email: "jordan@example.com",
  phone: "+1 (555) 123-4567",
  address: "New York City",
}

export function ProfileInformationPage({ onNavigate }: ProfileInformationPageProps) {
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
          <div className="gradient-primary flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white">
            {userProfile.avatar}
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-foreground">{userProfile.name}</p>
            <p className="text-sm text-muted-foreground">{userProfile.username}</p>
            <p className="mt-1 text-xs text-muted-foreground">Member since {userProfile.memberSince}</p>
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
            <p className="text-sm font-semibold text-foreground">{contactInfo.email}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted p-3">
            <p className="text-[10px] text-muted-foreground">Phone</p>
            <p className="text-sm font-semibold text-foreground">{contactInfo.phone}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted p-3">
            <p className="text-[10px] text-muted-foreground">Location</p>
            <p className="text-sm font-semibold text-foreground">{contactInfo.address}</p>
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
