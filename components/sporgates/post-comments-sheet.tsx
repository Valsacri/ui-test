"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useComments } from "@/hooks/use-comments"
import type { CreateCommentPayload } from "@/lib/types/post"
import { formatFeedTime } from "@/lib/utils"
import { Send, Loader2 } from "lucide-react"

export interface PostCommentsSheetProps {
  postId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  commentCount: number
  onCountChange?: (count: number) => void
  currentUser: { id: string; authorName: string; authorAvatar: string } | null
}

/**
 * Sheet that lists comments for a post and allows adding new ones.
 * Fetches comments when opened; supports load more.
 */
export function PostCommentsSheet({
  postId,
  open,
  onOpenChange,
  commentCount,
  onCountChange,
  currentUser,
}: PostCommentsSheetProps) {
  const {
    comments,
    totalElements,
    loading,
    adding,
    error,
    hasMore,
    loadFirst,
    loadMore,
    addComment,
  } = useComments({ postId, initialCount: commentCount, onCountChange })

  useEffect(() => {
    if (open && postId) loadFirst()
  }, [open, postId, loadFirst])

  const handleSubmit = async (text: string) => {
    if (!currentUser?.id || !text.trim()) return
    const payload: CreateCommentPayload = {
      authorId: currentUser.id,
      authorName: currentUser.authorName,
      authorAvatar: currentUser.authorAvatar,
      text: text.trim(),
    }
    await addComment(payload)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Comments {totalElements > 0 ? `(${totalElements})` : ""}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col min-h-0 mt-4">
          {currentUser && (
            <CommentForm onSubmit={handleSubmit} disabled={adding} />
          )}
          <div className="flex-1 overflow-y-auto mt-4 space-y-3">
            {loading && comments.length === 0 ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <p className="text-sm text-destructive">{error.message}</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No comments yet.</p>
            ) : (
              <>
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="gradient-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                      {c.authorAvatar ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground">{c.authorName ?? "User"}</p>
                      <p className="text-sm text-foreground mt-0.5">{c.text}</p>
                      {c.createdAt != null && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {formatFeedTime(c.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <Button variant="ghost" size="sm" onClick={loadMore} disabled={loading} className="w-full">
                    {loading ? "Loading..." : "Load more"}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function CommentForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (text: string) => Promise<void>
  disabled: boolean
}) {
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || disabled || sending) return
    setSending(true)
    try {
      await onSubmit(text)
      setText("")
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="resize-none flex-1"
        disabled={disabled || sending}
      />
      <Button type="submit" size="icon" disabled={!text.trim() || disabled || sending}>
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </form>
  )
}

