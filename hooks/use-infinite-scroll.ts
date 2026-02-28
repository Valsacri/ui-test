"use client"

import { useEffect, useRef, useCallback } from 'react'

/**
 * IntersectionObserver-based infinite scroll hook.
 * Returns a ref to attach to a sentinel element at the bottom of the list.
 * When the sentinel enters the viewport, `onLoadMore` is called.
 */
export function useInfiniteScroll(
    onLoadMore: () => void,
    { enabled = true, rootMargin = '300px' }: { enabled?: boolean; rootMargin?: string } = {}
) {
    const sentinelRef = useRef<HTMLDivElement>(null)
    const callbackRef = useRef(onLoadMore)
    callbackRef.current = onLoadMore

    const observe = useCallback(() => {
        const el = sentinelRef.current
        if (!el || !enabled) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    callbackRef.current()
                }
            },
            { rootMargin }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [enabled, rootMargin])

    useEffect(() => {
        return observe()
    }, [observe])

    return sentinelRef
}
