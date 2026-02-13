"use client"

import { ManageCustomersPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function ManageCustomersRoute() {
    const { navigate } = useAppRouter()
    return <ManageCustomersPage onNavigate={navigate} />
}
