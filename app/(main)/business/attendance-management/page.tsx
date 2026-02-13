"use client"

import { AttendanceManagementPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function AttendanceManagementRoute() {
    const { navigate } = useAppRouter()
    return <AttendanceManagementPage onNavigate={navigate} />
}
