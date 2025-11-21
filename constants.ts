import { ChatThread, User } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Riya Patel',
  avatar: 'https://picsum.photos/200/200',
  role: 'Customer Support Agent'
};

export const MOCK_THREADS: ChatThread[] = [
  {
    id: 'c1',
    customer: {
      id: 'cust1',
      name: 'Verma Jewellers',
      phone: '+91 98765 43210',
      avatar: 'https://picsum.photos/seed/verma/200/200',
      tags: ['VIP', 'Wholesale']
    },
    lastMessage: 'Can you send the catalog for the new gold rings?',
    lastMessageTime: '10:42 AM',
    unreadCount: 1,
    messages: [
      { id: 'm1', sender: 'agent', text: 'Hello! How can I help you today?', timestamp: '10:40 AM', isRead: true },
      { id: 'm2', sender: 'customer', text: 'Hi Riya, we are looking to restock for the wedding season.', timestamp: '10:41 AM', isRead: true },
      { id: 'm3', sender: 'customer', text: 'Can you send the catalog for the new gold rings?', timestamp: '10:42 AM', isRead: false }
    ],
    suggestions: [
      {
        id: 's1',
        chatId: 'c1',
        type: 'send_document',
        title: 'Send Gold Ring Catalog',
        description: 'Customer explicitly requested the "catalog for new gold rings".',
        suggestedActionPayload: 'Gold_Rings_2024.pdf',
        confidence: 'high',
        priority: 'high',
        reason: 'Keyword match: "send catalog", "gold rings"',
        status: 'pending',
        createdAt: '10:42 AM'
      }
    ]
  },
  {
    id: 'c2',
    customer: {
      id: 'cust2',
      name: 'Deepak Kumar',
      phone: '+91 99887 77665',
      avatar: 'https://picsum.photos/seed/deepak/200/200',
      tags: ['New Lead']
    },
    lastMessage: 'I will be free tomorrow at 4pm.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm4', sender: 'agent', text: 'When would be a good time to discuss the diamond pricing?', timestamp: 'Yesterday 2:00 PM', isRead: true },
      { id: 'm5', sender: 'customer', text: 'I am busy right now.', timestamp: 'Yesterday 2:10 PM', isRead: true },
      { id: 'm6', sender: 'customer', text: 'I will be free tomorrow at 4pm.', timestamp: 'Yesterday 2:11 PM', isRead: true }
    ],
    suggestions: [
      {
        id: 's2',
        chatId: 'c2',
        type: 'schedule_call',
        title: 'Schedule Follow-up Call',
        description: 'Customer specified availability for a call.',
        suggestedActionPayload: 'Tomorrow at 4:00 PM',
        confidence: 'high',
        priority: 'medium',
        reason: 'Date/Time extraction: "Tomorrow at 4pm"',
        status: 'pending',
        createdAt: 'Yesterday 2:12 PM'
      }
    ]
  },
  {
    id: 'c3',
    customer: {
      id: 'cust3',
      name: 'Kolkata Jewellery Customers',
      phone: 'Group',
      avatar: 'https://picsum.photos/seed/kolkata/200/200',
      tags: ['Broadcast List']
    },
    lastMessage: 'Payment received for Invoice #9921',
    lastMessageTime: 'Sep 23',
    unreadCount: 0,
    messages: [
        { id: 'm7', sender: 'customer', text: 'Payment received for Invoice #9921', timestamp: 'Sep 23', isRead: true }
    ],
    suggestions: [] // No suggestions
  }
];
