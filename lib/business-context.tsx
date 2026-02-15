"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { businessesService } from "@/lib/services/businesses"

interface BusinessItem {
    id: string
    name: string
    type: string
    emoji?: string
    avatar?: string
    location: string
    rating: number
    followers: number
}

interface BusinessContextType {
    businesses: BusinessItem[]
    activeBusinessId: string | null
    isBusinessMode: boolean
    switchBusiness: (bizId: string) => void
    switchToUser: () => void
    createNewBusiness: () => void
}

const BusinessContext = createContext<BusinessContextType | null>(null)

export function BusinessProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [businesses, setBusinesses] = useState<BusinessItem[]>([])
    const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null)
    const isBusinessMode = activeBusinessId !== null

    useEffect(() => {
        businessesService.getMyBusinesses().then((data: any) => {
            const list = Array.isArray(data) ? data : (data?.content || [])
            const mapped: BusinessItem[] = list.map((b: any) => ({
                id: b.id,
                name: b.name || "Unnamed Business",
                type: (b.bio && b.bio.length > 60) ? b.bio.slice(0, 60) + "…" : (b.bio || "Business"),
                emoji: undefined,
                avatar: b.avatar
                    ? (b.avatar.startsWith("/") ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}${b.avatar}` : b.avatar)
                    : undefined,
                location: [b.city, b.state].filter(Boolean).join(", ") || b.address || "",
                rating: b.rating || 0,
                followers: b.followers || 0,
            }))
            setBusinesses(mapped)
        }).catch(() => { })
    }, [])

    const switchBusiness = useCallback(
        (bizId: string) => {
            setActiveBusinessId(bizId)
            router.push("/business/dashboard")
        },
        [router]
    )

    const switchToUser = useCallback(() => {
        setActiveBusinessId(null)
        router.push("/")
    }, [router])

    const createNewBusiness = useCallback(() => {
        router.push("/business/onboarding")
    }, [router])

    return (
        <BusinessContext.Provider
            value={{
                businesses,
                activeBusinessId,
                isBusinessMode,
                switchBusiness,
                switchToUser,
                createNewBusiness,
            }}
        >
            {children}
        </BusinessContext.Provider>
    )
}

export function useBusinessContext() {
    const ctx = useContext(BusinessContext)
    if (!ctx) throw new Error("useBusinessContext must be used within BusinessProvider")
    return ctx
}
