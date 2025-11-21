
import React, { useState } from 'react';
import { Search, CheckCircle2, Sparkle, Clock, FileText, AlertCircle, MessageSquare } from 'lucide-react';
import { Chat, LeadStage, ActionType, PriorityLevel } from '../types';

interface ChatListProps {
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    chatsWithSuggestions?: Map<string, { type: ActionType, priority: PriorityLevel }[]>;
}

const ChatList: React.FC<ChatListProps> = ({ chats, activeChatId, onSelectChat, chatsWithSuggestions }) => {
    const [filter, setFilter] = useState('All');

    // Simple categorization for the UI tabs
    const filters = ['All', 'Unread', 'Hot', 'Warm'];

    const getActionIcon = (type: ActionType) => {
        switch (type) {
            case ActionType.SCHEDULE_FOLLOWUP: return <Clock size={12} />;
            case ActionType.SEND_TEMPLATE: return <FileText size={12} />;
            case ActionType.ESCALATE: return <AlertCircle size={12} />;
            default: return <Sparkle size={12} />;
        }
    };

    const getPriorityColor = (priority: PriorityLevel) => {
        switch (priority) {
            case PriorityLevel.HIGH: return 'text-red-600';
            case PriorityLevel.MEDIUM: return 'text-orange-600';
            case PriorityLevel.LOW: return 'text-indigo-600';
            default: return 'text-indigo-600';
        }
    };

    return (
        <div className="w-full bg-white flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 text-xl">Inbox</h2>
                    <div className="flex gap-2">
                        <button className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                            <MessageSquare className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex px-4 py-2 gap-2 overflow-x-auto scrollbar-hide border-b border-gray-50 pb-3">
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === f
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {f} {f === 'All' && <span className="ml-1 opacity-80">{chats.length}</span>}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pb-20">
                {chats.map((chat) => {
                    const lastMsg = chat.messages[chat.messages.length - 1];
                    const suggestions = chatsWithSuggestions?.get(chat.id);

                    return (
                        <div
                            key={chat.id}
                            onClick={() => onSelectChat(chat.id)}
                            className="flex items-start gap-3 p-4 border-b border-gray-50 active:bg-gray-50 transition-colors"
                        >
                            <div className="relative">
                                <img
                                    src={chat.contact.avatar || `https://ui-avatars.com/api/?name=${chat.contact.name}`}
                                    alt={chat.contact.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                {chat.contact.source === 'Website' && (
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <CheckCircle2 size={12} color="white" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-base font-semibold text-gray-900 truncate">
                                        {chat.contact.name}
                                    </h3>
                                    <span className="text-xs text-gray-400">{lastMsg?.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-500 truncate pr-2 mb-1.5">
                                    {lastMsg?.sender === 'user' && 'You: '}
                                    {lastMsg?.content}
                                </p>

                                <div className="flex gap-2 items-center">
                                    {chat.contact.leadStage === LeadStage.HOT && (
                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-medium">Hot</span>
                                    )}
                                    {suggestions && suggestions.length > 0 && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 rounded-md border border-purple-100">
                                            {suggestions.slice(0, 3).map((s, i) => (
                                                <span key={i} className={getPriorityColor(s.priority)}>
                                                    {getActionIcon(s.type)}
                                                </span>
                                            ))}
                                            {suggestions.length > 3 && (
                                                <span className="text-[10px] text-purple-600 font-bold">+{suggestions.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                    {chat.unreadCount > 0 && (
                                        <span className="ml-auto bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default ChatList;
