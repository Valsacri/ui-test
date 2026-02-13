"use client"

import { ProductsPage } from "@/components/sporgates/pages/products-page"
import { useAppRouter } from "@/lib/route-map"

export default function ProductsRoute() {
    const { navigate } = useAppRouter()
    return <ProductsPage onNavigate={navigate} />
}
