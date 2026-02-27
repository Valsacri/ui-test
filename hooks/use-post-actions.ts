"use client"

import { useCallback, useState } from 'react'
import { postsService } from '@/lib/services/posts'
import type { Post } from '@/lib/types/post'

export interface UsePostActionsOptions {
  postId: string
  userId: string | undefined
  initialPost: Partial<Post>
  onUpdate?: (updated: Partial<Post>) => void
  onError?: (action: string, error: Error) => void
}

/**
 * Encapsulates like, share, and save actions with optimistic updates and rollback on error.
 * CTO-level: single responsibility, clear error handling, minimal re-renders.
 */
export function usePostActions({
  postId,
  userId,
  initialPost,
  onUpdate,
  onError,
}: UsePostActionsOptions) {
  const [liked, setLiked] = useState(!!initialPost.likedByCurrentUser)
  const [likeCount, setLikeCount] = useState(initialPost.likes ?? 0)
  const [saved, setSaved] = useState(!!initialPost.savedByCurrentUser)
  const [shareCount, setShareCount] = useState(initialPost.shares ?? 0)
  const [loading, setLoading] = useState<{ like?: boolean; save?: boolean; share?: boolean }>({})

  const handleLike = useCallback(async () => {
    if (!userId) return
    const prevLiked = liked
    const prevCount = likeCount
    setLiked((l) => !l)
    setLikeCount((c) => (liked ? c - 1 : c + 1))
    setLoading((l) => ({ ...l, like: true }))
    try {
      const updated = await postsService.toggleLike(postId, userId)
      onUpdate?.({ likedByCurrentUser: updated.likedByCurrentUser, likes: updated.likes })
      setLiked(!!updated.likedByCurrentUser)
      setLikeCount(updated.likes ?? 0)
    } catch (err) {
      setLiked(prevLiked)
      setLikeCount(prevCount)
      onError?.('like', err instanceof Error ? err : new Error('Like failed'))
    } finally {
      setLoading((l) => ({ ...l, like: false }))
    }
  }, [postId, userId, liked, likeCount, onUpdate, onError])

  const handleSave = useCallback(async () => {
    if (!userId) return
    const prevSaved = saved
    setSaved((s) => !s)
    setLoading((l) => ({ ...l, save: true }))
    try {
      if (saved) {
        await postsService.unsave(userId, postId)
        onUpdate?.({ savedByCurrentUser: false })
      } else {
        await postsService.save(userId, postId)
        onUpdate?.({ savedByCurrentUser: true })
      }
    } catch (err) {
      setSaved(prevSaved)
      onError?.('save', err instanceof Error ? err : new Error('Save failed'))
    } finally {
      setLoading((l) => ({ ...l, save: false }))
    }
  }, [postId, userId, saved, onUpdate, onError])

  const handleShare = useCallback(async () => {
    if (!userId) return
    const prevShareCount = shareCount
    setShareCount((c) => c + 1)
    setLoading((l) => ({ ...l, share: true }))
    try {
      const updated = await postsService.recordShare(postId, userId)
      onUpdate?.({ shares: updated.shares })
      setShareCount(updated.shares ?? prevShareCount + 1)
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'Post from Sporgates',
          text: initialPost.content?.slice(0, 100) ?? '',
          url: window.location.href,
        })
      } else {
        await navigator.clipboard?.writeText(window.location.href)
      }
    } catch (err) {
      setShareCount(prevShareCount)
      onError?.('share', err instanceof Error ? err : new Error('Share failed'))
    } finally {
      setLoading((l) => ({ ...l, share: false }))
    }
  }, [postId, userId, shareCount, initialPost.content, onUpdate, onError])

  return {
    liked,
    likeCount,
    saved,
    shareCount,
    loading,
    handleLike,
    handleSave,
    handleShare,
  }
}
