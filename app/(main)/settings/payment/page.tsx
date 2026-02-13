"use client"

import { SettingsPaymentPage } from "@/components/sporgates/pages/settings-payment-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsPaymentRoute() {
    const { navigate } = useAppRouter()
    return <SettingsPaymentPage onBack={() => navigate("settings")} />
}
