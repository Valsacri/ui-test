"use client"

import React, { createContext, useCallback, useContext, useState } from "react"
import { PostPopupModal } from "@/components/sporgates/post-popup-modal"

interface PostModalState {
  postId: string | null
  openComments: boolean
}

interface PostModalContextValue {
  openPost: (postId: string, openComments?: boolean) => void
  closePost: () => void
}

const PostModalContext = createContext<PostModalContextValue | null>(null)

export function PostModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PostModalState>({
    postId: null,
    openComments: false,
  })

  const openPost = useCallback((postId: string, openComments = false) => {
    setState({ postId, openComments })
  }, [])

  const closePost = useCallback(() => {
    setState((prev) => ({ ...prev, postId: null }))
  }, [])

  return (
    <PostModalContext.Provider value={{ openPost, closePost }}>
      {children}
      <PostPopupModal
        postId={state.postId}
        open={!!state.postId}
        onOpenChange={(open) => !open && closePost()}
        openComments={state.openComments}
      />
    </PostModalContext.Provider>
  )
}

export function usePostModal(): PostModalContextValue {
  const ctx = useContext(PostModalContext)
  if (!ctx) {
    throw new Error("usePostModal must be used within PostModalProvider")
  }
  return ctx
}
