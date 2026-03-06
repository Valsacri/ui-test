"use client"

import React, { createContext, useCallback, useContext } from "react"
import { useRouter } from "next/navigation"

interface PostModalContextValue {
  openPost: (postId: string, openComments?: boolean) => void
  closePost: () => void
}

const PostModalContext = createContext<PostModalContextValue | null>(null)

export function PostModalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const openPost = useCallback(
    (postId: string, openComments = false) => {
      const path = openComments ? `/post/${postId}?comments=1` : `/post/${postId}`
      router.push(path)
    },
    [router]
  )

  const closePost = useCallback(() => {
    router.back()
  }, [router])

  return (
    <PostModalContext.Provider value={{ openPost, closePost }}>
      {children}
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
