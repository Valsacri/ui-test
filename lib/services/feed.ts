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

export interface FeedPage {
    content: FeedItem[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}

export const feedService = {
    /** Personalized feed (paginated). Default page=0, size=20. */
    getFeed: async (userId: string, page = 0, size = 20) => {
        const response = await apiClient.get(`/v1/feeds/${userId}`, { params: { page, size } });
        return response.data as FeedPage;
    },

    /** Public feed (paginated). Default page=0, size=20. */
    getPublicFeed: async (page = 0, size = 20) => {
        const response = await apiClient.get('/v1/feeds/public', { params: { page, size } });
        return response.data as FeedPage;
    },
};
