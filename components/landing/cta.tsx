"use client"

import { ArrowRight } from "lucide-react"
import { useAppBaseUrl } from "@/lib/landing-app-url"

export function LandingCTA() {
    const base = useAppBaseUrl()
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#003C66] to-[#005A99] py-24 lg:py-32">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div className="animate-float absolute right-[15%] top-[20%] h-20 w-20 rounded-full bg-[#FC8936]/10 blur-md" />
                <div
                    className="animate-float absolute left-[10%] bottom-[25%] h-14 w-14 rounded-full bg-white/5 blur-sm"
                    style={{ animationDelay: "1.5s" }}
                />
                <svg
                    className="absolute inset-0 h-full w-full opacity-[0.04]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <line x1="10%" y1="0" x2="90%" y2="100%" stroke="white" strokeWidth="1" />
                    <line x1="30%" y1="0" x2="70%" y2="100%" stroke="white" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
                <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                    Ready to get in the game?
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                    Whether you are looking for your next session, building a squad, or
                    growing your sports brand, Sporgates is where it all happens.
                </p>

                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <a
                        href={base ? `${base}/signup` : "/signup"}
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FC8936] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#FC8936]/25 transition-all hover:bg-[#e67a2e] hover:shadow-xl hover:shadow-[#FC8936]/30 focus:outline-none focus:ring-2 focus:ring-[#FC8936] focus:ring-offset-2 focus:ring-offset-[#003C66]"
                    >
                        Create Free Account
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>

                <p className="mt-6 text-sm text-white/50">
                    Already have an account?{" "}
                    <a
                        href={base ? `${base}/signin` : "/signin"}
                        className="font-medium text-white/80 underline underline-offset-4 transition-colors hover:text-white"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </section>
    )
}
