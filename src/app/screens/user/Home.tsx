import { useState } from "react";
import { toast } from "sonner";
import { Stories } from "@/app/components/Stories";
import { PostCard } from "@/app/components/PostCard";
import { Button } from "@/app/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Textarea } from "@/app/components/ui/textarea";
import { MOCK_STORIES, MOCK_POSTS } from "@/app/data/feedData";
import {
  Image as ImageIcon,
  MapPin,
  Smile,
  Send,
} from "lucide-react";

interface HomeProps {
  onActivityClick: (activityId: string) => void;
}

export function Home({ onActivityClick }: HomeProps) {
  const [activeTab, setActiveTab] = useState("for-you");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState("");

  const handleCreatePost = () => {
    if (postContent.trim()) {
      toast.success("Post created!");
      setPostContent("");
      setShowCreatePost(false);
    }
  };

  const handleLike = (postId: string) => {
    toast.success("Post liked!");
  };

  const handleComment = (postId: string) => {
    toast("Comments feature coming soon!");
  };

  const handleShare = (postId: string) => {
    toast.success("Post shared!");
  };

  return (
    <div className="space-y-4">
      {/* Stories */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <Stories
          stories={MOCK_STORIES}
          onStoryClick={(id) =>
            toast("Story viewer coming soon!")
          }
          onAddStory={() => toast("Add story coming soon!")}
        />
      </div>

      {/* Feed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="for-you">For You</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Feed Content */}
      <Tabs value={activeTab} className="space-y-4">
        {/* For You Tab */}
        <TabsContent value="for-you" className="space-y-4 mt-0">
          <div className="space-y-4">
            {MOCK_POSTS.map((post) => (
              <PostCard
                key={post.id}
                {...post}
                onLike={() => handleLike(post.id)}
                onComment={() => handleComment(post.id)}
                onShare={() => handleShare(post.id)}
                onLocationClick={() =>
                  toast("Opening map view...")
                }
                onActivityClick={() =>
                  post.activity &&
                  onActivityClick(post.activity.id)
                }
              />
            ))}
          </div>
        </TabsContent>

        {/* Following Tab */}
        <TabsContent
          value="following"
          className="space-y-4 mt-0"
        >
          {MOCK_POSTS.filter((p) => !p.sponsored).map(
            (post) => (
              <PostCard
                key={post.id}
                {...post}
                onLike={() => handleLike(post.id)}
                onComment={() => handleComment(post.id)}
                onShare={() => handleShare(post.id)}
                onLocationClick={() =>
                  toast("Opening map view...")
                }
                onActivityClick={() =>
                  post.activity &&
                  onActivityClick(post.activity.id)
                }
              />
            ),
          )}
        </TabsContent>
      </Tabs>

      {/* Create Post Dialog */}
      <Dialog
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={4}
              className="resize-none"
            />

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Photo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                Location
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Smile className="w-4 h-4" />
                Feeling
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreatePost(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                onClick={handleCreatePost}
                disabled={!postContent.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}