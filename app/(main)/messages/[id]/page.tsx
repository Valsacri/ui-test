"use client"

import { useParams } from "next/navigation"
import { ConversationPage } from "@/components/sporgates/pages/conversation-page"
import { useAppRouter } from "@/lib/route-map"

export default function ConversationRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <ConversationPage conversationId={id} onNavigate={navigate} />
}
