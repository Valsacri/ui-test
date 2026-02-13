"use client"

import { ProfilePage } from "@/components/sporgates/pages/profile-page"
import { useAppRouter } from "@/lib/route-map"

export default function ProfileRoute() {
    const { navigate } = useAppRouter()
    return <ProfilePage onNavigate={navigate} />
}
