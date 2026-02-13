"use client"

import { MessagesPage } from "@/components/sporgates/pages/messages-page"
import { useAppRouter } from "@/lib/route-map"

export default function MessagesRoute() {
    const { navigate } = useAppRouter()
    return <MessagesPage onNavigate={navigate} />
}
