import apiClient from '../api';
import { getFakeResourcesForBusiness } from '../fake-data';

export const marketplaceService = {
    getAll: async (params?: { category?: string; sellerId?: string }) => {
        try {
            const response = await apiClient.get('/v1/products', { params });
            return response.data;
        } catch (error) {
            // Fallback to fake data
            if (params?.sellerId) {
                const fakeResources = getFakeResourcesForBusiness(params.sellerId, 'product');
                return fakeResources;
            }
            return [];
        }
    },

    getById: async (id: string) => {
        try {
            const response = await apiClient.get(`/v1/products/${id}`);
            return response.data;
        } catch {
            return null;
        }
    },

    search: async (query: string) => {
        try {
            const response = await apiClient.get('/v1/products/search', { params: { query } });
            return response.data;
        } catch {
            return [];
        }
    },

    create: async (data: Record<string, unknown>) => {
        try {
            const response = await apiClient.post('/v1/products', data);
            return response.data;
        } catch {
            return { id: 'temp-' + Date.now(), ...data };
        }
    },

    update: async (id: string, data: Record<string, unknown>) => {
        try {
            const response = await apiClient.put(`/v1/products/${id}`, data);
            return response.data;
        } catch {
            return { id, ...data };
        }
    },

    delete: async (id: string) => {
        try {
            const response = await apiClient.delete(`/v1/products/${id}`);
            return response.data;
        } catch {
            return { success: true };
        }
    },
};
