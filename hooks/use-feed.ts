"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { feedService } from '@/lib/services/feed'
import { postsService } from '@/lib/services/posts'
import { authService } from '@/lib/services'
import type { FeedPage } from '@/lib/services/feed'
import type { FeedItem } from '@/lib/services/feed'
import type { CreatePostPayload } from '@/lib/types/post'

export type FeedTab = 'foryou' | 'following'

export interface UseFeedOptions {
    /** Initial page size */
    pageSize?: number
}

export interface UseFeedReturn {
    /** Feed items mapped to PostCardData for the UI */
    items: FeedItem[]
    /** Whether the initial load is in progress */
    isLoading: boolean
    /** Whether more items are being loaded */
    isLoadingMore: boolean
    /** Current feed tab */
    tab: FeedTab
    /** Whether there are more pages to load */
    hasMore: boolean
    /** Error from most recent load attempt */
    error: Error | null
    /** Switch feed tab */
    setTab: (tab: FeedTab) => void
    /** Load next page (for infinite scroll) */
    loadMore: () => Promise<void>
    /** Refresh the feed from scratch */
    refresh: () => Promise<void>
    /** Create a post (optimistic insert, rollback on error) */
    createPost: (payload: CreatePostPayload) => Promise<void>
    /** Delete a post (optimistic removal, rollback on error) */
    deletePost: (postId: string) => Promise<void>
}

/**
 * Centralized feed state hook. Manages For You / Following tabs,
 * pagination, post creation with optimistic updates, and post deletion.
 */
export function useFeed({ pageSize = 20 }: UseFeedOptions = {}): UseFeedReturn {
    const [tab, setTabState] = useState<FeedTab>('foryou')
    const [items, setItems] = useState<FeedItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const pageRef = useRef(0)

    const fetchPage = useCallback(async (page: number, currentTab: FeedTab, append: boolean) => {
        try {
            let feedPage: FeedPage
            if (currentTab === 'following') {
                feedPage = await feedService.getFollowingFeed(page, pageSize)
            } else {
                feedPage = await feedService.getForYouFeed(page, pageSize)
            }

            setItems(prev => append ? [...prev, ...feedPage.content] : feedPage.content)
            setHasMore(!feedPage.last)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load feed'))
        }
    }, [pageSize])

    const refresh = useCallback(async () => {
        setIsLoading(true)
        pageRef.current = 0
        await fetchPage(0, tab, false)
        setIsLoading(false)
    }, [tab, fetchPage])

    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore) return
        setIsLoadingMore(true)
        pageRef.current += 1
        await fetchPage(pageRef.current, tab, true)
        setIsLoadingMore(false)
    }, [isLoadingMore, hasMore, tab, fetchPage])

    const setTab = useCallback((newTab: FeedTab) => {
        if (newTab === tab) return
        setTabState(newTab)
        setItems([])
        setIsLoading(true)
        pageRef.current = 0
        fetchPage(0, newTab, false).then(() => setIsLoading(false))
    }, [tab, fetchPage])

    /**
     * Optimistic post creation:
     * 1. Build a placeholder FeedItem and prepend immediately
     * 2. Call the API in background
     * 3. On success, swap placeholder with real data
     * 4. On error, rollback (remove the optimistic item)
     */
    const createPost = useCallback(async (payload: CreatePostPayload) => {
        const currentUser = authService.getCurrentUser()
        const name = currentUser
            ? [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ') || currentUser.username || 'User'
            : 'User'
        const avatar = currentUser?.profilePicture || currentUser?.firstName?.[0] || '?'
        const tempId = `__optimistic_${Date.now()}`

        // Optimistic item
        const optimisticItem: FeedItem = {
            id: tempId,
            type: 'POST',
            summary: payload.content,
            authorName: name,
            authorAvatar: avatar,
            image: payload.image,
            likes: 0,
            comments: 0,
            shares: 0,
            sport: payload.sport,
            createdAt: new Date().toISOString(),
            likedByCurrentUser: false,
            savedByCurrentUser: false,
        }

        // 1. Prepend immediately
        setItems(prev => [optimisticItem, ...prev])

        try {
            // 2. Call API
            const created = await postsService.create(payload)

            // 3. Replace optimistic item with real data
            const realItem: FeedItem = {
                id: created.id,
                type: 'POST',
                summary: created.content,
                authorName: created.authorName ?? name,
                authorAvatar: created.authorAvatar ?? avatar,
                image: created.image,
                likes: created.likes ?? 0,
                comments: created.comments ?? 0,
                shares: created.shares ?? 0,
                sport: created.sport,
                createdAt: created.createdAt,
                likedByCurrentUser: false,
                savedByCurrentUser: false,
            }
            setItems(prev => prev.map(item => item.id === tempId ? realItem : item))
        } catch {
            // 4. Rollback: remove optimistic item
            setItems(prev => prev.filter(item => item.id !== tempId))
            throw new Error('Failed to create post')
        }
    }, [])

    /**
     * Optimistic post deletion:
     * 1. Remove immediately from UI
     * 2. Call API in background
     * 3. On error, restore the item at its original position
     */
    const deletePost = useCallback(async (postId: string) => {
        // Snapshot for rollback
        const snapshot = items
        const itemIndex = items.findIndex(item => item.id === postId)

        // 1. Remove optimistically
        setItems(prev => prev.filter(item => item.id !== postId))

        try {
            // 2. Call API
            await postsService.delete(postId)
        } catch {
            // 3. Rollback to snapshot
            setItems(snapshot)
            throw new Error('Failed to delete post')
        }
    }, [items])

    // Initial load
    useEffect(() => {
        refresh()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return {
        items,
        isLoading,
        isLoadingMore,
        tab,
        hasMore,
        error,
        setTab,
        loadMore,
        refresh,
        createPost,
        deletePost,
    }
}
