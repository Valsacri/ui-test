"use client"

import { useAppBaseUrl } from "@/lib/landing-app-url"

export function LandingFooter() {
    const base = useAppBaseUrl()

    return (
        <footer className="border-t border-[#e2e8f0] bg-[#f8fafc]">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
                <span className="text-lg font-bold tracking-tight text-[#003C66]">
                    Sporgates
                </span>

                <div className="flex items-center gap-6">
                    <a
                        href={base ? `${base}/` : "/"}
                        className="text-sm text-[#64748b] transition-colors hover:text-[#003C66]"
                    >
                        Open App
                    </a>
                    <a
                        href={base ? `${base}/signin` : "/signin"}
                        className="text-sm text-[#64748b] transition-colors hover:text-[#003C66]"
                    >
                        Sign In
                    </a>
                </div>

                <p className="text-xs text-[#64748b]">
                    © {new Date().getFullYear()} Sporgates. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
