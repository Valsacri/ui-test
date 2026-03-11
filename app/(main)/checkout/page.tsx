"use client"

import { CheckoutPage } from "@/components/sporgates/pages/checkout-page"
import { useAppRouter } from "@/lib/route-map"

export default function CheckoutRoute() {
    const { navigate } = useAppRouter()
    return <CheckoutPage onNavigate={navigate} />
}
