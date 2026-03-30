"use client"

import useSWR from "swr"
import { FeedComposer } from "@/components/sporgates/feed-composer"
import { PostCard } from "@/components/sporgates/cards/post-card"
import { useBusinessContext } from "@/lib/business-context"
import { postsService, authService } from "@/lib/services"
import { formatFeedTime, resolvePostImageUrl } from "@/lib/utils"
import type { Post, PostCardData } from "@/lib/types/post"
import type { FeedComposerPayload } from "@/components/sporgates/feed-composer"
import type { PageRoute } from "@/lib/navigation"

interface BusinessFeedPageProps {
  onNavigate?: (page: PageRoute) => void
}

export function BusinessFeedPage({ onNavigate }: BusinessFeedPageProps) {
  const { activeBusinessId, businesses } = useBusinessContext()
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId)
  const currentUser = authService.getCurrentUser()
  const userId = currentUser?.id
  const initials =
    (currentUser?.firstName?.[0] ?? "") +
    (currentUser?.lastName?.[0] ?? "") ||
    (currentUser?.username?.[0] ?? "?").toUpperCase()
  const currentUserForComment = currentUser
    ? {
        id: currentUser.id,
        authorName:
          [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") ||
          currentUser.username ||
          "User",
        authorAvatar: initials,
      }
    : null

  const { data: postsData, mutate: mutatePosts } = useSWR(
    activeBusinessId ? [`/posts/business/${activeBusinessId}`, activeBusinessId] : null,
    () => postsService.getByBusiness(activeBusinessId!, 0, 20),
    { revalidateOnFocus: false, dedupingInterval: 5000 }
  )
  const businessPosts = postsData?.content ?? []

  const handleCreatePost = async (payload: FeedComposerPayload) => {
    await postsService.create({ ...payload, businessId: activeBusinessId! })
    mutatePosts()
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Feed</h1>
        <p className="text-sm text-muted-foreground">
          Share updates and connect with your audience
        </p>
      </div>

      {activeBusinessId && (
        <div className="space-y-4">
          <FeedComposer
            userDisplayName={activeBusiness?.name ?? "Your business"}
            userAvatar={activeBusiness?.avatar}
            placeholder="Share an update with your followers..."
            businessId={activeBusinessId}
            onSubmit={handleCreatePost}
            onSuccess={() => mutatePosts()}
          />
          <div className="space-y-4">
            {businessPosts.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">No posts yet. Create one above.</p>
            ) : (
              businessPosts.map((p: Post) => {
                const postCard: PostCardData = {
                  id: String(p.id),
                  author: (p.authorName as string) ?? "Business",
                  authorAvatar: (p.authorAvatar as string) ?? "?",
                  time: formatFeedTime(p.createdAt as string | number[] | undefined),
                  content: (p.content as string) ?? "",
                  image: resolvePostImageUrl(p.image as string) || (p.image as string),
                  images: (p.images as string[] | undefined)?.map((img) => resolvePostImageUrl(img) || img),
                  likes: (p.likes as number) ?? 0,
                  comments: (p.comments as number) ?? 0,
                  shares: (p.shares as number) ?? 0,
                  liked: (p.likedByCurrentUser as boolean) ?? false,
                  saved: (p.savedByCurrentUser as boolean) ?? false,
                  sport: p.sport as string | undefined,
                  authorType: p.authorType,
                  businessId: p.businessId as string | undefined,
                  postKind: p.postKind,
                  linkedProductId: p.linkedProductId,
                  linkedServiceListingId: p.linkedServiceListingId,
                  linkedFacilityId: p.linkedFacilityId,
                  linkedActivityId: p.linkedActivityId,
                }
                return (
                  <PostCard
                    key={String(p.id)}
                    post={postCard}
                    userId={userId}
                    currentUser={currentUserForComment}
                    onCountChange={() => mutatePosts()}
                    canDelete
                    onDelete={async (id) => {
                      await postsService.delete(id)
                      mutatePosts()
                    }}
                  />
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
