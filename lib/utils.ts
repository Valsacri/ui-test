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
