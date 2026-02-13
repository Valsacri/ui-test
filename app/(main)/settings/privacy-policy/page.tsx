"use client"

import { SettingsPrivacyPolicyPage } from "@/components/sporgates/pages/settings-privacy-policy-page"
import { useAppRouter } from "@/lib/route-map"

export default function SettingsPrivacyPolicyRoute() {
    const { navigate } = useAppRouter()
    return <SettingsPrivacyPolicyPage onBack={() => navigate("settings")} />
}
