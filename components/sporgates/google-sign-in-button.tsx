"use client"

import { getGoogleOAuthStartUrl } from "@/lib/constants"
import { cn } from "@/lib/utils"

type GoogleSignInButtonProps = {
  disabled?: boolean
}

/**
 * Starts Google OAuth 2.0 on the API (authorization code + client secret on server).
 * Uses NEXT_PUBLIC_API_URL + `/auth/google/start` when set (recommended on dev/prod droplets);
 * otherwise same-origin `/auth/google/start` (Next rewrite → local API).
 */
export function GoogleSignInButton({ disabled }: GoogleSignInButtonProps) {
  return (
    <a
      href={getGoogleOAuthStartUrl()}
      aria-disabled={disabled}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] bg-white py-2.5 text-sm font-medium text-[#0f172a] transition-colors hover:bg-[#f8fafc]",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"
        />
      </svg>
      Continue with Google
    </a>
  )
}
