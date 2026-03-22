"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { userService, messagesService, authService } from "@/lib/services"
import { resolvePostImageUrl, isAvatarImageUrl } from "@/lib/utils"
import { Loader2, MessageCircle, UserMinus } from "lucide-react"
import { toast } from "sonner"
import type { PageRoute } from "@/lib/navigation"

type FollowListMode = "followers" | "following"

interface UserItem {
    id: string
    firstName?: string
    lastName?: string
    username?: string
    profilePicture?: string
}

interface FollowListModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: string
    mode: FollowListMode
    onNavigate: (page: PageRoute, id?: string) => void
    /** Called after a successful unfollow so the profile can refresh counts */
    onUnfollow?: () => void
}

export function FollowListModal({
    open,
    onOpenChange,
    userId,
    mode,
    onNavigate,
    onUnfollow,
}: FollowListModalProps) {
    const [page, setPage] = useState(0)
    const size = 20
    const currentUser = authService.getCurrentUser()
    const currentUserId = currentUser?.id ?? null

    const fetcher = () =>
        mode === "followers"
            ? userService.getFollowers(userId, { page, size })
            : userService.getFollowing(userId, { page, size })

    const { data, isLoading, mutate: mutateList } = useSWR(
        open && userId ? [`/users/${userId}/${mode}`, page] : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    const { data: myFollowingData, mutate: mutateMyFollowing } = useSWR(
        open && currentUserId ? [`/users/${currentUserId}/following`, "set"] : null,
        () => userService.getFollowing(currentUserId!, { page: 0, size: 500 }),
        { revalidateOnFocus: false }
    )

    const followingIds = useMemo(() => {
        const list = myFollowingData?.content ?? []
        return new Set(list.map((u: UserItem) => u.id))
    }, [myFollowingData])

    const [unfollowingId, setUnfollowingId] = useState<string | null>(null)
    const [optimisticUnfollow, setOptimisticUnfollow] = useState<Set<string>>(new Set())

    const isFollowing = (targetId: string) =>
        targetId !== currentUserId && followingIds.has(targetId) && !optimisticUnfollow.has(targetId)

    useEffect(() => {
        if (open) setPage(0)
    }, [open])

    const list = data?.content ?? []
    const total = data?.totalElements ?? 0
    const title = mode === "followers" ? "Followers" : "Following"

    const [messagingUserId, setMessagingUserId] = useState<string | null>(null)

    const handleUserClick = (id: string) => {
        onOpenChange(false)
        onNavigate("person-detail", id)
    }

    const handleMessageClick = async (e: React.MouseEvent, targetUserId: string) => {
        e.stopPropagation()
        if (messagingUserId) return
        setMessagingUserId(targetUserId)
        try {
            const conv = await messagesService.createDirectConversation({ targetUserId })
            onOpenChange(false)
            onNavigate("conversation", conv.id)
        } catch {
            toast.error("Could not start conversation")
        } finally {
            setMessagingUserId(null)
        }
    }

    const handleUnfollowClick = async (e: React.MouseEvent, targetUserId: string) => {
        e.stopPropagation()
        if (!currentUserId || unfollowingId) return
        setUnfollowingId(targetUserId)
        setOptimisticUnfollow((prev) => new Set(prev).add(targetUserId))
        try {
            await userService.unfollowUser(currentUserId, targetUserId)
            await Promise.all([mutateMyFollowing(), mutateList()])
            onUnfollow?.()
        } catch {
            toast.error("Could not unfollow")
            setOptimisticUnfollow((prev) => {
                const next = new Set(prev)
                next.delete(targetUserId)
                return next
            })
        } finally {
            setUnfollowingId(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] flex flex-col gap-0 p-0 sm:max-w-md">
                <DialogHeader className="border-b border-border px-4 py-3">
                    <DialogTitle className="text-base">{title}</DialogTitle>
                </DialogHeader>
                <div className="min-h-0 flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : list.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            {mode === "followers"
                                ? "No followers yet."
                                : "Not following anyone yet."}
                        </p>
                    ) : (
                        <ul className="divide-y divide-border">
                            {list.map((user: UserItem) => {
                                const name =
                                    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                                    user.username ||
                                    "Unknown"
                                const initials = name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2) || "?"
                                const avatarUrl = user.profilePicture
                                    ? resolvePostImageUrl(user.profilePicture)
                                    : null
                                return (
                                    <li key={user.id}>
                                        <div className="flex items-center gap-2 px-4 py-3 transition-colors hover:bg-muted">
                                            <button
                                                type="button"
                                                onClick={() => handleUserClick(user.id)}
                                                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-semibold text-foreground">
                                                    {avatarUrl && isAvatarImageUrl(avatarUrl) ? (
                                                        <Image
                                                            src={avatarUrl}
                                                            alt=""
                                                            width={40}
                                                            height={40}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        initials
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-medium text-foreground">
                                                        {name}
                                                    </p>
                                                    {user.username && (
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            @{user.username}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                            {isFollowing(user.id) && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleUnfollowClick(e, user.id)}
                                                    disabled={unfollowingId !== null}
                                                    className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                                                    title="Unfollow"
                                                    aria-label={`Unfollow ${name}`}
                                                >
                                                    {unfollowingId === user.id ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <UserMinus className="h-5 w-5" />
                                                    )}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => handleMessageClick(e, user.id)}
                                                disabled={messagingUserId !== null}
                                                className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted-foreground/10 hover:text-foreground disabled:opacity-50"
                                                title="Message"
                                                aria-label={`Message ${name}`}
                                            >
                                                {messagingUserId === user.id ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <MessageCircle className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                    {total > (page + 1) * size && (
                        <div className="border-t border-border p-3 text-center">
                            <button
                                type="button"
                                onClick={() => setPage((p) => p + 1)}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Load more
                            </button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
