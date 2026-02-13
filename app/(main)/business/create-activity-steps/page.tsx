"use client"

import { CreateActivityStepsPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function CreateActivityStepsRoute() {
    const { navigate } = useAppRouter()
    return <CreateActivityStepsPage onNavigate={navigate} />
}
