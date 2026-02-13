import apiClient from '../api';

export const jobsService = {
    getAll: async (type?: string) => {
        const response = await apiClient.get('/v1/jobs', { params: type ? { type } : {} });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/v1/jobs/${id}`);
        return response.data;
    },

    search: async (query: string) => {
        const response = await apiClient.get('/v1/jobs/search', { params: { query } });
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await apiClient.post('/v1/jobs', data);
        return response.data;
    },

    update: async (id: string, data: Record<string, unknown>) => {
        const response = await apiClient.put(`/v1/jobs/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/v1/jobs/${id}`);
        return response.data;
    },
};
