"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { userBusinesses as initialBusinesses } from "@/lib/mock-data"

interface BusinessContextType {
    businesses: typeof initialBusinesses
    activeBusinessId: string | null
    isBusinessMode: boolean
    switchBusiness: (bizId: string) => void
    switchToUser: () => void
    createNewBusiness: () => void
}

const BusinessContext = createContext<BusinessContextType | null>(null)

export function BusinessProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [businesses] = useState(initialBusinesses)
    const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null)
    const isBusinessMode = activeBusinessId !== null

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
