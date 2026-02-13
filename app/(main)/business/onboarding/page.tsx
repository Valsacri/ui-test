"use client"

import { BusinessOnboardingPage } from "@/components/sporgates/pages/business-onboarding-page"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessOnboardingRoute() {
    const { navigate } = useAppRouter()
    return <BusinessOnboardingPage onNavigate={navigate} />
}
