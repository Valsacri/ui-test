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

    addMember: async (squadId: string, member: { userId: string; role?: string; position?: string }) => {
        const response = await apiClient.post(`/v1/squads/${squadId}/members`, member);
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
};
