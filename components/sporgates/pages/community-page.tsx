"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Users, Plus, ImageIcon } from "lucide-react"
import { posts, squads } from "@/lib/mock-data"
import { Stories } from "@/components/sporgates/stories"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface CommunityPageProps {
  onNavigate: (page: PageRoute, id?: string) => void
}

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState("Feed")
  const [newPost, setNewPost] = useState("")

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community</h1>
          <p className="text-sm text-muted-foreground">Connect with athletes and squads</p>
        </div>
      </div>

      <Stories />

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {["Feed", "Squads", "Discover"].map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all",
              activeTab === tab
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Feed" && (
        <div className="space-y-4">
          {/* Create Post */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="gradient-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                JR
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share something with the community..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-border bg-muted p-3 text-sm outline-none focus:border-primary"
                />
                <div className="mt-2 flex items-center justify-between">
                  <button type="button" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <ImageIcon className="h-4 w-4" />
                    Photo
                  </button>
                  <button
                    type="button"
                    className="gradient-primary rounded-full px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <div key={post.id} className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 p-4 pb-2">
                <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">
                  {post.authorAvatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{post.author}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{post.time}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {post.sport}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-3">
                <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
              </div>
              {post.image && (
                <img
                  src={post.image}
                  alt=""
                  className="w-full object-cover"
                  style={{ maxHeight: 300 }}
                  crossOrigin="anonymous"
                />
              )}
              <div className="flex items-center gap-6 border-t border-border px-4 py-3">
                <button type="button" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-secondary transition-colors">
                  <Heart className="h-4 w-4" />
                  {post.likes}
                </button>
                <button type="button" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </button>
                <button type="button" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="h-4 w-4" />
                  {post.shares}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Squads" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Your Squads</h2>
            <button type="button" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Plus className="h-3.5 w-3.5" />
              Create Squad
            </button>
          </div>
          {squads.map((squad) => (
            <button
              type="button"
              key={squad.id}
              onClick={() => onNavigate("squad-detail", squad.id)}
              className="w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="gradient-primary flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white">
                  {squad.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground">{squad.name}</h3>
                  <p className="text-xs text-muted-foreground">{squad.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {squad.members}/{squad.maxMembers} members
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {squad.sport}
                    </span>
                    <span>{squad.upcomingEvents} upcoming</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {activeTab === "Discover" && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground">Suggested Squads</h2>
          {squads.map((squad) => (
            <div
              key={squad.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="gradient-secondary flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white">
                {squad.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{squad.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {squad.members} members - {squad.sport}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
