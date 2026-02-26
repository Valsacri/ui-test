import apiClient from '../api';

export interface FeedItem {
    id: string;
    title?: string;
    summary?: string;
    type: 'post' | 'activity' | 'system' | 'community';
    createdAt?: string;
    authorId?: string;
    authorName?: string;
    authorAvatar?: string;
    image?: string;
    likes?: number;
    comments?: number;
    shares?: number;
    sport?: string;
    activityStatus?: string;
}

export const feedService = {
    /** Personalized feed for the authenticated user (GET /v1/feeds/{userId}) */
    getFeed: async (userId: string) => {
        const response = await apiClient.get(`/v1/feeds/${userId}`);
        return response.data as FeedItem[];
    },

    /** Public feed (GET /v1/feeds/public) */
    getPublicFeed: async () => {
        const response = await apiClient.get('/v1/feeds/public');
        return response.data as FeedItem[];
    },
};
