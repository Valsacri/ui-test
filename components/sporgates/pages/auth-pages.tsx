"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, CheckCircle, Zap, TrendingUp, Trophy } from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface AuthPageProps {
  page:
    | "signin"
    | "signup"
    | "forgot-password"
    | "reset-password"
    | "verify-email"
    | "choose-sports"
    | "experience-level"
    | "set-goals"
    | "onboarding-confirmation"
  onNavigate: (page: PageRoute) => void
}

export function AuthPages({ page, onNavigate }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const sportsList = ["Basketball", "Soccer", "Tennis", "Swimming", "Running", "Volleyball", "Boxing", "Yoga", "Cycling", "Golf"]

  if (page === "choose-sports") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-2 text-center">
            <div className="gradient-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white">
              S
            </div>
            <h1 className="text-xl font-bold text-foreground">Choose Your Sports</h1>
            <p className="text-sm text-muted-foreground">Select the sports you are interested in</p>
          </div>
          <div className="my-6 grid grid-cols-2 gap-3">
            {sportsList.map((sport) => (
              <button
                type="button"
                key={sport}
                onClick={() =>
                  setSelectedSports((prev) =>
                    prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
                  )
                }
                className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                  selectedSports.includes(sport)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-primary/40"
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onNavigate("experience-level")}
            className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  if (page === "experience-level") {
    const levels = [
      { id: "beginner", label: "Beginner", description: "Just getting started with sports and fitness", icon: Zap },
      { id: "intermediate", label: "Intermediate", description: "Comfortable with regular training and games", icon: TrendingUp },
      { id: "advanced", label: "Advanced", description: "Competitive level with years of experience", icon: Trophy },
    ]

    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-2 text-center">
            <div className="gradient-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white">
              S
            </div>
            <h1 className="text-xl font-bold text-foreground">Your Experience Level</h1>
            <p className="text-sm text-muted-foreground">Help us personalize your experience</p>
          </div>
          <div className="my-6 space-y-3">
            {levels.map((level) => (
              <button
                type="button"
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all",
                  selectedLevel === level.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  selectedLevel === level.id ? "bg-primary/10" : "bg-muted"
                )}>
                  <level.icon className={cn("h-5 w-5", selectedLevel === level.id ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div>
                  <p className={cn("text-sm font-semibold", selectedLevel === level.id ? "text-primary" : "text-foreground")}>{level.label}</p>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onNavigate("set-goals")}
            className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  if (page === "set-goals") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-2 text-center">
            <div className="gradient-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white">
              S
            </div>
            <h1 className="text-xl font-bold text-foreground">Set Your Goals</h1>
            <p className="text-sm text-muted-foreground">What would you like to achieve?</p>
          </div>
          <div className="my-6 space-y-3">
            {["Stay fit and healthy", "Compete in leagues", "Meet new people", "Learn a new sport", "Train for events"].map((goal) => (
              <button
                type="button"
                key={goal}
                onClick={() =>
                  setSelectedGoals((prev) =>
                    prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
                  )
                }
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all",
                  selectedGoals.includes(goal)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-foreground hover:border-primary/40"
                )}
              >
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                  selectedGoals.includes(goal) ? "border-primary bg-primary" : "border-border"
                )}>
                  {selectedGoals.includes(goal) && (
                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                {goal}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onNavigate("onboarding-confirmation")}
            className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            Get Started
          </button>
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
