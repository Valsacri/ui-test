"use client"

import { DocsHelpCenterPage } from "@/components/sporgates/pages/docs-help-center-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsHelpRoute() {
    const { navigate } = useAppRouter()
    return <DocsHelpCenterPage onBack={() => navigate("settings")} />
}
