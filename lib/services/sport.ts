import apiClient from '../api';

export const sportService = {
    getAll: async () => {
        const response = await apiClient.get('/v1/sports');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/v1/sports/${id}`);
        return response.data;
    },

    getByName: async (name: string) => {
        const response = await apiClient.get(`/v1/sports/name/${name}`);
        return response.data;
    },

    getByCategory: async (category: string) => {
        const response = await apiClient.get(`/v1/sports/category/${category}`);
        return response.data;
    },

    getByFormat: async (format: string) => {
        const response = await apiClient.get(`/v1/sports/format/${format}`);
        return response.data;
    },

    search: async (query: string) => {
        const response = await apiClient.get('/v1/sports/search', { params: { query } });
        return response.data;
    },
};
