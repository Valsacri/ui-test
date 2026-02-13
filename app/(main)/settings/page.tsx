"use client"

import { SettingsPage } from "@/components/sporgates/pages/settings-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsRoute() {
    const { navigate } = useAppRouter()
    return <SettingsPage onNavigate={navigate} />
}
