"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/lib/services"
import { APP_HOME_PATH } from "@/lib/constants"

/** Matches backend AuthController onboarding query values. */
const ONBOARDING_PATH: Record<string, string> = {
  "1": "/choose-sports",
  goals: "/set-goals",
  location: "/onboarding-location",
  roles: "/onboarding-activity",
  availability: "/onboarding-activity",
  notifications: "/onboarding-notifications",
}

function GoogleOAuthCompleteInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const onboardingParam = searchParams.get("onboarding")

  useEffect(() => {
    let cancelled = false
    authService
      .refreshToken()
      .then(() => {
        if (cancelled) return
        if (onboardingParam && ONBOARDING_PATH[onboardingParam]) {
          router.replace(ONBOARDING_PATH[onboardingParam])
          return
        }
        router.replace(APP_HOME_PATH)
      })
      .catch(() => {
        if (!cancelled) router.replace("/signin?error=google&message=session_refresh_failed")
      })
    return () => {
      cancelled = true
    }
  }, [router, onboardingParam])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Finishing sign-in…</p>
    </div>
  )
}

/**
 * After Google redirects to the API callback, the browser lands here with HttpOnly JWT cookies set.
 * We refresh the session to mirror email/password login (localStorage user + auth_logged_in cookie).
 * New Google accounts get ?onboarding=1 and go to the same sports onboarding as email sign-up after verify.
 */
export default function GoogleOAuthCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Finishing sign-in…</p>
        </div>
      }
    >
      <GoogleOAuthCompleteInner />
    </Suspense>
  )
}
