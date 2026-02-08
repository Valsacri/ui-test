import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/app/data/messagesData';
import { ArrowLeft, Send, MoreVertical, Phone, Video, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ConversationProps {
  conversationId: string;
  onBack: () => void;
}

export function Conversation({ conversationId, onBack }: ConversationProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
  const messages = MOCK_MESSAGES[conversationId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return null;
  }

  const handleSend = () => {
    if (message.trim()) {
      toast.success('Message sent!');
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={conversation.userAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
                    {conversation.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h2 className="font-semibold truncate">{conversation.userName}</h2>
                  {conversation.verified && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {conversation.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => toast('Voice call coming soon!')}>
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toast('Video call coming soon!')}>
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toast('More options coming soon!')}>
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg, index) => {
            const showTimestamp = 
              index === 0 || 
              msg.timestamp.getTime() - messages[index - 1].timestamp.getTime() > 1000 * 60 * 30;

            return (
              <div key={msg.id}>
                {showTimestamp && (
                  <div className="text-center my-4">
                    <span className="text-xs text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                      {format(msg.timestamp, 'MMM d, h:mm a')}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.isOwn
                        ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white'
                        : 'bg-gray-100 text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-end gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
