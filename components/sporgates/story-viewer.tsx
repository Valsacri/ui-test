"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import {
    X, ChevronLeft, ChevronRight, Pause, Play,
    MoreVertical, Heart, Send, Eye, Trash2, Users
} from "lucide-react"
import { cn, resolvePostImageUrl } from "@/lib/utils"
import type { StoryDto } from "@/lib/types/story"
import { storiesService } from "@/lib/services/stories"

interface StoryViewerProps {
    /** All stories for the currently viewed user */
    stories: StoryDto[]
    /** Index of the initial story to show */
    initialIndex?: number
    /** Current user's ID for ownership checks */
    currentUserId?: string
    /** Called when viewer should close */
    onClose: () => void
    /** Called when a story is viewed */
    onView?: (storyId: string) => void
    /** Called when like is toggled; should return updated story */
    onToggleLike?: (storyId: string) => Promise<StoryDto>
    /** Called when a reply is sent */
    onReply?: (storyId: string, content: string) => Promise<void>
    /** Called when a story is deleted */
    onDelete?: (storyId: string) => Promise<void>
    /** Called when we reach the end and want to go to next user's stories */
    onNextUser?: () => void
    /** Called when we reach the beginning and want to go to previous user's stories */
    onPrevUser?: () => void
}

/** Photo display time (Instagram uses 7s); video stories use actual video duration */
const IMAGE_STORY_DURATION_MS = 7000

/** Format seconds as M:SS for video time display */
function formatStoryTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
}

