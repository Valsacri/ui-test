"use client"

import { useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Wallet,
  Globe,
  ChevronRight,
  LogOut,
  Building2,
} from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { authService, userService, businessesService } from "@/lib/services"

interface SettingsPageProps {
  onNavigate: (page: PageRoute, id?: string) => void
}

const settingsGroups = [
  {
    title: "Account",
    items: [
      { label: "Profile Information", icon: User, page: "profile-information" as PageRoute, description: "Review and update your account details" },
      { label: "Privacy & Security", icon: Shield, page: "settings-privacy" as PageRoute, description: "Manage your privacy and security settings" },
      { label: "Notifications", icon: Bell, page: "settings-notifications" as PageRoute, description: "Configure your notification preferences" },
    ],
  },
  {
    title: "Payments",
    items: [
      { label: "Payment Methods", icon: CreditCard, page: "settings-payment" as PageRoute, description: "Add or manage payment methods" },
      { label: "Wallet & Transactions", icon: Wallet, page: "settings-wallet" as PageRoute, description: "View your wallet balance and history" },
      { label: "Transaction History", icon: CreditCard, page: "settings-transactions" as PageRoute, description: "View receipts and payment history" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Language & Region", icon: Globe, page: "settings-language" as PageRoute, description: "Set your language and location preferences" },
    ],
  },
  {
    title: "Safety",
    items: [
      { label: "Blocked Users", icon: Shield, page: "settings-blocked" as PageRoute, description: "Manage blocked accounts" },
      { label: "Data Permissions", icon: Shield, page: "settings-data-permissions" as PageRoute, description: "Control how your data is used and shared" },
    ],
  },
  {
    title: "Legal & Support",
    items: [
      { label: "Terms of Service", icon: Shield, page: "settings-terms" as PageRoute, description: "Review platform terms" },
      { label: "Privacy Policy", icon: Shield, page: "settings-privacy-policy" as PageRoute, description: "How we handle your data" },
      { label: "Help & Support", icon: Shield, page: "settings-help" as PageRoute, description: "Find help articles" },
    ],
  },
]

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const user = authService.getCurrentUser()
  const userId = user?.id

  const { data: userData } = useSWR(
    userId ? `/users/${userId}/settings` : null,
    () => userService.getUserById(userId!),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: bizRaw = [] } = useSWR(
    userId ? `/businesses/my` : null,
    () => businessesService.getMyBusinesses(),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const fallbackName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || ""
  const fallbackAvatar = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "U"

  const userProfile = userData ? {
    name: [userData.firstName, userData.lastName].filter(Boolean).join(" ") || user?.email || "",
    username: userData.username ? `@${userData.username}` : "",
    email: userData.email || user?.email || "",
    avatar: [userData.firstName?.[0], userData.lastName?.[0]].filter(Boolean).join("").toUpperCase() || user?.email?.[0]?.toUpperCase() || "U",
    profilePicture: userData.profilePicture || undefined,
  } : {
    name: fallbackName, username: user?.username ? `@${user.username}` : "",
    email: user?.email || "", avatar: fallbackAvatar,
  }

  const bizList = Array.isArray(bizRaw) ? bizRaw : ((bizRaw as any)?.content || [])
  const businesses: { id: string; name: string; bio: string; email: string; avatar?: string }[] = bizList.map((b: any) => ({
    id: b.id, name: b.name, bio: b.bio || "", email: b.email || "", avatar: b.avatar || undefined,
  }))

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Summary */}
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        {userProfile.profilePicture ? (
          <Image
            src={userProfile.profilePicture}
            alt={userProfile.name}
            width={56}
            height={56}
            className="rounded-xl object-cover"
          />
        ) : (
          <div className="gradient-primary flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white">
            {userProfile.avatar}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-foreground">{userProfile.name || "Loading..."}</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Personal
            </span>
          </div>
          {userProfile.username && <p className="text-sm text-muted-foreground">{userProfile.username}</p>}
          {userProfile.email && <p className="text-xs text-muted-foreground">{userProfile.email}</p>}
        </div>
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          View Profile
        </button>
      </div>

      {/* Businesses List */}
      <div className="space-y-4">
        {businesses.map((business) => (
          <div key={business.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            {business.avatar ? (
              <Image
                src={business.avatar.startsWith("/") ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}${business.avatar}` : business.avatar}
                alt={business.name}
                width={56}
                height={56}
                className="rounded-xl object-cover"
              />
            ) : (
              <div className="gradient-secondary flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white">
                <Building2 className="h-6 w-6" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-foreground">{business.name}</p>
                <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                  Business
                </span>
              </div>
              {business.bio && <p className="text-sm text-muted-foreground truncate max-w-[250px]">{business.bio}</p>}
              {business.email && <p className="text-xs text-muted-foreground">{business.email}</p>}
            </div>
            <button
              type="button"
              onClick={() => {
                // Navigate to public profile with ID
                onNavigate("business-detail", business.id)
              }}
              className="rounded-full bg-secondary/10 px-4 py-2 text-xs font-semibold text-secondary transition-colors hover:bg-secondary/20"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      {/* Start a Business CTA */}
      <button
        type="button"
        onClick={() => onNavigate("create-business")}
        className="flex w-full items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 p-5 shadow-sm transition-all hover:shadow-md"
      >
        <div className="gradient-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md">
          <Building2 className="h-6 w-6" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold text-foreground">Start a Business</p>
          <p className="text-xs text-muted-foreground">
            Create activities, manage teams, and grow your sports business
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-primary" />
      </button>

      {/* Settings Groups */}
      {settingsGroups.map((group) => (
        <div key={group.title} className="space-y-2">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.title}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {group.items.map((item, index) => (
              <button
                type="button"
                key={item.label}
                onClick={() => onNavigate(item.page)}
                className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted ${index < group.items.length - 1 ? "border-b border-border" : ""
                  }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Sign Out */}
      <button
        type="button"
        onClick={() => onNavigate("signin")}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-card py-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  )
}
