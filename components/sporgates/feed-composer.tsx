"use client"

import { useRef, useState } from "react"
import useSWR from "swr"
import { ImageIcon, Send, X, Loader2, Globe, Users, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { postsService } from "@/lib/services/posts"
import { marketplaceService } from "@/lib/services/marketplace"
import { servicesService } from "@/lib/services/services"
import { facilitiesService } from "@/lib/services/facilities"
import { activitiesService } from "@/lib/services/activities"
import Image from "next/image"
import { cn, resolvePostImageUrl, isAvatarImageUrl } from "@/lib/utils"
import { parseDate } from "@/lib/mappers/explore-mappers"
import type { PostVisibility, PostKind } from "@/lib/types/post"

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const MAX_FILE_SIZE_MB = 10

export interface FeedComposerPayload {
  content: string
  image?: string
  images?: string[]
  sport?: string
  visibility?: PostVisibility
  /** When set, creates a business post (owner/staff). */
  businessId?: string
  postKind?: PostKind
  linkedProductId?: string
  linkedServiceListingId?: string
  linkedFacilityId?: string
  linkedActivityId?: string
}

const VISIBILITY_OPTIONS: { value: PostVisibility; label: string; icon: typeof Globe }[] = [
  { value: 'PUBLIC', label: 'Public', icon: Globe },
  { value: 'FOLLOWERS_ONLY', label: 'Followers', icon: Users },
  { value: 'PRIVATE', label: 'Private', icon: Lock },
]

interface FeedComposerProps {
  userDisplayName: string
  userAvatar?: string
  placeholder?: string
  /** When posting as a business page, enables catalog-linked post kinds. */
  businessId?: string
  onSubmit: (payload: FeedComposerPayload) => Promise<unknown>
  onSuccess?: () => void
  className?: string
}

const POST_KIND_OPTIONS: { value: PostKind; label: string }[] = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'NEW_PRODUCT', label: 'New product' },
  { value: 'NEW_SERVICE', label: 'New service' },
  { value: 'NEW_FACILITY', label: 'New facility' },
  { value: 'UPCOMING_EVENT', label: 'Upcoming event' },
]

type LinkedOption = { id: string; label: string }

async function fetchBusinessProducts(businessId: string): Promise<LinkedOption[]> {
  const data = await marketplaceService.getAll({ sellerId: businessId })
  const list = Array.isArray(data) ? data : []
  return list
    .map((p: Record<string, unknown>) => ({
      id: String(p.id ?? ""),
      label: String(p.name ?? "Product"),
    }))
    .filter((o) => o.id.length > 0)
}

async function fetchBusinessServices(businessId: string): Promise<LinkedOption[]> {
  const data = await servicesService.getAll({ providerId: businessId })
  const list = Array.isArray(data) ? data : []
  return list
    .map((s: Record<string, unknown>) => ({
      id: String(s.id ?? ""),
      label: String(s.name ?? "Service"),
    }))
    .filter((o) => o.id.length > 0)
}

async function fetchBusinessFacilities(businessId: string): Promise<LinkedOption[]> {
  const data = await facilitiesService.getAll({ businessId })
  const list = Array.isArray(data) ? data : []
  return list
    .map((f: Record<string, unknown>) => ({
      id: String(f.id ?? ""),
      label: String(f.name ?? "Facility"),
    }))
    .filter((o) => o.id.length > 0)
}

/** Matches API + UI: LocalDateTime may be ISO string or Jackson array [y,m,d,h,min,s]. */
function activityEffectiveStart(a: Record<string, unknown>): Date | null {
  const main = parseDate(a.startDateTime)
  if (main) return main
  const sessions = a.sessions
  if (!Array.isArray(sessions) || sessions.length === 0) return null
  let earliest: Date | null = null
  for (const raw of sessions) {
    const s = raw as Record<string, unknown>
    const d = parseDate(s.startDateTime)
    if (!d) continue
    if (!earliest || d.getTime() < earliest.getTime()) earliest = d
  }
  return earliest
}

