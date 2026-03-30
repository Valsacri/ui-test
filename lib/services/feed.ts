import apiClient from '../api';
import type { PostKind } from '@/lib/types/post';

export interface FeedItem {
    id: string;
    title?: string;
    summary?: string;
    type: 'POST' | 'ACTIVITY' | 'SYSTEM' | 'COMMUNITY';
    createdAt?: string;
    authorId?: string;
    authorName?: string;
    authorAvatar?: string;
    image?: string;
    images?: string[];
    likes?: number;
    comments?: number;
    shares?: number;
    sport?: string;
    activityStatus?: string;
    likedByCurrentUser?: boolean;
    savedByCurrentUser?: boolean;
    postKind?: PostKind;
    linkedProductId?: string;
    linkedServiceListingId?: string;
    linkedFacilityId?: string;
    linkedActivityId?: string;
    sponsored?: boolean;
    sponsoredCampaignId?: string;
    sponsoredCreativeId?: string;
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
    /** Personalized "For You" feed — ranked, paginated. Auth required. */
    getForYouFeed: async (page = 0, size = 20): Promise<FeedPage> => {
        const { data } = await apiClient.get<FeedPage>('/v1/feeds/for-you', { params: { page, size } });
        return data;
    },

    /** Following feed — chronological posts from followed users. Auth required. */
    getFollowingFeed: async (page = 0, size = 20): Promise<FeedPage> => {
        const { data } = await apiClient.get<FeedPage>('/v1/feeds/following', { params: { page, size } });
        return data;
    },

    /** Public feed — PUBLIC posts + activities. No auth required. */
    getPublicFeed: async (page = 0, size = 20): Promise<FeedPage> => {
        const { data } = await apiClient.get<FeedPage>('/v1/feeds/public', { params: { page, size } });
        return data;
    },

    // Legacy alias — keep for backward compat during transition
    /** @deprecated Use getForYouFeed() instead */
    getFeed: async (_userId: string, page = 0, size = 20): Promise<FeedPage> => {
        const { data } = await apiClient.get<FeedPage>('/v1/feeds/for-you', { params: { page, size } });
        return data;
    },
};
