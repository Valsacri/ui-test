import apiClient from '../api';

export const facilitiesService = {
    getAll: async (params?: { city?: string; sportId?: string; businessId?: string; verified?: boolean; query?: string }) => {
        const response = await apiClient.get('/v1/facilities', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/v1/facilities/${id}`);
        return response.data;
    },

    getByOwner: async (ownerId: string) => {
        const response = await apiClient.get(`/v1/facilities/owner/${ownerId}`);
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await apiClient.post('/v1/facilities', data);
        return response.data;
    },

    update: async (id: string, data: Record<string, unknown>) => {
        const response = await apiClient.put(`/v1/facilities/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/v1/facilities/${id}`);
        return response.data;
    },
};
