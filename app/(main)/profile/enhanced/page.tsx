"use client"

import { ProfileEnhancedPage } from "@/components/sporgates/pages/profile-enhanced-page"
import { useAppRouter } from "@/lib/route-map"

export default function ProfileEnhancedRoute() {
    const { navigate } = useAppRouter()
    return <ProfileEnhancedPage onNavigate={navigate} />
}
