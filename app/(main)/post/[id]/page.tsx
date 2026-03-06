"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import { PostPopupModal } from "@/components/sporgates/post-popup-modal"

export default function PostDetailRoute() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const postId = typeof params?.id === "string" ? params.id : null
  const openComments = searchParams.get("comments") === "1"

  if (!postId) {
    return null
  }

  return (
    <PostPopupModal
      postId={postId}
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
      openComments={openComments}
    />
  )
}
