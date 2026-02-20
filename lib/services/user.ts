import apiClient from '../api';

export const userService = {
    getUserById: async (id: string) => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },

    getUserByEmail: async (email: string) => {
        const response = await apiClient.get(`/users/email/${email}`);
        return response.data;
    },

    getUserByUsername: async (username: string) => {
        const response = await apiClient.get(`/users/username/${username}`);
        return response.data;
    },

    browseUsers: async (params?: { query?: string; page?: number; size?: number }) => {
        const response = await apiClient.get('/users', { params });
        return response.data;
    },

    searchUsers: async (username: string, limit: number = 10) => {
        const response = await apiClient.get('/users/search', { params: { username, limit } });
        return response.data;
    },

    updateProfile: async (id: string, data: Record<string, unknown>) => {
        const response = await apiClient.patch(`/users/${id}/profile`, data);
        return response.data;
    },

    updateSportsPreferences: async (id: string, sportsPreferences: Array<{ sportId: string; sportName: string; skillLevel: string; yearsOfExperience?: number }>) => {
        const response = await apiClient.put(`/users/${id}/sports-preferences`, { sportsPreferences });
        return response.data;
    },

    updateGoals: async (id: string, goals: Array<{ type: string; description: string; priority?: string }>) => {
        const response = await apiClient.put(`/users/${id}/goals`, { goals });
        return response.data;
    },

    followUser: async (userId: string) => {
        const response = await apiClient.post(`/users/${userId}/follow`);
        return response.data;
    },

    unfollowUser: async (userId: string) => {
        const response = await apiClient.delete(`/users/${userId}/follow`);
        return response.data;
    },
};
