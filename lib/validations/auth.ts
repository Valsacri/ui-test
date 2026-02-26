import { z } from "zod"

// ─── Shared field schemas ────────────────────────────────────────────────────

const emailField = z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")

const passwordField = z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character")

const nameField = z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters")

// ─── Auth form schemas ───────────────────────────────────────────────────────

export const signInSchema = z.object({
    email: emailField,
    password: z.string().min(1, "Password is required"),
})

export const signUpSchema = z
    .object({
        fullName: nameField,
        email: emailField,
        password: passwordField,
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export const forgotPasswordSchema = z.object({
    email: emailField,
})

export const resetPasswordSchema = z
    .object({
        newPassword: passwordField,
        newConfirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.newConfirmPassword, {
        message: "Passwords do not match",
        path: ["newConfirmPassword"],
    })

export const verifyEmailSchema = z.object({
    code: z
        .string()
        .length(6, "Please enter the full 6-digit code")
        .regex(/^\d{6}$/, "Code must contain only digits"),
})

// ─── Inferred types ──────────────────────────────────────────────────────────

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>
