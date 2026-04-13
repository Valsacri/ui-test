/** @type {import('next').NextConfig} */
/**
 * Backend base URL including servlet context path `/api` (see Sporgates-backend `server.servlet.context-path`).
 * Rewrites proxy from this Next app to the API; the browser only sees same-origin `/uploads`, `/v1`, `/auth`.
 * - Production Docker: set INTERNAL_API_URL to the hostname the Next server can reach (e.g. http://api:8080/api).
 * - Otherwise NEXT_PUBLIC_API_URL must be the public API URL (e.g. https://dev.api.sporgates.com/api).
 */
function apiBaseUrl() {
  const raw =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8080/api'
  return raw.replace(/\/+$/, '')
}

const nextConfig = {
  output: 'standalone',
  transpilePackages: ['three'],

  /**
   * Baseline security headers (see .agents/rules/security-standards.md).
   * Tune CSP if you add new third-party scripts or embeds.
   */
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    /** @type {{ key: string; value: string }[]} */
    const base = [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
      },
    ]
    if (isProd) {
      base.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      })
    }
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com",
      // Three.js DRACOLoader uses blob: workers; without worker-src, script-src blocks them.
      "worker-src 'self' blob: https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' data: https:",
      // DRACO/Three may fetch() same-origin blob: URLs during decode.
      "connect-src 'self' blob: https: http: ws: wss:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
    base.push({ key: 'Content-Security-Policy', value: csp })
    return [{ source: '/:path*', headers: base }]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/upload/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // DigitalOcean Spaces public URLs (add your bucket host if different)
      {
        protocol: 'https',
        hostname: 'imagesstorage.fra1.digitaloceanspaces.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const apiUrl = apiBaseUrl()
    return [
      // Same-origin proxy for DO Spaces images so WebGL TextureLoader is not blocked by missing CORS on the bucket.
      {
        source: '/spaces-cdn/:path*',
        destination: 'https://imagesstorage.fra1.digitaloceanspaces.com/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      },
      {
        source: '/auth/:path*',
        destination: `${apiUrl}/auth/:path*`,
      },
      {
        source: '/v1/:path*',
        destination: `${apiUrl}/v1/:path*`,
      },
    ]
  },
}

export default nextConfig

