"use client"

import { useParams } from "next/navigation"
import { ProductDetailPage } from "@/components/sporgates/pages/product-detail-page"
import { useAppRouter } from "@/lib/route-map"

export default function ProductDetailRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <ProductDetailPage productId={id} onNavigate={navigate} />
}
