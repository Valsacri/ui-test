import apiClient from '../api';

export const squadService = {
    getById: async (id: string) => {
        const response = await apiClient.get(`/v1/squads/${id}`);
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await apiClient.post('/v1/squads', data);
        return response.data;
    },

    getByCaptain: async (captainId: string) => {
        const response = await apiClient.get(`/v1/squads/captain/${captainId}`);
        return response.data;
    },

    getBySport: async (sportId: string) => {
        const response = await apiClient.get(`/v1/squads/sport/${sportId}`);
        return response.data;
    },

    getByCity: async (city: string) => {
        const response = await apiClient.get(`/v1/squads/city/${city}`);
        return response.data;
    },

    getByLeague: async (leagueId: string) => {
        const response = await apiClient.get(`/v1/squads/league/${leagueId}`);
        return response.data;
    },

    getByUser: async (userId: string) => {
        const response = await apiClient.get(`/v1/squads/user/${userId}`);
        return response.data;
    },

    addMember: async (squadId: string, member: { userId: string; userName?: string; role?: string; position?: string; jerseyNumber?: number }) => {
        const response = await apiClient.post(`/v1/squads/${squadId}/members`, member);
        return response.data;
    },

    unsendInvite: async (squadId: string, userId: string) => {
        const response = await apiClient.delete(`/v1/squads/${squadId}/invites/${userId}`);
        return response.data;
    },

    requestJoin: async (squadId: string) => {
        const response = await apiClient.post(`/v1/squads/${squadId}/join-request`);
        return response.data;
    },

    getJoinRequestStatus: async (squadId: string) => {
        const response = await apiClient.get(`/v1/squads/${squadId}/join-request/status`);
        return response.data as boolean;
    },

    cancelJoinRequest: async (squadId: string) => {
        const response = await apiClient.delete(`/v1/squads/${squadId}/join-request`);
        return response.data;
    },

    removeMember: async (squadId: string, userId: string) => {
        const response = await apiClient.delete(`/v1/squads/${squadId}/members/${userId}`);
        return response.data;
    },

    addToLeague: async (squadId: string, leagueId: string) => {
        const response = await apiClient.post(`/v1/squads/${squadId}/leagues/${leagueId}`);
        return response.data;
    },

    removeFromLeague: async (squadId: string, leagueId: string) => {
        const response = await apiClient.delete(`/v1/squads/${squadId}/leagues/${leagueId}`);
        return response.data;
    },

    search: async (query: string) => {
        const response = await apiClient.get('/v1/squads/search', { params: { query } });
        return response.data;
    },

    uploadLogo: async (file: File) => {
        const form = new FormData();
        form.append('file', file);
        const response = await apiClient.post('/v1/upload/squad/logo', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data as { url: string; message: string };
    },

    uploadCover: async (file: File) => {
        const form = new FormData();
        form.append('file', file);
        const response = await apiClient.post('/v1/upload/squad/cover', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data as { url: string; message: string };
    },
};
