"use client"

import { useRef, useState } from "react"
import { ImageIcon, Send, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { postsService } from "@/lib/services/posts"
import Image from "next/image"
import { cn, resolvePostImageUrl, isAvatarImageUrl } from "@/lib/utils"

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const MAX_FILE_SIZE_MB = 10

export interface FeedComposerPayload {
  content: string
  image?: string
  sport?: string
}

interface FeedComposerProps {
  userDisplayName: string
  userAvatar?: string
  placeholder?: string
  onSubmit: (payload: FeedComposerPayload) => Promise<unknown>
  onSuccess?: () => void
  className?: string
}

export function FeedComposer({
  userDisplayName,
  userAvatar,
  placeholder = "What's on your mind?",
  onSubmit,
  onSuccess,
  className,
}: FeedComposerProps) {
  const [expanded, setExpanded] = useState(false)
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [sport, setSport] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canSubmit = content.trim().length > 0 && !isSubmitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit({
        content: content.trim(),
        image: imageUrl.trim() || undefined,
        sport: sport.trim() || undefined,
      })
      setContent("")
      setImageUrl("")
      setSport("")
      setExpanded(false)
      onSuccess?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't post. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const initials = userDisplayName
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-sm transition-shadow",
        className
      )}
    >
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50 rounded-2xl transition-colors"
        >
          <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted">
            {isAvatarImageUrl(userAvatar) ? (
              <Image src={resolvePostImageUrl(userAvatar)!} alt={userDisplayName} fill className="object-cover" sizes="40px" />
            ) : (
              <div className="gradient-primary flex h-full w-full items-center justify-center text-xs font-bold text-white">
                {userAvatar ?? initials}
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground flex-1">{placeholder}</span>
        </button>
      ) : (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted">
              {isAvatarImageUrl(userAvatar) ? (
                <Image src={resolvePostImageUrl(userAvatar)!} alt={userDisplayName} fill className="object-cover" sizes="40px" />
              ) : (
                <div className="gradient-primary flex h-full w-full items-center justify-center text-xs font-bold text-white">
                  {userAvatar ?? initials}
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => {
                setExpanded(false)
                setError(null)
              }}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Textarea
            placeholder="Share a workout, result, or tip..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="resize-none border-border bg-background"
            disabled={isSubmitting}
            autoFocus
          />

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                setError("Please choose a JPEG, PNG, GIF or WebP image.")
                return
              }
              if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setError(`Image must be under ${MAX_FILE_SIZE_MB}MB.`)
                return
              }
              setError(null)
              setUploading(true)
              try {
                const { url } = await postsService.uploadMedia(file)
                setImageUrl(url)
              } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed.")
              } finally {
                setUploading(false)
                e.target.value = ""
              }
            }}
          />
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              disabled={isSubmitting || uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
              {uploading ? "Uploading..." : "Photo"}
            </Button>
            {imageUrl && (
              <div className="relative inline-block">
                <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolvePostImageUrl(imageUrl)}
                    alt="Upload"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="absolute -top-1 -right-1 rounded-full bg-destructive text-destructive-foreground p-0.5"
                  onClick={() => setImageUrl("")}
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <input
              type="text"
              placeholder="Sport (optional)"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="h-8 w-24 rounded-md border border-border bg-background px-2 text-xs outline-none focus:ring-1 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setExpanded(false)
                setError(null)
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-1.5 gradient-primary text-white border-0"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Posting...</span>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
