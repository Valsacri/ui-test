"use client"

import { SettingsWalletPage } from "@/components/sporgates/pages/settings-wallet-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsWalletRoute() {
    const { navigate } = useAppRouter()
    return <SettingsWalletPage onBack={() => navigate("settings")} />
}
