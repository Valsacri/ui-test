import apiClient from '../api';
import { getFakeResourcesForBusiness } from '../fake-data';

export const facilitiesService = {
    getAll: async (params?: { city?: string; sportId?: string; businessId?: string; verified?: boolean; query?: string }) => {
        try {
            const response = await apiClient.get('/v1/facilities', { params });
            return response.data;
        } catch (error) {
            // Fallback to fake data
            if (params?.businessId) {
                const fakeResources = getFakeResourcesForBusiness(params.businessId, 'facility');
                return fakeResources;
            }
            return [];
        }
    },

    getById: async (id: string) => {
        try {
            const response = await apiClient.get(`/v1/facilities/${id}`);
            return response.data;
        } catch {
            return null;
        }
    },

    getByOwner: async (ownerId: string) => {
        try {
            const response = await apiClient.get(`/v1/facilities/owner/${ownerId}`);
            return response.data;
        } catch (error) {
            // Fallback to fake data
            const fakeResources = getFakeResourcesForBusiness(ownerId, 'facility');
            return fakeResources;
        }
    },

    create: async (data: Record<string, unknown>) => {
        try {
            const response = await apiClient.post('/v1/facilities', data);
            return response.data;
        } catch {
            return { id: 'temp-' + Date.now(), ...data };
        }
    },

    update: async (id: string, data: Record<string, unknown>) => {
        try {
            const response = await apiClient.put(`/v1/facilities/${id}`, data);
            return response.data;
        } catch {
            return { id, ...data };
        }
    },

    delete: async (id: string) => {
        try {
            const response = await apiClient.delete(`/v1/facilities/${id}`);
            return response.data;
        } catch {
            return { success: true };
        }
    },

    getAvailableForSlots: async (data: {
        ranges: Array<{ startDateTime: string; endDateTime: string }>;
        sportId?: string;
        city?: string;
    }) => {
        try {
            const response = await apiClient.post('/v1/facilities/available-for-slots', data);
            return response.data;
        } catch {
            return [];
        }
    },
};
