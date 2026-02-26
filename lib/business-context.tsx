"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { businessesService } from "@/lib/services/businesses"
import { STORAGE_KEYS, DEFAULT_API_BASE_URL } from "@/lib/constants"

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
    // Initialize from localStorage if available, otherwise null. 
    // We start with null to prevent hydration mismatch, then sync in useEffect.
    const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    // Derived state - only valid after initialization
    const isBusinessMode = !!activeBusinessId

    // Hydrate state from localStorage on mount
    useEffect(() => {
        const storedId = localStorage.getItem(STORAGE_KEYS.ACTIVE_BUSINESS_ID)
        if (storedId) {
            setActiveBusinessId(storedId)
        }
        setIsInitialized(true)
    }, [])

    useEffect(() => {
        businessesService.getMyBusinesses().then((data: any) => {
            const list = Array.isArray(data) ? data : (data?.content || [])
            const mapped: BusinessItem[] = list.map((b: any) => ({
                id: b.id,
                name: b.name || "Unnamed Business",
                type: (b.bio && b.bio.length > 60) ? b.bio.slice(0, 60) + "…" : (b.bio || "Business"),
                emoji: undefined,
                avatar: b.avatar
                    ? (b.avatar.startsWith("/") ? `${process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL}${b.avatar}` : b.avatar)
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
            localStorage.setItem(STORAGE_KEYS.ACTIVE_BUSINESS_ID, bizId)
            router.push("/business/dashboard")
        },
        [router]
    )

    const switchToUser = useCallback(() => {
        setActiveBusinessId(null)
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_BUSINESS_ID)
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
