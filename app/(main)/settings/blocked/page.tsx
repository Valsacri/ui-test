"use client"

import { SettingsBlockedPage } from "@/components/sporgates/pages/settings-blocked-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsBlockedRoute() {
    const { navigate } = useAppRouter()
    return <SettingsBlockedPage onBack={() => navigate("settings")} />
}
