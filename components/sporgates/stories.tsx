"use client"

import { useState } from "react"
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Story {
  id: string
  name: string
  avatar: string
  image: string
  isOwn?: boolean
  viewed?: boolean
}

const storiesData: Story[] = [
  {
    id: "own",
    name: "Your Story",
    avatar: "JR",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba9c646b?w=400&h=600&fit=crop",
    isOwn: true,
    viewed: false,
  },
  {
    id: "1",
    name: "Mike J.",
    avatar: "MJ",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=600&fit=crop",
    viewed: false,
  },
  {
    id: "2",
    name: "Sarah L.",
    avatar: "SL",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=600&fit=crop",
    viewed: false,
  },
  {
    id: "3",
    name: "Alex C.",
    avatar: "AC",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=600&fit=crop",
    viewed: true,
  },
  {
    id: "4",
    name: "Emily P.",
    avatar: "EP",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=600&fit=crop",
    viewed: false,
  },
  {
    id: "5",
    name: "Carlos R.",
    avatar: "CR",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    viewed: true,
  },
  {
    id: "6",
    name: "Chelsea P.",
    avatar: "CP",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop",
    viewed: false,
  },
  {
    id: "7",
    name: "NYC Run",
    avatar: "RC",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba9c646b?w=400&h=600&fit=crop",
    viewed: true,
  },
]

export function Stories() {
  const [viewingStory, setViewingStory] = useState<Story | null>(null)
  const [viewedStories, setViewedStories] = useState<Set<string>>(
    new Set(storiesData.filter((s) => s.viewed).map((s) => s.id))
  )

  const openStory = (story: Story) => {
    if (story.isOwn) return
    setViewingStory(story)
    setViewedStories((prev) => new Set([...prev, story.id]))
  }

  const closeStory = () => setViewingStory(null)

  const navigateStory = (direction: "prev" | "next") => {
    if (!viewingStory) return
    const nonOwnStories = storiesData.filter((s) => !s.isOwn)
    const currentIndex = nonOwnStories.findIndex((s) => s.id === viewingStory.id)
    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
    if (nextIndex >= 0 && nextIndex < nonOwnStories.length) {
      const nextStory = nonOwnStories[nextIndex]
      setViewingStory(nextStory)
      setViewedStories((prev) => new Set([...prev, nextStory.id]))
    } else {
      closeStory()
    }
  }

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {storiesData.map((story) => (
          <button
            type="button"
            key={story.id}
            onClick={() => openStory(story)}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <div
              className={cn(
                "relative flex h-16 w-16 items-center justify-center rounded-full p-[2.5px]",
                story.isOwn
                  ? "bg-muted"
                  : viewedStories.has(story.id)
                    ? "bg-border"
                    : "bg-gradient-to-br from-[#003C66] to-[#FC8936]"
              )}
            >
              <div className="gradient-primary flex h-full w-full items-center justify-center rounded-full border-2 border-card text-xs font-bold text-white">
                {story.avatar}
              </div>
              {story.isOwn && (
                <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-secondary text-white">
                  <Plus className="h-3 w-3" />
                </div>
              )}
            </div>
            <span className="w-16 truncate text-center text-[10px] font-medium text-foreground">
              {story.name}
            </span>
          </button>
        ))}
      </div>

      {/* Story Viewer Overlay */}
      {viewingStory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/90">
          <button
            type="button"
            onClick={closeStory}
            className="absolute right-4 top-4 z-10 rounded-full bg-card/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-card/40"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => navigateStory("prev")}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-card/40"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => navigateStory("next")}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-card/40"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="relative h-[80vh] w-full max-w-sm overflow-hidden rounded-2xl">
            {/* Progress Bar */}
            <div className="absolute left-3 right-3 top-3 z-10 h-1 overflow-hidden rounded-full bg-white/30">
              <div className="h-full w-full animate-[storyProgress_5s_linear] rounded-full bg-white" />
            </div>

            {/* Story Header */}
            <div className="absolute left-0 right-0 top-6 z-10 flex items-center gap-3 px-4">
              <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-bold text-white">
                {viewingStory.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{viewingStory.name}</p>
                <p className="text-[10px] text-white/70">2h ago</p>
              </div>
            </div>

            <img
              src={viewingStory.image}
              alt={viewingStory.name}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      )}
    </>
  )
}
