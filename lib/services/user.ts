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

    /** Upload profile picture; returns { url }. Then call updateProfile(id, { profilePicture: url }). */
    uploadProfileImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/v1/upload/user/avatar', formData);
        return response.data as { url: string; message?: string };
    },

    /** Upload cover image; returns { url }. Then call updateProfile(id, { coverImage: url }). */
    uploadCoverImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/v1/upload/user/cover', formData);
        return response.data as { url: string; message?: string };
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

    /** Paginated followers of a user (people who follow this user). */
    getFollowers: async (userId: string, params?: { page?: number; size?: number }) => {
        const response = await apiClient.get(`/v1/users/${userId}/followers`, {
            params: { page: params?.page ?? 0, size: params?.size ?? 20 },
        });
        const data = response.data;
        return { content: data?.content ?? [], totalElements: data?.totalElements ?? 0 };
    },

    /** Paginated following of a user (people this user follows). */
    getFollowing: async (userId: string, params?: { page?: number; size?: number }) => {
        const response = await apiClient.get(`/v1/users/${userId}/following`, {
            params: { page: params?.page ?? 0, size: params?.size ?? 20 },
        });
        const data = response.data;
        return { content: data?.content ?? [], totalElements: data?.totalElements ?? 0 };
    },

    /** Users that current user follows and who follow back (for starting chats). */
    getMutualFollows: async (userId: string) => {
        const response = await apiClient.get(`/v1/users/${userId}/mutual-follows`);
        return response.data as Array<{ id: string; firstName?: string; lastName?: string; username?: string; profilePicture?: string; lastActiveAt?: string | number[] }>;
    },

    /** Report current user activity for presence (online status). Call periodically when app is in use. */
    reportActivity: async (userId: string) => {
        await apiClient.put(`/v1/users/${userId}/activity`);
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
