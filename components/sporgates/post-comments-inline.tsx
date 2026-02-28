"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useComments } from "@/hooks/use-comments"
import type { Comment as CommentType, CreateCommentPayload } from "@/lib/types/post"
import { formatFeedTime, resolvePostImageUrl, isAvatarImageUrl } from "@/lib/utils"
import { Send, Loader2, Heart, MessageCircle, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"

export interface PostCommentsInlineProps {
  postId: string
  commentCount: number
  onCountChange?: (count: number) => void
  currentUser: { id: string; authorName: string; authorAvatar: string } | null
  /** When true, load comments on mount (e.g. when opened from a comment notification). */
  initialLoad?: boolean
}

/**
 * Inline comments under a post: input, list with like/reply, nested replies.
 */
export function PostCommentsInline({
  postId,
  commentCount,
  onCountChange,
  currentUser,
  initialLoad = false,
}: PostCommentsInlineProps) {
  const {
    comments,
    totalElements,
    loading,
    adding,
    error,
    hasMore,
    likingId,
    loadFirst,
    loadMore,
    addComment,
    likeComment,
  } = useComments({
    postId,
    currentUserId: currentUser?.id ?? null,
    initialCount: commentCount,
    onCountChange,
  })

  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())
  const [commentsLoaded, setCommentsLoaded] = useState(initialLoad)
  /** When false, only first 5 comments are shown; "Show more" expands to show all loaded without fetching. */
  const [showAllLoaded, setShowAllLoaded] = useState(false)

  useEffect(() => {
    if (initialLoad && postId) {
      setCommentsLoaded(true)
      loadFirst()
    }
  }, [initialLoad, postId, loadFirst])

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev)
      if (next.has(commentId)) next.delete(commentId)
      else next.add(commentId)
      return next
    })
  }

  const handleShowComments = () => {
    setCommentsLoaded(true)
    loadFirst()
  }

  const handleSubmit = async (text: string, parentCommentId?: string | null) => {
    if (!currentUser?.id || !text.trim()) return
    const payload: CreateCommentPayload = {
      text: text.trim(),
      parentCommentId: parentCommentId ?? undefined,
    }
    await addComment(payload)
    setReplyingToId(null)
    if (parentCommentId) setExpandedReplies((prev) => new Set(prev).add(parentCommentId))
    if (!commentsLoaded) {
      setCommentsLoaded(true)
      loadFirst()
    }
  }

  const showList = commentsLoaded

  return (
    <div className="border-t border-border bg-muted/30 px-3 sm:px-4 pt-3 pb-5">
      {currentUser && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const input = e.currentTarget.querySelector<HTMLInputElement>('input[name="comment"]')
            const text = input?.value?.trim()
            if (text) {
              await handleSubmit(text)
              input!.value = ""
            }
          }}
          className="flex gap-2 mb-3"
        >
          <input
            name="comment"
            type="text"
            placeholder="Write a comment..."
            className="flex-1 min-h-[44px] rounded-full border border-border bg-background px-4 py-2.5 sm:py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            disabled={adding}
            maxLength={500}
          />
          <Button
            type="submit"
            size="icon"
            variant="secondary"
            className="shrink-0 rounded-full h-11 w-11 min-h-[44px] min-w-[44px] sm:h-9 sm:w-9 sm:min-h-0 sm:min-w-0 touch-manipulation"
            disabled={adding}
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      )}

      {!showList ? (
        <div className="space-y-2">
          {commentCount === 0 ? (
            <p className="text-xs text-muted-foreground py-1">No comments yet.</p>
          ) : (
            <button
              type="button"
              onClick={handleShowComments}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 rounded py-1 -ml-1"
            >
              <ChevronDown className="h-3.5 w-3.5" />
              {commentCount === 1 ? "1 comment" : `${commentCount} comments`}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {loading && comments.length === 0 ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-xs text-destructive">{error.message}</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-muted-foreground py-1">No comments yet.</p>
          ) : (
            <>
              {(showAllLoaded ? comments : comments.slice(0, 5)).map((c) => (
                <CommentRow
                  key={c.id}
                  comment={c}
                  currentUser={currentUser}
                  replyingToId={replyingToId}
                  setReplyingToId={setReplyingToId}
                  onReplySubmit={handleSubmit}
                  onLike={likeComment}
                  likingId={likingId}
                  adding={adding}
                  nestLevel={0}
                  expandedReplies={expandedReplies}
                  onToggleReplies={toggleReplies}
                />
              ))}
              {!showAllLoaded && comments.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllLoaded(true)}
                  className="min-h-[44px] py-2 text-xs text-muted-foreground -ml-2 touch-manipulation sm:min-h-0 sm:py-0 sm:h-7"
                >
                  Show more comments ({comments.length - 5})
                </Button>
              )}
              {showAllLoaded && hasMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadMore}
                  disabled={loading}
                  className="min-h-[44px] py-2 text-xs text-muted-foreground -ml-2 touch-manipulation sm:min-h-0 sm:py-0 sm:h-7"
                >
                  {loading ? "Loading..." : totalElements > comments.length ? `Show more comments (${totalElements - comments.length})` : "Show more comments"}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function countReplies(c: CommentType): number {
  const direct = c.replies?.length ?? 0
  return direct + (c.replies?.reduce((sum, r) => sum + countReplies(r), 0) ?? 0)
}

interface CommentRowProps {
  comment: CommentType
  currentUser: PostCommentsInlineProps["currentUser"]
  replyingToId: string | null
  setReplyingToId: (id: string | null) => void
  onReplySubmit: (text: string, parentCommentId: string | null) => Promise<void>
  onLike: (commentId: string) => void
  likingId: string | null
  adding: boolean
  nestLevel: number
  expandedReplies: Set<string>
  onToggleReplies: (commentId: string) => void
}

function CommentRow({
  comment,
  currentUser,
  replyingToId,
  setReplyingToId,
  onReplySubmit,
  onLike,
  likingId,
  adding,
  nestLevel,
  expandedReplies,
  onToggleReplies,
}: CommentRowProps) {
  const isReply = nestLevel > 0
  const showReplyInput = replyingToId === comment.id
  const replyCount = comment.replies?.length ?? 0
  const totalReplyCount = countReplies(comment)
  const isRepliesExpanded = expandedReplies.has(comment.id)

  return (
    <div className={isReply ? "ml-6 border-l-2 border-border/50 pl-2" : ""}>
      <div className="flex gap-2 items-start">
        <div className="relative h-7 w-7 shrink-0 rounded-full overflow-hidden mt-0.5 bg-muted">
          {isAvatarImageUrl(comment.authorAvatar) ? (
            <Image
              src={resolvePostImageUrl(comment.authorAvatar)}
              alt={comment.authorName ?? "User"}
              fill
              className="object-cover"
              sizes="28px"
            />
          ) : (
            <div className="gradient-primary flex h-full w-full items-center justify-center text-[10px] font-bold text-white">
              {comment.authorAvatar ?? "?"}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-foreground">
            <span className="font-semibold">{comment.authorName ?? "User"}</span>{" "}
            <span className="text-muted-foreground">{comment.text}</span>
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[10px] text-muted-foreground">
              {formatFeedTime(comment.createdAt)}
            </span>
            {currentUser && (
              <>
                <button
                  type="button"
                  onClick={() => onLike(comment.id)}
                  disabled={likingId === comment.id}
                  className={`text-[10px] flex items-center gap-0.5 rounded hover:bg-muted px-2 py-2 sm:px-1 sm:py-0.5 touch-manipulation -my-1 sm:my-0 ${comment.likedByCurrentUser ? "text-red-500" : "text-muted-foreground"
                    }`}
                >
                  {likingId === comment.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Heart
                      className={`h-3 w-3 ${comment.likedByCurrentUser ? "fill-current" : ""}`}
                    />
                  )}
                  {comment.likes ? comment.likes : ""}
                </button>
                <button
                  type="button"
                  onClick={() => setReplyingToId(showReplyInput ? null : comment.id)}
                  className="text-[10px] text-muted-foreground hover:bg-muted rounded px-2 py-2 sm:px-1 sm:py-0.5 flex items-center gap-0.5 touch-manipulation -my-1 sm:my-0"
                >
                  <MessageCircle className="h-3 w-3" /> Reply
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showReplyInput && currentUser && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const input = e.currentTarget.querySelector<HTMLInputElement>('input[name="reply"]')
            const text = input?.value?.trim()
            if (text) {
              await onReplySubmit(text, comment.id)
              input!.value = ""
            }
          }}
          className="flex gap-2 mt-2 ml-9"
        >
          <input
            name="reply"
            type="text"
            placeholder={`Reply to ${comment.authorName ?? "User"}...`}
            className="flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
            disabled={adding}
            maxLength={500}
            autoFocus
          />
          <Button type="submit" size="sm" variant="ghost" className="h-7 text-xs" disabled={adding}>
            {adding ? <Loader2 className="h-3 w-3 animate-spin" /> : "Reply"}
          </Button>
        </form>
      )}

      {replyCount > 0 ? (
        <div className="mt-2 ml-9">
          {!isRepliesExpanded ? (
            <button
              type="button"
              onClick={() => onToggleReplies(comment.id)}
              className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 rounded px-1 py-0.5 -ml-1"
            >
              <ChevronDown className="h-3.5 w-3.5" />
              {totalReplyCount === 1 ? "1 reply" : `${totalReplyCount} replies`}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onToggleReplies(comment.id)}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 rounded px-1 py-0.5 -ml-1 mb-1"
              >
                <ChevronUp className="h-3.5 w-3.5" />
                Hide replies
              </button>
              <div className="space-y-2">
                {comment.replies!.map((r) => (
                  <CommentRow
                    key={r.id}
                    comment={r}
                    currentUser={currentUser}
                    replyingToId={replyingToId}
                    setReplyingToId={setReplyingToId}
                    onReplySubmit={onReplySubmit}
                    onLike={onLike}
                    likingId={likingId}
                    adding={adding}
                    nestLevel={nestLevel + 1}
                    expandedReplies={expandedReplies}
                    onToggleReplies={onToggleReplies}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
