"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useAppBaseUrl } from "@/lib/landing-app-url"

export function LandingHeader() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const base = useAppBaseUrl()

    return (
        <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-lg">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                <span
                    className="text-xl font-bold tracking-tight text-[#003C66] sm:text-2xl"
                    aria-label="Sporgates home"
                >
                    Sporgates
                </span>

                <div className="hidden items-center gap-6 md:flex">
                    <a
                        href={base ? `${base}/` : "/"}
                        className="text-sm font-medium text-[#475569] transition-colors hover:text-[#003C66]"
                    >
                        Open App
                    </a>
                    <a
                        href={base ? `${base}/signin` : "/signin"}
                        className="text-sm font-medium text-[#475569] transition-colors hover:text-[#003C66]"
                    >
                        Sign In
                    </a>
                    <a
                        href={base ? `${base}/signup` : "/signup"}
                        className="inline-flex items-center rounded-lg bg-[#FC8936] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e67a2e] focus:outline-none focus:ring-2 focus:ring-[#FC8936] focus:ring-offset-2"
                    >
                        Get Started
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
                        <a
                            href={base ? `${base}/` : "/"}
                            className="text-sm font-medium text-[#475569] transition-colors hover:text-[#003C66]"
                        >
                            Open App
                        </a>
                        <a
                            href={base ? `${base}/signin` : "/signin"}
                            className="text-sm font-medium text-[#475569] transition-colors hover:text-[#003C66]"
                        >
                            Sign In
                        </a>
                        <a
                            href={base ? `${base}/signup` : "/signup"}
                            className="inline-flex justify-center rounded-lg bg-[#FC8936] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e67a2e]"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            )}
        </header>
    )
}
