"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import { TopBar } from "@/components/sporgates/top-bar"
import { ExtendedOnboardingBanner } from "@/components/sporgates/extended-onboarding-banner"
import { ExploreSidebar } from "@/components/sporgates/explore-sidebar"
import { FeedSidebar } from "@/components/sporgates/feed-sidebar"
import { BottomNav } from "@/components/sporgates/bottom-nav"
import { AuthGuard } from "@/components/sporgates/auth-guard"
import { ErrorBoundary } from "@/components/sporgates/ux/error-boundary"
import { BusinessProvider, useBusinessContext } from "@/lib/business-context"
import { CartProvider } from "@/lib/cart-context"
import { useAppRouter } from "@/lib/route-map"
import { notificationsService } from "@/lib/services/notifications"
import { messagesService } from "@/lib/services/messages"
import { authService } from "@/lib/services/auth"
import { useNotificationStream } from "@/lib/hooks/use-notification-stream"
import { mutate as swrMutate } from "swr"
import { PostModalProvider } from "@/lib/post-modal-context"
import { StoryModalProvider } from "@/lib/story-modal-context"
import { StoryReplyModalProvider } from "@/lib/story-reply-modal-context"
import { NotificationCountProvider } from "@/lib/notification-count-context"
import { MessageCountProvider } from "@/lib/message-count-context"
import type { PageRoute } from "@/lib/navigation"


/** Determines the current PageRoute from the URL pathname */
function pathnameToPageRoute(pathname: string): PageRoute {
    // Strip trailing slash
    const p = pathname === "/" ? "/" : pathname.replace(/\/$/, "")

    if (p === "/" || p === "/home") return "home"
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
    if (p.startsWith("/jobs/")) return "job-detail"
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
    if (p === "/business/feed") return "business-feed"
    if (p === "/business/activities") return "business-activities"
    if (p === "/business/customers") return "business-customers"
    if (p === "/business/team") return "business-team"
    if (p === "/business/analytics") return "business-analytics"
    if (p === "/business/campaigns") return "business-campaigns"
    if (p === "/business/resources") return "business-resources"
    if (p.startsWith("/business/resources/")) return "business-resource-detail"
    if (p === "/business/partners") return "business-partners"
    if (p === "/business/athletes") return "business-athletes"
    if (p === "/business/jobs") return "business-jobs"
    if (p.startsWith("/business/jobs/")) return "business-job-detail"
    if (p === "/business/portfolio") return "business-portfolio"
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
    if (p.match(/\/business\/activities\/[^/]+\/edit/)) return "create-activity-steps"

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
    return (
        <BusinessProvider>
            <AuthGuard>
                <CartProvider>
                    <MainLayoutInner>{children}</MainLayoutInner>
                </CartProvider>
            </AuthGuard>
        </BusinessProvider>
    )
}

