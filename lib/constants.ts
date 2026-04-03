/**
 * Application-wide constants.
 * Centralizes hardcoded strings for localStorage keys, auth routes, and API config.
 */

// ── LocalStorage Keys ─────────────────────────────────────
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    ACTIVE_BUSINESS_ID: 'activeBusinessId',
    /** Session-only: onboarding participation roles until confirmation redirect (cleared after use). */
    ONBOARDING_PARTICIPANT_ROLES: 'sporgates_onboarding_participant_roles',
} as const

// ── Auth ───────────────────────────────────────────────────
export const AUTH_TOKEN_TYPE = 'Bearer'
export const AUTH_COOKIE_NAME = 'auth_logged_in'
/** Logged-in app home; used after sign-in and for “go home” navigation */
export const APP_HOME_PATH = '/home'

// ── Public Routes (no auth required) ──────────────────────
export const PUBLIC_ROUTES = [
    '/landing',
    '/auth',
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/choose-sports',
    '/set-goals',
    '/onboarding-location',
    '/onboarding-activity',
    '/onboarding-notifications',
    '/onboarding-confirmation',
    '/oauth/google',
] as const

// ── API Config ────────────────────────────────────────────
export const API_TIMEOUT_MS = 15000
/** Story media upload (larger files); slightly longer than default API timeout */
export const STORY_UPLOAD_TIMEOUT_MS = 60 * 1000 // 1 minute
/** Server-side / non-browser callers (e.g. tests). Browser uses same-origin '' + rewrites. */
export const DEFAULT_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

/**
 * Google OAuth browser entry (GET). Default: same-origin `/auth/google/start` so the URL bar stays
 * on the app host (e.g. dev.sporgates.com); next.config rewrites proxy to Spring.
 * Set NEXT_PUBLIC_OAUTH_USE_API_ORIGIN=true only if you must bypass rewrites (e.g. debugging).
 */
export function getGoogleOAuthStartUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_OAUTH_USE_API_ORIGIN === "true") {
    const base = process.env.NEXT_PUBLIC_API_URL
    if (base && base.trim().length > 0) {
      return `${base.replace(/\/$/, "")}/auth/google/start`
    }
  }
  return "/auth/google/start"
}

/** Next.js app origin for server-side fetch to same-origin API rewrites (RSC, server actions). */
export const INTERNAL_APP_ORIGIN =
  process.env.INTERNAL_APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof process.env.VERCEL_URL === "string" && process.env.VERCEL_URL.length > 0
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000")
