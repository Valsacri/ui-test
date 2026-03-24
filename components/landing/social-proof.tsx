"use client"

import { BarChart3, Compass, Sparkles, Users, Wallet } from "lucide-react"

const builtInFeatures = [
    { icon: Sparkles, title: "AI Goal Tracking", desc: "Smart recommendations and personalized progress insights." },
    { icon: Compass, title: "Nearby Discovery", desc: "Find activities, facilities, and events close to you." },
    { icon: Users, title: "Sponsored Events", desc: "Connect businesses with athletes seamlessly." },
    { icon: BarChart3, title: "Campaign Analytics", desc: "Real-time metrics and ROI tracking for sponsors." },
    { icon: Users, title: "Squad System", desc: "Create teams, manage rosters, and compete together." },
    { icon: Wallet, title: "Secure Payments", desc: "Built-in wallet for tickets, subscriptions, and more." },
]

export function LandingSocialProof() {
    return (
        <section className="border-t border-[#e2e8f0] bg-white py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl">
                        Everything you need, built in
                    </h2>
                    <p className="mt-3 text-[#64748b]">
                        Powered by AI and designed for the modern sports ecosystem.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {builtInFeatures.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <div key={feature.title} className="flex gap-3 rounded-xl border border-[#e2e8f0] bg-white p-4">
                                <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#003C66]">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-[#0f172a]">{feature.title}</h3>
                                    <p className="mt-1 text-sm text-[#64748b]">{feature.desc}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
