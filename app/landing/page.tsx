import { LandingHeader } from "@/components/landing/header"
import { LandingHero } from "@/components/landing/hero"
import { LandingPartnersBand } from "@/components/landing/partners-band"
import { LandingFeatures } from "@/components/landing/features"
import { LandingSocialProof } from "@/components/landing/social-proof"
import { LandingCTA } from "@/components/landing/cta"
import { LandingFooter } from "@/components/landing/footer"

export const metadata = {
    title: "Sporgates – Sports Community & Business Platform",
    description:
        "Discover activities, book facilities, connect with athletes, and grow your sports business. One place for players, organizers, and brands.",
}

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#f8fafc]">
            <LandingHeader />
            <main>
                <LandingHero />
                <LandingPartnersBand />
                <LandingFeatures />
                <LandingSocialProof />
                <LandingCTA />
            </main>
            <LandingFooter />
        </div>
    )
}
