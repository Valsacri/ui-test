import apiClient from '../api';
import type { Post, PostsPage, CreatePostPayload } from '@/lib/types/post';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export type { Post, PostsPage, CreatePostPayload };

export const postsService = {
  getAll: async (
    sport?: string,
    currentUserId?: string,
    page = 0,
    size = DEFAULT_PAGE_SIZE
  ): Promise<PostsPage> => {
    const params: Record<string, string | number> = { page, size: Math.min(size, MAX_PAGE_SIZE) };
    if (sport) params.sport = sport;
    if (currentUserId) params.currentUserId = currentUserId;
    const { data } = await apiClient.get<PostsPage>('/v1/posts', { params });
    return data;
  },

  getById: async (id: string, currentUserId?: string): Promise<Post> => {
    const { data } = await apiClient.get<Post>(`/v1/posts/${id}`, {
      params: currentUserId ? { currentUserId } : {},
    });
    return data;
  },

  getByUser: async (userId: string, currentUserId?: string): Promise<Post[]> => {
    const { data } = await apiClient.get<Post[]>(`/v1/posts/user/${userId}`, {
      params: currentUserId ? { currentUserId } : {},
    });
    return data;
  },

  create: async (payload: CreatePostPayload): Promise<Post> => {
    const { data } = await apiClient.post<Post>('/v1/posts', payload);
    return data;
  },

  toggleLike: async (postId: string, userId: string): Promise<Post> => {
    const { data } = await apiClient.post<Post>(`/v1/posts/${postId}/like`, null, {
      params: { userId },
    });
    return data;
  },

  recordShare: async (postId: string, userId: string): Promise<Post> => {
    const { data } = await apiClient.post<Post>(`/v1/posts/${postId}/share`, null, {
      params: { userId },
    });
    return data;
  },

  save: async (userId: string, postId: string): Promise<void> => {
    await apiClient.post(`/v1/users/${userId}/saved-posts/${postId}`);
  },

  unsave: async (userId: string, postId: string): Promise<void> => {
    await apiClient.delete(`/v1/users/${userId}/saved-posts/${postId}`);
  },

  getSavedPosts: async (userId: string): Promise<Post[]> => {
    const { data } = await apiClient.get<Post[]>(`/v1/users/${userId}/saved-posts`);
    return data;
  },

  uploadMedia: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post<{ url: string }>('/v1/posts/upload-media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/posts/${id}`);
  },
};
