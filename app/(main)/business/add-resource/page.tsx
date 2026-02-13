"use client"

import { AddResourcePage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function AddResourceRoute() {
    const { navigate } = useAppRouter()
    return <AddResourcePage onNavigate={navigate} />
}
