"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { MoreHorizontal, Globe, Users, Lock, Link2, EyeOff, Flag, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { cn, resolvePostImageUrl, isAvatarImageUrl } from "@/lib/utils"
import { PostActionBar } from "@/components/sporgates/post-action-bar"
import { PostCommentsInline } from "@/components/sporgates/post-comments-inline"
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
import { usePostActions } from "@/hooks/use-post-actions"
import type { PostCardData, PostVisibility } from "@/lib/types/post"
import { toast } from "sonner"

const VISIBILITY_ICON: Record<PostVisibility, { icon: typeof Globe; label: string }> = {
  PUBLIC: { icon: Globe, label: 'Public' },
  FOLLOWERS_ONLY: { icon: Users, label: 'Followers only' },
  PRIVATE: { icon: Lock, label: 'Private' },
}

export interface PostCardProps {
  post: PostCardData
  userId?: string
  /** For inline comment form; when absent, comments section is hidden. */
  currentUser?: { id: string; authorName: string; authorAvatar: string } | null
  onCountChange?: (count: number) => void
  /** When true, comments section is expanded by default. */
  initialShowComments?: boolean
  /** Whether this is one of the first visible posts (enables priority image loading). */
  priority?: boolean
  className?: string
  /** When true, show Delete in the options menu. Call onDelete when user confirms. */
  canDelete?: boolean
  onDelete?: (postId: string) => void | Promise<void>
}

/**
 * Single post in the feed. Memoized to avoid re-renders when sibling state changes.
 */
export const PostCard = React.memo(function PostCard({
  post,
  userId,
  currentUser,
  onCountChange,
  initialShowComments,
  priority = false,
  className,
  canDelete = false,
  onDelete,
}: PostCardProps) {
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
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] text-muted-foreground">{post.time}</p>
              {post.visibility && post.visibility !== 'PUBLIC' && (() => {
                const vis = VISIBILITY_ICON[post.visibility]
                return (
                  <span title={vis.label} className="text-muted-foreground">
                    <vis.icon className="h-3 w-3" />
                  </span>
                )
              })()}
            </div>
          </div>
        </div>
        <PostOptionsMenu postId={post.id} canDelete={canDelete} onDelete={onDelete} />
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-[15px] leading-relaxed text-foreground">{post.content}</p>
      </div>

      {/* Images */}
      <PostImages
        images={post.images}
        fallbackImage={post.image}
        priority={priority}
      />

      {/* Actions — stop propagation so parent "open post" click doesn't fire */}
      <div onClick={(e) => e.stopPropagation()}>
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
      </div>

      {/* Inline comments — stop propagation so parent "open post" click doesn't fire */}
      <div onClick={(e) => e.stopPropagation()}>
      <CommentsCollapsible show={showComments}>
        <PostCommentsInline
          postId={post.id}
          commentCount={commentCount}
          onCountChange={handleCountChange}
          currentUser={currentUser ?? null}
          initialLoad={initialShowComments ?? false}
        />
      </CommentsCollapsible>
      </div>
    </div>
  )
})

/** Renders post images: carousel when multiple, single full-width when one. */
function PostImages({ images, fallbackImage, priority }: { images?: string[]; fallbackImage?: string; priority?: boolean }) {
  const allImages = (images && images.length > 0) ? images : (fallbackImage ? [fallbackImage] : [])
  const [current, setCurrent] = useState(0)

  if (allImages.length === 0) return null

  if (allImages.length === 1) {
    return (
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={allImages[0]}
          alt="Post"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
          priority={priority}
        />
      </div>
    )
  }

  return (
    <div className="relative group overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {allImages.map((img, i) => (
          <div key={i} className="relative aspect-video w-full shrink-0">
            <Image
              src={img}
              alt={`Post image ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
              priority={priority && i === 0}
            />
          </div>
        ))}
      </div>
      {/* Left / Right arrows */}
      {current > 0 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setCurrent(c => c - 1) }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      {current < allImages.length - 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setCurrent(c => c + 1) }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
      {/* Counter badge */}
      <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
        {current + 1}/{allImages.length}
      </span>
      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
        {allImages.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
            )}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/** Post options dropdown (delete when allowed, copy link, hide, report). */
function PostOptionsMenu({
  postId,
  canDelete = false,
  onDelete,
}: {
  postId: string
  canDelete?: boolean
  onDelete?: (postId: string) => void | Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleConfirmDelete = async () => {
    if (!onDelete) return
    try {
      await onDelete(postId)
      setConfirmDeleteOpen(false)
      toast.success('Post deleted')
    } catch {
      toast.error('Failed to delete post')
    }
  }

  const deleteAction =
    canDelete && onDelete
      ? {
          label: 'Delete post',
          icon: Trash2,
          danger: true,
          onClick: () => {
            setOpen(false)
            setConfirmDeleteOpen(true)
          },
        }
      : null

  const actions = [
    {
      label: 'Copy link',
      icon: Link2,
      onClick: () => {
        navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)
        toast.success('Link copied')
      },
    },
    {
      label: 'Hide post',
      icon: EyeOff,
      onClick: () => toast.info('Post hidden from your feed'),
    },
    ...(deleteAction ? [deleteAction] : []),
    {
      label: 'Report',
      icon: Flag,
      danger: true,
      onClick: () => toast.info('Thanks for reporting. We\u2019ll review this post.'),
    },
  ]

  return (
    <>
      <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full p-1.5 transition-colors hover:bg-muted"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
        {open && (
          <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-border bg-card py-1 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => { a.onClick(); setOpen(false) }}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors hover:bg-muted',
                  (a as { danger?: boolean }).danger ? 'text-destructive' : 'text-foreground'
                )}
              >
                <a.icon className="h-3.5 w-3.5" />
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleConfirmDelete() }}
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

/** Smooth height transition wrapper. Recalculates height when content changes (e.g. when comments finish loading). */
function CommentsCollapsible({ show, children }: { show: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  const updateHeight = useCallback(() => {
    if (ref.current) setHeight(ref.current.scrollHeight)
  }, [])

  useEffect(() => {
    if (!show) {
      setHeight(0)
      return
    }
    updateHeight()
  }, [show, updateHeight])

  useEffect(() => {
    if (!show || !ref.current) return
    const el = ref.current
    const observer = new ResizeObserver(() => updateHeight())
    observer.observe(el)
    return () => observer.disconnect()
  }, [show, updateHeight])

  return (
    <div
      className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      style={{ maxHeight: show ? height || 'none' : 0 }}
    >
      <div ref={ref}>
        {children}
      </div>
    </div>
  )
}
