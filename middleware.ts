import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME, PUBLIC_ROUTES } from '@/lib/constants'

/**
 * Server-side auth middleware.
 * 
 * Since JWT tokens live in localStorage (not accessible server-side),
 * we use a cookie marker (`auth_logged_in`) set after successful login.
 * The client-side AuthGuard remains as a secondary check for
 * token validity and logout events.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

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
