import apiClient from '../api';

export const businessesService = {
    getAll: async () => {
        const response = await apiClient.get('/v1/businesses');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/v1/businesses/${id}`);
        return response.data;
    },

    getMyBusinesses: async () => {
        const response = await apiClient.get('/v1/businesses/my');
        return response.data;
    },

    create: async (data: Record<string, unknown>, avatarFile?: File | null, coverFile?: File | null) => {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        if (coverFile) {
            formData.append('cover', coverFile);
        }

        const response = await apiClient.post('/v1/businesses', formData, {
            headers: { 'Content-Type': null },
        });
        return response.data;
    },

    update: async (id: string, data: Record<string, unknown>) => {
        const response = await apiClient.put(`/v1/businesses/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/v1/businesses/${id}`);
        return response.data;
    },

    getByOwner: async (ownerId: string) => {
        const response = await apiClient.get(`/v1/businesses/owner/${ownerId}`);
        return response.data;
    },

    getStaff: async (businessId: string) => {
        const response = await apiClient.get(`/v1/businesses/${businessId}/staff`);
        return response.data;
    },

    addStaff: async (businessId: string, staffUserId: string) => {
        const response = await apiClient.post(`/v1/businesses/${businessId}/staff/${staffUserId}`);
        return response.data;
    },

    removeStaff: async (businessId: string, staffUserId: string) => {
        const response = await apiClient.delete(`/v1/businesses/${businessId}/staff/${staffUserId}`);
        return response.data;
    },

    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/v1/upload/business/avatar', formData, {
            headers: { 'Content-Type': null },
        });
        return response.data;
    },

    uploadCover: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/v1/upload/business/cover', formData, {
            headers: { 'Content-Type': null },
        });
        return response.data;
    },
};