async function fetchBusinessUpcomingActivities(businessId: string): Promise<LinkedOption[]> {
  const data = await activitiesService.getAll({ organizerId: businessId })
  const list = Array.isArray(data) ? data : []
  const now = Date.now() - 60_000
  return list
    .filter((a: Record<string, unknown>) => {
      const start = activityEffectiveStart(a)
      if (!start) return true
      return start.getTime() >= now
    })
    .map((a: Record<string, unknown>) => ({
      id: String(a.id ?? ""),
      label: String(a.name ?? "Activity"),
    }))
    .filter((o) => o.id.length > 0)
}

export function FeedComposer({
  userDisplayName,
  userAvatar,
  placeholder = "What's on your mind?",
  businessId,
  onSubmit,
  onSuccess,
  className,
}: FeedComposerProps) {
  const [expanded, setExpanded] = useState(false)
  const [content, setContent] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [sport, setSport] = useState("")
  const [visibility, setVisibility] = useState<PostVisibility>('PUBLIC')
  const [postKind, setPostKind] = useState<PostKind>('STANDARD')
  const [linkedResourceId, setLinkedResourceId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const shouldLoadLinked =
    expanded && !!businessId && postKind !== "STANDARD"

  const { data: productOptions = [], isLoading: loadingProducts, error: errProducts } = useSWR(
    shouldLoadLinked && postKind === "NEW_PRODUCT" ? ["feed-composer", "products", businessId] : null,
    () => fetchBusinessProducts(businessId!)
  )
  const { data: serviceOptions = [], isLoading: loadingServices, error: errServices } = useSWR(
    shouldLoadLinked && postKind === "NEW_SERVICE" ? ["feed-composer", "services", businessId] : null,
    () => fetchBusinessServices(businessId!)
  )
  const { data: facilityOptions = [], isLoading: loadingFacilities, error: errFacilities } = useSWR(
    shouldLoadLinked && postKind === "NEW_FACILITY" ? ["feed-composer", "facilities", businessId] : null,
    () => fetchBusinessFacilities(businessId!)
  )
  const { data: activityOptions = [], isLoading: loadingActivities, error: errActivities } = useSWR(
    shouldLoadLinked && postKind === "UPCOMING_EVENT" ? ["feed-composer", "activities", businessId] : null,
    () => fetchBusinessUpcomingActivities(businessId!)
  )

  const linkedPicker =
    postKind === "NEW_PRODUCT"
      ? {
          label: "Product",
          options: productOptions,
          loading: loadingProducts,
          error: errProducts,
          emptyHint: "No products in your catalog yet.",
        }
      : postKind === "NEW_SERVICE"
        ? {
            label: "Service",
            options: serviceOptions,
            loading: loadingServices,
            error: errServices,
            emptyHint: "No services listed yet.",
          }
        : postKind === "NEW_FACILITY"
          ? {
              label: "Facility",
              options: facilityOptions,
              loading: loadingFacilities,
              error: errFacilities,
              emptyHint: "No facilities yet.",
            }
          : postKind === "UPCOMING_EVENT"
            ? {
                label: "Event",
                options: activityOptions,
                loading: loadingActivities,
                error: errActivities,
                emptyHint: "No upcoming activities. Create one under Activities.",
              }
            : null

  const needsLinkedResource = !!businessId && postKind !== "STANDARD"
  const hasLinkedWhenRequired =
    !needsLinkedResource || linkedResourceId.trim().length > 0

  const canSubmit =
    content.trim().length > 0 && !isSubmitting && hasLinkedWhenRequired

  const handleSubmit = async () => {
    if (!canSubmit) return
    setError(null)
    setIsSubmitting(true)
    try {
      const payload: FeedComposerPayload = {
        content: content.trim(),
        image: imageUrls[0] || undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        sport: sport.trim() || undefined,
        visibility,
      }
      if (businessId) {
        payload.businessId = businessId
        payload.postKind = postKind
        const rid = linkedResourceId.trim()
        if (postKind === 'NEW_PRODUCT' && rid) payload.linkedProductId = rid
        if (postKind === 'NEW_SERVICE' && rid) payload.linkedServiceListingId = rid
        if (postKind === 'NEW_FACILITY' && rid) payload.linkedFacilityId = rid
        if (postKind === 'UPCOMING_EVENT' && rid) payload.linkedActivityId = rid
      }
      await onSubmit(payload)
      setContent("")
      setImageUrls([])
      setSport("")
      setPostKind('STANDARD')
      setLinkedResourceId("")
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

          {businessId && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-[10px] font-medium text-muted-foreground">Post type</span>
              <Select
                value={postKind}
                onValueChange={(v) => {
                  setPostKind(v as PostKind)
                  setLinkedResourceId("")
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  className={cn(
                    "h-8 w-[148px] shrink-0 border-border px-2.5 py-0 text-xs",
                    "focus:ring-1 focus:ring-primary focus:ring-offset-0",
                    "[&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:opacity-60"
                  )}
                  aria-label="Post type"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" className="max-h-72">
                  {POST_KIND_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="py-1.5 pl-8 pr-2 text-xs">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {businessId && linkedPicker && (
            <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
              <div className="min-w-0 flex flex-col gap-1">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {linkedPicker.label}
                </span>
                <Select
                  value={linkedResourceId || undefined}
                  onValueChange={setLinkedResourceId}
                  disabled={
                    isSubmitting ||
                    linkedPicker.loading ||
                    linkedPicker.options.length === 0
                  }
                >
                  <SelectTrigger
                    className={cn(
                      "h-8 w-full min-w-[200px] max-w-md border-border px-2.5 py-0 text-xs",
                      "focus:ring-1 focus:ring-primary focus:ring-offset-0",
                      "[&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:opacity-60"
                    )}
                    aria-label={`Select ${linkedPicker.label.toLowerCase()}`}
                  >
                    <SelectValue
                      placeholder={
                        linkedPicker.loading
                          ? "Loading…"
                          : linkedPicker.options.length === 0
                            ? "None available"
                            : `Choose a ${linkedPicker.label.toLowerCase()}…`
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {linkedPicker.options.map((o) => (
                      <SelectItem
                        key={o.id}
                        value={o.id}
                        className="py-1.5 pl-8 pr-2 text-xs"
                      >
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {linkedPicker.error && (
                  <p className="text-xs text-destructive" role="alert">
                    Couldn’t load {linkedPicker.label.toLowerCase()}s. Try again.
                  </p>
                )}
                {!linkedPicker.loading &&
                  !linkedPicker.error &&
                  linkedPicker.options.length === 0 && (
                    <p className="text-xs text-muted-foreground max-w-md">
                      {linkedPicker.emptyHint}
                    </p>
                  )}
              </div>
            </div>
          )}
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
            multiple
            className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files || [])
              if (files.length === 0) return
              for (const file of files) {
                if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                  setError("Please choose JPEG, PNG, GIF or WebP images.")
                  return
                }
                if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                  setError(`Each image must be under ${MAX_FILE_SIZE_MB}MB.`)
                  return
                }
              }
              setError(null)
              setUploading(true)
              try {
                const { urls } = await postsService.uploadMedia(files)
                setImageUrls((prev) => [...prev, ...urls])
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
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {imageUrls.map((url, idx) => (
                  <div key={url} className="relative inline-block">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolvePostImageUrl(url)}
                        alt={`Upload ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 rounded-full bg-destructive text-destructive-foreground p-0.5"
                      onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
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
            {/* Visibility selector */}
            <div className="ml-auto flex items-center gap-1 rounded-lg border border-border bg-background px-1">
              {VISIBILITY_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const active = visibility === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setVisibility(opt.value)}
                    disabled={isSubmitting}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title={opt.label}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                )
              })}
            </div>
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
