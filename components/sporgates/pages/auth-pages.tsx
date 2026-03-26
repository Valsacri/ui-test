"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Eye,
  EyeOff,
  Github,
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
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { SporgatesLogoText } from "@/components/sporgates/sporgates-logo-text"
import { cn } from "@/lib/utils"
import { authService } from "@/lib/services"
import { APP_HOME_PATH, AUTH_COOKIE_NAME } from "@/lib/constants"
import { userService } from "@/lib/services/user"
import { sportService } from "@/lib/services/sport"
import { getApiErrorMessage, isApiError } from "@/lib/api-errors"
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type SignInFormData,
  type SignUpFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "@/lib/validations/auth"

// Inline — no BE endpoint for experience levels
const experienceLevels = [
  { id: "beginner", label: "Beginner", description: "Just starting out" },
  { id: "intermediate", label: "Intermediate", description: "Some experience" },
  { id: "advanced", label: "Advanced", description: "Highly skilled" },
  { id: "professional", label: "Professional", description: "Competitive level" },
]

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
  const [selectedSports, setSelectedSports] = useState<Array<{ id: string; level: string; yearsOfExperience?: number }>>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sports, setSports] = useState<any[]>([])
  const [sportsLoading, setSportsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""))
  const [resendCooldown, setResendCooldown] = useState(0)
  const [verifySuccess, setVerifySuccess] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const [resetToken, setResetToken] = useState("")
  const [tokenExpired, setTokenExpired] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState("")
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // ── react-hook-form instances ──────────────────────────────────────────────
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  })

  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", newConfirmPassword: "" },
  })

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  // Fetch sports from API for the onboarding flow
  useEffect(() => {
    if (page === "choose-sports") {
      setSportsLoading(true)
      sportService
        .getAll()
        .then((data: any) => {
          const list = Array.isArray(data) ? data : data?.content ?? []
          setSports(list)
        })
        .catch(() => setSports([]))
        .finally(() => setSportsLoading(false))
    }
  }, [page])

  // Restore email from localStorage on verify-email page (state is lost on navigation)
  useEffect(() => {
    if (page === "verify-email" && !verifyEmail) {
      const saved = typeof window !== "undefined" ? localStorage.getItem("pending_verification_email") : null
      if (saved) setVerifyEmail(saved)
    }
  }, [page, verifyEmail])

  const handleSignIn = async (data: SignInFormData) => {
    setError(null)
    setLoading(true)
    try {
      const res = await authService.login({ email: data.email, password: data.password })

      if (res?.nextStep === "VERIFY_EMAIL") {
        localStorage.setItem("pending_verification_email", data.email)
        setVerifyEmail(data.email)
        onNavigate("verify-email")
        return
      }
      // Redirect to callbackUrl (set by middleware) or app home
      const params = new URLSearchParams(window.location.search)
      const callbackUrl = params.get('callbackUrl') || APP_HOME_PATH
      window.location.href = callbackUrl
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Login failed. Please try again."))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (data: SignUpFormData) => {
    setError(null)
    setLoading(true)
    try {
      const [firstName, ...rest] = data.fullName.trim().split(" ")
      const lastName = rest.join(" ") || ""
      const username = data.email.split("@")[0] || firstName.toLowerCase()
      await authService.register({ firstName, lastName, email: data.email, password: data.password, passwordConfirm: data.confirmPassword, username })
      // Save email for the verify-email page (state is lost on route change)
      localStorage.setItem("pending_verification_email", data.email)
      onNavigate("verify-email")
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Registration failed. Please try again."))
    } finally {
      setLoading(false)
    }
  }

  const sportsList = sports.map((sport: any) => sport.name)
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
        return [...prev, { id: sportName, level: experienceLevels[0]?.id ?? "beginner", yearsOfExperience: 0 }]
      })
    }

    const handleLevelChange = (sportName: string, levelId: string) => {
      setSelectedSports((prev) =>
        prev.map((item) => (item.id === sportName ? { ...item, level: levelId } : item))
      )
    }

    const handleYearsChange = (sportName: string, value: string) => {
      const years = Math.max(0, parseInt(value, 10) || 0)
      setSelectedSports((prev) =>
        prev.map((item) => (item.id === sportName ? { ...item, yearsOfExperience: years } : item))
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

          {sportsLoading ? (
            <div className="mt-10 flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : sportsList.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">No sports available right now. You can continue and add them later from your profile.</p>
              <button
                type="button"
                onClick={() => onNavigate("set-goals")}
                className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Continue
              </button>
            </div>
          ) : (
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
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-medium text-muted-foreground">Years of experience:</span>
                      <div className="inline-flex h-6 items-center rounded-full border border-border bg-muted">
                        <button
                          type="button"
                          onClick={() => handleYearsChange(sport, String(Math.max(0, (selected.yearsOfExperience ?? 0) - 1)))}
                          className="flex h-6 w-5 items-center justify-center rounded-l-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                          aria-label="Subtract year"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                        <input
                          id={`years-${sport}`}
                          type="number"
                          min={0}
                          step={1}
                          value={selected.yearsOfExperience ?? ""}
                          onChange={(e) => handleYearsChange(sport, e.target.value)}
                          placeholder="0"
                          className="h-6 w-8 border-0 bg-transparent p-0 text-center text-[11px] font-semibold text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleYearsChange(sport, String(Math.max(0, (selected.yearsOfExperience ?? 0) + 1)))}
                          className="flex h-6 w-5 items-center justify-center rounded-r-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                          aria-label="Add year"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground">Level:</span>
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
          )}
        </div>

        {!sportsLoading && sportsList.length > 0 && (
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
                        const sport = sports.find((sp: any) => sp.name === s.id)
                        return {
                          sportId: sport?.id || s.id,
                          sportName: s.id,
                          skillLevel: skillLevelMap[s.level] || "BEGINNER",
                          yearsOfExperience: Math.max(0, s.yearsOfExperience ?? 0),
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
        )}
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
      const emailForVerify = verifyEmail || localStorage.getItem("pending_verification_email") || ""
      if (!emailForVerify) {
        setError("Email not found. Please go back and sign up again.")
        return
      }
      setLoading(true)
      setError(null)
      try {
        await authService.verifyEmail(emailForVerify, code)
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
      const emailForResend = verifyEmail || localStorage.getItem("pending_verification_email") || ""
      if (!emailForResend) {
        setError("Email not found. Please go back and sign up again.")
        return
      }
      try {
        await authService.resendVerification(emailForResend)
        setResendCooldown(60)
        setError(null)
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, "Failed to resend code. Please try again."))
      }
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e5e7eb] px-4 py-8">
        <div className="w-full max-w-xl rounded-3xl border border-[#d1d5db] bg-white p-7 text-center shadow-lg sm:p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FC8936]">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-black text-[#003C66]">Verify Your Email</h1>
          <p className="mx-auto mb-7 max-w-lg text-lg text-[#64748b]">
            We&apos;ve sent a 6-digit verification code to{" "}
            {verifyEmail ? <span className="font-semibold text-[#003C66]">{verifyEmail}</span> : "your email"}.
            {" "}Enter the code below to verify your account.
          </p>

          <div className="mb-8 flex justify-center gap-2 sm:gap-3">
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
                  "h-14 w-12 rounded-xl border-2 bg-[#f8fafc] text-center text-xl font-bold outline-none transition-all sm:h-16 sm:w-14",
                  "focus:border-[#003C66] focus:ring-2 focus:ring-[#003C66]/20",
                  verifySuccess ? "border-green-500 text-green-600" : "border-[#d1d5db] text-[#0f172a]",
                  error && !digit ? "border-red-300" : ""
                )}
              />
            ))}
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}

          {verifySuccess && (
            <p className="mb-4 text-sm font-semibold text-green-600">Email verified successfully! Redirecting...</p>
          )}

          {(() => {
            const verifyDisabled = loading || verifySuccess || verificationCode.join("").length !== 6

            return (
          <button
            type="button"
            onClick={handleVerifyEmail}
            disabled={verifyDisabled}
            className={cn(
              "w-full rounded-2xl py-3 text-lg font-bold text-white transition-colors",
              verifyDisabled
                ? "cursor-not-allowed bg-[#7aa0b8]/70 opacity-60"
                : "bg-[#003C66] hover:bg-[#002f52]"
            )}
          >
            {loading ? "Verifying..." : verifySuccess ? "Verified ✓" : "Verify Email"}
          </button>
            )
          })()}

          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendCooldown > 0}
            className="mt-4 w-full text-base font-semibold text-[#FC8936] transition-colors hover:text-[#e67a2e] disabled:cursor-not-allowed disabled:text-[#94a3b8]"
          >
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend verification code"}
          </button>
        </div>
      </div>
    )
  }

  if (page === "forgot-password") {
    const handleForgotPassword = async (data: ForgotPasswordFormData) => {
      setLoading(true)
      setError(null)
      try {
        await authService.forgotPassword(data.email)
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
            <form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                  {error}
                </div>
              )}
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Email address"
                    {...forgotForm.register("email")}
                    className={cn(
                      "h-12 w-full rounded-full border bg-muted pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary",
                      forgotForm.formState.errors.email ? "border-red-400" : "border-border"
                    )}
                  />
                </div>
                {forgotForm.formState.errors.email && (
                  <p className="mt-1 pl-4 text-xs text-red-500">{forgotForm.formState.errors.email.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="gradient-primary w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  if (page === "reset-password") {
    const handleResetPassword = async (data: ResetPasswordFormData) => {
      const token = resetToken || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") || "" : "")
      if (!token) {
        setError("Reset token is missing. Please use the link from your email.")
        return
      }
      setLoading(true)
      setError(null)
      try {
        await authService.resetPassword(token, data.newPassword, data.newConfirmPassword)
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
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                  {error}
                </div>
              )}
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    {...resetForm.register("newPassword")}
                    className={cn(
                      "h-12 w-full rounded-full border bg-muted pl-11 pr-12 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary",
                      resetForm.formState.errors.newPassword ? "border-red-400" : "border-border"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {resetForm.formState.errors.newPassword && (
                  <p className="mt-1 pl-4 text-xs text-red-500">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    {...resetForm.register("newConfirmPassword")}
                    className={cn(
                      "h-12 w-full rounded-full border bg-muted pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary",
                      resetForm.formState.errors.newConfirmPassword ? "border-red-400" : "border-border"
                    )}
                  />
                </div>
                {resetForm.formState.errors.newConfirmPassword && (
                  <p className="mt-1 pl-4 text-xs text-red-500">{resetForm.formState.errors.newConfirmPassword.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="gradient-primary w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Save Password"}
              </button>
            </form>
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
            onClick={() => {
              if (authService.getToken()) {
                document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
              }
              onNavigate("home")
            }}
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
    <div className="min-h-screen bg-[#e5e7eb]">
      <div className="grid min-h-screen lg:grid-cols-[45%_55%]">
        <div className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col">
          <div className="absolute inset-0" aria-hidden>
            <Image
              src="/images/auth-image.jpg"
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 0px, 45vw"
              priority
            />
            <div className="absolute inset-0 bg-[#003C66]/80" />
          </div>
          <div className="relative z-10 flex min-h-screen flex-col justify-between p-10 text-white">
            <div>
              <SporgatesLogoText variant="onDark" heightClass="h-8 sm:h-9" />
              <h2 className="mt-14 text-5xl font-black leading-tight">
                {isSignIn ? "Welcome back." : "Your sports journey starts here."}
              </h2>
              <p className="mt-4 max-w-md text-sm text-white/80">
                {isSignIn
                  ? "Pick up right where you left off. Your events, your community, your goals - all waiting for you."
                  : "Join a growing community of athletes, organizers, and sponsors building the future of sports."}
              </p>
            </div>
            {isSignIn ? (
              <div className="max-w-md rounded-2xl bg-white/10 p-4 text-sm backdrop-blur-sm">
                <p className="italic text-white/90">
                  &quot;Sporgates has completely changed how I organize local running events.&quot;
                </p>
                <p className="mt-3 font-semibold">Maria Rodriguez</p>
                <p className="text-xs text-white/70">Event Organizer</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xl font-black text-[#FC8936]">50K+ <span className="ml-2 text-sm font-normal text-white/80">Active athletes on the platform</span></p>
                <p className="text-xl font-black text-[#FC8936]">2.5K <span className="ml-2 text-sm font-normal text-white/80">Events created every month</span></p>
                <p className="text-xl font-black text-[#FC8936]">300+ <span className="ml-2 text-sm font-normal text-white/80">Sponsorship campaigns running</span></p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 lg:px-12 xl:px-16">
          <div className="w-full">
            <div className="mb-4 flex justify-center lg:hidden">
              <SporgatesLogoText heightClass="h-7" />
            </div>
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="mb-6 text-xs font-medium text-[#64748b] transition-colors hover:text-[#003C66]"
            >
              ← Back to home
            </button>

            <div className="mx-auto mb-5 max-w-xl text-center">
              <h1 className="text-3xl font-black text-[#0f172a]">
                {isSignIn ? "Sign in to your account" : "Create your account"}
              </h1>
              <p className="mt-2 text-sm text-[#64748b]">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => onNavigate(isSignIn ? "signup" : "signin")}
                  className="font-semibold text-[#003C66] hover:underline"
                >
                  {isSignIn ? "Create one" : "Sign in"}
                </button>
              </p>
            </div>

            <div className="mx-auto max-w-xl space-y-2">
              <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] bg-white py-2.5 text-sm font-medium text-[#0f172a]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z" />
                </svg>
                Continue with Google
              </button>
              <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] bg-white py-2.5 text-sm font-medium text-[#0f172a]">
                <Github className="h-4 w-4" />
                Continue with GitHub
              </button>
            </div>

            <div className="mx-auto my-5 flex max-w-xl items-center gap-3">
              <div className="h-px flex-1 bg-[#d1d5db]" />
              <span className="text-xs text-[#94a3b8]">OR</span>
              <div className="h-px flex-1 bg-[#d1d5db]" />
            </div>

            {isSignIn ? (
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="mx-auto max-w-xl space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#334155]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  <input
                    type="email"
                    placeholder="Email address"
                    {...signInForm.register("email")}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#003C66] focus:ring-2 focus:ring-[#003C66]/20",
                      signInForm.formState.errors.email ? "border-red-400" : "border-[#e2e8f0]"
                    )}
                  />
                </div>
                {signInForm.formState.errors.email && (
                  <p className="mt-1 pl-2 text-xs text-red-500">{signInForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-medium text-[#334155]">Password</label>
                  <button
                    type="button"
                    onClick={() => onNavigate("forgot-password")}
                    className="text-xs font-semibold text-[#003C66] transition-colors hover:text-[#005A99]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...signInForm.register("password")}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#003C66] focus:ring-2 focus:ring-[#003C66]/20",
                      signInForm.formState.errors.password ? "border-red-400" : "border-[#e2e8f0]"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {signInForm.formState.errors.password && (
                  <p className="mt-1 pl-2 text-xs text-red-500">{signInForm.formState.errors.password.message}</p>
                )}
              </div>
              {error && (
                <p className="text-center text-xs text-red-500">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#003C66] py-3 text-sm font-bold text-white transition-colors hover:bg-[#005A99] disabled:opacity-50"
              >
                {loading ? "Please wait..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="mx-auto max-w-xl space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#334155]">Full name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  <input
                    type="text"
                    placeholder="Full name"
                    {...signUpForm.register("fullName")}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#003C66] focus:ring-2 focus:ring-[#003C66]/20",
                      signUpForm.formState.errors.fullName ? "border-red-400" : "border-[#e2e8f0]"
                    )}
                  />
                </div>
                {signUpForm.formState.errors.fullName && (
                  <p className="mt-1 pl-2 text-xs text-red-500">{signUpForm.formState.errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#334155]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  <input
                    type="email"
                    placeholder="Email address"
                    {...signUpForm.register("email")}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#003C66] focus:ring-2 focus:ring-[#003C66]/20",
                      signUpForm.formState.errors.email ? "border-red-400" : "border-[#e2e8f0]"
                    )}
                  />
                </div>
                {signUpForm.formState.errors.email && (
                  <p className="mt-1 pl-2 text-xs text-red-500">{signUpForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#334155]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...signUpForm.register("password")}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#003C66] focus:ring-2 focus:ring-[#003C66]/20",
                      signUpForm.formState.errors.password ? "border-red-400" : "border-[#e2e8f0]"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {signUpForm.formState.errors.password && (
                  <p className="mt-1 pl-2 text-xs text-red-500">{signUpForm.formState.errors.password.message}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    {...signUpForm.register("confirmPassword")}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#003C66] focus:ring-2 focus:ring-[#003C66]/20",
                      signUpForm.formState.errors.confirmPassword ? "border-red-400" : "border-[#e2e8f0]"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="mt-1 pl-2 text-xs text-red-500">{signUpForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              {error && (
                <p className="text-center text-xs text-red-500">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#003C66] py-3 text-sm font-bold text-white transition-colors hover:bg-[#005A99] disabled:opacity-50"
              >
                {loading ? "Please wait..." : "Create Account"}
              </button>
              <p className="text-center text-xs text-[#64748b]">
                By signing up, you agree to our <span className="font-semibold text-[#0f172a]">Terms of Service</span> and <span className="font-semibold text-[#0f172a]">Privacy Policy</span>
              </p>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}
