"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { ArrowLeft, Copy, Download, Loader2, Plus, Save, Shirt, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  JerseySponsorPreview,
  type JerseySponsorPreviewHandle,
} from "@/components/sporgates/campaign/jersey-sponsor-preview"
import type { PageRoute } from "@/lib/navigation"
import {
  FONT_CHOICES,
  PLACEMENT_ZONE_IDS,
  PLACEMENT_ZONE_LABELS,
  campaignJerseyPlacementSchema,
  placementEditorSchema,
  defaultJerseyCustomTextOptions,
  defaultPlacementEditorSettings,
  defaultZonePlacementAdjust,
  type JerseyCustomTextOptions,
  type PlacementEditorSettings,
  type PlacementZoneId,
  type ZonePlacementAdjust,
  type ZoneSurfaceAnchor,
} from "@/lib/types/campaign-jersey-placement"
import { swrDefaults } from "@/lib/fetcher"
import { authService, kitTemplatesService } from "@/lib/services"
import type { JerseyKitTemplateDto } from "@/lib/types/kit-template"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import JSZip from "jszip"

/** Theme `accent` / `secondary` are brand orange — neutral hovers keep kit actions navy/gray, not orange. */
const kitOutlineNeutral = "border-border bg-background hover:bg-muted hover:text-foreground"

interface CampaignPlacementPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

const JERSEY_PRESET_ID = "prototype-v1"
const MAX_LOGO_BYTES = 2 * 1024 * 1024
/** Radix Select cannot use empty string; map to no kit selected. */
const KIT_SELECT_NONE = "__none__"

const EMPTY_SAVED_KITS: JerseyKitTemplateDto[] = []

const DEFAULT_ZONES: Record<PlacementZoneId, boolean> = {
  chest: true,
  back: true,
  left_sleeve: true,
  right_sleeve: true,
}

const NUDGE = 0.012
const ROT_STEP = 5
const SCALE_STEP = 0.1

const DEFAULT_JERSEY_HEX = "#4371ad"

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl)
  return res.blob()
}

function zonesFromApi(raw: Record<string, boolean>): Record<PlacementZoneId, boolean> {
  return {
    chest: !!raw.chest,
    back: !!raw.back,
    left_sleeve: !!raw.left_sleeve,
    right_sleeve: !!raw.right_sleeve,
  }
}

function loadImageDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Image load failed"))
    img.src = dataUrl
  })
}

/** 2×2 sheet: front | back / left | right with labels. */
async function buildJerseyCollage(shots: { name: string; label: string; dataUrl: string }[]): Promise<string> {
  const cell = 1024
  const canvas = document.createElement("canvas")
  canvas.width = cell * 2
  canvas.height = cell * 2
  const ctx = canvas.getContext("2d")
  if (!ctx) return ""
  ctx.fillStyle = "#f4f4f5"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const layout: Array<{ name: string; gx: number; gy: number }> = [
    { name: "front", gx: 0, gy: 0 },
    { name: "back", gx: 1, gy: 0 },
    { name: "left", gx: 0, gy: 1 },
    { name: "right", gx: 1, gy: 1 },
  ]
  for (const { name, gx, gy } of layout) {
    const shot = shots.find((s) => s.name === name)
    if (!shot) continue
    const img = await loadImageDataUrl(shot.dataUrl)
    ctx.drawImage(img, gx * cell, gy * cell, cell, cell)
    ctx.fillStyle = "rgba(0,0,0,0.55)"
    ctx.fillRect(gx * cell, gy * cell, cell, 40)
    ctx.fillStyle = "#fff"
    ctx.font = "bold 20px system-ui, sans-serif"
    ctx.fillText(shot.label, gx * cell + 14, gy * cell + 27)
  }
  return canvas.toDataURL("image/png")
}

