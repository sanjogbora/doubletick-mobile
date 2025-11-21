export type Priority = 'high' | 'medium' | 'low';
export type Confidence = 'high' | 'medium' | 'low';
export type ActionType = 'schedule_call' | 'send_document' | 'follow_up' | 'reply_template';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar: string; // Using placeholder URLs
  company?: string;
  tags: string[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'agent' | 'customer' | 'system';
  timestamp: string;
  isRead: boolean;
}

export interface AISuggestion {
  id: string;
  chatId: string;
  type: ActionType;
  title: string;
  description: string; // The rationale
  suggestedActionPayload?: string; // e.g., "Tomorrow 4pm" or "Catalog.pdf"
  confidence: Confidence;
  priority: Priority;
  reason: string; // Explainability text
  status: 'pending' | 'accepted' | 'rejected' | 'scheduled';
  createdAt: string;
}

export interface ChatThread {
  id: string;
  customer: Customer;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  suggestions: AISuggestion[]; // Active suggestions for this thread
}
