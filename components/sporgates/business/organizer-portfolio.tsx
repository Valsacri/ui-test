"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import {
  Calendar,
  Eye,
  MapPin,
  Plus,
  TrendingUp,
  Users,
  X,
  Trash2,
  ExternalLink,
  FileText,
  Upload,
  Link2,
  Globe,
  Handshake,
  ShieldCheck,
  Mail,
} from "lucide-react"
import { businessesService } from "@/lib/services/businesses"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as DateCalendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { messagesService, authService } from "@/lib/services"
import { useAppRouter } from "@/lib/route-map"
import type {
  CreateOrganizerPortfolioEventCommand,
  OrganizerPortfolioDto,
  OrganizerPortfolioEventDto,
} from "@/lib/types/organizer-portfolio"

interface OrganizerPortfolioProps {
  businessId: string
  onClose?: () => void
  canManage?: boolean
}

interface BusinessContactInfo {
  id?: string
  name?: string
  email?: string
  website?: string
  phoneNumber?: string
  phone?: string
  owner?: { id?: string }
}

interface SponsorSenderBusiness {
  id: string
  name: string
}

const formatNumber = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

const coerceDateValue = (input: unknown): Date | null => {
  if (!input) return null
  if (input instanceof Date && !Number.isNaN(input.getTime())) return input
  if (Array.isArray(input) && input.length >= 3) {
    const [yearRaw, monthRaw, dayRaw] = input
    const year = Number(yearRaw)
    const month = Number(monthRaw)
    const day = Number(dayRaw)
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      const parsed = new Date(year, month - 1, day)
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }
  }
  if (typeof input === "string" || typeof input === "number") {
    const parsed = new Date(input)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  if (typeof input === "object") {
    const maybe = input as {
      year?: number
      monthValue?: number
      month?: number | string
      dayOfMonth?: number
      day?: number
      dayOfMonthValue?: number
      value?: string
      date?: string
    }
    if (typeof maybe.value === "string") {
      const parsed = new Date(maybe.value)
      if (!Number.isNaN(parsed.getTime())) return parsed
    }
    if (typeof maybe.date === "string") {
      const parsed = new Date(maybe.date)
      if (!Number.isNaN(parsed.getTime())) return parsed
    }
    const year = maybe.year
    const monthRaw = maybe.monthValue ?? maybe.month
    const day = maybe.dayOfMonth ?? maybe.dayOfMonthValue ?? maybe.day
    const month =
      typeof monthRaw === "number"
        ? monthRaw
        : typeof monthRaw === "string"
          ? [
              "january",
              "february",
              "march",
              "april",
              "may",
              "june",
              "july",
              "august",
              "september",
              "october",
              "november",
              "december",
            ].indexOf(monthRaw.toLowerCase()) + 1
          : undefined
    if (typeof year === "number" && typeof month === "number" && typeof day === "number") {
      const parsed = new Date(year, month - 1, day)
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }
  }
  return null
}

const getDateTimestamp = (input: unknown) => coerceDateValue(input)?.getTime() ?? 0
const getDateKey = (input: unknown) => coerceDateValue(input)?.toISOString().slice(0, 10) ?? ""
const getDisplayDate = (input: unknown) => coerceDateValue(input)?.toLocaleDateString() ?? "Unknown date"
const normalizeText = (value: unknown) => (typeof value === "string" ? value.trim().toLowerCase() : "")
const isImageUrl = (url: string) => /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(url)

