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
} as const

// ── Auth ───────────────────────────────────────────────────
export const AUTH_TOKEN_TYPE = 'Bearer'
export const AUTH_COOKIE_NAME = 'auth_logged_in'

// ── Public Routes (no auth required) ──────────────────────
export const PUBLIC_ROUTES = [
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/choose-sports',
    '/set-goals',
    '/onboarding-confirmation',
] as const

// ── API Config ────────────────────────────────────────────
export const API_TIMEOUT_MS = 15000
/** Story media upload (larger files); slightly longer than default API timeout */
export const STORY_UPLOAD_TIMEOUT_MS = 60 * 1000 // 1 minute
export const DEFAULT_API_BASE_URL = 'http://localhost:8080/api'
