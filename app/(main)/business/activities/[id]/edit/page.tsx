"use client"

import { CreateActivityStepsPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"
import { useParams } from "next/navigation"

export default function EditActivityRoute() {
    const { navigate } = useAppRouter()
    const params = useParams()
    const id = params?.id as string

    return <CreateActivityStepsPage onNavigate={navigate} activityId={id} />
}