const getLinkPreview = (rawUrl: string) => {
  try {
    const parsed = new URL(rawUrl)
    const host = parsed.hostname.replace(/^www\./, "")
    const displayUrl = `${parsed.protocol}//${parsed.hostname}${parsed.pathname}${parsed.search}${parsed.hash}`
    const isYoutube = /(^|\.)youtube\.com$|(^|\.)youtu\.be$/i.test(parsed.hostname)
    const videoId =
      isYoutube
        ? parsed.hostname.includes("youtu.be")
          ? parsed.pathname.split("/").filter(Boolean)[0]
          : parsed.searchParams.get("v")
        : null

    return {
      host,
      displayUrl,
      favicon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(parsed.hostname)}&sz=64`,
      thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : isImageUrl(rawUrl) ? rawUrl : null,
    }
  } catch {
    return {
      host: "Invalid link",
      displayUrl: rawUrl,
      favicon: null,
      thumbnail: null,
    }
  }
}

const emptyPortfolio: OrganizerPortfolioDto = {
  businessId: "",
  overview: {
    totalEvents: 0,
    totalAttendance: 0,
    totalMediaReach: 0,
    averageEngagementRate: 0,
  },
  events: [],
}

export function OrganizerPortfolio({ businessId, onClose, canManage = false }: OrganizerPortfolioProps) {
  const { navigate } = useAppRouter()
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [contactActionLoading, setContactActionLoading] = useState<"contact" | "deck" | null>(null)
  const [selectedSenderBusinessId, setSelectedSenderBusinessId] = useState("")
  const [linkInputs, setLinkInputs] = useState<Record<string, { media: string; social: string }>>({})
  const [testimonialInputs, setTestimonialInputs] = useState<Record<string, { author: string; role: string; text: string }>>({})
  const [newEventMediaUrl, setNewEventMediaUrl] = useState("")
  const [newEventSocialUrl, setNewEventSocialUrl] = useState("")
  const [newEventMediaUrls, setNewEventMediaUrls] = useState<string[]>([])
  const [newEventSocialUrls, setNewEventSocialUrls] = useState<string[]>([])
  const [newEventPhotos, setNewEventPhotos] = useState<File[]>([])
  const [newEventDocuments, setNewEventDocuments] = useState<File[]>([])
  const [newEventPhotoPreviews, setNewEventPhotoPreviews] = useState<string[]>([])
  const [newEventDocumentPreviews, setNewEventDocumentPreviews] = useState<string[]>([])
  const [newEventPartnerLogoUrl, setNewEventPartnerLogoUrl] = useState("")
  const [newEventDeliverable, setNewEventDeliverable] = useState("")
  const [formData, setFormData] = useState<CreateOrganizerPortfolioEventCommand>({
    name: "",
    date: "",
    location: "",
    attendance: 0,
    mediaReach: 0,
    engagementRate: 0,
    geographicReach: [],
    partnerLogoUrls: [],
    deliverablesCompleted: [],
    sponsorReachGenerated: 0,
  })

  const { data, isLoading, mutate } = useSWR<OrganizerPortfolioDto>(
    businessId ? ["organizer-portfolio", businessId] : null,
    async () => businessesService.getPortfolio(businessId)
  )
  const { data: businessContact } = useSWR<BusinessContactInfo>(
    !canManage && businessId ? ["business-contact", businessId] : null,
    async () => businessesService.getById(businessId) as BusinessContactInfo
  )
  const { data: sponsorBusinessesRaw } = useSWR(
    !canManage ? ["my-businesses-for-sponsor-cta"] : null,
    async () => businessesService.getMyBusinesses()
  )

  const portfolio = data ?? emptyPortfolio
  const sponsorBusinesses: SponsorSenderBusiness[] = useMemo(() => {
    const raw = sponsorBusinessesRaw as { content?: Array<{ id?: string; name?: string }> } | Array<{ id?: string; name?: string }> | undefined
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.content) ? raw.content : []
    return list
      .map((item) => ({ id: item?.id ?? "", name: item?.name ?? "Business" }))
      .filter((item) => item.id)
  }, [sponsorBusinessesRaw])
  useEffect(() => {
    if (selectedSenderBusinessId) return
    if (sponsorBusinesses.length > 0) {
      setSelectedSenderBusinessId(sponsorBusinesses[0].id)
    }
  }, [selectedSenderBusinessId, sponsorBusinesses])

  const selectedAddEventDate = formData.date ? new Date(formData.date) : undefined
  const sortedEvents = useMemo(
    () => [...portfolio.events].sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date)),
    [portfolio.events]
  )
  const credibilityMetrics = useMemo(() => {
    const events = portfolio.events ?? []
    const avgAttendance =
      events.length > 0
        ? events.reduce((sum, event) => sum + Number(event.attendance ?? 0), 0) / events.length
        : 0
    const allSponsors = events.flatMap((event) => event.partnerLogoUrls ?? []).map((url) => normalizeText(url))
    const sponsorCounts = new Map<string, number>()
    allSponsors.forEach((url) => sponsorCounts.set(url, (sponsorCounts.get(url) ?? 0) + 1))
    const uniqueSponsors = sponsorCounts.size
    const retainedSponsors = Array.from(sponsorCounts.values()).filter((count) => count > 1).length
    const sponsorRetentionRate = uniqueSponsors > 0 ? (retainedSponsors / uniqueSponsors) * 100 : 0
    return { avgAttendance, sponsorRetentionRate }
  }, [portfolio.events])

  const resolveBusinessContact = async (): Promise<BusinessContactInfo | null> => {
    if (businessContact?.id || businessContact?.owner?.id || businessContact?.email?.trim() || businessContact?.website?.trim()) {
      return businessContact
    }
    try {
      const fresh = (await businessesService.getById(businessId)) as BusinessContactInfo
      return fresh
    } catch {
      return businessContact ?? null
    }
  }

  const resolveSponsorRecipientId = async (): Promise<string | null> => {
    const contact = await resolveBusinessContact()
    const ownerId = contact?.owner?.id?.trim()
    const currentUserId = authService.getCurrentUser()?.id?.trim()
    if (ownerId && ownerId !== currentUserId) return ownerId

    try {
      const staffRaw = await businessesService.getStaff(businessId)
      const staff = Array.isArray(staffRaw) ? staffRaw : []
      const firstStaffId = staff
        .map((member: { id?: string }) => member?.id?.trim())
        .find((id): id is string => Boolean(id) && id !== currentUserId)
      return firstStaffId ?? null
    } catch {
      return null
    }
  }

  const handleSponsorCta = async (type: "contact" | "deck") => {
    setContactActionLoading(type)
    try {
      if (sponsorBusinesses.length === 0) {
        toast.error("Only business accounts can send sponsorship requests.")
        return
      }
      if (!selectedSenderBusinessId) {
        toast.error("Choose a business profile before messaging the organizer.")
        return
      }
      const recipientId = await resolveSponsorRecipientId()
      if (!recipientId) {
        toast.error("No organizer contact is available for direct messaging.")
        return
      }

      const content =
        type === "contact"
          ? "Hi, I discovered your organizer portfolio and I am interested in discussing sponsorship opportunities for your upcoming events."
          : `Hi, please share your sponsorship deck and partnership packages. (Business ID: ${businessId})`

      let conversationId: string | undefined
      try {
        const sent = await messagesService.sendDirectMessage({
          recipientId,
          content,
          referenceId: businessId,
          referenceType: "business_portfolio",
          senderBusinessId: selectedSenderBusinessId,
        })
        conversationId = sent?.conversationId
      } catch {
        // Fallback handled below.
      }

      if (!conversationId) {
        try {
          const conv = await messagesService.createDirectConversation({ targetUserId: recipientId })
          conversationId = conv?.id
          if (conversationId) {
            const me = authService.getCurrentUser()?.id
            if (me) {
              await messagesService.sendMessage({
                conversationId,
                senderId: selectedSenderBusinessId || me,
                content,
              })
            }
          }
        } catch {
          toast.error("Could not start a direct conversation with the organizer.")
          return
        }
      }

      if (!conversationId) {
        toast.error("Conversation could not be opened right now.")
        return
      }

      navigate("conversation", conversationId)
      toast.success(type === "contact" ? "Message sent to organizer." : "Sponsorship deck request sent.")
    } finally {
      setContactActionLoading(null)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      location: "",
      attendance: 0,
      mediaReach: 0,
      engagementRate: 0,
      geographicReach: [],
      partnerLogoUrls: [],
      deliverablesCompleted: [],
      sponsorReachGenerated: 0,
    })
    setNewEventMediaUrl("")
    setNewEventSocialUrl("")
    setNewEventMediaUrls([])
    setNewEventSocialUrls([])
    setNewEventPhotos([])
    setNewEventDocuments([])
    setNewEventPartnerLogoUrl("")
    setNewEventDeliverable("")
    newEventPhotoPreviews.forEach((url) => URL.revokeObjectURL(url))
    newEventDocumentPreviews.forEach((url) => URL.revokeObjectURL(url))
    setNewEventPhotoPreviews([])
    setNewEventDocumentPreviews([])
  }

  const appendUniqueFiles = (current: File[], incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return current
    const merged = [...current]
    for (const file of Array.from(incoming)) {
      const exists = merged.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified
      )
      if (!exists) merged.push(file)
    }
    return merged
  }

  const removeSelectedPhoto = (idx: number) => {
    setNewEventPhotos((prev) => prev.filter((_, i) => i !== idx))
    setNewEventPhotoPreviews((prev) => {
      const removed = prev[idx]
      if (removed) URL.revokeObjectURL(removed)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const removeSelectedDocument = (idx: number) => {
    setNewEventDocuments((prev) => prev.filter((_, i) => i !== idx))
    setNewEventDocumentPreviews((prev) => {
      const removed = prev[idx]
      if (removed) URL.revokeObjectURL(removed)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const appendPhotoSelection = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return
    const incomingFiles = Array.from(incoming)
    const uniqueIncoming = incomingFiles.filter((file) => {
      return !newEventPhotos.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified
      )
    })
    if (uniqueIncoming.length === 0) return
    setNewEventPhotos((prev) => [...prev, ...uniqueIncoming])
    setNewEventPhotoPreviews((prev) => [...prev, ...uniqueIncoming.map((file) => URL.createObjectURL(file))])
  }

  const appendDocumentSelection = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return
    const incomingFiles = Array.from(incoming)
    const uniqueIncoming = incomingFiles.filter((file) => {
      return !newEventDocuments.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified
      )
    })
    if (uniqueIncoming.length === 0) return
    setNewEventDocuments((prev) => [...prev, ...uniqueIncoming])
    setNewEventDocumentPreviews((prev) => [...prev, ...uniqueIncoming.map((file) => URL.createObjectURL(file))])
  }

  const addNewEventUrl = (type: "media" | "social") => {
    const value = (type === "media" ? newEventMediaUrl : newEventSocialUrl).trim()
    if (!value) return

    const looksLikeUrl = /^https?:\/\/.+/i.test(value)
    if (!looksLikeUrl) {
      setError("Please enter a valid URL starting with http:// or https://")
      return
    }

    setError(null)
    if (type === "media") {
      if (!newEventMediaUrls.includes(value)) {
        setNewEventMediaUrls((prev) => [...prev, value])
      }
      setNewEventMediaUrl("")
      return
    }

    if (!newEventSocialUrls.includes(value)) {
      setNewEventSocialUrls((prev) => [...prev, value])
    }
    setNewEventSocialUrl("")
  }

  const removeNewEventUrl = (type: "media" | "social", index: number) => {
    if (type === "media") {
      setNewEventMediaUrls((prev) => prev.filter((_, i) => i !== index))
      return
    }
    setNewEventSocialUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const addPartnerLogoUrl = () => {
    const value = newEventPartnerLogoUrl.trim()
    if (!value) return
    const looksLikeUrl = /^https?:\/\/.+/i.test(value)
    if (!looksLikeUrl) {
      setError("Please enter a valid partner logo URL starting with http:// or https://")
      return
    }
    if (!formData.partnerLogoUrls.includes(value)) {
      setFormData((prev) => ({ ...prev, partnerLogoUrls: [...prev.partnerLogoUrls, value] }))
    }
    setNewEventPartnerLogoUrl("")
    setError(null)
  }

  const removePartnerLogoUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      partnerLogoUrls: prev.partnerLogoUrls.filter((_, idx) => idx !== index),
    }))
  }

  const addDeliverable = () => {
    const value = newEventDeliverable.trim()
    if (!value) return
    if (!formData.deliverablesCompleted.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        deliverablesCompleted: [...prev.deliverablesCompleted, value],
      }))
    }
    setNewEventDeliverable("")
  }

  const removeDeliverable = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      deliverablesCompleted: prev.deliverablesCompleted.filter((_, idx) => idx !== index),
    }))
  }

  const onCreateEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim() || !formData.date || !formData.location.trim()) {
      setError("Event name, date, and location are required.")
      return
    }

    const duplicateExists = portfolio.events.some(
      (event) => normalizeText(event.name) === normalizeText(formData.name)
    )
    if (duplicateExists) {
      const duplicateMessage = "An event with this name already exists. Please choose a different event name."
      setError(duplicateMessage)
      toast.error(duplicateMessage)
      return
    }

    setSubmitting(true)
    try {
      const createdPortfolio = await businessesService.createPortfolioEvent(businessId, formData)
      const createdEvent = Array.isArray(createdPortfolio?.events)
        ? [...createdPortfolio.events]
            .sort(
              (a: OrganizerPortfolioEventDto, b: OrganizerPortfolioEventDto) =>
                getDateTimestamp(b.date) - getDateTimestamp(a.date)
            )
            .find(
              (event: OrganizerPortfolioEventDto) =>
                event.name === formData.name &&
                getDateKey(event.date) === getDateKey(formData.date) &&
                event.location === formData.location
            ) ?? createdPortfolio.events[createdPortfolio.events.length - 1]
        : null

      const failedSteps: string[] = []
      if (createdEvent?.id) {
        // Optional follow-up calls should not make event creation look failed.
        if (newEventPhotos.length > 0) {
          try {
            await businessesService.uploadPortfolioAssets(businessId, createdEvent.id, "photo", newEventPhotos)
          } catch {
            failedSteps.push("images")
          }
        }
        if (newEventDocuments.length > 0) {
          try {
            await businessesService.uploadPortfolioAssets(businessId, createdEvent.id, "document", newEventDocuments)
          } catch {
            failedSteps.push("documents")
          }
        }
        if (newEventMediaUrls.length > 0) {
          try {
            await businessesService.addPortfolioLinks(businessId, createdEvent.id, "media", { urls: newEventMediaUrls })
          } catch {
            failedSteps.push("media links")
          }
        }
        if (newEventSocialUrls.length > 0) {
          try {
            await businessesService.addPortfolioLinks(businessId, createdEvent.id, "social", { urls: newEventSocialUrls })
          } catch {
            failedSteps.push("social links")
          }
        }
      }

      await mutate()
      resetForm()
      setIsAddingEvent(false)
      if (failedSteps.length > 0) {
        setError(`Past event was created, but ${failedSteps.join(", ")} could not be saved. Please add them again.`)
      } else {
        setError(null)
      }
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (err as { response: { data: { message: string } } }).response.data.message
          : "Could not create event. Please try again."
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const onDeleteEvent = async (eventId: string) => {
    setError(null)
    try {
      await businessesService.deletePortfolioEvent(businessId, eventId)
      await mutate()
      if (expandedEvent === eventId) {
        setExpandedEvent(null)
      }
    } catch {
      setError("Could not delete event. Please try again.")
    }
  }

  const onAddLink = async (eventId: string, type: "media" | "social") => {
    const value = linkInputs[eventId]?.[type]?.trim()
    if (!value) return
    setError(null)
    try {
      await businessesService.addPortfolioLinks(businessId, eventId, type, { urls: [value] })
      await mutate()
      setLinkInputs((prev) => ({
        ...prev,
        [eventId]: {
          media: type === "media" ? "" : prev[eventId]?.media ?? "",
          social: type === "social" ? "" : prev[eventId]?.social ?? "",
        },
      }))
    } catch {
      setError("Could not add link. Please verify URL format.")
    }
  }

  const onAddTestimonial = async (eventId: string) => {
    const input = testimonialInputs[eventId]
    if (!input?.author?.trim() || !input.role?.trim() || !input.text?.trim()) {
      setError("Author, role, and testimonial text are required.")
      return
    }
    setError(null)
    try {
      await businessesService.addPortfolioTestimonial(businessId, eventId, {
        author: input.author.trim(),
        role: input.role.trim(),
        text: input.text.trim(),
      })
      await mutate()
      setTestimonialInputs((prev) => ({
        ...prev,
        [eventId]: { author: "", role: "", text: "" },
      }))
    } catch {
      setError("Could not add testimonial.")
    }
  }

  const onUploadAssets = async (eventId: string, type: "photo" | "document", files: FileList | null) => {
    if (!files || files.length === 0) return
    setError(null)
    setUploading(`${eventId}:${type}`)
    try {
      await businessesService.uploadPortfolioAssets(businessId, eventId, type, Array.from(files))
      await mutate()
    } catch {
      setError("Could not upload files. Please check file type and size.")
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-4 shadow-sm lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Organizer Portfolio</p>
          <h1 className="text-lg font-bold text-foreground">Prove your event track record</h1>
          <p className="text-xs text-muted-foreground">Showcase results and proof points for sponsors.</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Close portfolio"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground">
                {canManage ? "Portfolio Overview" : "Organizer Credibility Summary"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {canManage
                  ? "Aggregate impact across all events"
                  : "Evaluate organizer reliability and sponsorship outcomes at a glance"}
              </p>
            </div>
            {canManage && (
              <button
                type="button"
                onClick={() => setIsAddingEvent(true)}
                className="gradient-primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Add Event
              </button>
            )}
            {!canManage && (
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[420px]">
                <Select
                  value={selectedSenderBusinessId}
                  onValueChange={setSelectedSenderBusinessId}
                  disabled={contactActionLoading !== null || sponsorBusinesses.length === 0}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl border-border bg-background px-3 text-xs font-medium">
                    <SelectValue placeholder="No business profile available">
                      {selectedSenderBusinessId
                        ? `Send as: ${sponsorBusinesses.find((b) => b.id === selectedSenderBusinessId)?.name ?? "Business"}`
                        : "No business profile available"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sponsorBusinesses.length === 0 ? (
                      <SelectItem value="__none" disabled>No business profile available</SelectItem>
                    ) : (
                      sponsorBusinesses.map((business) => (
                        <SelectItem key={business.id} value={business.id}>
                          Send as: {business.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <div className="flex w-full gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 flex-1 rounded-xl border-border bg-background px-3 text-xs font-semibold"
                    onClick={() => void handleSponsorCta("contact")}
                    disabled={contactActionLoading !== null || sponsorBusinesses.length === 0}
                  >
                    <Mail className="mr-1.5 h-4 w-4" />
                    {contactActionLoading === "contact" ? "Opening..." : "Contact Organizer"}
                  </Button>
                  <Button
                    type="button"
                    className="h-10 flex-1 rounded-xl px-3 text-xs font-semibold"
                    onClick={() => void handleSponsorCta("deck")}
                    disabled={contactActionLoading !== null || sponsorBusinesses.length === 0}
                  >
                    <Handshake className="mr-1.5 h-4 w-4" />
                    {contactActionLoading === "deck" ? "Opening..." : "Request Sponsorship Deck"}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-muted/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> Total Events
              </div>
              <p className="text-xl font-bold text-foreground">{portfolio.overview.totalEvents}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> Avg Attendance
              </div>
              <p className="text-xl font-bold text-foreground">{formatNumber(Math.round(credibilityMetrics.avgAttendance))}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" /> Avg Engagement
              </div>
              <p className="text-xl font-bold text-foreground">{portfolio.overview.averageEngagementRate.toFixed(1)}%</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Handshake className="h-3.5 w-3.5" /> Sponsor Retention
              </div>
              <p className="text-xl font-bold text-foreground">{credibilityMetrics.sponsorRetentionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">
            {error}
          </div>
        )}

        {canManage && isAddingEvent && (
          <form onSubmit={onCreateEvent} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Add Past Event</h3>
                <p className="text-xs text-muted-foreground">Capture proof and key metrics</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingEvent(false)}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Event Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                  placeholder="e.g., Summer Basketball Championship"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold text-foreground">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2 h-11 w-full justify-between rounded-xl border-input bg-background font-normal hover:bg-primary/10 hover:text-primary"
                      >
                        <span className={cn("text-sm", formData.date ? "text-foreground" : "text-muted-foreground")}>
                          {formData.date
                            ? selectedAddEventDate?.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Select date"}
                        </span>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <DateCalendar
                        mode="single"
                        selected={selectedAddEventDate}
                        onSelect={(date) => {
                          if (!date) return
                          const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                            .toISOString()
                            .slice(0, 10)
                          setFormData((prev) => ({ ...prev, date: dateString }))
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                    placeholder="Venue name"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-foreground">Event Metrics</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Attendance</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.attendance}
                      onChange={(e) => setFormData((prev) => ({ ...prev, attendance: Number(e.target.value || 0) }))}
                      className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Media Reach</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.mediaReach}
                      onChange={(e) => setFormData((prev) => ({ ...prev, mediaReach: Number(e.target.value || 0) }))}
                      className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Engagement Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={100}
                      value={formData.engagementRate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, engagementRate: Number(e.target.value || 0) }))}
                      className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-foreground">Sponsorship Outcomes</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Sponsor Reach Generated</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.sponsorReachGenerated}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, sponsorReachGenerated: Number(e.target.value || 0) }))
                      }
                      className="mt-2 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Partner Logo URL</label>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="url"
                        value={newEventPartnerLogoUrl}
                        onChange={(e) => setNewEventPartnerLogoUrl(e.target.value)}
                        placeholder="https://brand.com/logo.png"
                        className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={addPartnerLogoUrl}
                        className="rounded-xl border border-border px-3 text-xs font-semibold hover:bg-muted"
                      >
                        Add
                      </button>
                    </div>
                    {formData.partnerLogoUrls.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.partnerLogoUrls.map((url, idx) => (
                          <span key={`${url}-${idx}`} className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 text-[11px]">
                            <a href={url} target="_blank" rel="noreferrer" className="max-w-[220px] truncate text-foreground hover:text-primary">
                              {url}
                            </a>
                            <button
                              type="button"
                              onClick={() => removePartnerLogoUrl(idx)}
                              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-primary hover:bg-primary/10"
                              aria-label="Remove partner logo URL"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground">Deliverables Completed</label>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={newEventDeliverable}
                        onChange={(e) => setNewEventDeliverable(e.target.value)}
                        placeholder="e.g., Brand booth setup"
                        className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={addDeliverable}
                        className="rounded-xl border border-border px-3 text-xs font-semibold hover:bg-muted"
                      >
                        Add
                      </button>
                    </div>
                    {formData.deliverablesCompleted.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.deliverablesCompleted.map((item, idx) => (
                          <span key={`${item}-${idx}`} className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 text-[11px] text-foreground">
                            <span className="max-w-[240px] truncate">{item}</span>
                            <button
                              type="button"
                              onClick={() => removeDeliverable(idx)}
                              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-primary hover:bg-primary/10"
                              aria-label="Remove deliverable"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-foreground">Upload Proof</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div
                    className={cn(
                      "rounded-2xl border-2 border-dashed border-border bg-muted p-3 transition-colors",
                      "hover:border-primary/40",
                      newEventPhotos.length > 0 && "border-solid border-primary/20"
                    )}
                  >
                    <Label className="text-xs text-muted-foreground">Images</Label>
                    <input
                      id="portfolio-images-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => appendPhotoSelection(e.target.files)}
                      className="hidden"
                    />
                    <label
                      htmlFor="portfolio-images-input"
                      className="mt-2 flex h-20 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-background/60 text-center transition-colors hover:border-primary/40"
                    >
                      <div>
                        <Upload className="mx-auto h-4 w-4 text-muted-foreground" />
                        <p className="mt-1 text-[11px] text-muted-foreground">Choose images</p>
                      </div>
                    </label>
                    {newEventPhotos.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-[11px] text-muted-foreground">{newEventPhotos.length} image(s) selected</p>
                        {newEventPhotos.map((file, idx) => (
                          <div key={`${file.name}-${file.size}-${idx}`} className="flex items-center justify-between rounded-lg bg-background px-2 py-1">
                            <span className="truncate pr-3 text-[11px] text-foreground">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeSelectedPhoto(idx)}
                              aria-label="Remove selected image"
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {newEventPhotoPreviews.map((preview, idx) => (
                            <a
                              key={`${preview}-${idx}`}
                              href={preview}
                              target="_blank"
                              rel="noreferrer"
                              className="group relative block aspect-square overflow-hidden rounded-lg border border-border"
                            >
                              <img
                                src={preview}
                                alt={newEventPhotos[idx]?.name || `Selected image ${idx + 1}`}
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                <ExternalLink className="h-3 w-3" />
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl border-2 border-dashed border-border bg-muted p-3 transition-colors",
                      "hover:border-primary/40",
                      newEventDocuments.length > 0 && "border-solid border-primary/20"
                    )}
                  >
                    <Label className="text-xs text-muted-foreground">Documents</Label>
                    <input
                      id="portfolio-documents-input"
                      type="file"
                      multiple
                      onChange={(e) => appendDocumentSelection(e.target.files)}
                      className="hidden"
                    />
                    <label
                      htmlFor="portfolio-documents-input"
                      className="mt-2 flex h-20 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-background/60 text-center transition-colors hover:border-primary/40"
                    >
                      <div>
                        <Upload className="mx-auto h-4 w-4 text-muted-foreground" />
                        <p className="mt-1 text-[11px] text-muted-foreground">Choose documents</p>
                      </div>
                    </label>
                    {newEventDocuments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-[11px] text-muted-foreground">{newEventDocuments.length} document(s) selected</p>
                        {newEventDocuments.map((file, idx) => (
                          <div key={`${file.name}-${file.size}-${idx}`} className="flex items-center justify-between rounded-lg bg-background px-2 py-1">
                            <a
                              href={newEventDocumentPreviews[idx]}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex min-w-0 items-center gap-2 truncate pr-3 text-[11px] text-foreground hover:text-primary"
                              title={`Preview ${file.name}`}
                            >
                              <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
                              <span className="truncate">{file.name}</span>
                              <ExternalLink className="h-3 w-3 shrink-0 text-primary" />
                            </a>
                            <button
                              type="button"
                              onClick={() => removeSelectedDocument(idx)}
                              aria-label="Remove selected document"
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Media URL</label>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="url"
                        value={newEventMediaUrl}
                        onChange={(e) => setNewEventMediaUrl(e.target.value)}
                        placeholder="https://news.example.com/event"
                        className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => addNewEventUrl("media")}
                        className="rounded-xl border border-border px-3 text-xs font-semibold hover:bg-muted"
                      >
                        Add
                      </button>
                    </div>
                    {newEventMediaUrls.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newEventMediaUrls.map((url, idx) => (
                          <span key={`${url}-${idx}`} className="inline-flex max-w-full items-center gap-1 rounded-full bg-background px-2 py-1 text-[11px] text-foreground">
                            <a href={url} target="_blank" rel="noreferrer" className="truncate hover:text-primary hover:underline">
                              {url}
                            </a>
                            <button
                              type="button"
                              onClick={() => removeNewEventUrl("media", idx)}
                              aria-label="Remove media URL"
                              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-primary hover:bg-primary/10"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Social URL</label>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="url"
                        value={newEventSocialUrl}
                        onChange={(e) => setNewEventSocialUrl(e.target.value)}
                        placeholder="https://instagram.com/p/..."
                        className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => addNewEventUrl("social")}
                        className="rounded-xl border border-border px-3 text-xs font-semibold hover:bg-muted"
                      >
                        Add
                      </button>
                    </div>
                    {newEventSocialUrls.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newEventSocialUrls.map((url, idx) => (
                          <span key={`${url}-${idx}`} className="inline-flex max-w-full items-center gap-1 rounded-full bg-background px-2 py-1 text-[11px] text-foreground">
                            <a href={url} target="_blank" rel="noreferrer" className="truncate hover:text-primary hover:underline">
                              {url}
                            </a>
                            <button
                              type="button"
                              onClick={() => removeNewEventUrl("social", idx)}
                              aria-label="Remove social URL"
                              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-primary hover:bg-primary/10"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="gradient-primary flex-1 rounded-xl py-2.5 text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Add Event"}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Past Events</h2>
            <p className="text-xs text-muted-foreground">{portfolio.overview.totalEvents} tracked events</p>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground shadow-sm">
              Loading portfolio...
            </div>
          )}

          {!isLoading && sortedEvents.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground shadow-sm">
              No past events yet. Add your first event to start building your organizer track record.
            </div>
          )}

          {sortedEvents.map((event: OrganizerPortfolioEventDto) => (
            <div key={event.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">{event.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {getDisplayDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {event.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                    className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    {expandedEvent === event.id ? "Hide Details" : "View Details"}
                  </button>
                  {canManage && (
                    <button
                      type="button"
                      onClick={() => onDeleteEvent(event.id)}
                      className="rounded-full border border-destructive/50 px-3 py-2 text-[11px] font-semibold text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <span className="inline-flex items-center gap-1">
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Users className="h-3 w-3" /> Attendance
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatNumber(event.attendance)}</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Eye className="h-3 w-3" /> Media Reach
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatNumber(event.mediaReach)}</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <TrendingUp className="h-3 w-3" /> Engagement
                  </div>
                  <p className="text-sm font-semibold text-foreground">{event.engagementRate}%</p>
                </div>
              </div>

              {expandedEvent === event.id && (
                <div className="mt-4 space-y-4 border-t border-border pt-4">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Geographic Reach</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.geographicReach.map((location) => (
                        <span
                          key={location}
                          className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary"
                        >
                          {location}
                        </span>
                      ))}
                      {event.geographicReach.length === 0 && (
                        <span className="text-[11px] text-muted-foreground">No geographic tags added yet.</span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <h4 className="text-xs font-semibold text-foreground">Verification Signals</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-[11px] text-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        Proof docs uploaded: {event.documentUrls.length}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-[11px] text-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        Media links verified: {event.mediaLinks.length + event.socialLinks.length}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-[11px] text-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        Testimonials: {event.testimonials.length}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/40 p-3">
                    <h4 className="text-xs font-semibold text-foreground">Sponsorship Outcomes</h4>
                    <div className="mt-2 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-background p-2.5">
                        <p className="text-[10px] text-muted-foreground">Partner Logos</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{event.partnerLogoUrls.length}</p>
                      </div>
                      <div className="rounded-lg bg-background p-2.5">
                        <p className="text-[10px] text-muted-foreground">Deliverables Completed</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{event.deliverablesCompleted.length}</p>
                      </div>
                      <div className="rounded-lg bg-background p-2.5">
                        <p className="text-[10px] text-muted-foreground">Sponsor Reach Generated</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{formatNumber(event.sponsorReachGenerated ?? 0)}</p>
                      </div>
                    </div>
                    {event.partnerLogoUrls.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {event.partnerLogoUrls.map((logo, idx) => (
                          <a
                            key={`${logo}-${idx}`}
                            href={logo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-border bg-background"
                            title="View partner logo"
                          >
                            <img src={logo} alt={`Partner logo ${idx + 1}`} className="h-full w-full object-contain" />
                          </a>
                        ))}
                      </div>
                    )}
                    {event.deliverablesCompleted.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {event.deliverablesCompleted.map((item, idx) => (
                          <span key={`${item}-${idx}`} className="rounded-full bg-background px-2.5 py-1 text-[11px] text-foreground">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-border bg-muted/40 p-3">
                      <h4 className="text-xs font-semibold text-foreground">Photos</h4>
                      <p className="mt-1 text-[11px] text-muted-foreground">{event.photoUrls.length} uploaded</p>
                      {event.photoUrls.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {event.photoUrls.map((url, index) => (
                            <a
                              key={`${url}-${index}`}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="group relative block aspect-square overflow-hidden rounded-lg border border-border"
                            >
                              <img
                                src={url}
                                alt={`Event photo ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                <ExternalLink className="h-3 w-3" />
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                      {canManage && (
                        <>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="mt-2 block w-full text-[11px]"
                            onChange={(e) => onUploadAssets(event.id, "photo", e.target.files)}
                          />
                          {uploading === `${event.id}:photo` && <p className="mt-2 text-[11px] text-muted-foreground">Uploading photos...</p>}
                        </>
                      )}
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 p-3">
                      <h4 className="text-xs font-semibold text-foreground">Documents</h4>
                      <p className="mt-1 text-[11px] text-muted-foreground">{event.documentUrls.length} uploaded</p>
                      {event.documentUrls.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {event.documentUrls.map((url, index) => {
                            const label = (() => {
                              try {
                                const pathname = new URL(url).pathname
                                return decodeURIComponent(pathname.split("/").pop() || `Document ${index + 1}`)
                              } catch {
                                return `Document ${index + 1}`
                              }
                            })()
                            return (
                              <a
                                key={`${url}-${index}`}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-lg border border-border bg-background px-2.5 py-2 text-[11px] hover:border-primary/40"
                              >
                                <span className="inline-flex min-w-0 items-center gap-2">
                                  <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
                                  <span className="truncate text-foreground">{label}</span>
                                </span>
                                <ExternalLink className="h-3 w-3 shrink-0 text-primary" />
                              </a>
                            )
                          })}
                        </div>
                      )}
                      {canManage && (
                        <>
                          <input
                            type="file"
                            multiple
                            className="mt-2 block w-full text-[11px]"
                            onChange={(e) => onUploadAssets(event.id, "document", e.target.files)}
                          />
                          {uploading === `${event.id}:document` && <p className="mt-2 text-[11px] text-muted-foreground">Uploading documents...</p>}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-border bg-muted/40 p-3">
                      <h4 className="text-xs font-semibold text-foreground">Media links</h4>
                      {canManage && (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="url"
                            value={linkInputs[event.id]?.media ?? ""}
                            onChange={(e) =>
                              setLinkInputs((prev) => ({
                                ...prev,
                                [event.id]: { media: e.target.value, social: prev[event.id]?.social ?? "" },
                              }))
                            }
                            placeholder="https://news.example.com/event"
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => onAddLink(event.id, "media")}
                            className="rounded-lg border border-border px-3 text-xs font-semibold hover:bg-muted"
                          >
                            Add
                          </button>
                        </div>
                      )}
                      {event.mediaLinks.length > 0 && (
                        <div className="mt-2 grid gap-2">
                          {event.mediaLinks.map((link, idx) => {
                            const preview = getLinkPreview(link)
                            return (
                              <a
                                key={`${link}-${idx}`}
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="block min-w-0 rounded-lg border border-border bg-background p-2 hover:border-primary/40"
                              >
                                {preview.thumbnail && (
                                  <div className="mb-2 overflow-hidden rounded-md border border-border">
                                    <img src={preview.thumbnail} alt={preview.host} className="h-24 w-full object-cover" />
                                  </div>
                                )}
                                <div className="flex min-w-0 items-center gap-2">
                                  {preview.favicon ? (
                                    <img src={preview.favicon} alt="" className="h-4 w-4 rounded-sm" />
                                  ) : (
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <p className="min-w-0 max-w-full truncate text-[11px] font-semibold text-foreground">{preview.host}</p>
                                </div>
                                <p
                                  className="mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-muted-foreground"
                                  title={link}
                                >
                                  {preview.displayUrl}
                                </p>
                              </a>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 p-3">
                      <h4 className="text-xs font-semibold text-foreground">Social links</h4>
                      {canManage && (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="url"
                            value={linkInputs[event.id]?.social ?? ""}
                            onChange={(e) =>
                              setLinkInputs((prev) => ({
                                ...prev,
                                [event.id]: { social: e.target.value, media: prev[event.id]?.media ?? "" },
                              }))
                            }
                            placeholder="https://instagram.com/post/..."
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => onAddLink(event.id, "social")}
                            className="rounded-lg border border-border px-3 text-xs font-semibold hover:bg-muted"
                          >
                            Add
                          </button>
                        </div>
                      )}
                      {event.socialLinks.length > 0 && (
                        <div className="mt-2 grid gap-2">
                          {event.socialLinks.map((link, idx) => {
                            const preview = getLinkPreview(link)
                            return (
                              <a
                                key={`${link}-${idx}`}
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="block min-w-0 rounded-lg border border-border bg-background p-2 hover:border-primary/40"
                              >
                                {preview.thumbnail && (
                                  <div className="mb-2 overflow-hidden rounded-md border border-border">
                                    <img src={preview.thumbnail} alt={preview.host} className="h-24 w-full object-cover" />
                                  </div>
                                )}
                                <div className="flex min-w-0 items-center gap-2">
                                  {preview.favicon ? (
                                    <img src={preview.favicon} alt="" className="h-4 w-4 rounded-sm" />
                                  ) : (
                                    <Link2 className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <p className="min-w-0 max-w-full truncate text-[11px] font-semibold text-foreground">{preview.host}</p>
                                </div>
                                <p
                                  className="mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-muted-foreground"
                                  title={link}
                                >
                                  {preview.displayUrl}
                                </p>
                              </a>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/40 p-3">
                    <h4 className="text-xs font-semibold text-foreground">Testimonials</h4>
                    {canManage && (
                      <>
                        <div className="mt-2 grid gap-2 md:grid-cols-3">
                          <input
                            type="text"
                            placeholder="Author"
                            value={testimonialInputs[event.id]?.author ?? ""}
                            onChange={(e) =>
                              setTestimonialInputs((prev) => ({
                                ...prev,
                                [event.id]: {
                                  author: e.target.value,
                                  role: prev[event.id]?.role ?? "",
                                  text: prev[event.id]?.text ?? "",
                                },
                              }))
                            }
                            className="h-10 rounded-lg border border-border bg-background px-3 text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Role"
                            value={testimonialInputs[event.id]?.role ?? ""}
                            onChange={(e) =>
                              setTestimonialInputs((prev) => ({
                                ...prev,
                                [event.id]: {
                                  role: e.target.value,
                                  author: prev[event.id]?.author ?? "",
                                  text: prev[event.id]?.text ?? "",
                                },
                              }))
                            }
                            className="h-10 rounded-lg border border-border bg-background px-3 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => onAddTestimonial(event.id)}
                            className="rounded-lg border border-border px-3 text-xs font-semibold hover:bg-muted"
                          >
                            Add testimonial
                          </button>
                        </div>
                        <textarea
                          placeholder="What did participants/sponsors say?"
                          value={testimonialInputs[event.id]?.text ?? ""}
                          onChange={(e) =>
                            setTestimonialInputs((prev) => ({
                              ...prev,
                              [event.id]: {
                                text: e.target.value,
                                author: prev[event.id]?.author ?? "",
                                role: prev[event.id]?.role ?? "",
                              },
                            }))
                          }
                          className="mt-2 min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs"
                        />
                      </>
                    )}
                    {event.testimonials.length > 0 && (
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {event.testimonials.map((t, idx) => (
                          <div key={`${t.author}-${idx}`} className="rounded-lg bg-background p-3 text-[11px]">
                            <p className="text-foreground">"{t.text}"</p>
                            <p className="mt-1 text-muted-foreground">
                              <span className="font-semibold text-foreground">{t.author}</span> · {t.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
