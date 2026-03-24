'use client'

import { useEffect, useRef } from 'react'
import { subscribeToNotificationStream } from '@/lib/services/notifications'

/**
 * Subscribe to the notification SSE stream for the current user.
 * Uses a ref for the callback so the effect only depends on userId — avoids tearing down
 * and reconnecting the stream when the parent passes a new function identity each render.
 */
export function useNotificationStream(
    userId: string | null | undefined,
    onNotification: () => void
): void {
    const onNotificationRef = useRef(onNotification)
    onNotificationRef.current = onNotification

    useEffect(() => {
        if (!userId) return
        const { disconnect } = subscribeToNotificationStream(userId, () => {
            onNotificationRef.current()
        })
        return disconnect
    }, [userId])
}