function MainLayoutInner({ children }: { children: React.ReactNode }) {
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

    const showSidebars = true
    const showRightSidebar =
        showSidebars && !isBusinessMode && !hideRightSidebarPages.includes(currentPage)

    const [unreadNotifications, setUnreadNotifications] = useState(0)
    const [unreadMessages, setUnreadMessages] = useState(0)

    // Unlock audio on first user gesture so notification sound can play later (browser autoplay policy).
    const audioUnlockedRef = useRef(false)
    const notificationAudioRef = useRef<HTMLAudioElement | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    /** Collapse duplicate SSE (or double-parse) bursts into a single audible cue. */
    const lastNotificationSoundAtRef = useRef(0)

    /** Play notification sound: try MP3 first, then fallback beep if missing or failed. */
    const playNotificationSound = useCallback(() => {
        const now = Date.now()
        if (now - lastNotificationSoundAtRef.current < 650) {
            return
        }
        lastNotificationSoundAtRef.current = now

        const volume = 0.6
        let usedFallback = false
        const tryMp3 = () => {
            const audio = notificationAudioRef.current
            const playOrFallback = (a: HTMLAudioElement) => {
                a.volume = volume
                a.currentTime = 0
                a.play().catch(() => {
                    if (!usedFallback) {
                        usedFallback = true
                        tryBeep()
                    }
                })
            }
            if (audio) {
                playOrFallback(audio)
            } else {
                const newAudio = new Audio("/sound/notification.mp3")
                playOrFallback(newAudio)
            }
        }
        const tryBeep = () => {
            try {
                const ctx = audioContextRef.current
                if (!ctx) return
                if (ctx.state === "suspended") ctx.resume().then(() => playBeep(ctx)).catch(() => { })
                else playBeep(ctx)
            } catch { /* ignore */ }
        }
        const playBeep = (ctx: AudioContext) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.frequency.value = 880
            osc.type = "sine"
            gain.gain.setValueAtTime(0.15, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
            osc.start(ctx.currentTime)
            osc.stop(ctx.currentTime + 0.2)
        }
        try {
            tryMp3()
        } catch {
            if (!usedFallback) {
                usedFallback = true
                tryBeep()
            }
        }
    }, [])

    useEffect(() => {
        if (audioUnlockedRef.current) return
        const unlock = () => {
            if (audioUnlockedRef.current) return
            audioUnlockedRef.current = true
            try {
                const audio = new Audio("/sound/notification.mp3")
                notificationAudioRef.current = audio
                audio.volume = 0
                audio.play().catch(() => { })
            } catch { /* ignore */ }
            try {
                const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
                audioContextRef.current = ctx
                ctx.resume().catch(() => { })
            } catch { /* ignore */ }
            document.removeEventListener("click", unlock)
            document.removeEventListener("keydown", unlock)
        }
        document.addEventListener("click", unlock, { once: true })
        document.addEventListener("keydown", unlock, { once: true })
        return () => {
            document.removeEventListener("click", unlock)
            document.removeEventListener("keydown", unlock)
        }
    }, [])

    const refetchNotificationCount = useCallback(() => {
        const u = authService.getCurrentUser()
        if (!u?.id) return
        notificationsService.getUnreadCount(u.id)
            .then((data) => {
                const count = typeof data === 'number' ? data : (data?.count ?? 0)
                setUnreadNotifications(count)
            })
            .catch(() => { })
    }, [])

    const refetchMessagesCount = useCallback(() => {
        const u = authService.getCurrentUser()
        if (!u?.id) return
        messagesService.getUnreadCount(u.id)
            .then((data: { unreadCount?: number }) => {
                setUnreadMessages(data?.unreadCount ?? 0)
            })
            .catch(() => { })
    }, [])

    const handleNewNotification = useCallback(() => {
        playNotificationSound()
        refetchNotificationCount()
        const u = authService.getCurrentUser()
        if (u?.id) swrMutate(`/notifications/user/${u.id}`)
    }, [playNotificationSound, refetchNotificationCount])

    const user = authService.getCurrentUser()
    useNotificationStream(user?.id ?? null, handleNewNotification)

    const onUnreadNotificationsChange = useCallback(
        (updater: number | ((prev: number) => number)) => {
            setUnreadNotifications((prev) =>
                typeof updater === "function" ? updater(prev) : updater
            )
        },
        []
    )

    // Polling fallback: refetch unread count every 15s if SSE drops (no sound here — SSE already plays once per push; polling would duplicate sound)
    const prevUnreadRef = useRef(0)
    useEffect(() => {
        if (user?.id) {
            notificationsService.getUnreadCount(user.id)
                .then((data) => {
                    const count = typeof data === 'number' ? data : (data?.count ?? 0)
                    setUnreadNotifications(count)
                    prevUnreadRef.current = count
                })
                .catch(() => { })
            messagesService.getUnreadCount(user.id)
                .then((data: { unreadCount?: number }) => {
                    setUnreadMessages(data?.unreadCount ?? 0)
                })
                .catch(() => { })
        }
    }, [user?.id])

    useEffect(() => {
        if (!user?.id) return
        const interval = setInterval(() => {
            notificationsService.getUnreadCount(user.id)
                .then((data) => {
                    const count = typeof data === 'number' ? data : (data?.count ?? 0)
                    prevUnreadRef.current = count
                    setUnreadNotifications(count)
                })
                .catch(() => { })
        }, 15000)
        return () => clearInterval(interval)
    }, [user?.id])

    return (
        <PostModalProvider>
            <StoryModalProvider>
                <StoryReplyModalProvider>
                <NotificationCountProvider value={onUnreadNotificationsChange}>
                <MessageCountProvider value={refetchMessagesCount}>
                <div className="min-h-screen bg-background">
                    <ExtendedOnboardingBanner isBusinessMode={isBusinessMode} />
                    <TopBar
                        onNavigate={navigate}
                        isBusinessMode={isBusinessMode}
                        businesses={businesses}
                        activeBusinessId={activeBusinessId}
                        onSwitchBusiness={switchBusiness}
                        onSwitchToUser={switchToUser}
                        onCreateNewBusiness={createNewBusiness}
                        unreadMessages={unreadMessages}
                        unreadNotifications={unreadNotifications}
                        onUnreadNotificationsChange={onUnreadNotificationsChange}
                    />
                    <div className="flex">
                        {showSidebars && (
                            <ExploreSidebar
                                currentPage={currentPage}
                                onNavigate={(page) => {
                                    if (page === "business-portfolio") {
                                        if (isBusinessMode && activeBusinessId) {
                                            navigate(page)
                                        } else {
                                            navigate("businesses")
                                        }
                                        return
                                    }
                                    navigate(page)
                                }}
                                isBusinessMode={isBusinessMode}
                            />
                        )}
                        <div className="min-w-0 flex-1 flex justify-center">
                            <main className={`w-full ${currentPage === "home" ? "max-w-3xl" : "max-w-6xl"} mt-6 p-6 lg:p-2`}>
                                <ErrorBoundary>
                                    {children}
                                </ErrorBoundary>
                            </main>
                        </div>
                        {showRightSidebar && <FeedSidebar onNavigate={navigate} />}
                    </div>
                    <BottomNav
                        currentPage={currentPage}
                        onNavigate={navigate}
                        isBusinessMode={isBusinessMode}
                    />
                </div>
                </MessageCountProvider>
                </NotificationCountProvider>
                </StoryReplyModalProvider>
            </StoryModalProvider>
        </PostModalProvider>
    )
}

