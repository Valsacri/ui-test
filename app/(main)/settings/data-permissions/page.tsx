"use client"

import { SettingsDataPermissionsPage } from "@/components/sporgates/pages/settings-data-permissions-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsDataPermissionsRoute() {
    const { navigate } = useAppRouter()
    return <SettingsDataPermissionsPage onBack={() => navigate("settings")} />
}
