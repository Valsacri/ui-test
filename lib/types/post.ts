/**
 * Central types for posts, comments, and feed.
 * Single source of truth for API contracts and UI props.
 */

export interface Post {
  id: string
  authorId?: string
  authorName?: string
  authorAvatar?: string
  content?: string
  image?: string
  likes?: number
  comments?: number
  shares?: number
  sport?: string
  likedByCurrentUser?: boolean
  savedByCurrentUser?: boolean
  createdAt?: string
}

export interface Comment {
  id: string
  postId: string
  parentCommentId?: string | null
  authorId?: string
  authorName?: string
  authorAvatar?: string
  text: string
  likes?: number
  likedByCurrentUser?: boolean
  createdAt?: string
  replies?: Comment[]
}

export interface CreatePostPayload {
  authorId: string
  authorName?: string
  authorAvatar?: string
  content: string
  image?: string
  sport?: string
}

export interface CreateCommentPayload {
  authorId: string
  authorName?: string
  authorAvatar?: string
  text: string
  /** When set, creates a reply to this comment. */
  parentCommentId?: string | null
}

export interface PostsPage {
  content: Post[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export interface CommentsPage {
  content: Comment[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

/** Props for a single post in the feed (UI layer). */
export interface PostCardData {
  id: string
  author: string
  authorAvatar: string
  time: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  liked?: boolean
  saved?: boolean
  sport?: string
}
