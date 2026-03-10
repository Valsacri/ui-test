"use client"

import Image from "next/image"

/**
 * Infinite scrolling band of partner brand icons.
 * Icons from Simple Icons (CC0-1.0) – https://simpleicons.org
 * Duplicated 3× so the band loops seamlessly (translate -33.333%).
 */
const PARTNERS = [
    { name: "Nike", icon: "/images/partners/nike.svg" },
    { name: "Adidas", icon: "/images/partners/adidas.svg" },
    { name: "Decathlon", icon: null, color: "#0066B2" },
    { name: "Puma", icon: "/images/partners/puma.svg" },
    { name: "Under Armour", icon: "/images/partners/underarmour.svg" },
    { name: "Reebok", icon: "/images/partners/reebok.svg" },
    { name: "Fila", icon: "/images/partners/fila.svg" },
    { name: "New Balance", icon: "/images/partners/newbalance.svg" },
    { name: "Garmin", icon: "/images/partners/garmin.svg" },
    { name: "Strava", icon: "/images/partners/strava.svg" },
]

function PartnerItem({
    name,
    icon,
    color,
}: {
    name: string
    icon: string | null
    color?: string
}) {
    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-2xl border border-[#e2e8f0] bg-white px-6 py-3.5 shadow-sm transition hover:border-[#003C66]/20 hover:shadow-md"
            style={{ minWidth: "120px" }}
        >
            {icon ? (
                <Image
                    src={icon}
                    alt={name}
                    width={64}
                    height={28}
                    className="h-7 w-auto object-contain"
                />
            ) : (
                <span
                    className="text-base font-bold tracking-tight"
                    style={{ color: color ?? "#000" }}
                >
                    {name}
                </span>
            )}
        </div>
    )
}

export function LandingPartnersBand() {
    // 3 copies so the band loops seamlessly: when we translate -33.333%, the next segment is identical
    const bandItems = [...PARTNERS, ...PARTNERS, ...PARTNERS]

    return (
        <section className="border-y border-[#e2e8f0] bg-[#f1f5f9] py-8" aria-label="Partners">
            <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-[#64748b]">
                Trusted by leading sports brands
            </p>
            <div className="relative w-full overflow-hidden">
                <div className="flex w-max animate-partners-scroll gap-5">
                    {bandItems.map((partner, i) => (
                        <PartnerItem
                            key={`${partner.name}-${i}`}
                            name={partner.name}
                            icon={partner.icon ?? null}
                            color={"color" in partner ? partner.color : undefined}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
