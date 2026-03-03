"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { StoryViewer } from "@/components/sporgates/story-viewer"
import { useStories } from "@/hooks/use-stories"
import { authService } from "@/lib/services/auth"
import type { StoryDto } from "@/lib/types/story"

interface StoryPopupModalProps {
  userId: string | null
  storyId: string | null
  open: boolean
  onClose: () => void
}

/**
 * Modal that shows a single user's story viewer (e.g. when opening from a "liked your story" notification).
 * Loads the user's stories and opens at the given storyId.
 */
export function StoryPopupModal({ userId, storyId, open, onClose }: StoryPopupModalProps) {
  const { loadUserStories, recordView, toggleLike, sendReply, deleteStory } = useStories()
  const currentUser = authService.getCurrentUser()
  const [stories, setStories] = useState<StoryDto[]>([])
  const [initialIndex, setInitialIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!open || !userId || !storyId) {
      setStories([])
      setInitialIndex(0)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(false)
    loadUserStories(userId)
      .then((list) => {
        if (cancelled) return
        const index = list.findIndex((s) => s.id === storyId)
        setStories(list)
        setInitialIndex(index >= 0 ? index : 0)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, userId, storyId, loadUserStories])

  if (!open) return null
  if (loading || error || stories.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
        <div className="text-white">
          {loading && "Loading story…"}
          {error && "Could not load story."}
          {!loading && !error && stories.length === 0 && "No story found."}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    <StoryViewer
      stories={stories}
      initialIndex={initialIndex}
      currentUserId={currentUser?.id}
      onClose={onClose}
      onView={recordView}
      onToggleLike={toggleLike}
      onReply={sendReply}
      onDelete={async (id) => {
        await deleteStory(id)
        if (stories.length <= 1) onClose()
      }}
      onNextUser={onClose}
      onPrevUser={onClose}
    />
  )
}
