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

    browseUsers: async (params?: { query?: string; page?: number; size?: number }) => {
        const response = await apiClient.get('/v1/users', { params });
        return response.data;
    },

    searchUsers: async (username: string, limit: number = 10) => {
        const response = await apiClient.get('/v1/users/search', { params: { username, limit } });
        return response.data;
    },

    updateProfile: async (id: string, data: Record<string, unknown>) => {
        const response = await apiClient.patch(`/v1/users/${id}/profile`, data);
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

    followUser: async (currentUserId: string, targetUserId: string) => {
        await apiClient.post(`/v1/users/${currentUserId}/follow/${targetUserId}`);
    },

    unfollowUser: async (currentUserId: string, targetUserId: string) => {
        await apiClient.delete(`/v1/users/${currentUserId}/follow/${targetUserId}`);
    },

    updateLanguagePreference: async (id: string, language: string) => {
        const response = await apiClient.put(`/v1/users/${id}/language-preference`, { language });
        return response.data;
    },

    updateDataPermissions: async (id: string, permissions: Record<string, boolean>) => {
        const response = await apiClient.put(`/v1/users/${id}/data-permissions`, permissions);
        return response.data;
    },

    updateNotificationPreferences: async (id: string, preferences: Record<string, boolean | string>) => {
        const response = await apiClient.put(`/v1/users/${id}/notification-preferences`, preferences);
        return response.data;
    },

    updatePrivacySettings: async (id: string, settings: Record<string, boolean | string>) => {
        const response = await apiClient.put(`/v1/users/${id}/privacy-settings`, settings);
        return response.data;
    },

    getBlockedUsers: async (userId: string, params?: { page?: number; size?: number }) => {
        const response = await apiClient.get(`/v1/users/${userId}/blocked`, { params: { page: params?.page ?? 0, size: params?.size ?? 50 } });
        const data = response.data;
        if (data?.content) return data.content;
        return Array.isArray(data) ? data : [];
    },

    unblockUser: async (userId: string, targetUserId: string) => {
        await apiClient.delete(`/v1/users/${userId}/block/${targetUserId}`);
    },

    getPaymentMethods: async (userId: string) => {
        const response = await apiClient.get(`/v1/users/${userId}/payment-methods`);
        return response.data as Array<{
            id: string;
            userId: string;
            type: string;
            last4: string;
            brand?: string;
            expiryMonth: number;
            expiryYear: number;
            isDefault: boolean;
        }>;
    },

    addPaymentMethod: async (
        userId: string,
        data: { type: string; last4: string; brand?: string; expiryMonth: number; expiryYear: number; isDefault?: boolean }
    ) => {
        const response = await apiClient.post(`/v1/users/${userId}/payment-methods`, data);
        return response.data;
    },

    deletePaymentMethod: async (userId: string, methodId: string) => {
        await apiClient.delete(`/v1/users/${userId}/payment-methods/${methodId}`);
    },

    setDefaultPaymentMethod: async (userId: string, methodId: string) => {
        const response = await apiClient.put(`/v1/users/${userId}/payment-methods/${methodId}/default`);
        return response.data;
    },
};
