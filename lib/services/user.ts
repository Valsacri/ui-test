import apiClient from '../api';

export const userService = {
    getUserById: async (id: string) => {
        const response = await apiClient.get(`/v1/users/${id}`);
        return response.data;
    },

    getUserByEmail: async (email: string) => {
        const response = await apiClient.get(`/v1/users/email/${email}`);
        return response.data;
    },

    getUserByUsername: async (username: string) => {
        const response = await apiClient.get(`/v1/users/username/${username}`);
        return response.data;
    },

    updateProfile: async (id: string, data: Record<string, unknown>) => {
        const response = await apiClient.put(`/v1/users/${id}`, data);
        return response.data;
    },

    updateSportsPreferences: async (id: string, sportsPreferences: Array<{ sportId: string; sportName: string; skillLevel: string; yearsOfExperience?: number }>) => {
        const response = await apiClient.put(`/v1/users/${id}/sports-preferences`, { sportsPreferences });
        return response.data;
    },

    updateGoals: async (id: string, goals: Array<{ type: string; description: string; priority?: string }>) => {
        const response = await apiClient.put(`/v1/users/${id}/goals`, { goals });
        return response.data;
    },
};
