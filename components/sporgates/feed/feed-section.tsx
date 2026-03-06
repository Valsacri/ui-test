"use client"

import { Users, Compass, UserPlus } from "lucide-react"
import { FeedComposer } from "@/components/sporgates/feed-composer"
import { PostCard } from "@/components/sporgates/cards/post-card"
import { ActivityCard } from "@/components/sporgates/cards/activity-card"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { resolvePostImageUrl, formatFeedTime } from "@/lib/utils"
import { toast } from "sonner"
import type { PostCardData } from "@/lib/types/post"
import type { FeedTab, UseFeedReturn } from "@/hooks/use-feed"
import { useAppRouter } from "@/lib/route-map"
import { usePostModal } from "@/lib/post-modal-context"
import { ErrorState } from "@/components/sporgates/ux/error-state"

// ─── Sentinel ────────────────────────────────────────────────────
function ScrollSentinel({ onIntersect, enabled }: { onIntersect: () => void; enabled: boolean }) {
    const sentinelRef = useInfiniteScroll(onIntersect, { enabled })
    return <div ref={sentinelRef} className="h-1" aria-hidden />
}

// ─── Feed skeleton (shown while loading more) ────────────────────
function FeedItemSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-1.5">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-2 w-16 rounded bg-muted" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
            </div>
        </div>
    )
}

// ─── Props ───────────────────────────────────────────────────────
interface FeedSectionProps {
    feed: UseFeedReturn
    userId?: string
    currentUser: { id: string; authorName: string; authorAvatar: string } | null
    composer: {
        displayName: string
        avatar: string
    } | null
}

/**
 * The social feed section: composer, tabs (For You / Following), feed items,
 * infinite scroll sentinel, and end-of-feed indicator.
 */
