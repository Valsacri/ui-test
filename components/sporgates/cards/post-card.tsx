"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal } from "lucide-react"
import { cn, resolvePostImageUrl, isAvatarImageUrl } from "@/lib/utils"
import { PostActionBar } from "@/components/sporgates/post-action-bar"
import { PostCommentsInline } from "@/components/sporgates/post-comments-inline"
import { usePostActions } from "@/hooks/use-post-actions"
import type { PostCardData } from "@/lib/types/post"

export interface PostCardProps {
  post: PostCardData
  userId?: string
  /** For inline comment form; when absent, comments section is hidden. */
  currentUser?: { id: string; authorName: string; authorAvatar: string } | null
  onCountChange?: (count: number) => void
  /** When true, comments section is expanded by default (e.g. when opened from a comment notification). */
  initialShowComments?: boolean
  className?: string
}

/**
 * Single post in the feed. Inline comment input and list under the action bar.
 */
export function PostCard({ post, userId, currentUser, onCountChange, initialShowComments, className }: PostCardProps) {
  const [commentCount, setCommentCount] = useState(post.comments ?? 0)
  const [showComments, setShowComments] = useState(initialShowComments ?? false)
  const handleCountChange = (count: number) => {
    setCommentCount(count)
    onCountChange?.(count)
  }
  const toggleComments = () => setShowComments((prev) => !prev)

  const {
    liked,
    likeCount,
    saved,
    shareCount,
    loading,
    handleLike,
    handleSave,
    handleShare,
  } = usePostActions({
    postId: post.id,
    userId,
    initialPost: {
      likedByCurrentUser: post.liked,
      savedByCurrentUser: post.saved,
      likes: post.likes,
      shares: post.shares,
      content: post.content,
    },
  })

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted">
            {isAvatarImageUrl(post.authorAvatar) ? (
              <Image
                src={resolvePostImageUrl(post.authorAvatar)}
                alt={post.author}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="gradient-primary flex h-full w-full items-center justify-center text-xs font-bold text-white">
                {post.authorAvatar}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{post.author}</p>
              {post.sport && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
                  {post.sport}
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">{post.time}</p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-full p-1.5 transition-colors hover:bg-muted"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-sm leading-relaxed text-foreground">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative overflow-hidden">
          <Image
            src={post.image}
            alt="Post"
            width={600}
            height={320}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <PostActionBar
        likeCount={likeCount}
        liked={liked}
        commentCount={commentCount}
        shareCount={shareCount}
        saved={saved}
        loading={loading}
        onLike={handleLike}
        onComment={toggleComments}
        onShare={handleShare}
        onSave={handleSave}
        readOnly={!userId}
        commentsExpanded={showComments}
      />

      {/* Inline comments: show/hide when Comment is clicked */}
      {showComments && (
        <PostCommentsInline
          postId={post.id}
          commentCount={commentCount}
          onCountChange={handleCountChange}
          currentUser={currentUser ?? null}
          initialLoad={initialShowComments ?? false}
        />
      )}
    </div>
  )
}
