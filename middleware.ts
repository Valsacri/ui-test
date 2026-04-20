import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { APP_HOME_PATH, AUTH_COOKIE_NAME, PUBLIC_ROUTES } from '@/lib/constants'

const LANDING_HOSTS = ['www.sporgates.com', 'sporgates.com']

/**
 * Server-side middleware: domain-based routing + auth.
 *
 * - www.sporgates.com / sporgates.com → landing page at /
 * - app.sporgates.com → app (auth required for protected routes)
 * - API auth uses HttpOnly cookies (access/refresh tokens from the backend). Middleware cannot read those
 *   for routing; it uses the non-HttpOnly marker cookie `auth_logged_in` to infer “has a session” for
 *   redirects. The browser still sends HttpOnly tokens to `/auth` and `/v1` via `withCredentials`.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const host = request.headers.get('host') ?? ''

    // Domain-based routing: landing vs app
    const isLandingDomain = LANDING_HOSTS.some((h) => host.toLowerCase() === h)
    const isAppOrLocal = !isLandingDomain // app.sporgates.com or localhost

    // www.sporgates.com / sporgates.com: always show landing at / (no /landing in URL)
    if (isLandingDomain && pathname === '/') {
        const url = request.nextUrl.clone()
        url.pathname = '/landing'
        return NextResponse.rewrite(url)
    }

    // app.sporgates.com (and localhost): at "/" always go to app home (fake user is always logged in)
    if (isAppOrLocal && pathname === '/') {
        return NextResponse.redirect(new URL(APP_HOME_PATH, request.url))
    }

    // If they hit /landing on app (or localhost), send to home (fake user is always logged in)
    if (isAppOrLocal && pathname === '/landing') {
        return NextResponse.redirect(new URL(APP_HOME_PATH, request.url))
    }

    // Allow public routes, static assets, and API routes
    if (
        PUBLIC_ROUTES.some(route => pathname.startsWith(route)) ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/uploads') ||
        pathname.startsWith('/v1') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // No auth check needed - fake user is always logged in
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
