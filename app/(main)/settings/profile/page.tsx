"use client"

import { SettingsProfilePage } from "@/components/sporgates/pages/settings-profile-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsProfileRoute() {
    const { navigate } = useAppRouter()
    return <SettingsProfilePage onNavigate={navigate} />
}
