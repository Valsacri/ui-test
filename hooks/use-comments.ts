"use client"

import { useCallback, useState } from 'react'
import { commentsService } from '@/lib/services/comments'
import type { Comment, CreateCommentPayload } from '@/lib/types/post'

const PAGE_SIZE = 20

function countReplies(c: Comment): number {
  const r = c.replies?.length ?? 0
  return r + (c.replies?.reduce((sum, x) => sum + countReplies(x), 0) ?? 0)
}

function addReplyInTree(list: Comment[], parentId: string, newComment: Comment): Comment[] {
  return list.map((c) => {
    if (c.id === parentId) {
      return { ...c, replies: [...(c.replies ?? []), newComment] }
    }
    if (c.replies?.length) {
      return { ...c, replies: addReplyInTree(c.replies, parentId, newComment) }
    }
    return c
  })
}

function updateCommentInTree(list: Comment[], commentId: string, updater: (c: Comment) => Comment): Comment[] {
  return list.map((c) => {
    if (c.id === commentId) return updater(c)
    if (c.replies?.length) return { ...c, replies: updateCommentInTree(c.replies, commentId, updater) }
    return c
  })
}

function removeCommentFromTree(list: Comment[], commentId: string): Comment[] {
  const filtered = list.filter((c) => c.id !== commentId)
  return filtered.map((c) =>
    c.replies?.length ? { ...c, replies: removeCommentFromTree(c.replies, commentId) } : c
  )
}

export interface UseCommentsOptions {
  postId: string
  currentUserId?: string | null
  initialCount?: number
  onCountChange?: (count: number) => void
}

/**
 * Manages comment tree (top-level + replies), add, reply, like, delete.
 */
export function useComments({
  postId,
  currentUserId,
  initialCount = 0,
  onCountChange,
}: UseCommentsOptions) {
  const [comments, setComments] = useState<Comment[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [likingId, setLikingId] = useState<string | null>(null)

  const loadPage = useCallback(
    async (pageNum: number) => {
      setLoading(true)
      setError(null)
      try {
        const res = await commentsService.getByPostId(postId, pageNum, PAGE_SIZE, currentUserId ?? undefined)
        if (pageNum === 0) {
          setComments(res.content ?? [])
        } else {
          setComments((prev) => [...prev, ...(res.content ?? [])])
        }
        setTotalElements(res.totalElements ?? 0)
        setPage(pageNum)
        onCountChange?.(res.totalElements ?? 0)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load comments'))
      } finally {
        setLoading(false)
      }
    },
    [postId, currentUserId, onCountChange]
  )

  const loadFirst = useCallback(() => loadPage(0), [loadPage])

  const loadMore = useCallback(() => loadPage(page + 1), [loadPage, page])

  const addComment = useCallback(
    async (payload: CreateCommentPayload) => {
      setAdding(true)
      setError(null)
      try {
        const created = await commentsService.add(postId, payload)
        const parentId = payload.parentCommentId ?? null
        setComments((prev) => {
          if (parentId) {
            return addReplyInTree(prev, parentId, { ...created, replies: [] })
          }
          return [{ ...created, replies: [] }, ...prev]
        })
        setTotalElements((c) => c + 1)
        onCountChange?.(totalElements + 1)
        return created
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add comment'))
        throw err
      } finally {
        setAdding(false)
      }
    },
    [postId, totalElements, onCountChange]
  )

  const likeComment = useCallback(
    async (commentId: string) => {
      if (!currentUserId) return
      setLikingId(commentId)
      try {
        const updated = await commentsService.toggleLike(postId, commentId, currentUserId)
        setComments((prev) =>
          updateCommentInTree(prev, commentId, (c) => ({
            ...c,
            likes: updated.likes ?? 0,
            likedByCurrentUser: updated.likedByCurrentUser ?? false,
          }))
        )
      } catch {
        // keep previous state
      } finally {
        setLikingId(null)
      }
    },
    [postId, currentUserId]
  )

  const deleteComment = useCallback(
    async (commentId: string) => {
      const comment = comments.find((c) => c.id === commentId) ?? findInTree(comments, commentId)
      const replyCount = comment ? countReplies(comment) : 0
      try {
        await commentsService.delete(postId, commentId)
        setComments((prev) => removeCommentFromTree(prev, commentId))
        setTotalElements((c) => Math.max(0, c - 1 - replyCount))
        onCountChange?.(totalElements - 1 - replyCount)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete comment'))
        throw err
      }
    },
    [postId, comments, totalElements, onCountChange]
  )

  const hasMore = totalElements > comments.length

  return {
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
    deleteComment,
  }
}

function findInTree(list: Comment[], id: string): Comment | undefined {
  for (const c of list) {
    if (c.id === id) return c
    const inReplies = c.replies ? findInTree(c.replies, id) : undefined
    if (inReplies) return inReplies
  }
  return undefined
}
