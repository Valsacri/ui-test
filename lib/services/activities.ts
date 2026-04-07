import apiClient from '../api';

export const activitiesService = {
    getAll: async (params?: {
        city?: string;
        sportId?: string;
        status?: string;
        organizerId?: string;
        hostSquadId?: string;
        leagueId?: string;
    }) => {
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

    updateStatus: async (id: string, status: string) => {
        const response = await apiClient.put(`/v1/activities/${id}/status`, null, { params: { status } });
        return response.data;
    },

    search: async (query: string) => {
        const response = await apiClient.get('/v1/activities/search', { params: { query } });
        return response.data;
    },

    joinActivity: async (activityId: string, userId: string) => {
        const response = await apiClient.post(`/v1/activities/${activityId}/participants/${userId}`);
        return response.data;
    },

    leaveActivity: async (activityId: string, userId: string) => {
        const response = await apiClient.delete(`/v1/activities/${activityId}/participants/${userId}`);
        return response.data;
    },

    checkAttendanceStatus: async (activityId: string) => {
        const response = await apiClient.get(`/v1/attendance/activity/${activityId}/status`);
        return response.data;
    },

    getByOrganizer: async (organizerId: string) => {
        const response = await apiClient.get(`/v1/activities/organizer/${organizerId}`);
        return response.data;
    },

    getUserParticipations: async (userId: string) => {
        const response = await apiClient.get(`/v1/activities/user/${userId}/participants`);
        return response.data;
    },

    getActivityParticipants: async (activityId: string) => {
        const response = await apiClient.get(`/v1/activities/${activityId}/participants`);
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

    getHumanResourceRoles: async () => {
        const response = await apiClient.get('/v1/activities/human-resource-roles');
        return response.data;
    },

    bookActivity: async (activityId: string) => {
        const response = await apiClient.post(`/v1/activities/${activityId}/book`);
        return response.data;
    },
};
