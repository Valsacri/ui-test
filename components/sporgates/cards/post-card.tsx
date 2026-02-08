"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface Post {
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

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked || false)
  const [saved, setSaved] = useState(post.saved || false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const toggleLike = () => {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">
            {post.authorAvatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{post.author}</p>
              {post.sport && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
                  {post.sport}
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">{post.time}</p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-full p-1.5 transition-colors hover:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        <p className="text-sm leading-relaxed text-foreground">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt="Post"
            className="h-64 w-full object-cover md:h-80"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[11px] text-muted-foreground">
        <span>{likeCount} likes</span>
        <div className="flex gap-3">
          <span>{post.comments} comments</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-2 py-1">
        <button
          type="button"
          onClick={toggleLike}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
            liked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-red-500")} />
          Like
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button
          type="button"
          onClick={() => setSaved((prev) => !prev)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
            saved ? "text-secondary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Bookmark className={cn("h-4 w-4", saved && "fill-secondary")} />
          Save
        </button>
      </div>
    </div>
  )
}
