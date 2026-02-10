"use client"

import {
  User,
  Shield,
  Bell,
  CreditCard,
  Wallet,
  Globe,
  ChevronRight,
  LogOut,
} from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { userProfile } from "@/lib/mock-data"

interface SettingsPageProps {
  onNavigate: (page: PageRoute) => void
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
        <div className="gradient-primary flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white">
          {userProfile.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-foreground">{userProfile.name}</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Personal
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{userProfile.username}</p>
          <p className="text-xs text-muted-foreground">alex.johnson@email.com</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          View Profile
        </button>
      </div>

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
