"use client"

import { AuthPages } from "@/components/sporgates/pages/auth-pages"
import { useAppRouter } from "@/lib/route-map"

export default function SignInRoute() {
    const { navigate } = useAppRouter()
    return <AuthPages page="signin" onNavigate={navigate} />
}
