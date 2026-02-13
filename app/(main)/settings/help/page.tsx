"use client"

import { SettingsHelpPage } from "@/components/sporgates/pages/settings-help-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsHelpRoute() {
    const { navigate } = useAppRouter()
    return <SettingsHelpPage onBack={() => navigate("settings")} />
}
