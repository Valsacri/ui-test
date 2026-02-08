"use client"

import { useState } from "react"
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Lock,
  User,
  CheckCircle,
  Check,
  Target,
  Users,
  Dumbbell,
  Flag,
  Trophy,
} from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { experienceLevels, sports } from "@/lib/mock-data"

interface AuthPageProps {
  page:
    | "signin"
    | "signup"
    | "forgot-password"
    | "reset-password"
    | "verify-email"
    | "choose-sports"
    | "set-goals"
    | "onboarding-confirmation"
  onNavigate: (page: PageRoute) => void
}

export function AuthPages({ page, onNavigate }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedSports, setSelectedSports] = useState<Array<{ id: string; level: string }>>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const sportsList = sports.map((sport) => sport.name)
  const goalCategories = [
    { id: "fitness", label: "Stay fit and healthy", icon: Dumbbell },
    { id: "compete", label: "Compete in leagues", icon: Trophy },
    { id: "community", label: "Meet new people", icon: Users },
    { id: "skills", label: "Learn a new sport", icon: Target },
    { id: "events", label: "Train for events", icon: Flag },
  ]

  if (page === "choose-sports") {
    const handleToggleSport = (sportName: string) => {
      setSelectedSports((prev) => {
        const existing = prev.find((item) => item.id === sportName)
        if (existing) {
          return prev.filter((item) => item.id !== sportName)
        }
        return [...prev, { id: sportName, level: experienceLevels[0]?.id ?? "beginner" }]
      })
    }

    const handleLevelChange = (sportName: string, levelId: string) => {
      setSelectedSports((prev) =>
        prev.map((item) => (item.id === sportName ? { ...item, level: levelId } : item))
      )
    }

    return (
      <div className="min-h-[80vh]">
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
            <button
              type="button"
              onClick={() => onNavigate("verify-email")}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <div className="flex gap-2">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      step === 1 ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Step 1 of 2</span>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-10">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-foreground">What sports interest you?</h1>
            <p className="text-sm text-muted-foreground">
              Choose your sports and set your experience level for each one.
            </p>
          </div>

          <div className="mt-8 grid gap-4">
            {sportsList.map((sport) => {
              const selected = selectedSports.find((item) => item.id === sport)
              return (
                <div
                  key={sport}
                  className={cn(
                    "rounded-2xl border border-border bg-card p-4 shadow-sm",
                    selected && "border-primary/60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{sport}</p>
                      <p className="text-xs text-muted-foreground">Choose a level to personalize matches</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSport(sport)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {selected ? "Selected" : "Add"}
                    </button>
                  </div>

                  {selected && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {experienceLevels.map((level) => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => handleLevelChange(sport, level.id)}
                          className={cn(
                            "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
                            selected.level === level.id
                              ? "bg-secondary text-white"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur">
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={() => onNavigate("set-goals")}
              disabled={selectedSports.length === 0}
              className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (page === "set-goals") {
    return (
      <div className="min-h-[80vh]">
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
            <button
              type="button"
              onClick={() => onNavigate("choose-sports")}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <div className="flex gap-2">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      "bg-primary"
                    )}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Step 2 of 2</span>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-10">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-foreground">What are your goals?</h1>
            <p className="text-sm text-muted-foreground">
              Select one or more goals. We will tailor recommendations for you.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {goalCategories.map((goal) => {
              const isSelected = selectedGoals.includes(goal.label)
              const Icon = goal.icon

              return (
                <button
                  type="button"
                  key={goal.id}
                  onClick={() =>
                    setSelectedGoals((prev) =>
                      prev.includes(goal.label)
                        ? prev.filter((item) => item !== goal.label)
                        : [...prev, goal.label]
                    )
                  }
                  className={cn(
                    "relative rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all",
                    "hover:border-primary/60",
                    isSelected && "border-secondary bg-secondary/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        isSelected ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={cn("text-sm font-semibold", isSelected ? "text-secondary" : "text-foreground")}>
                        {goal.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="rounded-full bg-secondary text-white">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {selectedGoals.length > 0 && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              {selectedGoals.length} {selectedGoals.length === 1 ? "goal" : "goals"} selected
            </p>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur">
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={() => onNavigate("onboarding-confirmation")}
              disabled={selectedGoals.length === 0}
              className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (page === "verify-email") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg text-center">
          <div className="gradient-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-foreground">Check Your Email</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {"We've sent a verification link to your email address. Please click the link to verify your account."}
          </p>
          <button
            type="button"
            onClick={() => onNavigate("choose-sports")}
            className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            {"I've Verified My Email"}
          </button>
          <button
            type="button"
            className="mt-3 w-full text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
          >
            Resend verification email
          </button>
        </div>
      </div>
    )
  }

  if (page === "forgot-password") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
          <button
            type="button"
            onClick={() => onNavigate("signin")}
            className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </button>
          <div className="mb-6 text-center">
            <div className="gradient-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white">
              S
            </div>
            <h1 className="text-xl font-bold text-foreground">Reset Password</h1>
            <p className="text-sm text-muted-foreground">
              {"Enter your email and we'll send you a reset link"}
            </p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                className="h-12 w-full rounded-full border border-border bg-muted pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              className="gradient-primary w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (page === "reset-password") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="gradient-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white">
              S
            </div>
            <h1 className="text-xl font-bold text-foreground">Set New Password</h1>
            <p className="text-sm text-muted-foreground">Choose a strong new password</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="h-12 w-full rounded-full border border-border bg-muted pl-11 pr-12 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder="Confirm password"
                className="h-12 w-full rounded-full border border-border bg-muted pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              onClick={() => onNavigate("signin")}
              className="gradient-primary w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
            >
              Save Password
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (page === "onboarding-confirmation") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
          <div className="gradient-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-foreground">You're All Set</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Your profile is ready. Start exploring activities and connect with the community.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  // Sign In / Sign Up
  const isSignIn = page === "signin"

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="gradient-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white">
            S
          </div>
          <h1 className="text-xl font-bold text-foreground">
            {isSignIn ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignIn
              ? "Sign in to continue your sports journey"
              : "Join the Sporgates community today"}
          </p>
        </div>

        <div className="space-y-4">
          {!isSignIn && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Full name"
                className="h-12 w-full rounded-full border border-border bg-muted pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              className="h-12 w-full rounded-full border border-border bg-muted pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="h-12 w-full rounded-full border border-border bg-muted pl-11 pr-11 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {isSignIn && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => onNavigate("forgot-password")}
                className="text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
              >
                Forgot password?
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => onNavigate(isSignIn ? "home" : "verify-email")}
            className="gradient-primary w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => onNavigate(isSignIn ? "signup" : "signin")}
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  )
}
