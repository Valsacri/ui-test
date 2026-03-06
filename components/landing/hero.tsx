"use client"

import { ArrowRight } from "lucide-react"

const APP_URL = "https://app.sporgates.com"

export function LandingHero() {
    return (
        <section className="relative min-h-[32rem] w-full overflow-hidden sm:min-h-[36rem] lg:min-h-[42rem]">
            {/* Background: gradient (add /public/images/hero-sports.jpg and use next/image for photo hero) */}
            <div className="absolute inset-0 w-full bg-gradient-to-br from-[#003C66] via-[#005A99] to-[#003C66]" />

            <div className="absolute inset-0 bg-black/30" aria-hidden />
            <div
                className="absolute inset-0 bg-gradient-to-br from-[#003C66]/30 via-transparent to-[#005A99]/20"
                aria-hidden
            />

            <div className="pointer-events-none absolute inset-0">
                <div className="animate-float absolute right-[10%] top-[15%] h-16 w-16 rounded-full bg-[#FC8936]/15 blur-sm" />
                <div
                    className="animate-float absolute right-[15%] top-[25%] h-8 w-8 rounded-full bg-[#FFA05C]/20 blur-sm"
                    style={{ animationDelay: "1s" }}
                />
                <div
                    className="animate-float absolute left-[8%] bottom-[20%] h-12 w-12 rounded-full bg-[#FC8936]/10 blur-sm"
                    style={{ animationDelay: "2s" }}
                />
            </div>

            <div className="relative z-10 mx-auto flex min-h-[32rem] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[36rem] sm:py-24 lg:min-h-[42rem] lg:pb-32 lg:pt-28">
                <div className="flex flex-col items-center">
                    <div className="animate-slide-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                        <span className="h-2 w-2 rounded-full bg-[#FC8936]" />
                        <span className="text-xs font-medium uppercase tracking-wide text-white/95">
                            The sports community platform
                        </span>
                    </div>

                    <h1
                        className="animate-slide-up text-balance text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl"
                        style={{ animationDelay: "0.1s" }}
                    >
                        Where Sport{" "}
                        <span className="relative">
                            Meets
                            <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#FC8936]" />
                        </span>{" "}
                        Community
                    </h1>

                    <p
                        className="animate-slide-up mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg md:text-xl"
                        style={{ animationDelay: "0.2s" }}
                    >
                        Discover activities, book facilities, connect with athletes and
                        organizers, and grow your sports business.
                    </p>

                    <div
                        className="animate-slide-up mt-10 flex flex-col gap-4 sm:flex-row"
                        style={{ animationDelay: "0.3s" }}
                    >
                        <a
                            href={`${APP_URL}/signup`}
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FC8936] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#FC8936]/25 transition-all hover:bg-[#e67a2e] hover:shadow-xl hover:shadow-[#FC8936]/30 focus:outline-none focus:ring-2 focus:ring-[#FC8936] focus:ring-offset-2 focus:ring-offset-[#003C66]"
                        >
                            Get Started Free
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                        <a
                            href={APP_URL}
                            className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#003C66]"
                        >
                            Open App
                        </a>
                    </div>

                    <div
                        className="animate-slide-up mt-14 flex items-center gap-8 sm:gap-12"
                        style={{ animationDelay: "0.45s" }}
                    >
                        {[
                            { value: "10K+", label: "Active Players" },
                            { value: "500+", label: "Facilities" },
                            { value: "2K+", label: "Sessions Weekly" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl font-bold text-white drop-shadow-sm sm:text-3xl">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-xs text-white/70 sm:text-sm">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
