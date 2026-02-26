"use client"

import { useEffect } from 'react'
import { subscribeToNotificationStream } from '@/lib/services/notifications'

/**
 * Subscribe to the notification SSE stream for the current user.
 * When a real-time notification arrives, onNotification is called (e.g. to refetch unread count).
 */
export function useNotificationStream(
    userId: string | null | undefined,
    onNotification: () => void
): void {
    useEffect(() => {
        if (!userId) return
        const { disconnect } = subscribeToNotificationStream(userId, onNotification)
        return disconnect
    }, [userId, onNotification])
}
