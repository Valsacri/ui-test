"use client"

import { CreateSquadPage } from "@/components/sporgates/pages/create-squad-page"
import { useAppRouter } from "@/lib/route-map"

export default function CreateSquadRoute() {
    const { navigate } = useAppRouter()
    return <CreateSquadPage onNavigate={navigate} />
}
