"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { SporgatesLogoText } from "@/components/sporgates/sporgates-logo-text"
import { useAppBaseUrl } from "@/lib/landing-app-url"

export function LandingHeader() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const base = useAppBaseUrl()

    return (
        <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/95 backdrop-blur">
            <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                <a href="/" className="inline-flex shrink-0" aria-label="Sporgates home">
                    <SporgatesLogoText heightClass="h-6 sm:h-7" priority />
                </a>

                <div className="hidden items-center gap-8 md:flex">
                    <a href="#for-athletes" className="text-sm text-[#475569] transition-colors hover:text-[#003C66]">Athletes</a>
                    <a href="#for-organizers" className="text-sm text-[#475569] transition-colors hover:text-[#003C66]">Organizers</a>
                    <a href="#for-sponsors" className="text-sm text-[#475569] transition-colors hover:text-[#003C66]">Sponsors</a>
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <a
                        href={base ? `${base}/signin` : "/signin"}
                        className="text-sm font-medium text-[#475569] transition-colors hover:text-[#003C66]"
                    >
                        Log in
                    </a>
                    <a
                        href={base ? `${base}/signup` : "/signup"}
                        className="inline-flex items-center rounded-lg bg-[#003C66] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#005A99]"
                    >
                        Sign up
                    </a>
                </div>

                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="inline-flex justify-center rounded-md p-2 text-[#475569] transition-colors hover:text-[#003C66] md:hidden"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {mobileOpen && (
                <div className="border-t border-[#e2e8f0] bg-white px-4 pb-6 pt-4 md:hidden">
                    <div className="flex flex-col gap-4">
                        <a href="#for-athletes" className="text-sm text-[#475569] transition-colors hover:text-[#003C66]">Athletes</a>
                        <a href="#for-organizers" className="text-sm text-[#475569] transition-colors hover:text-[#003C66]">Organizers</a>
                        <a href="#for-sponsors" className="text-sm text-[#475569] transition-colors hover:text-[#003C66]">Sponsors</a>
                        <a
                            href={base ? `${base}/signin` : "/signin"}
                            className="text-sm font-medium text-[#475569] transition-colors hover:text-[#003C66]"
                        >
                            Log in
                        </a>
                        <a
                            href={base ? `${base}/signup` : "/signup"}
                            className="inline-flex justify-center rounded-lg bg-[#003C66] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005A99]"
                        >
                            Sign up
                        </a>
                    </div>
                </div>
            )}
        </header>
    )
}
