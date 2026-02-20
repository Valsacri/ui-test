import apiClient from '../api';

export const searchService = {
    search: async (data: {
        query: string;
        filters?: Record<string, unknown>;
        location?: { lat: number; lng: number };
        radius?: number;
    }) => {
        const response = await apiClient.post('/v1/search', data);
        return response.data;
    },

    getSuggestions: async (query: string, limit: number = 10) => {
        const response = await apiClient.get('/v1/search/suggest', { params: { query, limit } });
        return response.data;
    },

    getPopularSearches: async (limit: number = 10) => {
        const response = await apiClient.get('/v1/search/popular', { params: { limit } });
        return response.data;
    },

    getTrendingSearches: async (limit: number = 10) => {
        const response = await apiClient.get('/v1/search/trending', { params: { limit } });
        return response.data;
    },
};
