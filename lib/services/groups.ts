import apiClient from '../api';

export interface InterestGroupDto {
    id: string;
    name: string;
    description?: string;
    sportId?: string;
    sportName?: string;
    logoUrl?: string;
    coverImage?: string;
    memberCount?: number;
    createdBy?: string;
    isActive?: boolean;
    isMember?: boolean;
}

export const groupService = {
    getAll: async (): Promise<InterestGroupDto[]> => {
        const response = await apiClient.get('/v1/groups');
        return response.data;
    },

    getById: async (id: string): Promise<InterestGroupDto> => {
        const response = await apiClient.get(`/v1/groups/${id}`);
        return response.data;
    },

    create: async (data: {
        name: string;
        description?: string;
        sportId?: string;
        sportName?: string;
        logoUrl?: string;
    }): Promise<InterestGroupDto> => {
        const response = await apiClient.post('/v1/groups', data);
        return response.data;
    },

    join: async (groupId: string): Promise<InterestGroupDto> => {
        const response = await apiClient.post(`/v1/groups/${groupId}/join`);
        return response.data;
    },

    leave: async (groupId: string): Promise<InterestGroupDto> => {
        const response = await apiClient.delete(`/v1/groups/${groupId}/leave`);
        return response.data;
    },

    search: async (query: string): Promise<InterestGroupDto[]> => {
        const response = await apiClient.get('/v1/groups/search', { params: { query } });
        return response.data;
    },

    getByUser: async (userId: string): Promise<InterestGroupDto[]> => {
        const response = await apiClient.get(`/v1/groups/user/${userId}`);
        return response.data;
    },

    uploadLogo: async (file: File) => {
        const form = new FormData();
        form.append('file', file);
        const response = await apiClient.post('/v1/upload/group/logo', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data as { url: string; message: string };
    },
};