export function StoryViewer({
    stories,
    initialIndex = 0,
    currentUserId,
    onClose,
    onView,
    onToggleLike,
    onReply,
    onDelete,
    onNextUser,
    onPrevUser,
}: StoryViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [isPaused, setIsPaused] = useState(false)
    const [progress, setProgress] = useState(0)
    const [showMenu, setShowMenu] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [isSendingReply, setIsSendingReply] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [localStories, setLocalStories] = useState<StoryDto[]>(stories)
    const [showViewersPanel, setShowViewersPanel] = useState(false)
    const [viewers, setViewers] = useState<{ id: string; name: string; avatar: string | null }[]>([])
    const [likers, setLikers] = useState<{ id: string; name: string; avatar: string | null }[]>([])
    const [loadingViewers, setLoadingViewers] = useState(false)
    /** Current playback time in seconds for video stories (for time display) */
    const [videoCurrentTimeSec, setVideoCurrentTimeSec] = useState(0)

    const progressRef = useRef(0)
    const menuRef = useRef<HTMLDivElement>(null)
    const goNextRef = useRef<() => void>(() => { })
    const isPausedRef = useRef(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Keep isPausedRef in sync with state and pause/play video
    useEffect(() => {
        isPausedRef.current = isPaused
        if (videoRef.current) {
            if (isPaused) {
                videoRef.current.pause()
            } else {
                videoRef.current.play().catch(() => { })
            }
        }
    }, [isPaused])

    const currentStory = localStories[currentIndex]
    const isOwner = currentUserId && currentStory?.authorId === currentUserId
    const isVideo = currentStory?.mediaType === "VIDEO"
    /** Backend-provided duration for video stories; used for progress and time display */
    const videoDurationSec = currentStory?.durationSeconds ?? null

    // ─── Navigation ──────────────────────────────────────────────────
    const goNext = useCallback(() => {
        if (currentIndex < localStories.length - 1) {
            setCurrentIndex((i) => i + 1)
        } else {
            // End of this user's stories
            if (onNextUser) {
                onNextUser()
            } else {
                onClose()
            }
        }
    }, [currentIndex, localStories.length, onNextUser, onClose])

    const goPrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((i) => i - 1)
        } else {
            if (onPrevUser) {
                onPrevUser()
            }
        }
    }, [currentIndex, onPrevUser])

    // Keep ref in sync so animation always calls the latest goNext
    useEffect(() => {
        goNextRef.current = goNext
    }, [goNext])

    // ─── Record view on story change ─────────────────────────────────
    useEffect(() => {
        if (currentStory && onView) {
            onView(currentStory.id)
        }
    }, [currentStory?.id]) // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Progress animation: dual strategy for IMAGE vs VIDEO ────────
    useEffect(() => {
        progressRef.current = 0
        setProgress(0)
        setVideoCurrentTimeSec(0)

        const storyIsVideo = localStories[currentIndex]?.mediaType === 'VIDEO'

        if (storyIsVideo) {
            // VIDEO: progress and advance are driven only by the actual <video> element.
            // We advance to the next story only on video 'ended', so the story never
            // cuts off before the video finishes. Progress bar uses video.currentTime / video.duration
            // (or durationSeconds from API as fallback when duration not yet loaded).
            let rafId: number

            const tick = () => {
                const v = videoRef.current
                if (!v) {
                    rafId = requestAnimationFrame(tick)
                    return
                }
                if (v.ended) {
                    setProgress(100)
                    progressRef.current = 100
                    setTimeout(() => goNextRef.current(), 0)
                    return
                }
                const duration = v.duration > 0 ? v.duration : (videoDurationSec ?? 0)
                if (duration > 0) {
                    const pct = Math.min(100, (v.currentTime / duration) * 100)
                    progressRef.current = pct
                    setProgress(pct)
                    setVideoCurrentTimeSec(v.currentTime)
                }
                rafId = requestAnimationFrame(tick)
            }

            const handleEnded = () => {
                cancelAnimationFrame(rafId)
                setProgress(100)
                progressRef.current = 100
                setTimeout(() => goNextRef.current(), 0)
            }

            const videoEl = videoRef.current
            rafId = requestAnimationFrame(tick)
            videoEl?.addEventListener("ended", handleEnded)

            return () => {
                cancelAnimationFrame(rafId)
                videoEl?.removeEventListener("ended", handleEnded)
            }
        } else {
            // IMAGE strategy: unchanged interval-based timer
            const TICK_MS = 50
            const INCREMENT = (TICK_MS / IMAGE_STORY_DURATION_MS) * 100

            const intervalId = setInterval(() => {
                if (isPausedRef.current) return

                progressRef.current += INCREMENT

                if (progressRef.current >= 100) {
                    progressRef.current = 100
                    setProgress(100)
                    clearInterval(intervalId)
                    // Use setTimeout to avoid state update during render
                    setTimeout(() => goNextRef.current(), 0)
                    return
                }

                setProgress(progressRef.current)
            }, TICK_MS)

            return () => {
                clearInterval(intervalId)
            }
        }
    }, [currentIndex]) // Only restart when story changes

    // ─── Keyboard nav ────────────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowRight") goNext()
            if (e.key === "ArrowLeft") goPrev()
            if (e.key === " ") {
                e.preventDefault()
                setIsPaused((p) => !p)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onClose, goNext, goPrev])

    // ─── Close menu on outside click ─────────────────────────────────
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false)
            }
        }
        if (showMenu) {
            document.addEventListener("mousedown", handleClick)
            return () => document.removeEventListener("mousedown", handleClick)
        }
    }, [showMenu])

    // ─── Like toggle ─────────────────────────────────────────────────
    const handleLike = async () => {
        if (!onToggleLike || !currentStory) return
        try {
            const updated = await onToggleLike(currentStory.id)
            setLocalStories((prev) =>
                prev.map((s) => (s.id === updated.id ? updated : s))
            )
        } catch {
            // Silently fail
        }
    }

    // ─── Reply ───────────────────────────────────────────────────────
    const handleReply = async () => {
        if (!onReply || !currentStory || !replyText.trim()) return
        try {
            setIsSendingReply(true)
            await onReply(currentStory.id, replyText.trim())
            setReplyText("")
        } catch {
            // Could show toast
        } finally {
            setIsSendingReply(false)
        }
    }

    // ─── Delete ──────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!onDelete || !currentStory) return
        try {
            await onDelete(currentStory.id)
            setShowDeleteConfirm(false)
            setShowMenu(false)
            // If last story, close viewer; otherwise advance
            if (localStories.length <= 1) {
                onClose()
            } else {
                const newStories = localStories.filter((s) => s.id !== currentStory.id)
                setLocalStories(newStories)
                setCurrentIndex((prev) => Math.min(prev, newStories.length - 1))
            }
        } catch {
            // Could show toast
        }
    }

    // ─── Time ago ────────────────────────────────────────────────────
    const timeAgo = (dateInput: string | number[] | unknown) => {
        let date: Date
        if (Array.isArray(dateInput)) {
            // Java LocalDateTime serialized as array: [year, month, day, hour, minute, second, ...]
            const [y, m, d, h = 0, min = 0, s = 0] = dateInput as number[]
            date = new Date(y, m - 1, d, h, min, s)
        } else if (typeof dateInput === "string") {
            date = new Date(dateInput)
        } else {
            return ""
        }
        if (isNaN(date.getTime())) return ""
        const diff = Date.now() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 1) return "Just now"
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        return `${Math.floor(hours / 24)}d ago`
    }

    if (!currentStory) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
            {/* Left arrow */}
            <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-all hover:bg-white/20 sm:left-4 sm:p-3"
                aria-label="Previous story"
            >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Right arrow */}
            <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-all hover:bg-white/20 sm:right-4 sm:p-3"
                aria-label="Next story"
            >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Story container */}
            <div className="relative h-[85vh] w-full max-w-[420px] overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
                {/* ── Progress bars ───────────────────────────────────────── */}
                <div className="absolute left-3 right-3 top-3 z-20 flex gap-1">
                    {localStories.map((s, i) => (
                        <div
                            key={s.id}
                            className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30"
                        >
                            <div
                                className="h-full rounded-full bg-white transition-[width] duration-100 ease-linear"
                                style={{
                                    width:
                                        i < currentIndex
                                            ? "100%"
                                            : i === currentIndex
                                                ? `${progress}%`
                                                : "0%",
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="absolute left-0 right-0 top-7 z-20 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                            {currentStory.authorAvatar ? (
                                <Image
                                    src={currentStory.authorAvatar}
                                    alt=""
                                    width={36}
                                    height={36}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-[10px] font-bold text-white">
                                    {currentStory.authorName?.charAt(0) || "?"}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                {currentStory.authorName}
                            </p>
                            <p className="text-[10px] text-white/70">
                                {currentStory.createdAt
                                    ? timeAgo(currentStory.createdAt)
                                    : ""}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Pause/Play */}
                        <button
                            type="button"
                            onClick={() => setIsPaused((p) => !p)}
                            className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
                            aria-label={isPaused ? "Resume story" : "Pause story"}
                        >
                            {isPaused ? (
                                <Play className="h-5 w-5" />
                            ) : (
                                <Pause className="h-5 w-5" />
                            )}
                        </button>

                        {/* Three-dot menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setShowMenu((v) => !v)}
                                className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
                                aria-label="Story options"
                            >
                                <MoreVertical className="h-5 w-5" />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-10 z-30 min-w-[160px] overflow-hidden rounded-xl border border-white/10 bg-gray-900/95 shadow-2xl backdrop-blur-xl">
                                    {isOwner && (
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-white/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete story
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowMenu(false)}
                                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white/70 transition-colors hover:bg-white/10"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Close */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
                            aria-label="Close story viewer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* ── Media ──────────────────────────────────────────────── */}
                {isVideo ? (
                    <video
                        ref={videoRef}
                        key={currentStory.id}
                        src={resolvePostImageUrl(currentStory.mediaUrl)}
                        className="h-full w-full object-cover"
                        autoPlay
                        playsInline
                        style={{ pointerEvents: "none" }}
                    />
                ) : (
                    <Image
                        key={currentStory.id}
                        src={resolvePostImageUrl(currentStory.mediaUrl)}
                        alt={currentStory.authorName || "Story"}
                        fill
                        className="object-cover"
                        priority
                    />
                )}

                {/* ── Bottom left: View count (owner only, clickable) ────── */}
                {isOwner && (
                    <button
                        type="button"
                        onClick={async () => {
                            setShowViewersPanel(true)
                            setIsPaused(true)
                            setLoadingViewers(true)
                            try {
                                const [v, l] = await Promise.all([
                                    storiesService.getViewers(currentStory.id),
                                    storiesService.getLikers(currentStory.id),
                                ])
                                setViewers(v)
                                setLikers(l)
                            } catch (e) {
                                console.error('Failed to load viewers/likers', e)
                            } finally {
                                setLoadingViewers(false)
                            }
                        }}
                        className="absolute bottom-20 left-4 z-20 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60"
                    >
                        <Eye className="h-4 w-4" />
                        <span className="text-xs font-medium">
                            {currentStory.viewCount ?? 0}{" "}
                            {currentStory.viewCount === 1 ? "view" : "views"}
                        </span>
                    </button>
                )}

                {/* ── Bottom bar: Reply + Like ────────────────────────────── */}
                <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-8">
                    {/* Reply input */}
                    <div className="flex flex-1 items-center overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                        <input
                            type="text"
                            placeholder={`Reply to ${currentStory.authorName}…`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onFocus={() => setIsPaused(true)}
                            onBlur={() => {
                                if (!replyText.trim()) setIsPaused(false)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleReply()
                            }}
                            className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-white/50 outline-none"
                            disabled={isSendingReply}
                        />
                        {replyText.trim() && (
                            <button
                                type="button"
                                onClick={handleReply}
                                disabled={isSendingReply}
                                className="mr-2 rounded-full bg-blue-500 p-1.5 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                                aria-label="Send reply"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Like button */}
                    <button
                        type="button"
                        onClick={handleLike}
                        className="rounded-full p-2 transition-colors hover:bg-white/20"
                        aria-label={
                            currentStory.likedByCurrentUser ? "Unlike story" : "Like story"
                        }
                    >
                        <Heart
                            className={cn(
                                "h-6 w-6 transition-all",
                                currentStory.likedByCurrentUser
                                    ? "fill-red-500 text-red-500 scale-110"
                                    : "text-white"
                            )}
                        />
                    </button>
                </div>

                {/* Dark gradient overlays for text readability */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/60 to-transparent" />

                {/* ── Viewers / Likers Panel ──────────────────────────────── */}
                {showViewersPanel && (
                    <div className="absolute inset-0 z-30 flex flex-col">
                        {/* Backdrop */}
                        <div
                            className="flex-1"
                            onClick={() => {
                                setShowViewersPanel(false)
                                setIsPaused(false)
                            }}
                        />
                        {/* Panel */}
                        <div className="max-h-[60%] rounded-t-2xl bg-gray-900/95 backdrop-blur-xl">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-white/70" />
                                    <span className="text-sm font-medium text-white">
                                        {viewers.length} {viewers.length === 1 ? 'viewer' : 'viewers'}
                                    </span>
                                    {likers.length > 0 && (
                                        <>
                                            <span className="text-white/30">·</span>
                                            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                                            <span className="text-sm font-medium text-white">
                                                {likers.length} {likers.length === 1 ? 'like' : 'likes'}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowViewersPanel(false)
                                        setIsPaused(false)
                                    }}
                                    className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            {/* Combined list */}
                            <div className="overflow-y-auto" style={{ maxHeight: 'calc(60vh - 56px)' }}>
                                {loadingViewers ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                                    </div>
                                ) : (() => {
                                    const likerIds = new Set(likers.map((l) => l.id))
                                    const nonLikerViewers = viewers.filter((v) => !likerIds.has(v.id))
                                    const combined = [
                                        ...likers.map((u) => ({ ...u, liked: true })),
                                        ...nonLikerViewers.map((u) => ({ ...u, liked: false })),
                                    ]
                                    if (combined.length === 0) {
                                        return (
                                            <div className="py-8 text-center text-sm text-white/40">
                                                No viewers yet
                                            </div>
                                        )
                                    }
                                    return combined.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                                                {user.avatar ? (
                                                    <Image
                                                        src={resolvePostImageUrl(user.avatar)}
                                                        alt=""
                                                        width={36}
                                                        height={36}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    user.name?.charAt(0) || '?'
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-white">
                                                {user.name}
                                            </span>
                                            {user.liked && (
                                                <Heart className="ml-auto h-4 w-4 fill-red-500 text-red-500" />
                                            )}
                                        </div>
                                    ))
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Delete confirmation modal ──────────────────────────────── */}
            {
                showDeleteConfirm && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70">
                        <div className="mx-4 w-full max-w-[320px] overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
                            <div className="p-6 text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                                    <Trash2 className="h-6 w-6 text-red-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">
                                    Delete Story?
                                </h3>
                                <p className="mt-2 text-sm text-white/60">
                                    This will permanently remove your story. This action cannot be
                                    undone.
                                </p>
                            </div>
                            <div className="flex border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex-1 border-l border-white/10 px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
