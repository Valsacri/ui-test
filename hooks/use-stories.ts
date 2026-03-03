"use client"

import { useCallback, useEffect, useState } from 'react'
import { storiesService } from '@/lib/services/stories'
import type { StoryDto, StoryFeedItem } from '@/lib/types/story'

export interface UseStoriesReturn {
    /** Feed items: one per user with active stories */
    feedItems: StoryFeedItem[]
    /** Whether the feed is loading */
    isLoading: boolean
    /** Error from most recent load */
    error: Error | null
    /** Refresh the stories feed. Pass { silent: true } to refetch without showing the loading skeleton. */
    refresh: (opts?: { silent?: boolean }) => Promise<void>
    /** Load stories for a specific user */
    loadUserStories: (userId: string) => Promise<StoryDto[]>
    /** Create a story (upload file then create) */
    createStory: (file: File) => Promise<void>
    /** Delete a story */
    deleteStory: (storyId: string) => Promise<void>
    /** Optimistically remove a story from a user's feed item */
    removeFeedStory: (userId: string) => void
    /** Toggle like on a story */
    toggleLike: (storyId: string) => Promise<StoryDto>
    /** Record a view for a story */
    recordView: (storyId: string) => Promise<void>
    /** Send a reply to a story */
    sendReply: (storyId: string, content: string) => Promise<void>
}

/**
 * Hook for managing stories state and actions.
 * Handles feed loading, story CRUD, likes, views, and replies.
 */
export function useStories(): UseStoriesReturn {
    const [feedItems, setFeedItems] = useState<StoryFeedItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const refresh = useCallback(async (opts?: { silent?: boolean }) => {
        const silent = opts?.silent === true
        try {
            if (!silent) {
                setIsLoading(true)
                setError(null)
            }
            const items = await storiesService.getFeed()
            setFeedItems(items)
        } catch (err) {
            if (!silent) setError(err instanceof Error ? err : new Error('Failed to load stories'))
        } finally {
            if (!silent) setIsLoading(false)
        }
    }, [])

    const loadUserStories = useCallback(async (userId: string): Promise<StoryDto[]> => {
        return storiesService.getStoriesByUser(userId)
    }, [])

    const createStory = useCallback(async (file: File) => {
        const mediaType = file.type.startsWith('video/') ? ('VIDEO' as const) : ('IMAGE' as const)

        const result = await storiesService.uploadMedia(file)
        if (!result.url) {
            throw new Error('Upload did not return URL')
        }

        await storiesService.create({
            mediaUrl: result.url,
            mediaType,
            durationSeconds: result.durationSeconds,
        })
        await refresh({ silent: true })
    }, [refresh])

    const deleteStory = useCallback(async (storyId: string) => {
        await storiesService.deleteStory(storyId)
    }, [])

    const removeFeedStory = useCallback((userId: string) => {
        setFeedItems((prev) =>
            prev
                .map((item) =>
                    item.userId === userId
                        ? { ...item, storyCount: item.storyCount - 1 }
                        : item
                )
                .filter((item) => item.storyCount > 0)
        )
    }, [])

    const toggleLike = useCallback(async (storyId: string): Promise<StoryDto> => {
        return storiesService.toggleLike(storyId)
    }, [])

    const recordView = useCallback(async (storyId: string) => {
        try {
            await storiesService.recordView(storyId)
        } catch {
            // View recording is best-effort; don't surface errors to user
        }
    }, [])

    const sendReply = useCallback(async (storyId: string, content: string) => {
        await storiesService.createReply(storyId, content)
    }, [])

    // Initial load
    useEffect(() => {
        refresh()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return {
        feedItems,
        isLoading,
        error,
        refresh,
        loadUserStories,
        createStory,
        deleteStory,
        removeFeedStory,
        toggleLike,
        recordView,
        sendReply,
    }
}
