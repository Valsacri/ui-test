import apiClient from '../api';

export const leagueService = {
    getAll: async () => {
        const response = await apiClient.get('/v1/leagues');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/v1/leagues/${id}`);
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await apiClient.post('/v1/leagues', data);
        return response.data;
    },

    getByOrganizer: async (organizerId: string) => {
        const response = await apiClient.get(`/v1/leagues/organizer/${organizerId}`);
        return response.data;
    },

    getBySport: async (sportId: string) => {
        const response = await apiClient.get(`/v1/leagues/sport/${sportId}`);
        return response.data;
    },

    getByTeam: async (teamId: string) => {
        const response = await apiClient.get(`/v1/leagues/team/${teamId}`);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await apiClient.put(`/v1/leagues/${id}/status`, null, { params: { status } });
        return response.data;
    },

    addTeam: async (leagueId: string, teamId: string) => {
        const response = await apiClient.post(`/v1/leagues/${leagueId}/teams/${teamId}`);
        return response.data;
    },

    removeTeam: async (leagueId: string, teamId: string) => {
        const response = await apiClient.delete(`/v1/leagues/${leagueId}/teams/${teamId}`);
        return response.data;
    },

    search: async (query: string) => {
        const response = await apiClient.get('/v1/leagues/search', { params: { query } });
        return response.data;
    },

    getStandings: async (leagueId: string) => {
        const response = await apiClient.get(`/v1/leagues/${leagueId}/standings`);
        return response.data;
    },

    replaceStandings: async (leagueId: string, standings: Record<string, unknown>[]) => {
        const response = await apiClient.put(`/v1/leagues/${leagueId}/standings`, standings);
        return response.data;
    },

    uploadLogo: async (file: File) => {
        const form = new FormData();
        form.append('file', file);
        const response = await apiClient.post('/v1/upload/league/logo', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data as { url: string; message: string };
    },
};
