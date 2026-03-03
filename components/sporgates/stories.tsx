"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { Plus, Loader2 } from "lucide-react"
import { cn, resolvePostImageUrl } from "@/lib/utils"
import { useStories } from "@/hooks/use-stories"
import { StoryViewer } from "@/components/sporgates/story-viewer"
import { AddStoryDialog } from "@/components/sporgates/add-story-dialog"
import { StoryFeedSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { authService } from "@/lib/services/auth"
import { userService } from "@/lib/services/user"
import type { StoryFeedItem, StoryDto } from "@/lib/types/story"

export function Stories() {
  const {
    feedItems,
    isLoading,
    refresh,
    loadUserStories,
    createStory,
    deleteStory,
    removeFeedStory,
    toggleLike,
    recordView,
    sendReply,
  } = useStories()

  const [viewerState, setViewerState] = useState<{
    stories: StoryDto[]
    userId: string
    userIndex: number
  } | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const currentUser = authService.getCurrentUser()
  const currentUserId = currentUser?.id
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null)

  // Fetch user profile to get profile picture (not stored in auth token)
  useEffect(() => {
    if (currentUserId) {
      userService.getUserById(currentUserId).then((profile: any) => {
        if (profile?.profilePicture) {
          setCurrentUserAvatar(resolvePostImageUrl(profile.profilePicture))
        }
      }).catch(() => { })
    }
  }, [currentUserId])

  // ─── Open viewer for a specific user ─────────────────────────────
  const openViewer = useCallback(
    async (feedItem: StoryFeedItem, index: number) => {
      try {
        const stories = await loadUserStories(feedItem.userId)
        if (stories.length > 0) {
          setViewerState({
            stories,
            userId: feedItem.userId,
            userIndex: index,
          })
        }
      } catch {
        // Could show toast
      }
    },
    [loadUserStories]
  )

  // ─── Navigate between users in viewer ────────────────────────────
  const goToNextUser = useCallback(async () => {
    if (!viewerState) return
    // Find next non-own user
    const nonOwnItems = feedItems.filter((f) => f.userId !== currentUserId)
    const currentNonOwnIndex = nonOwnItems.findIndex(
      (f) => f.userId === viewerState.userId
    )
    if (currentNonOwnIndex < nonOwnItems.length - 1) {
      const nextItem = nonOwnItems[currentNonOwnIndex + 1]
      try {
        const stories = await loadUserStories(nextItem.userId)
        if (stories.length > 0) {
          setViewerState({
            stories,
            userId: nextItem.userId,
            userIndex: feedItems.indexOf(nextItem),
          })
        } else {
          setViewerState(null)
        }
      } catch {
        setViewerState(null)
      }
    } else {
      setViewerState(null)
    }
  }, [viewerState, feedItems, currentUserId, loadUserStories])

  const goToPrevUser = useCallback(async () => {
    if (!viewerState) return
    const nonOwnItems = feedItems.filter((f) => f.userId !== currentUserId)
    const currentNonOwnIndex = nonOwnItems.findIndex(
      (f) => f.userId === viewerState.userId
    )
    if (currentNonOwnIndex > 0) {
      const prevItem = nonOwnItems[currentNonOwnIndex - 1]
      try {
        const stories = await loadUserStories(prevItem.userId)
        if (stories.length > 0) {
          setViewerState({
            stories,
            userId: prevItem.userId,
            userIndex: feedItems.indexOf(prevItem),
          })
        }
      } catch {
        // stay on current
      }
    }
  }, [viewerState, feedItems, currentUserId, loadUserStories])

  // ─── Handle card click ───────────────────────────────────────────
  const handleCardClick = (feedItem: StoryFeedItem, index: number) => {
    if (feedItem.userId === currentUserId) {
      // Own story: if they have stories, show viewer; else show add dialog
      if (feedItem.storyCount > 0) {
        openViewer(feedItem, index)
      } else {
        setShowAddDialog(true)
      }
    } else {
      openViewer(feedItem, index)
    }
  }

  // ─── Build display list ──────────────────────────────────────────
  // Always show "Add story" card first for current user
  const hasOwnStories = currentUserId && feedItems.some((f) => f.userId === currentUserId)
  const ownFeedItem = feedItems.find((f) => f.userId === currentUserId)
  const otherItems = feedItems.filter((f) => f.userId !== currentUserId)

  if (isLoading) {
    return <StoryFeedSkeleton count={6} />
  }

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {/* ── Fixed "Add Story" card ── Always opens create dialog */}
        <button
          type="button"
          onClick={() => setShowAddDialog(true)}
          className="relative flex h-[160px] w-[100px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-transform active:scale-[0.98]"
        >
          {/* User photo as background (top portion) */}
          <div className="relative h-[110px] w-full overflow-hidden">
            {currentUserAvatar ? (
              <Image
                src={currentUserAvatar}
                alt=""
                fill
                className="object-cover"
                sizes="100px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-2xl font-bold text-white">
                  {currentUser?.firstName?.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>

          {/* Blue plus circle at boundary */}
          <div className="absolute left-1/2 top-[90px] z-10 -translate-x-1/2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-card bg-[#003C66] text-white shadow-md">
              <Plus className="h-4 w-4 stroke-[3]" />
            </div>
          </div>

          {/* Bottom label area */}
          <div className="flex flex-1 items-end justify-center pb-2 pt-5">
            <span className="text-[10px] font-semibold text-foreground">
              Add Story
            </span>
          </div>
        </button>

        {/* ── User's own stories card ── Only shown when they have stories */}
        {hasOwnStories && ownFeedItem && (
          <button
            type="button"
            onClick={() => openViewer(ownFeedItem, 0)}
            className="relative flex h-[160px] w-[100px] shrink-0 flex-col overflow-hidden rounded-xl transition-transform active:scale-[0.98]"
          >
            {/\.(mp4|webm|mov)$/i.test(ownFeedItem.latestStoryImageUrl) ? (
              <video
                src={`${resolvePostImageUrl(ownFeedItem.latestStoryImageUrl)}#t=0.1`}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                preload="auto"
              />
            ) : (
              <Image
                src={resolvePostImageUrl(ownFeedItem.latestStoryImageUrl)}
                alt=""
                fill
                className="object-cover"
                sizes="100px"
              />
            )}
            <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-500 bg-background/60 p-[2.5px] shadow-[0_0_0_1px_rgba(59,130,246,0.5)]">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white">
                  {currentUserAvatar ? (
                    <Image
                      src={currentUserAvatar}
                      alt=""
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    currentUser?.firstName?.charAt(0) || "?"
                  )}
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 flex h-12 items-center justify-center">
              <span className="truncate px-2 text-center text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Your Story
              </span>
            </div>
          </button>
        )}

        {/* ── Other users' story cards ── */}
        {otherItems.map((item, i) => (
          <button
            type="button"
            key={item.userId}
            onClick={() => handleCardClick(item, i + 1)}
            className="relative flex h-[160px] w-[100px] shrink-0 flex-col overflow-hidden rounded-xl transition-transform active:scale-[0.98]"
          >
            {/\.(mp4|webm|mov)$/i.test(item.latestStoryImageUrl) ? (
              <video
                src={`${resolvePostImageUrl(item.latestStoryImageUrl)}#t=0.1`}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                preload="auto"
              />
            ) : (
              <Image
                src={resolvePostImageUrl(item.latestStoryImageUrl)}
                alt=""
                fill
                className="object-cover"
                sizes="100px"
              />
            )}
            <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full p-[2.5px]",
                  item.allViewed
                    ? "border-2 border-white/60 bg-background/60"
                    : "border-2 border-blue-500 bg-background/60 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]"
                )}
              >
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white">
                  {item.userAvatar ? (
                    <Image
                      src={resolvePostImageUrl(item.userAvatar)}
                      alt=""
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    item.userName?.charAt(0) || "?"
                  )}
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 flex h-12 items-center justify-center">
              <span className="truncate px-2 text-center text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {item.userName}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Story Viewer */}
      {viewerState && (
        <StoryViewer
          stories={viewerState.stories}
          currentUserId={currentUserId}
          onClose={() => {
            setViewerState(null)
            refresh({ silent: true })
          }}
          onView={recordView}
          onToggleLike={toggleLike}
          onReply={sendReply}
          onDelete={async (storyId) => {
            await deleteStory(storyId)
            // Instantly update the stories strip
            removeFeedStory(viewerState.userId)
          }}
          onNextUser={goToNextUser}
          onPrevUser={goToPrevUser}
        />
      )}

      {/* Add Story Dialog */}
      <AddStoryDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onCreateStory={createStory}
      />
    </>
  )
}
