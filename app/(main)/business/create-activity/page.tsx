"use client"

import { CreateActivityPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function CreateActivityRoute() {
    const { navigate } = useAppRouter()
    return <CreateActivityPage onNavigate={navigate} />
}
