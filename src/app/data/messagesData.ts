export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  isOnline: boolean;
  verified?: boolean;
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    userId: 'u1',
    userName: 'Sarah Mitchell',
    userAvatar: '',
    lastMessage: "Hey! Are you joining the morning run tomorrow?",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    unread: 2,
    isOnline: true,
    verified: true,
  },
  {
    id: 'c2',
    userId: 'u2',
    userName: 'Mike Rodriguez',
    userAvatar: '',
    lastMessage: "Thanks for the workout tips! 💪",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: 0,
    isOnline: false,
    verified: true,
  },
  {
    id: 'c3',
    userId: 'u3',
    userName: 'Emma Lopez',
    userAvatar: '',
    lastMessage: "The cycling event was amazing!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unread: 0,
    isOnline: true,
    verified: false,
  },
  {
    id: 'c4',
    userId: 'u4',
    userName: 'Alex Chen',
    userAvatar: '',
    lastMessage: "Would love to collab on a yoga session",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: 0,
    isOnline: false,
    verified: true,
  },
  {
    id: 'c5',
    userId: 'u5',
    userName: 'Jordan Davis',
    userAvatar: '',
    lastMessage: "Basketball pickup game at 6pm?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    unread: 0,
    isOnline: false,
    verified: false,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1',
      senderId: 'u1',
      senderName: 'Sarah Mitchell',
      text: "Hey! How's your training going?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isOwn: false,
    },
    {
      id: 'm2',
      senderId: 'me',
      senderName: 'You',
      text: "Pretty good! Just finished a 5K run this morning",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      isOwn: true,
    },
    {
      id: 'm3',
      senderId: 'u1',
      senderName: 'Sarah Mitchell',
      text: "Nice! I'm planning a group run tomorrow at 7am. Want to join?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isOwn: false,
    },
    {
      id: 'm4',
      senderId: 'me',
      senderName: 'You',
      text: "Definitely! Where are we meeting?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isOwn: true,
    },
    {
      id: 'm5',
      senderId: 'u1',
      senderName: 'Sarah Mitchell',
      text: "Hey! Are you joining the morning run tomorrow?",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isOwn: false,
    },
  ],
  c2: [
    {
      id: 'm6',
      senderId: 'u2',
      senderName: 'Mike Rodriguez',
      text: "Thanks for the workout tips! 💪",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isOwn: false,
    },
    {
      id: 'm7',
      senderId: 'me',
      senderName: 'You',
      text: "No problem! Let me know if you need any more help",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isOwn: true,
    },
  ],
};
