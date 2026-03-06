import React from "react"
import {
    Calendar,
    MapPin,
    Users,
    Store,
    ArrowRight,
    Sparkles,
} from "lucide-react"

const APP_URL = "https://app.sporgates.com"

export const metadata = {
    title: "Sporgates – Sports Community & Business Platform",
    description:
        "Discover activities, book facilities, connect with athletes, and grow your sports business. One place for players, organizers, and brands.",
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
            {/* Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <span className="text-xl font-bold tracking-tight text-[#003C66]">
                        Sporgates
                    </span>
                    <a
                        href={APP_URL}
                        className="inline-flex items-center gap-2 rounded-full bg-[#003C66] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#005A99]"
                    >
                        Open app
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
                <div
                    className="absolute inset-0 -z-10 opacity-[0.07]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, #003C66 0%, transparent 50%),
                                          radial-gradient(circle at 80% 20%, #FC8936 0%, transparent 40%)`,
                    }}
                />
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
                    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#003C66]/20 bg-[#003C66]/5 px-4 py-1.5 text-sm font-medium text-[#003C66]">
                        <Sparkles className="h-4 w-4" />
                        Sports community & business in one place
                    </p>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#0f172a] sm:text-5xl md:text-6xl">
                        Where sport meets{" "}
                        <span className="bg-gradient-to-r from-[#003C66] to-[#005A99] bg-clip-text text-transparent">
                            community
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-[#475569] sm:text-xl">
                        Discover activities, book facilities, connect with athletes and
                        organizers, and grow your sports business—all in one platform.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <a
                            href={`${APP_URL}/signup`}
                            className="inline-flex items-center gap-2 rounded-full bg-[#FC8936] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#FC8936]/25 transition hover:bg-[#e67a2e]"
                        >
                            Get started free
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a
                            href={APP_URL}
                            className="inline-flex items-center gap-2 rounded-full border-2 border-[#003C66] px-6 py-3 text-base font-semibold text-[#003C66] transition hover:bg-[#003C66]/5"
                        >
                            Open app
                        </a>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-t border-[#e2e8f0] bg-white py-20 sm:py-24">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <h2 className="text-center text-3xl font-bold text-[#0f172a] sm:text-4xl">
                        Everything you need for sport
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-center text-[#64748b]">
                        For players, organizers, and businesses.
                    </p>
                    <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: Calendar,
                                title: "Discover activities",
                                description:
                                    "Find and join sports activities, events, and sessions near you.",
                                color: "text-[#003C66]",
                                bg: "bg-[#003C66]/10",
                            },
                            {
                                icon: MapPin,
                                title: "Book facilities",
                                description:
                                    "Reserve courts, pitches, and venues in a few taps.",
                                color: "text-[#005A99]",
                                bg: "bg-[#005A99]/10",
                            },
                            {
                                icon: Users,
                                title: "Connect with people",
                                description:
                                    "Meet athletes, squads, and organizers in your sport.",
                                color: "text-[#FC8936]",
                                bg: "bg-[#FC8936]/10",
                            },
                            {
                                icon: Store,
                                title: "Grow your business",
                                description:
                                    "List services, run campaigns, and manage your sports brand.",
                                color: "text-[#003C66]",
                                bg: "bg-[#003C66]/10",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="group rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm transition hover:border-[#003C66]/20 hover:shadow-md"
                            >
                                <div
                                    className={`inline-flex rounded-xl p-3 ${item.bg} ${item.color}`}
                                >
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-[#0f172a]">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-[#64748b]">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-[#e2e8f0] bg-gradient-to-br from-[#003C66] via-[#005A99] to-[#003C66] py-20 sm:py-24">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Ready to get in the game?
                    </h2>
                    <p className="mt-4 text-lg text-white/90">
                        Join Sporgates and discover your next session, squad, or opportunity.
                    </p>
                    <a
                        href={`${APP_URL}/signup`}
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FC8936] px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-black/20 transition hover:bg-[#e67a2e]"
                    >
                        Create free account
                        <ArrowRight className="h-5 w-5" />
                    </a>
                    <p className="mt-6 text-sm text-white/70">
                        Already have an account?{" "}
                        <a
                            href={`${APP_URL}/signin`}
                            className="font-medium text-white underline underline-offset-2 hover:no-underline"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#e2e8f0] bg-white py-8">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
                    <span className="font-semibold text-[#003C66]">Sporgates</span>
                    <div className="flex gap-6 text-sm text-[#64748b]">
                        <a
                            href={APP_URL}
                            className="hover:text-[#003C66]"
                        >
                            Open app
                        </a>
                        <a
                            href={`${APP_URL}/signin`}
                            className="hover:text-[#003C66]"
                        >
                            Sign in
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
