"use client"

import { ProfileInformationPage } from "@/components/sporgates/pages/profile-information-page"
import { useAppRouter } from "@/lib/route-map"

export default function ProfileInformationRoute() {
    const { navigate } = useAppRouter()
    return <ProfileInformationPage onNavigate={navigate} />
}
