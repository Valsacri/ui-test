import apiClient from '../api';
import { STORY_UPLOAD_TIMEOUT_MS } from '../constants';
import type {
    StoryDto,
    StoryFeedItem,
    StoryReply,
    StoryRepliesPage,
    CreateStoryPayload,
    CreateStoryReplyPayload,
} from '@/lib/types/story';

export type { StoryDto, StoryFeedItem, StoryReply, StoryRepliesPage, CreateStoryPayload };

export const storiesService = {
    /** Get stories feed: one entry per user with active stories. */
    getFeed: async (): Promise<StoryFeedItem[]> => {
        const { data } = await apiClient.get<StoryFeedItem[]>('/v1/stories');
        return data;
    },

    /** Get all active stories for a specific user. */
    getStoriesByUser: async (userId: string): Promise<StoryDto[]> => {
        const { data } = await apiClient.get<StoryDto[]>(`/v1/stories/users/${userId}`);
        return data;
    },

    /** Create a new story. */
    create: async (payload: CreateStoryPayload): Promise<StoryDto> => {
        const { data } = await apiClient.post<StoryDto>('/v1/stories', payload);
        return data;
    },

    /** Delete a story (author only). */
    deleteStory: async (storyId: string): Promise<void> => {
        await apiClient.delete(`/v1/stories/${storyId}`);
    },

    /** Toggle like on a story. */
    toggleLike: async (storyId: string): Promise<StoryDto> => {
        const { data } = await apiClient.post<StoryDto>(`/v1/stories/${storyId}/like`);
        return data;
    },

    /** Record a view for a story (idempotent). */
    recordView: async (storyId: string): Promise<void> => {
        await apiClient.post(`/v1/stories/${storyId}/view`);
    },

    /** Reply to a story. */
    createReply: async (storyId: string, content: string): Promise<StoryReply> => {
        const payload: CreateStoryReplyPayload = { content };
        const { data } = await apiClient.post<StoryReply>(`/v1/stories/${storyId}/replies`, payload);
        return data;
    },

    /** Get paginated replies for a story. */
    getReplies: async (storyId: string, page = 0, size = 20): Promise<StoryRepliesPage> => {
        const { data } = await apiClient.get<StoryRepliesPage>(`/v1/stories/${storyId}/replies`, {
            params: { page, size },
        });
        return data;
    },

    /**
     * Upload story media. Returns { url, durationSeconds? } for images and videos (video max 30s).
     */
    uploadMedia: async (file: File): Promise<{ url: string; durationSeconds?: number }> => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await apiClient.post<{ url: string; durationSeconds?: number }>(
            '/v1/stories/upload-media',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: STORY_UPLOAD_TIMEOUT_MS,
            },
        );
        return { url: data.url, durationSeconds: data.durationSeconds };
    },

    /** Get list of users who viewed a story. */
    getViewers: async (storyId: string): Promise<{ id: string; name: string; avatar: string | null }[]> => {
        const { data } = await apiClient.get(`/v1/stories/${storyId}/viewers`);
        return data;
    },

    /** Get list of users who liked a story. */
    getLikers: async (storyId: string): Promise<{ id: string; name: string; avatar: string | null }[]> => {
        const { data } = await apiClient.get(`/v1/stories/${storyId}/likers`);
        return data;
    },
};
