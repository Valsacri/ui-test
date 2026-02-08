import { useState } from 'react';
import { ConversationItem } from '@/app/components/ConversationItem';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { MOCK_CONVERSATIONS } from '@/app/data/messagesData';
import { Search, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface MessagesProps {
  onConversationClick: (conversationId: string) => void;
}

export function Messages({ onConversationClick }: MessagesProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = MOCK_CONVERSATIONS.filter((conv) =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Messages</h1>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => toast('New message feature coming soon!')}
            >
              <Edit className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-w-4xl mx-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              {...conversation}
              onClick={() => onConversationClick(conversation.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
