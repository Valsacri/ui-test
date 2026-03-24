"use client"

import { ArrowRight } from "lucide-react"
import { useAppBaseUrl } from "@/lib/landing-app-url"

export function LandingHero() {
    const base = useAppBaseUrl()
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
                <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
                    <span className="inline-flex items-center rounded-full border border-[#fed7aa] bg-[#fff7ed] px-3 py-1 text-xs font-semibold text-[#FC8936]">
                        AI-powered sports platform
                    </span>
                    <h1 className="mt-6 text-balance text-4xl font-black tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
                        The complete platform
                        <br />
                        for sports communities
                    </h1>
                    <p className="mt-5 max-w-2xl text-lg text-[#475569]">
                        Connect athletes, organizers, and sponsors. Create events,
                        manage facilities, and grow your sports business - all in one place.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a
                            href={base ? `${base}/signup` : "/signup"}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003C66] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#005A99]"
                        >
                            Get started - it&apos;s free
                            <ArrowRight className="h-4 w-4" />
                        </a>
                        <a
                            href={base ? `${base}/signin` : "/signin"}
                            className="inline-flex items-center justify-center rounded-lg border border-[#e2e8f0] bg-white px-6 py-3 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#f8fafc]"
                        >
                            See how it works
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-y border-[#e2e8f0] bg-[#f1f5f9]">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
                    {[
                        { value: "50K+", label: "Active athletes", accent: false },
                        { value: "2.5K", label: "Events monthly", accent: false },
                        { value: "98%", label: "Organizer satisfaction", accent: false },
                        { value: "3x", label: "Faster event creation", accent: true },
                    ].map((item) => (
                        <div key={item.label}>
                            <p className={`text-4xl font-black ${item.accent ? "text-[#FC8936]" : "text-[#0f172a]"}`}>{item.value}</p>
                            <p className="mt-1 text-sm text-[#64748b]">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
