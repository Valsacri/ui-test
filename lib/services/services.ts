import apiClient from '../api';

export const servicesService = {
    getAll: async (params?: { category?: string; providerId?: string }) => {
        const response = await apiClient.get('/v1/services', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/v1/services/${id}`);
        return response.data;
    },

    search: async (query: string) => {
        const response = await apiClient.get('/v1/services/search', { params: { query } });
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await apiClient.post('/v1/services', data);
        return response.data;
    },

    update: async (id: string, data: Record<string, unknown>) => {
        const response = await apiClient.put(`/v1/services/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/v1/services/${id}`);
        return response.data;
    },
};
