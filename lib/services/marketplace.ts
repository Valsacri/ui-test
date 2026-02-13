import apiClient from '../api';

export const marketplaceService = {
    getAll: async (category?: string) => {
        const response = await apiClient.get('/v1/products', { params: category ? { category } : {} });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/v1/products/${id}`);
        return response.data;
    },

    search: async (query: string) => {
        const response = await apiClient.get('/v1/products/search', { params: { query } });
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await apiClient.post('/v1/products', data);
        return response.data;
    },

    update: async (id: string, data: Record<string, unknown>) => {
        const response = await apiClient.put(`/v1/products/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/v1/products/${id}`);
        return response.data;
    },
};
