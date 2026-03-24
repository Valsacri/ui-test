"use client"

import { ArrowRight } from "lucide-react"
import { useAppBaseUrl } from "@/lib/landing-app-url"

export function LandingCTA() {
    const base = useAppBaseUrl()
    return (
        <section className="bg-[#003C66] py-14">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Ready to get started?
                    </h2>
                    <p className="mt-2 text-white/75">
                        Join thousands of athletes and organizers on Sporgates.
                    </p>
                </div>
                <div className="w-full md:w-auto">
                    <a
                        href={base ? `${base}/signup` : "/signup"}
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FC8936] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e67a2e] md:w-auto"
                    >
                        Create Free Account
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>
            </div>
        </section>
    )
}
