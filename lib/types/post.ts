/**
 * Central types for posts, comments, and feed.
 * Single source of truth for API contracts and UI props.
 */

export type PostVisibility = 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE'

export type AuthorType = 'USER' | 'BUSINESS'

/** Mirrors backend PostKind — business catalog-linked surfaces. */
export type PostKind =
  | 'STANDARD'
  | 'NEW_PRODUCT'
  | 'NEW_SERVICE'
  | 'NEW_FACILITY'
  | 'UPCOMING_EVENT'

export interface Post {
  id: string
  authorId?: string
  authorType?: AuthorType
  businessId?: string
  authorName?: string
  authorAvatar?: string
  content?: string
  image?: string
  images?: string[]
  visibility?: PostVisibility
  likes?: number
  comments?: number
  shares?: number
  sport?: string
  likedByCurrentUser?: boolean
  savedByCurrentUser?: boolean
  createdAt?: string
  postKind?: PostKind
  linkedProductId?: string
  linkedServiceListingId?: string
  linkedFacilityId?: string
  linkedActivityId?: string
  boostCampaignId?: string
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

/**
 * Payload for creating a new post.
 * Author info is resolved server-side from JWT (or from business when businessId is set).
 */
export interface CreatePostPayload {
  content: string
  image?: string
  images?: string[]
  sport?: string
  visibility?: PostVisibility
  /** When set, post is created as the business (owner/staff only). */
  businessId?: string
  postKind?: PostKind
  linkedProductId?: string
  linkedServiceListingId?: string
  linkedFacilityId?: string
  linkedActivityId?: string
}

/**
 * Payload for creating a comment.
 * Author info is resolved server-side from JWT.
 */
export interface CreateCommentPayload {
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
  images?: string[]
  likes: number
  comments: number
  shares: number
  liked?: boolean
  saved?: boolean
  sport?: string
  visibility?: PostVisibility
  authorType?: AuthorType
  businessId?: string
  postKind?: PostKind
  linkedProductId?: string
  linkedServiceListingId?: string
  linkedFacilityId?: string
  linkedActivityId?: string
  sponsored?: boolean
  sponsoredCampaignId?: string
  sponsoredCreativeId?: string
}
