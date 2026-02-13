import apiClient from '../api';

export const postsService = {
    getAll: async (sport?: string, currentUserId?: string) => {
        const params: Record<string, string> = {};
        if (sport) params.sport = sport;
        if (currentUserId) params.currentUserId = currentUserId;
        const response = await apiClient.get('/v1/posts', { params });
        return response.data;
    },

    getById: async (id: string, currentUserId?: string) => {
        const response = await apiClient.get(`/v1/posts/${id}`, {
            params: currentUserId ? { currentUserId } : {},
        });
        return response.data;
    },

    getByUser: async (userId: string, currentUserId?: string) => {
        const response = await apiClient.get(`/v1/posts/user/${userId}`, {
            params: currentUserId ? { currentUserId } : {},
        });
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await apiClient.post('/v1/posts', data);
        return response.data;
    },

    toggleLike: async (postId: string, userId: string) => {
        const response = await apiClient.post(`/v1/posts/${postId}/like`, null, {
            params: { userId },
        });
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/v1/posts/${id}`);
        return response.data;
    },
};
