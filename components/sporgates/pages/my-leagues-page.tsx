"use client"

import { useState, useRef } from "react"
import useSWR from "swr"
import { Trophy, Loader2, Plus, Camera } from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { leagueService } from "@/lib/services/league"
import { authService } from "@/lib/services/auth"
import { sportService } from "@/lib/services/sport"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { resolvePostImageUrl } from "@/lib/utils"
import { toast } from "sonner"

interface MyLeaguesPageProps {
  onNavigate: (page: PageRoute, id?: string) => void
}

export function MyLeaguesPage({ onNavigate }: MyLeaguesPageProps) {
  const user = authService.getCurrentUser()
  const userId = user?.id ?? ""

  const { data: leagues, error, isLoading, mutate } = useSWR(
    userId ? `/leagues/organizer/${userId}` : null,
    () => leagueService.getByOrganizer(userId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: sports = [] } = useSWR("sports", () => sportService.getAll(), {
    revalidateOnFocus: false,
  })

  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState("")
  const [sportId, setSportId] = useState("")
  const [format, setFormat] = useState("Round Robin")
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const logoRef = useRef<HTMLInputElement>(null)

  const list = Array.isArray(leagues) ? leagues : []

  const handleCreate = async () => {
    if (!name.trim() || !sportId) {
      toast.error("Name and sport are required")
      return
    }
    setSaving(true)
    try {
      let logoUrl: string | undefined
      if (logoFile) {
        const res = await leagueService.uploadLogo(logoFile)
        logoUrl = res.url
      }
      const sport = (Array.isArray(sports) ? sports : []).find((s: { id?: string }) => s.id === sportId)
      await leagueService.create({
        name: name.trim(),
        sportId,
        sportName: sport?.name,
        format,
        description: "",
        logoUrl,
      })
      toast.success("League created")
      setShowCreate(false)
      setName("")
      setSportId("")
      setLogoFile(null)
      setLogoPreview(null)
      mutate()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create league"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleStatus = async (id: string, status: string) => {
    try {
      await leagueService.updateStatus(id, status)
      toast.success(`Status: ${status}`)
      mutate()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Update failed")
    }
  }

  if (!userId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My leagues</h1>
        <p className="text-sm text-muted-foreground">Sign in to manage leagues you organize.</p>
      </div>
    )
  }

  if (isLoading && !leagues) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My leagues</h1>
        <ErrorState title="Couldn't load leagues" message={error.message} onRetry={() => mutate()} />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My leagues</h1>
          <p className="text-sm text-muted-foreground">Leagues you organize</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("league-list")}
          className="text-sm font-semibold text-primary"
        >
          Browse all
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowCreate((v) => !v)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-sm font-semibold text-primary"
      >
        <Plus className="h-4 w-4" />
        Create league
      </button>

      {showCreate && (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <div
              className="relative h-14 w-14 shrink-0 cursor-pointer"
              onClick={() => logoRef.current?.click()}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-14 w-14 rounded-xl object-cover" />
              ) : (
                <div className="gradient-secondary flex h-14 w-14 items-center justify-center rounded-xl text-white">
                  <Trophy className="h-6 w-6" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow">
                <Camera className="h-2.5 w-2.5" />
              </div>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)) }
                }}
              />
            </div>
            <input
              className="h-10 flex-1 rounded-xl border border-border bg-muted px-3 text-sm"
              placeholder="League name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <select
            className="h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm"
            value={sportId}
            onChange={(e) => setSportId(e.target.value)}
          >
            <option value="">Select sport</option>
            {(Array.isArray(sports) ? sports : []).map((s: { id: string; name: string }) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            className="h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm"
            placeholder="Format (e.g. Round Robin)"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          />
          <button
            type="button"
            disabled={saving}
            onClick={handleCreate}
            className="w-full rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
        </div>
      )}

      {list.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">You have not created any leagues yet.</p>
      ) : (
        <div className="space-y-3">
          {list.map((item: Record<string, unknown>) => (
            <div
              key={String(item.id)}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <button
                type="button"
                onClick={() => onNavigate("league-detail", String(item.id))}
                className="flex flex-1 items-center gap-3 text-left"
              >
                {(item as { logoUrl?: string }).logoUrl ? (
                  <img src={resolvePostImageUrl((item as { logoUrl: string }).logoUrl)} alt="" className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className="gradient-secondary flex h-10 w-10 items-center justify-center rounded-xl text-white">
                    <Trophy className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground">{String(item.name ?? "")}</p>
                  <p className="text-xs text-muted-foreground">{String(item.status ?? "")}</p>
                </div>
              </button>
              <div className="flex flex-wrap gap-2">
                {item.status === "DRAFT" && (
                  <button
                    type="button"
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    onClick={() => handleStatus(String(item.id), "ACTIVE")}
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
