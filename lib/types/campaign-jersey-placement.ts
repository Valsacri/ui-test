import { z } from "zod"

/** Fixed placement slots for paid campaign / sponsor creative (preview tool). */
export const PLACEMENT_ZONE_IDS = ["chest", "back", "left_sleeve", "right_sleeve"] as const

export type PlacementZoneId = (typeof PLACEMENT_ZONE_IDS)[number]

/** Per-zone nudge in decal local space: X = right, Y = up, Z = along outward normal (world). */
export interface ZonePlacementAdjust {
  offsetX: number
  offsetY: number
  offsetZ: number
  /** Degrees, rotation around the surface normal (in-plane). */
  rotationDeg: number
  scale: number
}

export function defaultZonePlacementAdjust(): ZonePlacementAdjust {
  return {
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    rotationDeg: 0,
    scale: 1,
  }
}

export function defaultZonePlacementMap(): Record<PlacementZoneId, ZonePlacementAdjust> {
  return {
    chest: defaultZonePlacementAdjust(),
    back: defaultZonePlacementAdjust(),
    left_sleeve: defaultZonePlacementAdjust(),
    right_sleeve: defaultZonePlacementAdjust(),
  }
}

/**
 * User-dragged anchor on the jersey (shirtGroup local space).
 * Rays are re-cast from outside along -normal so the decal always projects onto the mesh surface.
 */
export interface ZoneSurfaceAnchor {
  px: number
  py: number
  pz: number
  nx: number
  ny: number
  nz: number
}

export interface BackNumberOptions {
  enabled: boolean
  /** Usually 1–99 for squad numbers */
  text: string
  fontFamily: string
  color: string
  /** Height as fraction of jersey bbox Y extent */
  sizeFrac: number
  /** Fine-tune position / rotation / scale of the number decal (local plane). */
  adjust: ZonePlacementAdjust
}

export function defaultBackNumberOptions(): BackNumberOptions {
  return {
    enabled: true,
    text: "10",
    fontFamily: "system-ui, sans-serif",
    color: "#ffffff",
    /** World height ≈ this × jersey bbox height — tuned for readability on the GLB preview. */
    sizeFrac: 0.56,
    adjust: defaultZonePlacementAdjust(),
  }
}

/** Optional slogan / name / short copy on the kit (separate from squad number). */
export interface JerseyCustomTextOptions {
  enabled: boolean
  text: string
  fontFamily: string
  color: string
  /** Height as fraction of jersey bbox Y extent */
  sizeFrac: number
  /** Which surface to place text on; independent of sponsor logo zone toggles. */
  zone: PlacementZoneId
  adjust: ZonePlacementAdjust
}

export function defaultJerseyCustomTextOptions(): JerseyCustomTextOptions {
  return {
    enabled: false,
    text: "",
    fontFamily: "system-ui, sans-serif",
    color: "#ffffff",
    sizeFrac: 0.065,
    zone: "chest",
    adjust: defaultZonePlacementAdjust(),
  }
}

export interface PlacementEditorSettings {
  /** Multiplier on camera distance from orbit target (1 = default framing). */
  cameraDistanceMul: number
  /** Yaw the whole kit in the preview (degrees). */
  modelYawDeg: number
  zoneAdjustments: Record<PlacementZoneId, ZonePlacementAdjust>
  /** Optional per-zone surface anchors from click-drag (omit zone = auto bbox placement). */
  zoneAnchors: Partial<Record<PlacementZoneId, ZoneSurfaceAnchor>>
  backNumber: BackNumberOptions
  customText: JerseyCustomTextOptions
  /** Drag-to-place anchor for custom text (shirtGroup local). */
  customTextAnchor?: ZoneSurfaceAnchor
}

export function defaultPlacementEditorSettings(): PlacementEditorSettings {
  return {
    cameraDistanceMul: 1,
    modelYawDeg: 0,
    zoneAdjustments: defaultZonePlacementMap(),
    zoneAnchors: {},
    backNumber: defaultBackNumberOptions(),
    customText: defaultJerseyCustomTextOptions(),
  }
}

