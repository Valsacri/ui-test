import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME, PUBLIC_ROUTES } from '@/lib/constants'

const LANDING_HOSTS = ['www.sporgates.com', 'sporgates.com']
const APP_HOST = 'app.sporgates.com'

/**
 * Server-side middleware: domain-based routing + auth.
 *
 * - www.sporgates.com / sporgates.com → landing page at /
 * - app.sporgates.com → app (auth required for protected routes)
 * - JWT lives in localStorage; we use cookie marker `auth_logged_in` for server-side auth check.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const host = request.headers.get('host') ?? ''

    // Domain-based routing: landing vs app
    const isLandingDomain = LANDING_HOSTS.some((h) => host.toLowerCase() === h)
    const isAppDomain = host.toLowerCase() === APP_HOST

    if (isLandingDomain && pathname === '/') {
        // Serve landing at root on www / apex
        const url = request.nextUrl.clone()
        url.pathname = '/landing'
        return NextResponse.rewrite(url)
    }

    if (isAppDomain && pathname === '/landing') {
        // On app subdomain, send /landing visitors to app home
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Allow public routes, static assets, and API routes
    if (
        PUBLIC_ROUTES.some(route => pathname.startsWith(route)) ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/uploads') ||
        pathname.startsWith('/v1') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Check for auth cookie marker — redirect to signin if missing
    const authCookie = request.cookies.get(AUTH_COOKIE_NAME)
    if (!authCookie?.value) {
        const signinUrl = new URL('/signin', request.url)
        signinUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signinUrl)
    }

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
