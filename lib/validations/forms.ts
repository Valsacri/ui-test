import { z } from "zod"

/** Profile (settings): name required, optional email format */
export const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  username: z.string().max(50, "Username is too long").optional(),
  bio: z.string().max(500, "Bio is too long").optional(),
  email: z.string().max(254).optional(),
  phone: z.string().max(20, "Phone is too long").optional(),
})

/** Booking: date and time required for submission (used in parent before calling API) */
export const bookingFormSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  duration: z.number().min(1).max(24),
})

/** Create squad: name and sport required */
export const createSquadSchema = z.object({
  name: z.string().min(1, "Squad name is required").min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
  sport: z.string().min(1, "Please select a sport"),
  description: z.string().max(500).optional(),
  maxMembers: z.coerce.number().min(1).max(500).optional(),
})

/** Create facility: name and type required */
export const createFacilitySchema = z.object({
  name: z.string().min(1, "Facility name is required").min(2, "Name must be at least 2 characters").max(120, "Name is too long"),
  type: z.string().min(1, "Please select a facility type"),
  address: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
})

/** Contact / help form */
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>
export type BookingFormData = z.infer<typeof bookingFormSchema>
export type CreateSquadFormData = z.infer<typeof createSquadSchema>
export type CreateFacilityFormData = z.infer<typeof createFacilitySchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
