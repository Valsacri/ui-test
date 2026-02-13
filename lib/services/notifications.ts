import apiClient from '../api';

export const notificationsService = {
    getByUser: async (userId: string) => {
        const response = await apiClient.get(`/v1/notifications/user/${userId}`);
        return response.data;
    },

    getUnreadCount: async (userId: string) => {
        const response = await apiClient.get(`/v1/notifications/user/${userId}/unread-count`);
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await apiClient.put(`/v1/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async (userId: string) => {
        const response = await apiClient.put(`/v1/notifications/user/${userId}/read-all`);
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await apiClient.post('/v1/notifications', data);
        return response.data;
    },
};
