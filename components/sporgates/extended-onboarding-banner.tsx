"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, X } from "lucide-react"
import { authService } from "@/lib/services/auth"
import { cn } from "@/lib/utils"

const SNOOZE_KEY = "sg_extended_onboarding_snooze_until"
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000

const HINT_PATH: Record<string, string> = {
  location: "/onboarding-location",
  roles: "/onboarding-activity",
  availability: "/onboarding-activity",
  notifications: "/onboarding-notifications",
}

function snoozeUntil(): number {
  if (typeof window === "undefined") return 0
  const n = Number(localStorage.getItem(SNOOZE_KEY))
  return Number.isFinite(n) ? n : 0
}

/**
 * Soft prompt for users who completed sports + goals before extended onboarding existed.
 * Shown on main app shell; login/refresh expose extendedOnboardingPending on the auth payload.
 */
export function ExtendedOnboardingBanner({ isBusinessMode }: { isBusinessMode: boolean }) {
  const router = useRouter()
  const [user, setUser] = useState<Record<string, unknown> | null>(() => authService.getCurrentUser())
  const [rev, setRev] = useState(0)

  useEffect(() => {
    let cancelled = false
    authService
      .refreshToken()
      .then(() => {
        if (!cancelled) setUser(authService.getCurrentUser())
      })
      .catch(() => {
        if (!cancelled) setUser(authService.getCurrentUser())
      })
    return () => {
      cancelled = true
    }
  }, [])

  const snoozed = useMemo(() => {
    if (typeof window === "undefined") return false
    return snoozeUntil() > Date.now()
  }, [rev])
  const hint = typeof user?.extendedOnboardingHint === "string" ? user.extendedOnboardingHint : null
  const path = hint && HINT_PATH[hint] ? HINT_PATH[hint] : "/onboarding-location"

  const show =
    !isBusinessMode &&
    user?.extendedOnboardingPending === true &&
    !snoozed

  const dismissForAWeek = () => {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS))
    setRev((r) => r + 1)
  }

  if (!show) return null

  return (
    <div
      className="border-b border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-3"
      role="region"
      aria-label="Profile completion suggestion"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Finish your profile</p>
            <p className="text-xs text-muted-foreground">
              Add your location, how you participate, when you&apos;re available, and notification preferences — we&apos;ll
              tailor recommendations for you.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={dismissForAWeek}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Remind me in 7 days
          </button>
          <button
            type="button"
            onClick={() => router.push(path)}
            className={cn(
              "rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground",
              "transition-opacity hover:opacity-90"
            )}
          >
            Continue
          </button>
          <button
            type="button"
            onClick={dismissForAWeek}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
