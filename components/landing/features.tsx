"use client"

import { Calendar, Handshake, Radar } from "lucide-react"

const audienceCards = [
    {
        id: "for-athletes",
        icon: Radar,
        title: "For Athletes",
        description: "Discover activities, join events, and connect with your sports community.",
        bullets: ["AI-powered goal tracking", "Activities nearby", "Squads and community events"],
        featured: false,
    },
    {
        id: "for-organizers",
        icon: Calendar,
        title: "For Organizers",
        description: "Create events, manage facilities, run campaigns, and grow your sports business.",
        bullets: ["Create and manage activities", "Launch sponsorship campaigns", "Team and resource management"],
        featured: true,
    },
    {
        id: "for-sponsors",
        icon: Handshake,
        title: "For Sponsors",
        description: "Connect with athletes, sponsor events, and maximize your brand impact.",
        bullets: ["Sponsorship opportunities", "Real-time campaign analytics", "Direct athlete collaboration"],
        featured: false,
    },
]

export function LandingFeatures() {
    return (
        <section className="bg-white py-20 lg:py-24" id="features">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl">
                        Built for everyone in sports
                    </h2>
                    <p className="mt-3 text-[#64748b]">
                        Whether you compete, organize, or sponsor - Sporgates has the tools you need.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {audienceCards.map((card) => {
                        const Icon = card.icon
                        return (
                            <article
                                id={card.id}
                                key={card.title}
                                className={`rounded-2xl border p-6 shadow-sm transition-all ${
                                    card.featured
                                        ? "border-[#003C66] bg-[#f8fafc] shadow-md"
                                        : "border-[#e2e8f0] bg-white"
                                }`}
                            >
                                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#003C66]">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#0f172a]">{card.title}</h3>
                                <p className="mt-2 text-sm text-[#64748b]">{card.description}</p>
                                <ul className="mt-4 space-y-2 text-sm text-[#334155]">
                                    {card.bullets.map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FC8936]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
