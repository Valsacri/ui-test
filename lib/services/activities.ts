import apiClient from '../api';

export const activitiesService = {
    getAll: async (params?: { city?: string; sportId?: string; status?: string; organizerId?: string }) => {
        const response = await apiClient.get('/v1/activities', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/v1/activities/${id}`);
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await apiClient.post('/v1/activities', data);
        return response.data;
    },

    update: async (id: string, data: Record<string, unknown>) => {
        const response = await apiClient.put(`/v1/activities/${id}`, data);
        return response.data;
    },

    search: async (query: string) => {
        const response = await apiClient.get('/v1/activities/search', { params: { name: query } });
        return response.data;
    },

    joinActivity: async (activityId: string, userId: string) => {
        const response = await apiClient.post(`/v1/activities/${activityId}/join`, null, {
            params: { userId },
        });
        return response.data;
    },

    leaveActivity: async (activityId: string, userId: string) => {
        const response = await apiClient.post(`/v1/activities/${activityId}/leave`, null, {
            params: { userId },
        });
        return response.data;
    },

    uploadCover: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/v1/upload/activity/cover', formData, {
            headers: { 'Content-Type': null },
        });
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/v1/activities/${id}`);
        return response.data;
    },
};
