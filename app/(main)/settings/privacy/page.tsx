"use client"

import { SettingsPrivacyPage } from "@/components/sporgates/pages/settings-privacy-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsPrivacyRoute() {
    const { navigate } = useAppRouter()
    return <SettingsPrivacyPage onBack={() => navigate("settings")} />
}
