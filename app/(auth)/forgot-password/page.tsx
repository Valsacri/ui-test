"use client"

import { AuthPages } from "@/components/sporgates/pages/auth-pages"
import { useAppRouter } from "@/lib/route-map"

export default function ForgotPasswordRoute() {
    const { navigate } = useAppRouter()
    return <AuthPages page="forgot-password" onNavigate={navigate} />
}
