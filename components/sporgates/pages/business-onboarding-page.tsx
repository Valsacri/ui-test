"use client"

import { useState } from "react"
import {
    Building2,
    ArrowRight,
    CalendarDays,
    Users,
    Package,
    BarChart3,
    CheckCircle2,
    Sparkles,
    Dumbbell,
    GraduationCap,
    HeartPulse,
    ShoppingBag,
    Medal,
} from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface BusinessOnboardingPageProps {
    onNavigate: (page: PageRoute) => void
}

const businessTypes = [
    { id: "gym", label: "Gym & Training", icon: Dumbbell },
    { id: "sports-complex", label: "Sports Complex", icon: Building2 },
    { id: "academy", label: "Academy", icon: GraduationCap },
    { id: "wellness", label: "Wellness Center", icon: HeartPulse },
    { id: "retail", label: "Sports Retail", icon: ShoppingBag },
    { id: "coaching", label: "Coaching", icon: Medal },
]

const setupChecklist = [
    { id: "profile", label: "Set up your business profile", icon: Building2, route: "create-business" as const },
    { id: "activity", label: "Create your first activity", icon: CalendarDays, route: "create-activity" as const },
    { id: "team", label: "Invite team members", icon: Users, route: "add-team-member" as const },
    { id: "resource", label: "Add facilities & resources", icon: Package, route: "create-facility" as const },
    { id: "analytics", label: "View your analytics", icon: BarChart3, route: "business-analytics" as const },
]

export function BusinessOnboardingPage({ onNavigate }: BusinessOnboardingPageProps) {
    const [selectedType, setSelectedType] = useState("")
    const [step, setStep] = useState<"welcome" | "type" | "checklist">("welcome")

    return (
        <div className="mx-auto max-w-2xl space-y-8 pb-20 lg:pb-0">
            {/* ===== WELCOME ===== */}
            {step === "welcome" && (
                <div className="animate-fade-in text-center space-y-6 pt-12">
                    <div className="gradient-primary mx-auto flex h-24 w-24 items-center justify-center rounded-3xl text-white shadow-xl">
                        <Building2 className="h-12 w-12" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Welcome to Sporgates Business
                        </h1>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                            Manage your sports business, create activities, track analytics,
                            and grow your community — all from one place.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {[
                            { icon: CalendarDays, label: "Create Activities", desc: "Host sports events" },
                            { icon: Users, label: "Manage Teams", desc: "Staff & athletes" },
                            { icon: BarChart3, label: "Track Analytics", desc: "Revenue & insights" },
                        ].map((feature) => (
                            <div
                                key={feature.label}
                                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                            >
                                <feature.icon className="mx-auto mb-2 h-7 w-7 text-primary" />
                                <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                                <p className="text-[11px] text-muted-foreground">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setStep("type")}
                        className="gradient-primary mx-auto flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
                    >
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* ===== BUSINESS TYPE ===== */}
            {step === "type" && (
                <div className="animate-fade-in space-y-6 pt-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-foreground">
                            What type of business are you?
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We&apos;ll customize your dashboard based on your choice.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {businessTypes.map((type) => (
                            <button
                                type="button"
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all",
                                    selectedType === type.id
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "border-border hover:bg-muted"
                                )}
                            >
                                <type.icon className="h-8 w-8 mb-1 text-primary transition-colors" />
                                <p className="text-xs font-semibold text-foreground">{type.label}</p>
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            if (selectedType) {
                                localStorage.setItem("businessType", selectedType)
                                setStep("checklist")
                            }
                        }}
                        disabled={!selectedType}
                        className={cn(
                            "mx-auto flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-white shadow-lg transition-all",
                            selectedType
                                ? "gradient-primary hover:opacity-90"
                                : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                        )}
                    >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* ===== SETUP CHECKLIST ===== */}
            {step === "checklist" && (
                <div className="animate-fade-in space-y-6 pt-8">
                    <div className="text-center">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                            <Sparkles className="h-7 w-7 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">You&apos;re all set!</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Complete these steps to get the most out of Sporgates Business.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
                        {setupChecklist.map((item, index) => (
                            <button
                                type="button"
                                key={item.id}
                                onClick={() => onNavigate(item.route)}
                                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-muted group"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                                    <p className="text-[10px] text-muted-foreground">Step {index + 1}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => onNavigate("business-dashboard")}
                        className="gradient-primary mx-auto flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
                    >
                        Go to Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onNavigate("business-dashboard")}
                        className="mx-auto block text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Skip for now →
                    </button>
                </div>
            )}
        </div>
    )
}
