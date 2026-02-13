"use client"

import { SettingsTransactionsPage } from "@/components/sporgates/pages/settings-transactions-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsTransactionsRoute() {
    const { navigate } = useAppRouter()
    return <SettingsTransactionsPage onBack={() => navigate("settings")} />
}
