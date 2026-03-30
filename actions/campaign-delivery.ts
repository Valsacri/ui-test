"use server"

import { cookies } from "next/headers"
import { z } from "zod"
import { INTERNAL_APP_ORIGIN } from "@/lib/constants"

const recordEventSchema = z.object({
  placement: z.enum(["HOME_FEED", "BUSINESS_FEED"]),
  eventKey: z.string().min(1).max(128),
  campaignId: z.string().min(1),
  creativeId: z.string().min(1),
  type: z.enum(["IMPRESSION", "CLICK"]),
})

export type RecordCampaignDeliveryResult = { ok: true } | { ok: false; error: string }

export async function recordCampaignDeliveryEventAction(
  raw: z.infer<typeof recordEventSchema>
): Promise<RecordCampaignDeliveryResult> {
  const parsed = recordEventSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: "Invalid payload" }
  }

  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ")

  const res = await fetch(`${INTERNAL_APP_ORIGIN}/v1/campaigns/delivery-events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(parsed.data),
    cache: "no-store",
  })

  if (!res.ok) {
    return { ok: false, error: "Request failed" }
  }

  // Attribution cookie: set only after CLICK is accepted by the backend.
  if (parsed.data.type === "CLICK") {
    const attributionValue = `${parsed.data.campaignId}|${parsed.data.creativeId}|${parsed.data.placement}`
    cookieStore.set({
      name: "spg_campaign_attribution",
      value: encodeURIComponent(attributionValue),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  }
  return { ok: true }
}
