"use client"

import React, { createContext, useCallback, useContext, useState } from "react"
import { StoryPopupModal } from "@/components/sporgates/story-popup-modal"

interface StoryModalState {
  userId: string | null
  storyId: string | null
}

interface StoryModalContextValue {
  openStory: (userId: string, storyId: string) => void
  closeStory: () => void
}

const StoryModalContext = createContext<StoryModalContextValue | null>(null)

export function StoryModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoryModalState>({
    userId: null,
    storyId: null,
  })

  const openStory = useCallback((userId: string, storyId: string) => {
    setState({ userId, storyId })
  }, [])

  const closeStory = useCallback(() => {
    setState({ userId: null, storyId: null })
  }, [])

  return (
    <StoryModalContext.Provider value={{ openStory, closeStory }}>
      {children}
      <StoryPopupModal
        userId={state.userId}
        storyId={state.storyId}
        open={!!state.userId && !!state.storyId}
        onClose={closeStory}
      />
    </StoryModalContext.Provider>
  )
}

export function useStoryModal(): StoryModalContextValue {
  const ctx = useContext(StoryModalContext)
  if (!ctx) {
    throw new Error("useStoryModal must be used within StoryModalProvider")
  }
  return ctx
}
