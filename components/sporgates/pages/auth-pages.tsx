"use client"

import { useState, useRef, useEffect } from "react"
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
  Clock,
} from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { experienceLevels, sports } from "@/lib/mock-data"
import { authService } from "@/lib/services"
import { userService } from "@/lib/services/user"
import { getApiErrorMessage, isApiError } from "@/lib/api-errors"

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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""))
  const [resendCooldown, setResendCooldown] = useState(0)
  const [verifySuccess, setVerifySuccess] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newConfirmPassword, setNewConfirmPassword] = useState("")
  const [tokenExpired, setTokenExpired] = useState(false)
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  // Restore email from localStorage on verify-email page (state is lost on navigation)
  useEffect(() => {
    if (page === "verify-email" && !email) {
      const saved = typeof window !== "undefined" ? localStorage.getItem("pending_verification_email") : null
      if (saved) setEmail(saved)
    }
  }, [page, email])

  const handleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      await authService.login({ email, password })
      onNavigate("home")
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Login failed. Please try again."))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }
    try {
      const [firstName, ...rest] = fullName.trim().split(" ")
      const lastName = rest.join(" ") || ""
      const username = email.split("@")[0] || firstName.toLowerCase()
      await authService.register({ firstName, lastName, email, password, passwordConfirm: confirmPassword, username })
      // Save email for the verify-email page (state is lost on route change)
      localStorage.setItem("pending_verification_email", email)
      onNavigate("verify-email")
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Registration failed. Please try again."))
    } finally {
      setLoading(false)
    }
  }

  const sportsList = sports.map((sport) => sport.name)
  const goalCategories = [
    { id: "fitness", label: "Stay fit and healthy", icon: Dumbbell, goalType: "GENERAL_FITNESS" },
    { id: "compete", label: "Compete in leagues", icon: Trophy, goalType: "SPORTS_SKILL" },
    { id: "community", label: "Meet new people", icon: Users, goalType: "OVERALL_HEALTH" },
    { id: "skills", label: "Learn a new sport", icon: Target, goalType: "SPORTS_SKILL" },
    { id: "events", label: "Train for events", icon: Flag, goalType: "ENDURANCE" },
  ]

  const skillLevelMap: Record<string, string> = {
    beginner: "BEGINNER",
    intermediate: "INTERMEDIATE",
    advanced: "ADVANCED",
  }

  const getUserId = (): string | null => {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    try { return JSON.parse(userStr).id } catch { return null }
  }

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
              onClick={async () => {
                const userId = getUserId()
                if (userId) {
                  setLoading(true)
                  setError(null)
                  try {
                    const prefs = selectedSports.map((s) => {
                      const sport = sports.find((sp) => sp.name === s.id)
                      return {
                        sportId: sport?.id || s.id,
                        sportName: s.id,
                        skillLevel: skillLevelMap[s.level] || "BEGINNER",
                      }
                    })
                    await userService.updateSportsPreferences(userId, prefs)
                  } catch (err: unknown) {
                    console.error("Failed to save sports preferences", err)
                  } finally {
                    setLoading(false)
                  }
                }
                onNavigate("set-goals")
              }}
              disabled={selectedSports.length === 0 || loading}
              className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue"}
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
              onClick={async () => {
                const userId = getUserId()
                if (userId) {
                  setLoading(true)
                  setError(null)
                  try {
                    const goalsData = selectedGoals.map((label) => {
                      const cat = goalCategories.find((g) => g.label === label)
                      return {
                        type: cat?.goalType || "GENERAL_FITNESS",
                        description: label,
                        priority: "MEDIUM",
                      }
                    })
                    await userService.updateGoals(userId, goalsData)
                  } catch (err: unknown) {
                    console.error("Failed to save goals", err)
                  } finally {
                    setLoading(false)
                  }
                }
                onNavigate("onboarding-confirmation")
              }}
              disabled={selectedGoals.length === 0 || loading}
              className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Get Started"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (page === "verify-email") {
    const handleCodeChange = (index: number, value: string) => {
      if (value.length > 1) {
        // Handle paste of full code
        const digits = value.replace(/\D/g, "").slice(0, 6).split("")
        const newCode = [...verificationCode]
        digits.forEach((d, i) => {
          if (index + i < 6) newCode[index + i] = d
        })
        setVerificationCode(newCode)
        const nextIndex = Math.min(index + digits.length, 5)
        codeInputRefs.current[nextIndex]?.focus()
        return
      }
      if (value && !/^\d$/.test(value)) return
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus()
      }
    }

    const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
        codeInputRefs.current[index - 1]?.focus()
      }
    }

    const handleVerifyEmail = async () => {
      const code = verificationCode.join("")
      if (code.length !== 6) {
        setError("Please enter the full 6-digit code")
        return
      }
      const verifyEmail = email || localStorage.getItem("pending_verification_email") || ""
      if (!verifyEmail) {
        setError("Email not found. Please go back and sign up again.")
        return
      }
      setLoading(true)
      setError(null)
      try {
        await authService.verifyEmail(verifyEmail, code)
        setVerifySuccess(true)
        localStorage.removeItem("pending_verification_email")
        setTimeout(() => onNavigate("choose-sports"), 1500)
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, "Verification failed. Please try again."))
      } finally {
        setLoading(false)
      }
    }

    const handleResendCode = async () => {
      if (resendCooldown > 0) return
      const resendEmail = email || localStorage.getItem("pending_verification_email") || ""
      if (!resendEmail) {
        setError("Email not found. Please go back and sign up again.")
        return
      }
      try {
        await authService.resendVerification(resendEmail)
        setResendCooldown(60)
        setError(null)
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, "Failed to resend code. Please try again."))
      }
    }

    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg text-center">
          <div className="gradient-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-foreground">Verify Your Email</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            We&apos;ve sent a 6-digit verification code to{" "}
            {email ? <span className="font-semibold text-foreground">{email}</span> : "your email"}.
            Enter the code below to verify your account.
          </p>

          <div className="flex justify-center gap-2 mb-6">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { codeInputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                onFocus={(e) => e.target.select()}
                className={cn(
                  "h-14 w-12 rounded-xl border-2 bg-muted text-center text-xl font-bold outline-none transition-all",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20",
                  verifySuccess ? "border-green-500 text-green-600" : "border-border text-foreground",
                  error && !digit ? "border-red-300" : ""
                )}
              />
            ))}
          </div>

          {error && (
            <p className="mb-4 text-xs text-red-500">{error}</p>
          )}

          {verifySuccess && (
            <p className="mb-4 text-xs font-semibold text-green-600">Email verified successfully! Redirecting...</p>
          )}

          <button
            type="button"
            onClick={handleVerifyEmail}
            disabled={loading || verifySuccess || verificationCode.join("").length !== 6}
            className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Verifying..." : verifySuccess ? "Verified ✓" : "Verify Email"}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendCooldown > 0}
            className="mt-3 w-full text-xs font-semibold text-secondary transition-colors hover:text-secondary/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend verification code"}
          </button>
        </div>
      </div>
    )
  }

  if (page === "forgot-password") {
    const handleForgotPassword = async () => {
      if (!email) {
        setError("Please enter your email address")
        return
      }
      setLoading(true)
      setError(null)
      try {
        await authService.forgotPassword(email)
        setForgotSuccess(true)
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, "Failed to send reset link. Please try again."))
      } finally {
        setLoading(false)
      }
    }

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
          {forgotSuccess ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-950">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                If an account exists with that email, you will receive a password reset link shortly.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("signin")}
                className="mt-3 text-sm font-semibold text-primary hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-full border border-border bg-muted pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="gradient-primary w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (page === "reset-password") {
    const handleResetPassword = async () => {
      if (!newPassword || !newConfirmPassword) {
        setError("Please fill in both password fields")
        return
      }
      if (newPassword !== newConfirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }
      const token = resetToken || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") || "" : "")
      if (!token) {
        setError("Reset token is missing. Please use the link from your email.")
        return
      }
      setLoading(true)
      setError(null)
      try {
        await authService.resetPassword(token, newPassword, newConfirmPassword)
        setVerifySuccess(true)
        setTimeout(() => onNavigate("signin"), 2000)
      } catch (err: unknown) {
        const expired = isApiError(err, 'reset.token.invalid', 'reset.token.expired')
        setError(getApiErrorMessage(err, "Failed to reset password. Please try again."))
        if (expired) setTokenExpired(true)
      } finally {
        setLoading(false)
      }
    }

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
          {tokenExpired ? (
            <div className="space-y-4 text-center">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  Link Expired
                </p>
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  This password reset link has expired or has already been used. Please request a new one.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("forgot-password")}
                className="gradient-primary w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
              >
                Request New Link
              </button>
              <button
                type="button"
                onClick={() => onNavigate("signin")}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          ) : verifySuccess ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-950">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Password reset successfully! Redirecting to sign in...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  value={newConfirmPassword}
                  onChange={(e) => setNewConfirmPassword(e.target.value)}
                  className="h-12 w-full rounded-full border border-border bg-muted pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
                className="gradient-primary w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Save Password"}
              </button>
            </div>
          )}
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 w-full rounded-full border border-border bg-muted pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-full border border-border bg-muted pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {!isSignIn && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 w-full rounded-full border border-border bg-muted pl-11 pr-11 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}
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
          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}
          <button
            type="button"
            onClick={isSignIn ? handleSignIn : handleSignUp}
            disabled={loading}
            className="gradient-primary w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignIn ? "Sign In" : "Create Account"}
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
