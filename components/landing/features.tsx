"use client"

import { Calendar, MapPin, Users, Store } from "lucide-react"
import { useRef, useEffect, useState, type ReactNode } from "react"

interface FeatureCardProps {
    icon: ReactNode
    title: string
    description: string
    delay: number
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
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
        <div
            ref={ref}
            className="group relative rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s, box-shadow 0.3s ease`,
            }}
        >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FC8936]/10 text-[#FC8936] transition-colors group-hover:bg-[#FC8936] group-hover:text-white">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-[#0f172a]">{title}</h3>
            <p className="mt-2 leading-relaxed text-[#475569]">{description}</p>
        </div>
    )
}

const features = [
    {
        icon: <Calendar className="h-6 w-6" />,
        title: "Discover Activities",
        description:
            "Find sports sessions happening around you. From pickup games to organized leagues, your next session is a tap away.",
    },
    {
        icon: <MapPin className="h-6 w-6" />,
        title: "Book Facilities",
        description:
            "Reserve courts, fields, and sports venues easily. No more phone calls or waiting lists.",
    },
    {
        icon: <Users className="h-6 w-6" />,
        title: "Connect With Players",
        description:
            "Build squads, find teammates, and join a community of athletes who share your passion.",
    },
    {
        icon: <Store className="h-6 w-6" />,
        title: "Grow Your Sports Business",
        description:
            "Promote your services, organize events, and build your brand within the sports community.",
    },
]

export function LandingFeatures() {
    return (
        <section className="bg-[#f8fafc] py-24 lg:py-32" id="features">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#FC8936]">
                        Everything you need
                    </p>
                    <h2 className="text-balance text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl md:text-5xl">
                        One platform for the entire sports community
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-[#475569]">
                        Whether you play, organize, or run a sports business, Sporgates
                        brings everything together in one place.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, i) => (
                        <FeatureCard
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            delay={i * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
