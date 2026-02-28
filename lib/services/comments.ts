import apiClient from '../api';
import type { Comment, CommentsPage, CreateCommentPayload } from '@/lib/types/post';

const COMMENTS_PAGE_SIZE = 20;

export const commentsService = {
  getByPostId: async (
    postId: string,
    page = 0,
    size = COMMENTS_PAGE_SIZE,
    _currentUserId?: string | null // DEPRECATED — backend extracts from JWT
  ): Promise<CommentsPage> => {
    const { data } = await apiClient.get<CommentsPage>(`/v1/posts/${postId}/comments`, {
      params: { page, size },
    });
    return data;
  },

  add: async (postId: string, payload: CreateCommentPayload): Promise<Comment> => {
    const { data } = await apiClient.post<Comment>(`/v1/posts/${postId}/comments`, payload);
    return data;
  },

  toggleLike: async (postId: string, commentId: string, _userId?: string): Promise<Comment> => {
    // userId no longer sent — backend extracts from JWT
    const { data } = await apiClient.post<Comment>(
      `/v1/posts/${postId}/comments/${commentId}/like`
    );
    return data;
  },

  delete: async (postId: string, commentId: string): Promise<void> => {
    await apiClient.delete(`/v1/posts/${postId}/comments/${commentId}`);
  },
};
