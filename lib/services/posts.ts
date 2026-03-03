import apiClient from '../api';
import type { Post, PostsPage, CreatePostPayload } from '@/lib/types/post';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export type { Post, PostsPage, CreatePostPayload };

export const postsService = {
  getAll: async (
    sport?: string,
    _currentUserId?: string, // DEPRECATED — kept for backward compat signature
    page = 0,
    size = DEFAULT_PAGE_SIZE
  ): Promise<PostsPage> => {
    const params: Record<string, string | number> = { page, size: Math.min(size, MAX_PAGE_SIZE) };
    if (sport) params.sport = sport;
    // currentUserId no longer sent — backend extracts from JWT
    const { data } = await apiClient.get<PostsPage>('/v1/posts', { params });
    return data;
  },

  getById: async (id: string, _currentUserId?: string): Promise<Post> => {
    // currentUserId no longer sent — backend extracts from JWT
    const { data } = await apiClient.get<Post>(`/v1/posts/${id}`);
    return data;
  },

  getByUser: async (
    userId: string,
    _currentUserId?: string,
    page = 0,
    size = DEFAULT_PAGE_SIZE
  ): Promise<PostsPage> => {
    const { data } = await apiClient.get<PostsPage>(`/v1/posts/user/${userId}`, {
      params: { page, size: Math.min(size, MAX_PAGE_SIZE) },
    });
    return data;
  },

  getByBusiness: async (
    businessId: string,
    page = 0,
    size = DEFAULT_PAGE_SIZE
  ): Promise<PostsPage> => {
    const { data } = await apiClient.get<PostsPage>(`/v1/posts/business/${businessId}`, {
      params: { page, size: Math.min(size, MAX_PAGE_SIZE) },
    });
    return data;
  },

  create: async (payload: CreatePostPayload): Promise<Post> => {
    const { data } = await apiClient.post<Post>('/v1/posts', payload);
    return data;
  },

  toggleLike: async (postId: string, _userId?: string): Promise<Post> => {
    // userId no longer sent — backend extracts from JWT
    const { data } = await apiClient.post<Post>(`/v1/posts/${postId}/like`);
    return data;
  },

  recordShare: async (postId: string, _userId?: string): Promise<Post> => {
    const { data } = await apiClient.post<Post>(`/v1/posts/${postId}/share`);
    return data;
  },

  /** Toggle save/bookmark (uses the new unified save endpoint). */
  toggleSave: async (postId: string): Promise<Post> => {
    const { data } = await apiClient.post<Post>(`/v1/posts/${postId}/save`);
    return data;
  },

  /** @deprecated Use toggleSave instead */
  save: async (_userId: string, postId: string): Promise<void> => {
    await apiClient.post(`/v1/posts/${postId}/save`);
  },

  /** @deprecated Use toggleSave instead */
  unsave: async (_userId: string, postId: string): Promise<void> => {
    await apiClient.post(`/v1/posts/${postId}/save`);
  },

  getSavedPosts: async (_userId?: string): Promise<PostsPage> => {
    // TODO: implement GET /v1/posts/saved when backend supports it
    return { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20, first: true, last: true };
  },

  uploadMedia: async (files: File | File[]): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach((file) => formData.append('files', file));
    const { data } = await apiClient.post<{ urls: string[] }>('/v1/posts/upload-media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/posts/${id}`);
  },
};
