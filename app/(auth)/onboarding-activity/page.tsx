"use client"

import { AuthPages } from "@/components/sporgates/pages/auth-pages"
import { useAppRouter } from "@/lib/route-map"

export default function OnboardingActivityPage() {
  const { navigate } = useAppRouter()
  return <AuthPages page="onboarding-activity" onNavigate={navigate} />
}
