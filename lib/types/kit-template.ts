/** Mirrors backend {@code JerseyKitTemplateDto}. */
export interface JerseyKitTemplateDto {
  id: string
  ownerUserId: string
  name: string
  jerseyPresetId: string
  jerseyColor: string
  zones: Record<string, boolean>
  logoUrl: string | null
  capturedAt?: string | null
  editor: Record<string, unknown>
  createdAt?: string
  updatedAt?: string
}

/** Body for POST /v1/kit-templates (matches {@code JerseyKitTemplateCreateCommand}). */
export interface JerseyKitTemplateCreatePayload {
  name: string
  jerseyPresetId: string
  jerseyColor: string
  zones: Record<string, boolean>
  logoUrl?: string | null
  capturedAt?: string | null
  editor?: Record<string, unknown>
}
