import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Plus } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  timestamp: string;
  viewed: boolean;
}

interface StoriesProps {
  stories: Story[];
  onStoryClick?: (storyId: string) => void;
  onAddStory?: () => void;
}

export function Stories({ stories, onStoryClick, onAddStory }: StoriesProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
      {/* Add Story */}
      <button
        onClick={onAddStory}
        className="flex flex-col items-center gap-2 flex-shrink-0"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-medium">Your Story</span>
      </button>

      {/* Stories */}
      {stories.map((story) => (
        <button
          key={story.id}
          onClick={() => onStoryClick?.(story.id)}
          className="flex flex-col items-center gap-2 flex-shrink-0"
        >
          <div
            className={cn(
              "w-16 h-16 rounded-full p-0.5",
              story.viewed
                ? "bg-gray-300"
                : "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
            )}
          >
            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-100">
              {story.image ? (
                <img
                  src={story.image}
                  alt={story.userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Avatar className="w-full h-full">
                  <AvatarImage src={story.userAvatar} />
                  <AvatarFallback className="text-xs">
                    {story.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
          <span className="text-xs font-medium max-w-[64px] truncate">
            {story.userName.split(' ')[0]}
          </span>
        </button>
      ))}
    </div>
  );
}
