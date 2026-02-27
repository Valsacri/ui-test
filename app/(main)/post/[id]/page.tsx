"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import useSWR from "swr"
import { PostCard } from "@/components/sporgates/cards/post-card"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { FeedSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { postsService, authService } from "@/lib/services"
import { formatFeedTime, resolvePostImageUrl } from "@/lib/utils"
import type { PostCardData } from "@/lib/types/post"

export default function PostDetailRoute() {
  const params = useParams()
  const searchParams = useSearchParams()
  const postId = typeof params?.id === "string" ? params.id : null
  const openComments = searchParams.get("comments") === "1"
  const currentUser = authService.getCurrentUser()
  const userId = currentUser?.id
  const initials = (currentUser?.firstName?.[0] ?? "") + (currentUser?.lastName?.[0] ?? "") || (currentUser?.username?.[0] ?? "?").toUpperCase()
  const currentUserForComment = currentUser
    ? {
        id: currentUser.id,
        authorName: [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") || currentUser.username || "User",
        authorAvatar: initials,
      }
    : null

  const { data: post, error, isLoading, mutate } = useSWR(
    postId && userId ? [`post`, postId] : null,
    async () => postsService.getById(postId!, userId)
  )

  const postCard: PostCardData | null = useMemo(() => {
    if (!post) return null
    return {
      id: post.id,
      author: post.authorName ?? (post as unknown as { author?: string }).author ?? "User",
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

  if (!postId) {
    return <ErrorState message="Invalid post" onRetry={() => {}} />
  }

  if (isLoading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <div className="mx-auto max-w-[32rem]">
          <FeedSkeleton />
        </div>
      </div>
    )
  }

  if (error || !postCard) {
    return (
      <ErrorState
        message="Post not found or failed to load"
        onRetry={() => mutate()}
      />
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="mx-auto max-w-[32rem]">
        <PostCard
          post={postCard}
          userId={userId}
          currentUser={currentUserForComment}
          initialShowComments={openComments}
        />
      </div>
    </div>
  )
}
