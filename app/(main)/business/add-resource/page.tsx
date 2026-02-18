"use client"

import { AddResourcePage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"
import { useSearchParams } from "next/navigation"

export default function AddResourceRoute() {
    const { navigate } = useAppRouter()
    const searchParams = useSearchParams()
    const tab = searchParams.get("tab") as "facility" | "product" | "service" | null
    return <AddResourcePage onNavigate={navigate} editResourceType={tab || undefined} />
}
