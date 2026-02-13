"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { TopBar } from "@/components/sporgates/top-bar"
import { ExploreSidebar } from "@/components/sporgates/explore-sidebar"
import { FeedSidebar } from "@/components/sporgates/feed-sidebar"
import { BottomNav } from "@/components/sporgates/bottom-nav"
import { useBusinessContext } from "@/lib/business-context"
import { useAppRouter } from "@/lib/route-map"
import type { PageRoute } from "@/lib/navigation"

/** Determines the current PageRoute from the URL pathname */
function pathnameToPageRoute(pathname: string): PageRoute {
    // Strip trailing slash
    const p = pathname === "/" ? "/" : pathname.replace(/\/$/, "")

    if (p === "/") return "home"
    if (p === "/explore") return "explore"
    if (p === "/activities") return "activities"
    if (p.startsWith("/activities/")) return "activity-detail"
    if (p === "/facilities") return "facilities"
    if (p.startsWith("/facilities/")) return "facility-detail"
    if (p === "/marketplace") return "marketplace"
    if (p === "/products") return "products"
    if (p.startsWith("/products/")) return "product-detail"
    if (p === "/services") return "services"
    if (p.startsWith("/services/")) return "service-detail"
    if (p === "/businesses") return "businesses"
    if (p.startsWith("/businesses/") && p.endsWith("/portfolio")) return "organizer-portfolio"
    if (p.startsWith("/businesses/")) return "business-detail"
    if (p === "/jobs") return "jobs"
    if (p === "/messages") return "messages"
    if (p.startsWith("/messages/")) return "conversation"
    if (p === "/notifications") return "notifications"
    if (p === "/community") return "community"
    if (p.startsWith("/community/squads/dashboard")) return "squad-dashboard"
    if (p.match(/\/community\/squads\/[^/]+\/profile/)) return "squad-profile"
    if (p.startsWith("/community/squads/")) return "squad-detail"
    if (p.startsWith("/stores/")) return "store-detail"
    if (p === "/profile") return "profile"
    if (p === "/profile/enhanced") return "profile-enhanced"
    if (p === "/profile/information") return "profile-information"
    if (p.startsWith("/people/")) return "person-detail"
    if (p === "/settings") return "settings"
    if (p.startsWith("/settings/")) {
        const sub = p.replace("/settings/", "")
        return `settings-${sub}` as PageRoute
    }
    if (p === "/business" || p === "/business/dashboard") return "business-dashboard"
    if (p === "/business/activities") return "business-activities"
    if (p === "/business/customers") return "business-customers"
    if (p === "/business/team") return "business-team"
    if (p === "/business/analytics") return "business-analytics"
    if (p === "/business/campaigns") return "business-campaigns"
    if (p === "/business/resources") return "business-resources"
    if (p === "/business/partners") return "business-partners"
    if (p === "/business/athletes") return "business-athletes"
    if (p === "/business/profile") return "business-profile"
    if (p === "/business/onboarding") return "business-onboarding"
    if (p === "/business/create-activity") return "create-activity"
    if (p === "/business/create-activity-steps") return "create-activity-steps"
    if (p === "/business/create-campaign") return "create-campaign"
    if (p === "/business/create") return "create-business"
    if (p === "/business/add-resource") return "add-resource"
    if (p === "/business/add-team-member") return "add-team-member"
    if (p === "/business/add-collaboration") return "add-collaboration"
    if (p === "/business/manage-resources") return "manage-resources"
    if (p === "/business/manage-customers") return "manage-customers"
    if (p === "/business/team-management") return "team-management"
    if (p === "/business/attendance-management") return "attendance-management"
    if (p === "/business/create-facility") return "create-facility"
    if (p === "/business/create-squad") return "create-squad"

    return "home"
}

const hideRightSidebarPages: PageRoute[] = [
    "activity-detail",
    "facility-detail",
    "product-detail",
    "service-detail",
    "business-detail",
    "organizer-portfolio",
    "person-detail",
    "squad-profile",
]

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const currentPage = pathnameToPageRoute(pathname)
    const { navigate } = useAppRouter()
    const {
        isBusinessMode,
        businesses,
        activeBusinessId,
        switchBusiness,
        switchToUser,
        createNewBusiness,
    } = useBusinessContext()

    const isMessages = currentPage === "messages" || currentPage === "conversation"
    const showSidebars = !isMessages
    const showRightSidebar =
        showSidebars && !isBusinessMode && !hideRightSidebarPages.includes(currentPage)

    return (
        <div className="min-h-screen bg-background">
            <TopBar
                onNavigate={navigate}
                isBusinessMode={isBusinessMode}
                businesses={businesses}
                activeBusinessId={activeBusinessId}
                onSwitchBusiness={switchBusiness}
                onSwitchToUser={switchToUser}
                onCreateNewBusiness={createNewBusiness}
                unreadMessages={3}
                unreadNotifications={2}
            />
            <div className="flex">
                {showSidebars && (
                    <ExploreSidebar
                        currentPage={currentPage}
                        onNavigate={navigate}
                        isBusinessMode={isBusinessMode}
                    />
                )}
                <main className="min-w-0 flex-1 p-4 lg:p-6">
                    {children}
                </main>
                {showRightSidebar && <FeedSidebar onNavigate={navigate} />}
            </div>
            <BottomNav
                currentPage={currentPage}
                onNavigate={navigate}
                isBusinessMode={isBusinessMode}
            />
        </div>
    )
}
