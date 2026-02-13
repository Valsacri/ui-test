"use client"

import { SettingsNotificationsPage } from "@/components/sporgates/pages/settings-notifications-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsNotificationsRoute() {
    const { navigate } = useAppRouter()
    return <SettingsNotificationsPage onBack={() => navigate("settings")} />
}
