import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves post/media/profile image URL for display.
 * Same pattern as profile-page and business cards: api base (with /api) + path,
 * so backend context-path /api is correct (e.g. /api/uploads/user/avatars/...).
 */
export function resolvePostImageUrl(url: string | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const apiBase = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:8080/api'
  const path = url.startsWith('/') ? url : `/${url}`
  return `${apiBase.replace(/\/?$/, '')}${path}`
}

/** True if the value looks like an image URL (not initials). */
export function isAvatarImageUrl(value: string | undefined): boolean {
  return typeof value === 'string' && value.length > 0 && (value.startsWith('http') || value.startsWith('/'))
}

/**
 * Parse date from backend (string or Java LocalDateTime array [year, month, day, hour?, minute?, second?]).
 * Returns null if invalid or missing.
 */
export function parseBackendDate(value: string | number[] | undefined): Date | null {
  if (value == null) return null
  if (Array.isArray(value)) {
    const [y, m, d, h = 0, min = 0, s = 0] = value as number[]
    if (typeof y !== 'number' || typeof m !== 'number' || typeof d !== 'number') return null
    const date = new Date(y, m - 1, d, h, min, s)
    return isNaN(date.getTime()) ? null : date
  }
  const date = new Date(value as string)
  return isNaN(date.getTime()) ? null : date
}

/** Format post/comment createdAt for display (e.g. "2h ago", "Mar 1"). Handles string or array from backend. */
export function formatFeedTime(createdAt: string | number[] | undefined): string {
  const d = parseBackendDate(createdAt)
  if (!d) return ''
  try {
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

/** True if the message can be edited (sent by current user and within 1 minute). */
export function canEditMessage(
  message: { senderId?: string; createdAt?: string | number[] },
  currentUserId: string
): boolean {
  if (!currentUserId || message.senderId !== currentUserId) return false
  const d = parseBackendDate(message.createdAt)
  if (!d) return false
  const diffMs = Date.now() - d.getTime()
  return diffMs < 60 * 1000
}

/** Minutes of inactivity after which a user is considered offline. */
export const PRESENCE_ONLINE_MINUTES = 5

/** True if lastActiveAt is within PRESENCE_ONLINE_MINUTES (user considered online). */
export function isOnline(lastActiveAt: string | number[] | undefined | null): boolean {
  const d = parseBackendDate(lastActiveAt ?? undefined)
  if (!d) return false
  const diffMs = Date.now() - d.getTime()
  return diffMs >= 0 && diffMs < PRESENCE_ONLINE_MINUTES * 60 * 1000
}

/** "Last seen X ago" for presence. Returns empty if online or no date. */
export function formatLastSeen(lastActiveAt: string | number[] | undefined | null): string {
  const d = parseBackendDate(lastActiveAt ?? undefined)
  if (!d) return ''
  if (isOnline(lastActiveAt ?? undefined)) return ''
  const diffMs = Date.now() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Last seen just now'
  if (diffMins < 60) return `Last seen ${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `Last seen ${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Last seen yesterday'
  if (diffDays < 7) return `Last seen ${diffDays}d ago`
  return `Last seen ${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
}

/** Format message/conversation time for list (e.g. "2m ago", "Yesterday"). Handles backend string or array. */
export function formatMessageTime(createdAt: string | number[] | undefined): string {
  const d = parseBackendDate(createdAt)
  if (!d) return ''
  try {
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
  } catch {
    return ''
  }
}
