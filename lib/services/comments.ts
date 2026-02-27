import apiClient from '../api';
import type { Comment, CommentsPage, CreateCommentPayload } from '@/lib/types/post';

const COMMENTS_PAGE_SIZE = 20;

export const commentsService = {
  getByPostId: async (
    postId: string,
    page = 0,
    size = COMMENTS_PAGE_SIZE,
    currentUserId?: string | null
  ): Promise<CommentsPage> => {
    const { data } = await apiClient.get<CommentsPage>(`/v1/posts/${postId}/comments`, {
      params: { page, size, ...(currentUserId ? { currentUserId } : {}) },
    });
    return data;
  },

  add: async (postId: string, payload: CreateCommentPayload): Promise<Comment> => {
    const { data } = await apiClient.post<Comment>(`/v1/posts/${postId}/comments`, payload);
    return data;
  },

  toggleLike: async (postId: string, commentId: string, userId: string): Promise<Comment> => {
    const { data } = await apiClient.post<Comment>(
      `/v1/posts/${postId}/comments/${commentId}/like`,
      null,
      { params: { userId } }
    );
    return data;
  },

  delete: async (postId: string, commentId: string): Promise<void> => {
    await apiClient.delete(`/v1/posts/${postId}/comments/${commentId}`);
  },
};
