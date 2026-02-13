"use client"

import { CreateBusinessPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function CreateBusinessRoute() {
    const { navigate } = useAppRouter()
    return <CreateBusinessPage onNavigate={navigate} />
}
