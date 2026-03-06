"use client"

import { useRef, useState, useEffect } from "react"

const stats = [
    { value: "10,000+", label: "Active players" },
    { value: "50+", label: "Sports supported" },
    { value: "500+", label: "Venues & facilities" },
    { value: "95%", label: "Satisfaction rate" },
]

const avatars = [
    { bg: "bg-[#003C66]", initials: "JM" },
    { bg: "bg-[#005A99]", initials: "SK" },
    { bg: "bg-[#FC8936]", initials: "AL" },
    { bg: "bg-[#003C66]", initials: "TP" },
    { bg: "bg-[#e67a2e]", initials: "RV" },
]

export function LandingSocialProof() {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true)
            },
            { threshold: 0.2 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section className="border-y border-[#e2e8f0] bg-white py-24 lg:py-32" ref={ref}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <div
                        className="mb-8 flex items-center justify-center"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0)" : "translateY(20px)",
                            transition: "opacity 0.6s ease, transform 0.6s ease",
                        }}
                    >
                        <div className="flex -space-x-3">
                            {avatars.map((a) => (
                                <div
                                    key={a.initials}
                                    className={`${a.bg} flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white`}
                                >
                                    {a.initials}
                                </div>
                            ))}
                        </div>
                        <span className="ml-4 text-sm text-[#475569]">
                            & thousands more
                        </span>
                    </div>

                    <h2
                        className="text-balance text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0)" : "translateY(20px)",
                            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
                        }}
                    >
                        Join thousands of players and organizers already using Sporgates
                    </h2>

                    <p
                        className="mt-4 text-lg leading-relaxed text-[#475569]"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0)" : "translateY(20px)",
                            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
                        }}
                    >
                        From casual players to professional organizers, our community is
                        growing every day. Be part of the movement.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="text-center"
                            style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? "translateY(0)" : "translateY(20px)",
                                transition: `opacity 0.6s ease ${0.3 + i * 0.1}s, transform 0.6s ease ${0.3 + i * 0.1}s`,
                            }}
                        >
                            <p className="text-4xl font-bold text-[#003C66] sm:text-5xl">
                                {stat.value}
                            </p>
                            <p className="mt-2 text-sm font-medium text-[#64748b]">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
