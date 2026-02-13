"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import type { PageRoute } from "@/lib/navigation"

/**
 * Maps PageRoute identifiers to URL paths.
 * Detail pages use dynamic segments: e.g. activity-detail with id "5" → /activities/5
 */
const routeMap: Record<PageRoute, string> = {
    // Main pages
    home: "/",
    explore: "/explore",
    activities: "/activities",
    "activity-detail": "/activities/[id]",
    facilities: "/facilities",
    "facility-detail": "/facilities/[id]",
    marketplace: "/marketplace",
    products: "/products",
    "product-detail": "/products/[id]",
    services: "/services",
    "service-detail": "/services/[id]",
    businesses: "/businesses",
    "business-detail": "/businesses/[id]",
    "organizer-portfolio": "/businesses/[id]/portfolio",
    jobs: "/jobs",
    messages: "/messages",
    conversation: "/messages/[id]",
    notifications: "/notifications",
    community: "/community",
    "squad-detail": "/community/squads/[id]",
    "squad-profile": "/community/squads/[id]/profile",
    "squad-dashboard": "/community/squads/dashboard",
    "store-detail": "/stores/[id]",

    // Profile
    profile: "/profile",
    "profile-enhanced": "/profile/enhanced",
    "profile-information": "/profile/information",
    "person-detail": "/people/[id]",

    // Settings
    settings: "/settings",
    "settings-profile": "/settings/profile",
    "settings-privacy": "/settings/privacy",
    "settings-notifications": "/settings/notifications",
    "settings-payment": "/settings/payment",
    "settings-wallet": "/settings/wallet",
    "settings-language": "/settings/language",
    "settings-blocked": "/settings/blocked",
    "settings-data-permissions": "/settings/data-permissions",
    "settings-terms": "/settings/terms",
    "settings-privacy-policy": "/settings/privacy-policy",
    "settings-help": "/settings/help",
    "settings-transactions": "/settings/transactions",

    // Business
    "business-dashboard": "/business/dashboard",
    "business-activities": "/business/activities",
    "business-customers": "/business/customers",
    "business-team": "/business/team",
    "business-analytics": "/business/analytics",
    "business-campaigns": "/business/campaigns",
    "business-resources": "/business/resources",
    "business-partners": "/business/partners",
    "business-athletes": "/business/athletes",
    "business-profile": "/business/profile",
    "business-onboarding": "/business/onboarding",
    "create-activity": "/business/create-activity",
    "create-activity-steps": "/business/create-activity-steps",
    "create-campaign": "/business/create-campaign",
    "create-business": "/business/create",
    "add-resource": "/business/add-resource",
    "add-team-member": "/business/add-team-member",
    "add-collaboration": "/business/add-collaboration",
    "manage-resources": "/business/manage-resources",
    "manage-customers": "/business/manage-customers",
    "team-management": "/business/team-management",
    "attendance-management": "/business/attendance-management",
    "create-facility": "/business/create-facility",
    "create-squad": "/business/create-squad",

    // Auth
    signin: "/signin",
    signup: "/signup",
    "forgot-password": "/forgot-password",
    "reset-password": "/reset-password",
    "verify-email": "/verify-email",
    "choose-sports": "/choose-sports",
    "set-goals": "/set-goals",
    "onboarding-confirmation": "/onboarding-confirmation",
}

/**
 * Converts a PageRoute + optional detailId into a URL path.
 */
export function getPath(page: PageRoute, detailId?: string): string {
    const template = routeMap[page] || "/"
    if (detailId && template.includes("[id]")) {
        return template.replace("[id]", detailId)
    }
    return template.replace("/[id]", "")
}

/**
 * Hook that provides a navigate function matching the existing
 * onNavigate(page: PageRoute, detailId?: string) signature,
 * but uses Next.js router.push() under the hood.
 */
export function useAppRouter() {
    const router = useRouter()

    const navigate = useCallback(
        (page: PageRoute, detailId?: string) => {
            const path = getPath(page, detailId)
            router.push(path)
        },
        [router]
    )

    return { navigate, router }
}
