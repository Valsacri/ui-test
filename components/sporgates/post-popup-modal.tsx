"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import useSWR from "swr"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreHorizontal, X, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { getPath } from "@/lib/route-map"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PostActionBar } from "@/components/sporgates/post-action-bar"
import { PostCommentsInline } from "@/components/sporgates/post-comments-inline"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { postsService, authService } from "@/lib/services"
import { useBusinessContext } from "@/lib/business-context"
import { formatFeedTime, resolvePostImageUrl, isAvatarImageUrl } from "@/lib/utils"
import { usePostActions } from "@/hooks/use-post-actions"
import { mutate as swrMutate } from "swr"

export interface PostPopupModalProps {
  postId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When true, comments are expanded and loaded by default (e.g. from a comment notification). */
  openComments?: boolean
}

/**
 * Split layout: left = media (image/carousel), right = post details + comments (Facebook post view style).
 * Text-only posts use a single column (details + comments only).
 */
export function PostPopupModal({ postId, open, onOpenChange, openComments }: PostPopupModalProps) {
  const currentUser = authService.getCurrentUser()
  const userId = currentUser?.id
  const { activeBusinessId } = useBusinessContext()
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
    open && postId && userId ? ["post-popup-modal", postId] : null,
    async () => postsService.getById(postId!, userId)
  )

  const images = useMemo(() => {
    if (!post) return []
    const raw = post.images && post.images.length > 0
      ? post.images
      : post.image
        ? [post.image]
        : []
    return raw.map((src: string) => resolvePostImageUrl(src) || src).filter(Boolean)
  }, [post])

  const [commentCount, setCommentCount] = useState(0)
  const [mediaIndex, setMediaIndex] = useState(0)

  useEffect(() => {
    if (postId) setMediaIndex(0)
  }, [postId])

  const {
    liked,
    likeCount,
    saved,
    shareCount,
    loading: actionLoading,
    handleLike,
    handleSave,
    handleShare,
  } = usePostActions({
    postId: postId ?? "",
    userId,
    initialPost: post
      ? {
          likedByCurrentUser: post.likedByCurrentUser,
          savedByCurrentUser: post.savedByCurrentUser,
          likes: post.likes,
          shares: post.shares,
          content: post.content,
        }
      : {},
  })

  useEffect(() => {
    if (post?.comments != null) setCommentCount(post.comments)
  }, [post?.id, post?.comments])

  const content = () => {
    if (!postId) return null
    if (isLoading) {
      return (
        <div className="flex flex-col md:flex-row h-full md:max-h-[85vh] max-h-[100dvh] w-full bg-card rounded-none md:rounded-2xl overflow-hidden">
          <div className="flex-shrink-0 w-full md:w-[65%] aspect-[4/5] max-h-[45vh] md:max-h-[85vh] md:aspect-auto md:h-[85vh] bg-muted rounded-none md:rounded-l-2xl">
            <Skeleton className="h-full w-full rounded-none md:rounded-l-2xl" />
          </div>
          <div className="flex flex-1 flex-col min-w-0 p-4 border-t md:border-t-0 md:border-l border-border">
            <div className="flex items-center gap-3 shrink-0">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="mt-4 flex gap-4">
              <Skeleton className="h-9 w-16 rounded-full" />
              <Skeleton className="h-9 w-16 rounded-full" />
              <Skeleton className="h-9 w-16 rounded-full" />
            </div>
          </div>
        </div>
      )
    }
    if (error || !post) {
      return (
        <div className="flex min-h-[280px] items-center justify-center p-8">
          <ErrorState
            message="Post not found or failed to load"
            onRetry={() => mutate()}
          />
        </div>
      )
    }

    const authorName = post.authorName ?? (post as { author?: string }).author ?? "User"
    const authorAvatar = post.authorAvatar ?? "?"
    const timeStr = formatFeedTime(post.createdAt)
    const hasMedia = images.length > 0
    const isBusinessPost = post.authorType === "BUSINESS" || !!post.businessId
    const authorProfileId = post.businessId ?? post.authorId
    const authorProfileHref = authorProfileId
      ? getPath(isBusinessPost ? "business-detail" : "person-detail", authorProfileId)
      : null
    const canDeleteModal =
      !!userId &&
      ((post.authorType === "USER" && post.authorId === userId) ||
        (post.authorType === "BUSINESS" && !!post.businessId && post.businessId === activeBusinessId))

    const rightPanel = (
      <div className={`flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden bg-card border-t border-border rounded-none md:rounded-r-2xl ${hasMedia ? "md:border-t-0 md:border-l md:rounded-l-none" : "md:rounded-2xl"} pb-4 md:pb-0`}>
        {/* Post header */}
        <div className="flex items-start gap-3 p-3 sm:p-4 shrink-0">
          {authorProfileHref ? (
            <Link
              href={authorProfileHref}
              onClick={() => onOpenChange(false)}
              className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted ring-offset-2 ring-offset-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={isBusinessPost ? `View ${authorName} business` : `View ${authorName}'s profile`}
            >
              {isAvatarImageUrl(authorAvatar) ? (
                <Image
                  src={resolvePostImageUrl(authorAvatar)}
                  alt={authorName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="gradient-primary flex h-full w-full items-center justify-center text-xs font-bold text-white">
                  {String(authorAvatar).slice(0, 2).toUpperCase() || "?"}
                </div>
              )}
            </Link>
          ) : (
            <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted">
              {isAvatarImageUrl(authorAvatar) ? (
                <Image
                  src={resolvePostImageUrl(authorAvatar)}
                  alt={authorName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="gradient-primary flex h-full w-full items-center justify-center text-xs font-bold text-white">
                  {String(authorAvatar).slice(0, 2).toUpperCase() || "?"}
                </div>
              )}
            </div>
          )}
          {authorProfileHref ? (
            <Link
              href={authorProfileHref}
              onClick={() => onOpenChange(false)}
              className="min-w-0 flex-1 min-h-[2.5rem] flex flex-col justify-center ring-offset-2 ring-offset-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              aria-label={isBusinessPost ? `View ${authorName} business` : `View ${authorName}'s profile`}
            >
              <p className="text-sm font-semibold text-foreground">{authorName}</p>
              <p className="text-[11px] text-muted-foreground">{timeStr}</p>
            </Link>
          ) : (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{authorName}</p>
              <p className="text-[11px] text-muted-foreground">{timeStr}</p>
            </div>
          )}
          <div className="flex items-center gap-0.5 shrink-0">
            <PostModalOptionsMenu
              postId={post.id}
              canDelete={canDeleteModal}
              onDelete={async () => {
                await postsService.delete(post.id)
                onOpenChange(false)
                toast.success("Post deleted")
                if (userId) swrMutate(`/posts/user/${userId}`)
                if (post.businessId) swrMutate(`/posts/business/${post.businessId}`)
              }}
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Post text */}
        {post.content && (
          <div className="px-3 sm:px-4 pb-3 shrink-0">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}

        {/* Action bar — touch-friendly on mobile */}
        <div className="shrink-0 [&_button]:min-h-[44px] [&_button]:touch-manipulation md:[&_button]:min-h-0">
          <PostActionBar
            likeCount={likeCount}
            liked={liked}
            commentCount={(commentCount || post.comments) ?? 0}
            shareCount={shareCount}
            saved={saved}
            loading={actionLoading}
            onLike={handleLike}
            onComment={() => {}}
            onShare={handleShare}
            onSave={handleSave}
            readOnly={!userId}
            commentsExpanded
            className="border-t border-border"
          />
        </div>

        {/* Comments — scrollable; min height on mobile so section is usable */}
        <div className="flex-1 min-h-[200px] md:min-h-0 overflow-y-auto overflow-x-hidden">
          <PostCommentsInline
            postId={post.id}
            commentCount={(commentCount || post.comments) ?? 0}
            onCountChange={setCommentCount}
            currentUser={currentUserForComment}
            initialLoad={true}
          />
        </div>
      </div>
    )

    return (
      <div className="flex flex-col md:flex-row h-full md:max-h-[85vh] max-h-[100dvh] overflow-hidden w-full bg-card rounded-none md:rounded-2xl shadow-lg">
        {/* Left: Media — only when post has images */}
        {hasMedia && (
          <div className="relative flex-shrink-0 w-full md:w-[65%] md:min-w-0 aspect-[4/5] max-h-[45vh] md:max-h-[85vh] md:aspect-auto md:h-[85vh] overflow-hidden bg-black/95 rounded-none md:rounded-l-2xl md:rounded-tr-none">
            {images.length === 1 ? (
              <div className="absolute inset-0">
                <Image
                  src={images[0]}
                  alt="Post"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 65vw"
                />
              </div>
            ) : (
              <div className="absolute inset-0 group">
                <div
                  className="flex h-full transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${mediaIndex * 100}%)` }}
                >
                  {images.map((src, i) => (
                    <div key={i} className="relative w-full h-full shrink-0">
                      <Image
                        src={src}
                        alt={`Post image ${i + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 65vw"
                      />
                    </div>
                  ))}
                </div>
                {mediaIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setMediaIndex((i) => i - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-manipulation"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                {mediaIndex < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setMediaIndex((i) => i + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-manipulation"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
                <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                  {mediaIndex + 1}/{images.length}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Right: Post details + comments */}
        {rightPanel}
      </div>
    )
  }

  return (
    <Dialog open={open && !!postId} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-4xl overflow-hidden border-0 p-0 shadow-2xl bg-transparent max-h-[100dvh] h-[100dvh] md:h-auto md:max-h-[85vh] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Post</DialogTitle>
        {content()}
      </DialogContent>
    </Dialog>
  )
}

function PostModalOptionsMenu({
  postId,
  canDelete,
  onDelete,
}: {
  postId: string
  canDelete: boolean
  onDelete: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const handleConfirmDelete = async () => {
    await onDelete()
    setConfirmDeleteOpen(false)
  }

  return (
    <>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {open && (
          <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-border bg-card py-1 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
            {canDelete && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setConfirmDeleteOpen(true)
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-muted"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete post
              </button>
            )}
          </div>
        )}
      </div>
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleConfirmDelete()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
