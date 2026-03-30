import { cookies } from "next/headers"
import { INTERNAL_APP_ORIGIN } from "@/lib/constants"
import type { ServedCampaignPlacement } from "@/lib/types/campaign-delivery"

/**
 * Server-only: load a served campaign for HOME_FEED using the incoming request cookies
 * (HttpOnly auth cookies forwarded through the Next.js rewrite to the API).
 */
export async function fetchCampaignServeHome(): Promise<ServedCampaignPlacement | null> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ")

  const url = `${INTERNAL_APP_ORIGIN}/v1/campaigns/serve?placement=HOME_FEED`
  const res = await fetch(url, {
    headers: {
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  })

  if (res.status === 204 || !res.ok) {
    return null
  }

  return (await res.json()) as ServedCampaignPlacement
}
