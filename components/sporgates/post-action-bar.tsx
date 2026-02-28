"use client"

import React from "react"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PostActionBarProps {
  likeCount: number
  liked: boolean
  commentCount: number
  shareCount: number
  saved: boolean
  loading?: { like?: boolean; save?: boolean; share?: boolean }
  onLike: () => void
  onComment: () => void
  onShare: () => void
  onSave: () => void
  readOnly?: boolean
  /** When true, Comment button shows as active (section is open). */
  commentsExpanded?: boolean
  className?: string
}

/**
 * Reusable action bar for a post: Like, Comment, Share, Save.
 * Memoized + micro-animations on like/save.
 */
export const PostActionBar = React.memo(function PostActionBar({
  likeCount,
  liked,
  commentCount,
  shareCount,
  saved,
  loading = {},
  onLike,
  onComment,
  onShare,
  onSave,
  readOnly = false,
  commentsExpanded = false,
  className,
}: PostActionBarProps) {
  const btnClass = "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50"

  return (
    <div className={cn("flex flex-col gap-1 border-t border-border px-2 py-1", className)}>
      <div className="flex gap-3 text-[11px] text-muted-foreground">
        {likeCount > 0 && <span>{likeCount} likes</span>}
        {commentCount > 0 && <span>{commentCount} comments</span>}
        {shareCount > 0 && <span>{shareCount} shares</span>}
      </div>
      <div className="flex items-center gap-1">
        {!readOnly && (
          <button
            type="button"
            onClick={onLike}
            disabled={loading.like}
            className={cn(
              btnClass,
              liked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                liked && "fill-red-500 scale-110",
                !liked && "hover:scale-110"
              )}
            />
            Like
          </button>
        )}
        <button
          type="button"
          onClick={readOnly ? undefined : onComment}
          className={cn(
            btnClass,
            commentsExpanded ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={commentsExpanded ? "Hide comments" : "Comment"}
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </button>
        {!readOnly && (
          <button
            type="button"
            onClick={onShare}
            disabled={loading.share}
            className={cn(btnClass, "text-muted-foreground hover:text-foreground")}
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        )}
        {!readOnly && (
          <button
            type="button"
            onClick={onSave}
            disabled={loading.save}
            className={cn(
              btnClass,
              saved ? "text-secondary" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Bookmark
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                saved && "fill-secondary scale-110",
                !saved && "hover:scale-110"
              )}
            />
            Save
          </button>
        )}
      </div>
    </div>
  )
})