/** Props for the WebGL jersey preview (kept here so parents can lazy-load R3F without importing three). */
export interface JerseySponsorPreviewProps {
  logoUrl: string | null
  /** Toggles sponsor logo slots only; custom text uses {@link PlacementEditorSettings.customText.zone} instead. */
  activeZones: Record<PlacementZoneId, boolean>
  jerseyColor: string
  className?: string
  /** Optional editor: per-zone transforms, camera zoom, model yaw, back number. */
  editor?: PlacementEditorSettings
  /** Called when a logo is dragged to a new surface position (shirtGroup-local anchor saved in parent state). */
  onZoneAnchorChange?: (zone: PlacementZoneId, anchor: ZoneSurfaceAnchor) => void
  /** Called when custom text is dragged to a new surface position. */
  onCustomTextAnchorChange?: (anchor: ZoneSurfaceAnchor) => void
}

export const placementZoneIdSchema = z.enum(PLACEMENT_ZONE_IDS)

const zoneAdjustSchema = z.object({
  offsetX: z.number(),
  offsetY: z.number(),
  offsetZ: z.number(),
  rotationDeg: z.number(),
  scale: z.number(),
})

const backNumberSchema = z.object({
  enabled: z.boolean(),
  text: z.string().max(4),
  fontFamily: z.string(),
  color: z.string(),
  /** Must cover {@link defaultBackNumberOptions} (0.56) and preview tuning above 0.4 */
  sizeFrac: z.number().min(0.04).max(0.65),
  adjust: zoneAdjustSchema,
})

const zoneSurfaceAnchorSchema = z.object({
  px: z.number(),
  py: z.number(),
  pz: z.number(),
  nx: z.number(),
  ny: z.number(),
  nz: z.number(),
})

const jerseyCustomTextSchema = z.object({
  enabled: z.boolean(),
  text: z.string().max(120),
  fontFamily: z.string(),
  color: z.string(),
  sizeFrac: z.number().min(0.02).max(0.35),
  zone: placementZoneIdSchema,
  adjust: zoneAdjustSchema,
})

export const placementEditorSchema = z.object({
  cameraDistanceMul: z.number().min(0.5).max(2),
  modelYawDeg: z.number().min(-180).max(180),
  zoneAdjustments: z.record(placementZoneIdSchema, zoneAdjustSchema),
  zoneAnchors: z.record(placementZoneIdSchema, zoneSurfaceAnchorSchema),
  backNumber: backNumberSchema,
  customText: jerseyCustomTextSchema,
  customTextAnchor: zoneSurfaceAnchorSchema.optional(),
})

/** Serializable snapshot for future API / campaign creative attachment (client-generated for now). */
export const campaignJerseyPlacementSchema = z.object({
  jerseyPresetId: z.string(),
  jerseyColor: z.string(),
  zones: z.record(placementZoneIdSchema, z.boolean()),
  /** ISO timestamp when the preview was finalized in the UI */
  capturedAt: z.string().optional(),
  /** Optional placement editor state for reproduction / API handoff */
  editor: placementEditorSchema.optional(),
})

export type CampaignJerseyPlacement = z.infer<typeof campaignJerseyPlacementSchema>

export const PLACEMENT_ZONE_LABELS: Record<PlacementZoneId, string> = {
  chest: "Chest (front)",
  back: "Back",
  left_sleeve: "Left sleeve",
  right_sleeve: "Right sleeve",
}

export const FONT_CHOICES: { id: string; label: string }[] = [
  { id: "system-ui, sans-serif", label: "System UI" },
  { id: "Georgia, serif", label: "Georgia" },
  { id: "Impact, Haettenschweiler, sans-serif", label: "Impact" },
  { id: "'Arial Black', Arial, sans-serif", label: "Arial Black" },
  { id: "ui-monospace, monospace", label: "Monospace" },
]
