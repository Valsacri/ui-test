import apiClient from '../api';

export const feedService = {
    getFeed: async () => {
        const response = await apiClient.get('/feeds');
        return response.data;
    },
};
