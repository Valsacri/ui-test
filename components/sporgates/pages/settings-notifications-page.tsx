"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Bell, Mail, Smartphone, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { userService } from "@/lib/services/user"
import { authService } from "@/lib/services/auth"

interface SettingsNotificationsPageProps {
  onBack: () => void
}

export function SettingsNotificationsPage({ onBack }: SettingsNotificationsPageProps) {
  const [pushSettings, setPushSettings] = useState({
    activityUpdates: true,
    newMessages: true,
    goalProgress: true,
    eventReminders: true,
    newFollowers: false,
    bookingConfirmation: true,
    communityPosts: false,
  })

  const [emailSettings, setEmailSettings] = useState({
    weeklySummary: true,
    productUpdates: false,
    promotions: false,
    securityAlerts: true,
    newsletter: false,
    partnerOffers: false,
  })
  const [saving, setSaving] = useState(false)

  // Load from user profile
  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user?.id) {
      userService.getUserById(user.id).then((data: any) => {
        if (data?.notificationPreferences) {
          const np = data.notificationPreferences
          setPushSettings((prev) => ({
            ...prev,
            activityUpdates: np.activityUpdates ?? prev.activityUpdates,
            newMessages: np.newMessages ?? prev.newMessages,
            newFollowers: np.newFollowers ?? prev.newFollowers,
            bookingConfirmation: np.bookingConfirmation ?? prev.bookingConfirmation,
          }))
        }
      }).catch(() => { })
    }
  }, [])

  const togglePush = (key: keyof typeof pushSettings) => {
    setPushSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleEmail = (key: keyof typeof emailSettings) => {
    setEmailSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    const user = authService.getCurrentUser()
    if (!user?.id) return
    setSaving(true)
    try {
      await userService.updateNotificationPreferences(user.id, {
        activityUpdates: pushSettings.activityUpdates,
        newMessages: pushSettings.newMessages,
        newFollowers: pushSettings.newFollowers,
        bookingConfirmation: pushSettings.bookingConfirmation,
      })
      toast.success('Notification preferences saved')
    } catch {
      toast.error('Failed to save preferences')
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
        <h1 className="text-2xl font-bold text-foreground">Notification Preferences</h1>
        <p className="text-sm text-muted-foreground">Choose how you want to receive updates</p>
      </div>

      {/* Push Notifications */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Smartphone className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-sm font-bold text-foreground">Push Notifications</h2>
            <p className="text-[10px] text-muted-foreground">Notifications on your device</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {[
            { key: "activityUpdates" as const, label: "Activity Updates", description: "Get notified about activity changes" },
            { key: "newMessages" as const, label: "New Messages", description: "Alert when you receive a message" },
            { key: "goalProgress" as const, label: "Goal Progress", description: "Milestone achievements and updates" },
            { key: "eventReminders" as const, label: "Event Reminders", description: "Upcoming event notifications" },
            { key: "newFollowers" as const, label: "New Followers", description: "When someone starts following you" },
            { key: "bookingConfirmation" as const, label: "Booking Confirmations", description: "Booking status updates" },
            { key: "communityPosts" as const, label: "Community Posts", description: "New posts from people you follow" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={pushSettings[item.key]}
                aria-label={item.label}
                onClick={() => togglePush(item.key)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  pushSettings[item.key] ? "bg-primary" : "bg-border"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                    pushSettings[item.key] ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Email Notifications */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Mail className="h-5 w-5 text-secondary" />
          <div>
            <h2 className="text-sm font-bold text-foreground">Email Notifications</h2>
            <p className="text-[10px] text-muted-foreground">Email updates and digests</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {[
            { key: "weeklySummary" as const, label: "Weekly Summary", description: "Weekly activity overview email" },
            { key: "productUpdates" as const, label: "Product Updates", description: "New features and improvements" },
            { key: "promotions" as const, label: "Promotions", description: "Special offers and discounts" },
            { key: "securityAlerts" as const, label: "Security Alerts", description: "Important security notifications" },
            { key: "newsletter" as const, label: "Newsletter", description: "Monthly newsletter with tips" },
            { key: "partnerOffers" as const, label: "Partner Offers", description: "Deals from our partners" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={emailSettings[item.key]}
                aria-label={item.label}
                onClick={() => toggleEmail(item.key)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  emailSettings[item.key] ? "bg-secondary" : "bg-border"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                    emailSettings[item.key] ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Quiet Hours</h2>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Silence non-essential notifications during specific hours.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">From</label>
            <input
              type="time"
              defaultValue="22:00"
              className="mt-1 h-10 w-full rounded-full border border-border bg-muted px-4 text-xs outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">To</label>
            <input
              type="time"
              defaultValue="07:00"
              className="mt-1 h-10 w-full rounded-full border border-border bg-muted px-4 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  )
}
