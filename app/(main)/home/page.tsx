import { HomePage } from "@/components/sporgates/pages/home-page"
import { fetchCampaignServeHome } from "@/lib/server/campaign-serve"

export default async function HomeRoute() {
  const initialCampaignPlacement = await fetchCampaignServeHome()
  return <HomePage initialCampaignPlacement={initialCampaignPlacement} />
}
