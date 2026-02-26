"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Shield, Info } from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { userService } from "@/lib/services/user"
import { authService } from "@/lib/services/auth"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/sporgates/ux/confirm-dialog"

interface SettingsDataPermissionsPageProps {
  onBack: () => void
}

const permissions = [
  { id: "location", label: "Location Data", description: "Allow Sporgates to access your location for nearby activities", enabled: true },
  { id: "contacts", label: "Contacts", description: "Sync contacts to find friends on the platform", enabled: false },
  { id: "activity-history", label: "Activity History", description: "Share your activity history with coaches and trainers", enabled: true },
  { id: "health-data", label: "Health & Fitness Data", description: "Connect health apps to track performance metrics", enabled: false },
  { id: "analytics", label: "Usage Analytics", description: "Help improve Sporgates by sharing anonymous usage data", enabled: true },
  { id: "personalization", label: "Personalized Recommendations", description: "Use your data to personalize activity and content recommendations", enabled: true },
  { id: "third-party", label: "Third-Party Sharing", description: "Allow sharing data with verified partner businesses", enabled: false },
  { id: "marketing", label: "Marketing Communications", description: "Receive marketing emails and promotional content", enabled: false },
]

// Mapping from UI permission IDs to BE DataPermissions fields
const permissionToField: Record<string, string> = {
  location: 'allowLocationTracking',
  contacts: 'allowDataCollection',
  'activity-history': 'allowActivityAnalytics',
  'health-data': 'allowDataCollection',
  analytics: 'allowActivityAnalytics',
  personalization: 'allowPersonalizedAds',
  'third-party': 'allowThirdPartySharing',
  marketing: 'allowPersonalizedAds',
}

export function SettingsDataPermissionsPage({ onBack }: SettingsDataPermissionsPageProps) {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(permissions.map((p) => [p.id, p.enabled]))
  )
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Load user's current data permissions
  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user?.id) {
      userService.getUserById(user.id).then((data: any) => {
        if (data?.dataPermissions) {
          const dp = data.dataPermissions
          setToggles((prev) => ({
            ...prev,
            location: dp.allowLocationTracking ?? prev.location,
            analytics: dp.allowActivityAnalytics ?? prev.analytics,
            'third-party': dp.allowThirdPartySharing ?? prev['third-party'],
            personalization: dp.allowPersonalizedAds ?? prev.personalization,
            contacts: dp.allowDataCollection ?? prev.contacts,
          }))
        }
      }).catch(() => { })
    }
  }, [])

  const handleToggle = async (id: string) => {
    const newValue = !toggles[id]
    setToggles((prev) => ({ ...prev, [id]: newValue }))

    // Save to API
    const field = permissionToField[id]
    if (field) {
      const user = authService.getCurrentUser()
      if (user?.id) {
        setSaving(true)
        try {
          await userService.updateDataPermissions(user.id, { [field]: newValue })
          toast.success("Permission updated")
        } catch {
          // revert on failure
          setToggles((prev) => ({ ...prev, [id]: !newValue }))
          toast.error("Failed to update permission")
        } finally {
          setSaving(false)
        }
      }
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Permissions</h1>
          <p className="text-sm text-muted-foreground">Control how your data is used and shared</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Your data is protected</p>
            <p className="text-xs text-muted-foreground">
              We use industry-standard encryption and never sell your personal data. You control exactly what is shared.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {permissions.map((permission, index) => (
          <div
            key={permission.id}
            className={`flex items-center gap-4 px-5 py-4 ${index < permissions.length - 1 ? "border-b border-border" : ""
              }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-foreground">{permission.label}</p>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{permission.description}</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(permission.id)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${toggles[permission.id] ? "bg-primary" : "bg-muted"
                }`}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${toggles[permission.id] ? "translate-x-5" : "translate-x-0.5"
                  }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-2 text-sm font-bold text-foreground">Download Your Data</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Request a copy of all data Sporgates has collected about you.
        </p>
        <button
          type="button"
          className="rounded-xl border border-primary px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Request Data Export
        </button>
      </div>

      <div className="rounded-2xl border border-destructive/20 bg-card p-5 shadow-sm">
        <h3 className="mb-2 text-sm font-bold text-destructive">Delete My Data</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Permanently delete all your data from Sporgates. This action cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="rounded-xl border border-destructive px-4 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive hover:text-white"
        >
          Delete All Data
        </button>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete All Data?"
        description="This will permanently delete all your data from Sporgates. This action cannot be undone."
        confirmLabel="Delete Everything"
        variant="danger"
        onConfirm={() => {
          toast.info("Data deletion request submitted. You will be notified via email.")
        }}
      />
    </div>
  )
}
