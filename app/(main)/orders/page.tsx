"use client"

import { OrdersPage } from "@/components/sporgates/pages/orders-page"
import { useAppRouter } from "@/lib/route-map"

export default function OrdersRoute() {
    const { navigate } = useAppRouter()
    return <OrdersPage onNavigate={navigate} />
}
