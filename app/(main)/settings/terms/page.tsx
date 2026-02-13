"use client"

import { SettingsTermsPage } from "@/components/sporgates/pages/settings-terms-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsTermsRoute() {
    const { navigate } = useAppRouter()
    return <SettingsTermsPage onBack={() => navigate("settings")} />
}
