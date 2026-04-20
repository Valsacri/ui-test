import apiClient from '../api';
import { getFakeResourcesForBusiness } from '../fake-data';

export const servicesService = {
    getAll: async (params?: { category?: string; providerId?: string }) => {
        try {
            const response = await apiClient.get('/v1/services', { params });
            return response.data;
        } catch (error) {
            // Fallback to fake data
            if (params?.providerId) {
                const fakeResources = getFakeResourcesForBusiness(params.providerId, 'service');
                return fakeResources;
            }
            return [];
        }
    },

    getById: async (id: string) => {
        try {
            const response = await apiClient.get(`/v1/services/${id}`);
            return response.data;
        } catch {
            return null;
        }
    },

    search: async (query: string) => {
        try {
            const response = await apiClient.get('/v1/services/search', { params: { query } });
            return response.data;
        } catch {
            return [];
        }
    },

    create: async (data: Record<string, unknown>) => {
        try {
            const response = await apiClient.post('/v1/services', data);
            return response.data;
        } catch {
            return { id: 'temp-' + Date.now(), ...data };
        }
    },

    update: async (id: string, data: Record<string, unknown>) => {
        try {
            const response = await apiClient.put(`/v1/services/${id}`, data);
            return response.data;
        } catch {
            return { id, ...data };
        }
    },

    delete: async (id: string) => {
        try {
            const response = await apiClient.delete(`/v1/services/${id}`);
            return response.data;
        } catch {
            return { success: true };
        }
    },
};
