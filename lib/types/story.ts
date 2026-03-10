/**
 * Central types for Stories feature.
 * Single source of truth for API contracts and UI props.
 */

export type StoryMediaType = 'IMAGE' | 'VIDEO'

/** Viewer summary (id, name, avatar) inside story_views */
export interface StoryViewerSummary {
  id: string
  name: string
  avatar: string | null
}

/** Nested object: viewers list and count for a story */
export interface StoryViewsDto {
  count: number
  viewers: StoryViewerSummary[]
}

/** Nested object: replies count and first page of replies for a story */
export interface StoryRepliesDto {
  totalCount: number
  content: StoryReply[]
}

/** Full story object returned by GET /v1/stories/users/{userId} */
export interface StoryDto {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  mediaUrl: string
  mediaType: StoryMediaType
  /** Duration in seconds for VIDEO stories. Absent for IMAGE stories. */
  durationSeconds?: number
  expiresAt: string
  viewCount: number
  likeCount: number
  likedByCurrentUser: boolean
  createdAt: string
  /** Nested: viewers list and count (when returned by API) */
  storyViews?: StoryViewsDto
  /** Nested: replies count and first page (when returned by API) */
  storyReplies?: StoryRepliesDto
}

/** Summary entry for the stories feed strip (one per user). */
export interface StoryFeedItem {
  userId: string
  userName: string
  userAvatar?: string
  latestStoryImageUrl: string
  storyCount: number
  allViewed: boolean
}

/** Story reply object */
export interface StoryReply {
  id: string
  storyId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
}

/** Page wrapper for story replies */
export interface StoryRepliesPage {
  content: StoryReply[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

/** Payload for creating a story. */
export interface CreateStoryPayload {
  mediaUrl: string
  mediaType?: StoryMediaType
  /** Duration in seconds returned from the upload endpoint after video processing. */
  durationSeconds?: number
}

/** Payload for creating a story reply. */
export interface CreateStoryReplyPayload {
  content: string
}
