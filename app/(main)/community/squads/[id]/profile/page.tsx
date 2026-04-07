import { redirect } from "next/navigation"

export default function SquadProfileRoute({
  params,
}: {
  params: { id: string }
}) {
  redirect(`/community/squads/${params.id}`)
}
