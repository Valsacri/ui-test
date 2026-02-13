"use client"

import { SettingsLanguagePage } from "@/components/sporgates/pages/settings-language-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsLanguageRoute() {
    const { navigate } = useAppRouter()
    return <SettingsLanguagePage onBack={() => navigate("settings")} />
}