export function CampaignPlacementPage({ onNavigate }: CampaignPlacementPageProps) {
  const previewRef = useRef<JerseySponsorPreviewHandle>(null)
  const currentUser = authService.getCurrentUser()
  const { data: savedKitsData, isLoading: kitsLoading, mutate: mutateSavedKits } = useSWR(
    currentUser?.id ? "kit-templates-mine" : null,
    () => kitTemplatesService.listMine(),
    { ...swrDefaults }
  )
  const savedKits = savedKitsData ?? EMPTY_SAVED_KITS
  const [jerseyColor, setJerseyColor] = useState(DEFAULT_JERSEY_HEX)
  const [zones, setZones] = useState<Record<PlacementZoneId, boolean>>(DEFAULT_ZONES)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [editor, setEditor] = useState<PlacementEditorSettings>(() => defaultPlacementEditorSettings())
  const [selectedZone, setSelectedZone] = useState<PlacementZoneId>("chest")
  const [exporting, setExporting] = useState(false)
  const [savingKit, setSavingKit] = useState(false)
  const [kitName, setKitName] = useState("My kit")
  /** Dropdown selection for which kit to load (not necessarily the one being edited). */
  const [loadTemplateId, setLoadTemplateId] = useState<string>("")
  /**
   * Server id for the kit row that Save will PATCH (set after Load or after first successful create).
   * Null means the next save creates a new row. Use “Save as new copy” to clear without losing the canvas.
   */
  const [editingKitTemplateId, setEditingKitTemplateId] = useState<string | null>(null)
  const [deleteKitDialogOpen, setDeleteKitDialogOpen] = useState(false)

  useEffect(() => {
    return () => {
      if (logoUrl?.startsWith("blob:")) URL.revokeObjectURL(logoUrl)
    }
  }, [logoUrl])

  const onLogoFile = useCallback((file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Please upload a PNG, JPEG, or WebP image."); return }
    if (file.size > MAX_LOGO_BYTES) { toast.error("Logo must be 2 MB or smaller."); return }
    setLogoUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }, [])

  const toggleZone = (z: PlacementZoneId) => setZones((prev) => ({ ...prev, [z]: !prev[z] }))

  const patchZoneAdjust = (zone: PlacementZoneId, patch: Partial<ZonePlacementAdjust>) =>
    setEditor((prev) => ({
      ...prev,
      zoneAdjustments: { ...prev.zoneAdjustments, [zone]: { ...prev.zoneAdjustments[zone], ...patch } },
    }))

  const resetZone = (zone: PlacementZoneId) =>
    setEditor((prev) => {
      const { [zone]: _removed, ...restAnchors } = prev.zoneAnchors
      return { ...prev, zoneAnchors: restAnchors, zoneAdjustments: { ...prev.zoneAdjustments, [zone]: defaultZonePlacementAdjust() } }
    })

  const onZoneAnchorChange = useCallback(
    (zone: PlacementZoneId, anchor: ZoneSurfaceAnchor) =>
      setEditor((prev) => ({ ...prev, zoneAnchors: { ...prev.zoneAnchors, [zone]: anchor } })),
    []
  )

  const onCustomTextAnchorChange = useCallback((anchor: ZoneSurfaceAnchor) => {
    setEditor((prev) => ({ ...prev, customTextAnchor: anchor }))
  }, [])

  const patchCustomText = (patch: Partial<JerseyCustomTextOptions>) =>
    setEditor((prev) => ({ ...prev, customText: { ...prev.customText, ...patch } }))

  const resetCustomText = () =>
    setEditor((prev) => ({ ...prev, customText: defaultJerseyCustomTextOptions(), customTextAnchor: undefined }))

  const resetAllPlacement = () => {
    setEditor((prev) => ({ ...defaultPlacementEditorSettings(), cameraDistanceMul: prev.cameraDistanceMul, modelYawDeg: prev.modelYawDeg }))
    toast.message("All placements reset.")
  }

  const selAdj = editor.zoneAdjustments[selectedZone]
  const ctAdj = editor.customText.adjust

  const applyKitTemplate = useCallback((t: JerseyKitTemplateDto) => {
    setKitName(t.name)
    setJerseyColor(t.jerseyColor)
    setZones(zonesFromApi(t.zones))
    const ed = placementEditorSchema.safeParse(t.editor)
    setEditor(ed.success ? (ed.data as PlacementEditorSettings) : defaultPlacementEditorSettings())
    if (t.logoUrl) {
      setLogoUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev)
        return t.logoUrl
      })
    } else {
      setLogoUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev)
        return null
      })
    }
  }, [])

  const loadKitById = useCallback(
    async (id: string, opts?: { silent?: boolean }): Promise<boolean> => {
      setSavingKit(true)
      try {
        const t = await kitTemplatesService.getById(id)
        applyKitTemplate(t)
        setLoadTemplateId(id)
        setEditingKitTemplateId(id)
        if (!opts?.silent) toast.success("Kit loaded.")
        return true
      } catch {
        toast.error("Could not load kit.")
        return false
      } finally {
        setSavingKit(false)
      }
    },
    [applyKitTemplate]
  )

  const autoLoadAttemptedRef = useRef(false)
  const firstSavedKitId = savedKitsData?.[0]?.id

  const startNewDesign = useCallback(() => {
    setLogoUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev)
      return null
    })
    setJerseyColor(DEFAULT_JERSEY_HEX)
    setZones({ ...DEFAULT_ZONES })
    setEditor(defaultPlacementEditorSettings())
    setSelectedZone("chest")
    setKitName("New design")
    setLoadTemplateId("")
    setEditingKitTemplateId(null)
    autoLoadAttemptedRef.current = true
    toast.message("Started a new design.")
  }, [])

  useEffect(() => {
    autoLoadAttemptedRef.current = false
  }, [currentUser?.id, firstSavedKitId])

  useEffect(() => {
    if (!currentUser?.id || kitsLoading) return
    const list = savedKitsData ?? EMPTY_SAVED_KITS
    if (list.length === 0) return
    if (loadTemplateId !== "") return
    if (editingKitTemplateId !== null) return
    if (autoLoadAttemptedRef.current) return

    autoLoadAttemptedRef.current = true
    const firstId = list[0].id
    void loadKitById(firstId, { silent: true }).then((ok) => {
      if (!ok) autoLoadAttemptedRef.current = false
    })
  }, [
    currentUser?.id,
    kitsLoading,
    savedKitsData,
    loadTemplateId,
    editingKitTemplateId,
    loadKitById,
  ])

  const ensureUploadedLogoUrl = async (url: string | null): Promise<string | null> => {
    if (!url) return null
    if (!url.startsWith("blob:")) return url
    const blob = await fetch(url).then((r) => r.blob())
    const file = new File([blob], "sponsor-logo.png", { type: blob.type || "image/png" })
    return kitTemplatesService.uploadSponsorLogo(file)
  }

  const saveKitToAccount = async () => {
    if (!currentUser) {
      toast.error("Sign in to save your kit to your account.")
      return
    }
    setSavingKit(true)
    try {
      const stableLogo = await ensureUploadedLogoUrl(logoUrl)
      if (stableLogo && logoUrl?.startsWith("blob:")) {
        if (logoUrl) URL.revokeObjectURL(logoUrl)
        setLogoUrl(stableLogo)
      }
      const capturedAt = new Date().toISOString()
      const editorPayload = {
        cameraDistanceMul: editor.cameraDistanceMul,
        modelYawDeg: editor.modelYawDeg,
        zoneAdjustments: editor.zoneAdjustments,
        zoneAnchors: editor.zoneAnchors,
        backNumber: editor.backNumber,
        customText: editor.customText,
        ...(editor.customTextAnchor ? { customTextAnchor: editor.customTextAnchor } : {}),
      }
      const parsed = placementEditorSchema.safeParse(editorPayload)
      if (!parsed.success) {
        toast.error("Editor state is invalid; adjust settings and try again.")
        return
      }
      const body = {
        name: kitName.trim() || "My kit",
        jerseyPresetId: JERSEY_PRESET_ID,
        jerseyColor,
        zones: { ...zones },
        logoUrl: stableLogo ?? undefined,
        capturedAt,
        editor: parsed.data as unknown as Record<string, unknown>,
      }
      if (editingKitTemplateId) {
        await kitTemplatesService.update(editingKitTemplateId, body)
        await mutateSavedKits()
        toast.success("Saved kit updated.")
      } else {
        const created = await kitTemplatesService.create(body)
        setEditingKitTemplateId(created.id)
        await mutateSavedKits()
        toast.success("Kit saved to your account.")
      }
    } catch {
      toast.error("Could not save kit. Try again or check that you are signed in.")
    } finally {
      setSavingKit(false)
    }
  }

  const loadKitFromAccount = async () => {
    if (!loadTemplateId) {
      toast.error("Choose a saved kit.")
      return
    }
    await loadKitById(loadTemplateId, { silent: false })
  }

  const openDeleteKitDialog = () => {
    if (!loadTemplateId) {
      toast.error("Choose a saved kit to delete.")
      return
    }
    setDeleteKitDialogOpen(true)
  }

  const confirmDeleteSavedKit = async () => {
    if (!loadTemplateId) return
    setSavingKit(true)
    try {
      await kitTemplatesService.remove(loadTemplateId)
      await mutateSavedKits()
      setLoadTemplateId("")
      setEditingKitTemplateId((prev) => (prev === loadTemplateId ? null : prev))
      setDeleteKitDialogOpen(false)
      toast.success("Saved kit removed.")
    } catch {
      toast.error("Could not delete kit.")
    } finally {
      setSavingKit(false)
    }
  }

  const copyPlacementJson = () => {
    const payload = {
      jerseyPresetId: JERSEY_PRESET_ID,
      jerseyColor,
      zones: { ...zones },
      capturedAt: new Date().toISOString(),
      editor: {
        cameraDistanceMul: editor.cameraDistanceMul,
        modelYawDeg: editor.modelYawDeg,
        zoneAdjustments: editor.zoneAdjustments,
        zoneAnchors: editor.zoneAnchors,
        backNumber: editor.backNumber,
        customText: editor.customText,
        ...(editor.customTextAnchor ? { customTextAnchor: editor.customTextAnchor } : {}),
      },
    }
    const parsed = campaignJerseyPlacementSchema.safeParse(payload)
    if (!parsed.success) { toast.error("Could not build placement snapshot."); return }
    void navigator.clipboard.writeText(JSON.stringify(parsed.data, null, 2))
    toast.success("Placement JSON copied.")
  }

  const downloadJerseyZip = async () => {
    const h = previewRef.current
    if (!h) return
    setExporting(true)
    try {
      const shots = await h.captureFourViews()
      if (shots.length === 0) {
        toast.error("Preview is still loading. Try again in a moment.")
        return
      }
      const collage = await buildJerseyCollage(shots)
      if (!collage) {
        toast.error("Could not build image sheet.")
        return
      }
      const stamp = new Date().toISOString().slice(0, 10)
      const zip = new JSZip()
      zip.file(`jersey-kit-sheet-${stamp}.png`, await dataUrlToBlob(collage))
      for (const shot of shots) {
        zip.file(`jersey-${shot.name}-${stamp}.png`, await dataUrlToBlob(shot.dataUrl))
      }
      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `jersey-kit-${stamp}.zip`
      a.rel = "noopener"
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Downloaded ZIP with the 2×2 sheet and four view PNGs.")
    } catch {
      toast.error("Export failed.")
    } finally {
      setExporting(false)
    }
  }

  const pendingDeleteKitName = savedKits.find((x) => x.id === loadTemplateId)?.name?.trim()

  const SmallBtn = ({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active?: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
        active ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  )

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("business-campaigns")}
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaigns
      </button>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-3">
            <div className="gradient-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md">
              <Shirt className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">Kit designer</h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Upload a logo, pick where it goes, then drag it on the jersey to position it perfectly.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={savingKit}
              onClick={startNewDesign}
              className={cn("shrink-0 rounded-xl px-3 py-2.5 font-semibold", kitOutlineNeutral)}
            >
              <Plus className="h-4 w-4" />
              New design
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={exporting}
              onClick={() => void downloadJerseyZip()}
              className={cn("shrink-0 rounded-xl px-3 py-2.5 font-semibold", kitOutlineNeutral)}
            >
              <Download className="h-4 w-4" />
              {exporting ? "Exporting…" : "Download ZIP"}
            </Button>
            <Button
              type="button"
              variant="default"
              disabled={savingKit}
              onClick={() => void saveKitToAccount()}
              className="shrink-0 rounded-xl px-4 py-2.5 font-semibold"
            >
              {savingKit ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingKitTemplateId ? "Update saved kit" : "Save to account"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={copyPlacementJson}
              className={cn("shrink-0 rounded-xl px-4 py-2.5 font-semibold", kitOutlineNeutral)}
            >
              <Copy className="h-4 w-4" />
              JSON
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
        <JerseySponsorPreview
          ref={previewRef}
          logoUrl={logoUrl}
          activeZones={zones}
          jerseyColor={jerseyColor}
          editor={editor}
          onZoneAnchorChange={onZoneAnchorChange}
          onCustomTextAnchorChange={onCustomTextAnchorChange}
        />

        <div className="max-h-[calc(100vh-8rem)] space-y-5 overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-sm">

          {currentUser ? (
            <section className="rounded-xl border border-border bg-muted/30 p-3">
              <p className="text-xs font-semibold text-foreground">Saved kits</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {editingKitTemplateId
                  ? "Save updates this kit on the server (same name or a new name). Use “Save as new copy” to create another row."
                  : "Name your design, save it server-side, or load a previous template."}
              </p>
              <div className="mt-2 space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground" htmlFor="kit-template-name">
                  Template name
                </label>
                <Input
                  id="kit-template-name"
                  type="text"
                  value={kitName}
                  onChange={(e) => setKitName(e.target.value)}
                  placeholder="My kit"
                  maxLength={120}
                  className="h-10"
                />
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">Load saved</span>
                  <Select
                    value={loadTemplateId || KIT_SELECT_NONE}
                    onValueChange={(v) => setLoadTemplateId(v === KIT_SELECT_NONE ? "" : v)}
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Choose a saved kit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={KIT_SELECT_NONE}>— Select —</SelectItem>
                      {savedKits.map((k) => (
                        <SelectItem key={k.id} value={k.id}>
                          {k.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={savingKit || !loadTemplateId}
                    onClick={() => void loadKitFromAccount()}
                    className={kitOutlineNeutral}
                  >
                    Load
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={savingKit || !loadTemplateId}
                    onClick={openDeleteKitDialog}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Delete
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
                  disabled={savingKit || !editingKitTemplateId}
                  onClick={() => setEditingKitTemplateId(null)}
                >
                  Save as new copy
                </Button>
              </div>
            </section>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Sign in to save and load kit templates from your account. You can still export JSON or ZIP locally.
            </p>
          )}

          {/* ── 1. Upload ── */}
          <section>
            <p className="text-xs font-semibold text-foreground">1. Upload logo</p>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="mt-2 block w-full text-xs text-muted-foreground file:mr-2 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground file:hover:bg-primary/90"
              onChange={(e) => onLogoFile(e.target.files?.[0] ?? null)}
            />
          </section>

          {/* ── 2. Kit color ── */}
          <section>
            <p className="text-xs font-semibold text-foreground">2. Kit color</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="color"
                value={jerseyColor}
                onChange={(e) => setJerseyColor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
              />
              <span className="font-mono text-xs text-muted-foreground">{jerseyColor}</span>
            </div>
          </section>

          {/* ── 3. Zones ── */}
          <section>
            <p className="text-xs font-semibold text-foreground">3. Choose zones</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PLACEMENT_ZONE_IDS.map((z) => (
                <SmallBtn key={z} onClick={() => toggleZone(z)} active={zones[z]}>
                  {PLACEMENT_ZONE_LABELS[z]}
                </SmallBtn>
              ))}
            </div>
          </section>

          {/* ── 4. Fine-tune ── */}
          <section className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">4. Fine-tune</p>
              <button type="button" onClick={resetAllPlacement} className="text-[10px] font-semibold text-primary hover:underline">
                Reset all
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {PLACEMENT_ZONE_IDS.filter((z) => zones[z]).map((z) => (
                <SmallBtn key={z} onClick={() => setSelectedZone(z)} active={selectedZone === z}>
                  {PLACEMENT_ZONE_LABELS[z]}
                </SmallBtn>
              ))}
            </div>

            {!zones[selectedZone] ? (
              <p className="mt-3 text-[11px] text-muted-foreground">Enable this zone above to edit it.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {/* Move */}
                <div className="grid grid-cols-3 gap-1">
                  <SmallBtn onClick={() => patchZoneAdjust(selectedZone, { offsetX: selAdj.offsetX - NUDGE })}>← Left</SmallBtn>
                  <SmallBtn onClick={() => patchZoneAdjust(selectedZone, { offsetY: selAdj.offsetY + NUDGE })}>↑ Up</SmallBtn>
                  <SmallBtn onClick={() => patchZoneAdjust(selectedZone, { offsetX: selAdj.offsetX + NUDGE })}>→ Right</SmallBtn>
                  <div />
                  <SmallBtn onClick={() => patchZoneAdjust(selectedZone, { offsetY: selAdj.offsetY - NUDGE })}>↓ Down</SmallBtn>
                  <div />
                </div>

                {/* Rotate + Scale */}
                <div className="flex flex-wrap gap-1.5">
                  <SmallBtn onClick={() => patchZoneAdjust(selectedZone, { rotationDeg: selAdj.rotationDeg - ROT_STEP })}>↶ Rotate</SmallBtn>
                  <SmallBtn onClick={() => patchZoneAdjust(selectedZone, { rotationDeg: selAdj.rotationDeg + ROT_STEP })}>↷ Rotate</SmallBtn>
                  <SmallBtn onClick={() => patchZoneAdjust(selectedZone, { scale: Math.max(0.3, selAdj.scale - SCALE_STEP) })}>− Smaller</SmallBtn>
                  <SmallBtn onClick={() => patchZoneAdjust(selectedZone, { scale: Math.min(3, selAdj.scale + SCALE_STEP) })}>+ Bigger</SmallBtn>
                  <button
                    type="button"
                    onClick={() => resetZone(selectedZone)}
                    className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                  >
                    Reset zone
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="border-t border-border pt-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-foreground">5. Custom text</p>
              <button type="button" onClick={resetCustomText} className="text-[10px] font-semibold text-primary hover:underline">
                Clear text
              </button>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Short line on chest, back, or sleeves. Drag it on the kit like a logo. Sponsor zones in step 3 only affect logos, not this text.
            </p>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={editor.customText.enabled}
                onChange={(e) => patchCustomText({ enabled: e.target.checked })}
                className="rounded border-border"
              />
              Show custom text
            </label>
            {editor.customText.enabled ? (
              <div className="mt-3 space-y-2">
                <Input
                  type="text"
                  value={editor.customText.text}
                  maxLength={120}
                  placeholder="e.g. Your club name"
                  onChange={(e) => patchCustomText({ text: e.target.value })}
                  className="h-10"
                />
                <div className="space-y-1.5">
                  <span className="text-[11px] text-muted-foreground">Placement zone</span>
                  <Select
                    value={editor.customText.zone}
                    onValueChange={(z) =>
                      setEditor((p) => ({
                        ...p,
                        customText: { ...p.customText, zone: z as PlacementZoneId },
                        customTextAnchor: undefined,
                      }))
                    }
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLACEMENT_ZONE_IDS.map((z) => (
                        <SelectItem key={z} value={z}>
                          {PLACEMENT_ZONE_LABELS[z]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] text-muted-foreground">Font</span>
                  <Select value={editor.customText.fontFamily} onValueChange={(f) => patchCustomText({ fontFamily: f })}>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_CHOICES.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-muted-foreground">
                    Color
                    <input
                      type="color"
                      value={editor.customText.color}
                      onChange={(e) => patchCustomText({ color: e.target.value })}
                      className="ml-2 h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                    />
                  </label>
                </div>
                <label className="block text-[11px] text-muted-foreground">
                  Size ({editor.customText.sizeFrac.toFixed(2)})
                  <input
                    type="range"
                    min={0.03}
                    max={0.22}
                    step={0.005}
                    value={editor.customText.sizeFrac}
                    onChange={(e) => patchCustomText({ sizeFrac: Number(e.target.value) })}
                    className="mt-1 w-full"
                  />
                </label>
                <p className="text-[10px] font-medium text-muted-foreground">Nudge and rotate</p>
                <div className="grid grid-cols-3 gap-1">
                  <SmallBtn onClick={() => patchCustomText({ adjust: { ...ctAdj, offsetX: ctAdj.offsetX - NUDGE } })}>←</SmallBtn>
                  <SmallBtn onClick={() => patchCustomText({ adjust: { ...ctAdj, offsetY: ctAdj.offsetY + NUDGE } })}>↑</SmallBtn>
                  <SmallBtn onClick={() => patchCustomText({ adjust: { ...ctAdj, offsetX: ctAdj.offsetX + NUDGE } })}>→</SmallBtn>
                  <div />
                  <SmallBtn onClick={() => patchCustomText({ adjust: { ...ctAdj, offsetY: ctAdj.offsetY - NUDGE } })}>↓</SmallBtn>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <SmallBtn onClick={() => patchCustomText({ adjust: { ...ctAdj, rotationDeg: ctAdj.rotationDeg - ROT_STEP } })}>↶</SmallBtn>
                  <SmallBtn onClick={() => patchCustomText({ adjust: { ...ctAdj, rotationDeg: ctAdj.rotationDeg + ROT_STEP } })}>↷</SmallBtn>
                  <SmallBtn onClick={() => patchCustomText({ adjust: { ...ctAdj, scale: Math.max(0.3, ctAdj.scale - SCALE_STEP) } })}>−</SmallBtn>
                  <SmallBtn onClick={() => patchCustomText({ adjust: { ...ctAdj, scale: Math.min(3, ctAdj.scale + SCALE_STEP) } })}>+</SmallBtn>
                  <button
                    type="button"
                    onClick={() =>
                      setEditor((p) => ({
                        ...p,
                        customText: { ...p.customText, adjust: defaultZonePlacementAdjust() },
                        customTextAnchor: undefined,
                      }))
                    }
                    className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Reset position
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <AlertDialog open={deleteKitDialogOpen} onOpenChange={setDeleteKitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete saved kit?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteKitName
                ? `“${pendingDeleteKitName}” will be removed from your account. This cannot be undone.`
                : "This kit will be removed from your account. This cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={savingKit} className={kitOutlineNeutral}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={savingKit}
              onClick={() => void confirmDeleteSavedKit()}
            >
              {savingKit ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" /> : null}
              Delete kit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
