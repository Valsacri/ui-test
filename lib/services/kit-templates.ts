import apiClient from "../api"
import type { JerseyKitTemplateCreatePayload, JerseyKitTemplateDto } from "../types/kit-template"

export const kitTemplatesService = {
  listMine: () => apiClient.get<JerseyKitTemplateDto[]>("/v1/kit-templates/mine").then((r) => r.data),

  getById: (id: string) => apiClient.get<JerseyKitTemplateDto>(`/v1/kit-templates/${id}`).then((r) => r.data),

  create: (payload: JerseyKitTemplateCreatePayload) =>
    apiClient.post<JerseyKitTemplateDto>("/v1/kit-templates", payload).then((r) => r.data),

  update: (id: string, payload: Partial<JerseyKitTemplateCreatePayload>) =>
    apiClient.patch<JerseyKitTemplateDto>(`/v1/kit-templates/${id}`, payload).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/v1/kit-templates/${id}`),

  uploadSponsorLogo: (file: File) => {
    const fd = new FormData()
    fd.append("file", file)
    return apiClient.post<{ url: string }>("/v1/upload/kit/sponsor-logo", fd).then((r) => r.data.url)
  },
}
