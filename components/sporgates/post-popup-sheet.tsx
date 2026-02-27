"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { PostCard } from "@/components/sporgates/cards/post-card"
import { FeedSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { postsService, authService } from "@/lib/services"
import { formatFeedTime, resolvePostImageUrl } from "@/lib/utils"
import type { PostCardData } from "@/lib/types/post"

export interface PostPopupSheetProps {
  postId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When true, the comment/reply section is expanded automatically (e.g. when opened from a comment-related notification). */
  openComments?: boolean
}

/**
 * Sheet that shows a single post (e.g. from a notification click).
 * Fetches post when opened; does not navigate away.
 */
export function PostPopupSheet({ postId, open, onOpenChange, openComments }: PostPopupSheetProps) {
  const currentUser = authService.getCurrentUser()
  const userId = currentUser?.id
  const initials =
    (currentUser?.firstName?.[0] ?? "") +
    (currentUser?.lastName?.[0] ?? "") ||
    (currentUser?.username?.[0] ?? "?").toUpperCase()
  const currentUserForComment = currentUser
    ? {
        id: currentUser.id,
        authorName:
          [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") ||
          currentUser.username ||
          "User",
        authorAvatar: initials,
      }
    : null

  const { data: post, error, isLoading, mutate } = useSWR(
    open && postId && userId ? ["post-popup", postId] : null,
    async () => postsService.getById(postId!, userId)
  )

  const postCard: PostCardData | null = useMemo(() => {
    if (!post) return null
    return {
      id: post.id,
      author:
        post.authorName ?? (post as unknown as { author?: string }).author ?? "User",
      authorAvatar: post.authorAvatar ?? "?",
      time: formatFeedTime(post.createdAt),
      content: post.content ?? "",
      image: resolvePostImageUrl(post.image) || post.image,
      likes: post.likes ?? 0,
      comments: post.comments ?? 0,
      shares: post.shares ?? 0,
      liked: post.likedByCurrentUser ?? false,
      saved: post.savedByCurrentUser ?? false,
      sport: post.sport,
    }
  }, [post])

  const content = () => {
    if (!postId) return null
    if (isLoading) {
      return (
        <div className="p-4">
          <FeedSkeleton />
        </div>
      )
    }
    if (error || !postCard) {
      return (
        <div className="p-4">
          <ErrorState
            message="Post not found or failed to load"
            onRetry={() => mutate()}
          />
        </div>
      )
    }
    return (
      <div className="p-4">
        <PostCard
          post={postCard}
          userId={userId}
          currentUser={currentUserForComment}
          initialShowComments={openComments}
        />
      </div>
    )
  }

  return (
    <Sheet open={open && !!postId} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-md"
      >
        <SheetTitle className="sr-only">Post</SheetTitle>
        <div className="pt-6">{content()}</div>
      </SheetContent>
    </Sheet>
  )
}