export function FeedSection({ feed, userId, currentUser, composer }: FeedSectionProps) {
    const { navigate } = useAppRouter()
    const { openPost } = usePostModal()

    return (
        <div>
            {/* Composer */}
            {composer && (
                <div className="mb-4">
                    <FeedComposer
                        userDisplayName={composer.displayName}
                        userAvatar={composer.avatar}
                        placeholder="What's on your mind?"
                        onSubmit={async (payload) => {
                            await feed.createPost({
                                content: payload.content,
                                image: payload.image,
                                images: payload.images,
                                sport: payload.sport,
                                visibility: payload.visibility,
                            })
                        }}
                        onSuccess={() => toast.success("Post shared")}
                    />
                </div>
            )}

            {/* Section Header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Community Feed</h2>
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Community</span>
                </div>
            </div>

            {/* Sticky Feed Tabs */}
            <div className="sticky top-16 z-10 -mx-4 bg-background/95 backdrop-blur-sm px-4 pb-3 pt-1 lg:-mx-6 lg:px-6">
                <div className="relative flex gap-2">
                    {(["foryou", "following"] as const).map((t) => (
                        <button
                            type="button"
                            key={t}
                            onClick={() => feed.setTab(t)}
                            className={`relative rounded-full px-5 py-2 text-xs font-semibold transition-all ${feed.tab === t
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t === "foryou" ? "For You" : "Following"}
                            {feed.tab === t && (
                                <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary transition-all" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {feed.error && (
                <ErrorState message={feed.error.message} onRetry={() => feed.refresh()} />
            )}

            {/* Initial / tab load skeleton (For You and Following) */}
            {feed.isLoading && feed.items.length === 0 && (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <FeedItemSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Per-tab empty state */}
            {!feed.isLoading && !feed.error && feed.items.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        {feed.tab === 'following' ? (
                            <UserPlus className="h-6 w-6 text-primary" />
                        ) : (
                            <Compass className="h-6 w-6 text-primary" />
                        )}
                    </div>
                    <h3 className="mb-1 text-base font-bold text-foreground">
                        {feed.tab === 'following' ? 'No posts from people you follow' : 'Your feed is empty'}
                    </h3>
                    <p className="mb-4 max-w-xs text-xs text-muted-foreground">
                        {feed.tab === 'following'
                            ? 'Follow athletes, coaches and sports communities to see their posts here.'
                            : 'Create your first post or explore the community to get personalised content.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => feed.tab === 'following' ? navigate('explore') : navigate('explore')}
                        className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                        {feed.tab === 'following' ? 'Find people to follow' : 'Explore community'}
                    </button>
                </div>
            )}

            {/* Feed Items (only when not in initial load) */}
            {!(feed.isLoading && feed.items.length === 0) && (
            <div className="space-y-4">
                {feed.items.map((item, index) => {
                    if (item.type === "POST") {
                        const post: PostCardData = {
                            id: item.id,
                            author: item.authorName ?? "User",
                            authorAvatar: item.authorAvatar ?? "?",
                            time: formatFeedTime(item.createdAt),
                            content: item.summary ?? "",
                            image: resolvePostImageUrl(item.image) || item.image,
                            images: item.images?.map(img => resolvePostImageUrl(img) || img).filter(Boolean) as string[],
                            likes: item.likes ?? 0,
                            comments: item.comments ?? 0,
                            shares: item.shares ?? 0,
                            liked: item.likedByCurrentUser ?? false,
                            saved: item.savedByCurrentUser ?? false,
                            sport: item.sport,
                        }
                        const canDeletePost = !!userId && item.authorId === userId
                        return (
                            <div
                                key={item.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => openPost(item.id)}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter") return
                                    const tag = (e.target as HTMLElement).tagName
                                    if (tag === "INPUT" || tag === "TEXTAREA") return
                                    openPost(item.id)
                                }}
                                className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                            >
                                <PostCard
                                    post={post}
                                    userId={userId}
                                    currentUser={currentUser}
                                    priority={index < 2}
                                    canDelete={canDeletePost}
                                    onDelete={async (id) => {
                                        await feed.deletePost(id)
                                    }}
                                />
                            </div>
                        )
                    }
                    if (item.type === "ACTIVITY") {
                        const activity = {
                            id: item.id,
                            title: item.title ?? "Activity",
                            sport: item.sport ?? "Sport",
                            date: item.createdAt ?? "",
                            time: "",
                            location: "",
                            price: 0,
                            currency: "USD",
                            spots: 0,
                            totalSpots: 0,
                            image: item.image ?? "/placeholder.svg",
                            rating: 0,
                            reviews: 0,
                            organizer: item.authorName ?? "",
                            organizerAvatar: item.authorAvatar ?? "",
                            tags: item.sport ? [item.sport] : [],
                        }
                        return (
                            <ActivityCard
                                key={item.id}
                                activity={activity}
                                onClick={() => navigate("activity-detail", item.id)}
                            />
                        )
                    }
                    return (
                        <div key={item.id} className="rounded-2xl border border-border bg-card p-4">
                            {item.title && <h3 className="font-semibold text-foreground">{item.title}</h3>}
                            {item.summary && <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>}
                        </div>
                    )
                })}
            </div>
            )}

            {/* Infinite scroll sentinel + loading skeletons */}
            {feed.hasMore && feed.items.length > 0 && (
                <>
                    {feed.isLoadingMore && (
                        <div className="mt-4 space-y-4">
                            {[1, 2, 3].map((i) => <FeedItemSkeleton key={i} />)}
                        </div>
                    )}
                    <ScrollSentinel onIntersect={() => feed.loadMore()} enabled={!feed.isLoadingMore} />
                </>
            )}

            {/* End of feed */}
            {!feed.hasMore && feed.items.length > 0 && (
                <div className="mt-8 flex flex-col items-center gap-2 py-6 text-center">
                    <span className="text-3xl">🎉</span>
                    <p className="text-sm font-semibold text-foreground">You&apos;re all caught up!</p>
                    <p className="text-xs text-muted-foreground">You&apos;ve seen all the latest posts.</p>
                </div>
            )}
        </div>
    )
}
