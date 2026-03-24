"use client"

import { SporgatesLogoText } from "@/components/sporgates/sporgates-logo-text"

export function LandingFooter() {
    return (
        <footer className="border-t border-[#e2e8f0] bg-white">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
                <a href="/" className="inline-flex shrink-0" aria-label="Sporgates home">
                    <SporgatesLogoText heightClass="h-6 sm:h-7" />
                </a>

                <div className="flex items-center gap-6">
                    <a
                        href="#"
                        className="text-sm text-[#64748b] transition-colors hover:text-[#003C66]"
                    >
                        Privacy
                    </a>
                    <a
                        href="#"
                        className="text-sm text-[#64748b] transition-colors hover:text-[#003C66]"
                    >
                        Terms
                    </a>
                    <a
                        href="#"
                        className="text-sm text-[#64748b] transition-colors hover:text-[#003C66]"
                    >
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    )
}
