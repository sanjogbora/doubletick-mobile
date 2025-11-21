import React, { useState } from 'react';
import { ChatThread, AISuggestion } from '../types';
import { Icons } from './Icons';
import { ActionCard } from './ActionCard';

interface DashboardProps {
  threads: ChatThread[];
  onSelectThread: (threadId: string) => void;
  onUpdateSuggestion: (suggestionId: string, status: 'accepted' | 'rejected') => void;
}

type Tab = 'chats' | 'actions' | 'broadcast' | 'analytics';

export const Dashboard: React.FC<DashboardProps> = ({ threads, onSelectThread, onUpdateSuggestion }) => {
  const [activeTab, setActiveTab] = useState<Tab>('actions'); 

  // Flatten suggestions for the Action Center
  const allSuggestions = threads.flatMap(t => 
    t.suggestions
     .filter(s => s.status === 'pending')
     .map(s => ({ ...s, customerName: t.customer.name, customerAvatar: t.customer.avatar }))
  );

  const highPriorityCount = allSuggestions.filter(s => s.priority === 'high').length;

  const renderChatList = () => (
    <div className="flex-1 overflow-y-auto bg-white no-scrollbar">
      {threads.map(thread => (
        <div 
            key={thread.id} 
            onClick={() => onSelectThread(thread.id)}
            className="flex items-center px-4 py-3 border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
        >
          <div className="relative w-12 h-12 mr-3 flex-shrink-0">
            <img src={thread.customer.avatar} alt={thread.customer.name} className="w-full h-full rounded-full object-cover border border-gray-100" />
            {thread.suggestions.some(s => s.status === 'pending') && (
                <div className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    <Icons.Sparkle className="w-3 h-3 fill-current" />
                </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className="text-[15px] font-semibold text-gray-900 truncate">{thread.customer.name}</h3>
              <span className={`text-[11px] ${thread.unreadCount > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>{thread.lastMessageTime}</span>
            </div>
            <p className="text-[13px] text-gray-500 truncate flex items-center leading-tight">
               {thread.lastMessage.startsWith('Action Taken') && <Icons.CheckCircle2 className="w-3 h-3 mr-1 text-indigo-500"/>}
               {thread.lastMessage}
            </p>
             {/* Tags Row */}
             {thread.customer.tags.length > 0 && (
                <div className="flex mt-1.5 space-x-1">
                    {thread.customer.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200">
                            {tag}
                        </span>
                    ))}
                </div>
             )}
          </div>
          {thread.unreadCount > 0 && (
            <div className="ml-2 flex flex-col items-end justify-center space-y-1">
                <div className="bg-green-500 text-white text-[10px] font-bold min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full">
                {thread.unreadCount}
                </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderActionCenter = () => (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 no-scrollbar">
       <div className="mb-4 pt-1">
        <h2 className="text-lg font-bold text-gray-900 mb-0.5">Hello Riya! 👋</h2>
        <p className="text-xs text-gray-500">You have <span className="font-bold text-indigo-600">{allSuggestions.length} suggestions</span> to review.</p>
       </div>

       {/* Quick Filters */}
       <div className="flex space-x-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
            <button className="bg-white border border-red-100 shadow-sm px-3 py-1.5 rounded-full flex items-center whitespace-nowrap min-w-max active:bg-gray-50">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                <span className="text-[11px] font-bold text-gray-700">High Priority ({highPriorityCount})</span>
            </button>
            <button className="bg-white border border-gray-200 px-3 py-1.5 rounded-full flex items-center whitespace-nowrap min-w-max">
                <span className="text-[11px] font-medium text-gray-600">Follow-ups</span>
            </button>
            <button className="bg-white border border-gray-200 px-3 py-1.5 rounded-full flex items-center whitespace-nowrap min-w-max">
                <span className="text-[11px] font-medium text-gray-600">Scheduled</span>
            </button>
       </div>

       <div className="space-y-3 pb-20">
        {allSuggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Icons.CheckCircle2 className="w-14 h-14 mb-3 opacity-20" />
                <p className="text-sm">All caught up! No pending actions.</p>
            </div>
        ) : (
            allSuggestions.map(suggestion => (
                <div key={suggestion.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Date Separator or Thread grouping could go here */}
                    <div className="flex items-center justify-between mb-1.5 ml-1 px-1">
                        <div className="flex items-center">
                             <img src={(suggestion as any).customerAvatar} className="w-3.5 h-3.5 rounded-full mr-1.5" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide truncate max-w-[150px]">{(suggestion as any).customerName}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{suggestion.createdAt}</span>
                    </div>
                    <ActionCard 
                        suggestion={suggestion} 
                        onAccept={(id) => onUpdateSuggestion(id, 'accepted')} 
                        onReject={(id) => onUpdateSuggestion(id, 'rejected')} 
                    />
                </div>
            ))
        )}
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
        {/* App Header */}
        <div className="bg-white px-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-30 pt-7 h-[60px]">
            <div className="flex items-center">
                <button className="mr-3">
                    <Icons.Menu className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-[17px] font-bold text-[#075E54] tracking-tight">Converso</h1>
            </div>
            <div className="flex space-x-4">
                 <Icons.Search className="w-5 h-5 text-gray-500" />
                 <div className="relative">
                    <Icons.Bell className="w-5 h-5 text-gray-500" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                 </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
             {activeTab === 'chats' && renderChatList()}
             {activeTab === 'actions' && renderActionCenter()}
             {(activeTab === 'broadcast' || activeTab === 'analytics') && (
                <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                    <Icons.Filter className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">Feature not in prototype</p>
                </div>
            )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 px-5 flex justify-between items-end text-[10px] font-medium h-[65px] pb-3">
            <button onClick={() => setActiveTab('chats')} className={`flex flex-col items-center space-y-1 w-14 ${activeTab === 'chats' ? 'text-[#075E54]' : 'text-gray-400'}`}>
                <Icons.MessageSquare className="w-5 h-5" strokeWidth={activeTab === 'chats' ? 2.5 : 2} />
                <span>Inbox</span>
            </button>
            
            <button onClick={() => setActiveTab('broadcast')} className={`flex flex-col items-center space-y-1 w-14 ${activeTab === 'broadcast' ? 'text-[#075E54]' : 'text-gray-400'}`}>
                <Icons.Send className="w-5 h-5" strokeWidth={activeTab === 'broadcast' ? 2.5 : 2} />
                <span>Broadcast</span>
            </button>

            {/* The Suggested Actions Tab (Highlighted) */}
            <div className="relative -top-5">
                <button onClick={() => setActiveTab('actions')} className="flex flex-col items-center group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 ${activeTab === 'actions' ? 'bg-indigo-600 scale-110 ring-4 ring-indigo-50' : 'bg-gray-800 group-active:scale-95'}`}>
                        <Icons.Sparkle className={`w-5 h-5 text-white ${activeTab === 'actions' ? 'fill-white' : ''}`} />
                        {allSuggestions.length > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                {allSuggestions.length}
                            </span>
                        )}
                    </div>
                    <span className={`mt-1 ${activeTab === 'actions' ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>Actions</span>
                </button>
            </div>

             <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center space-y-1 w-14 ${activeTab === 'analytics' ? 'text-[#075E54]' : 'text-gray-400'}`}>
                <Icons.Filter className="w-5 h-5" strokeWidth={activeTab === 'analytics' ? 2.5 : 2} />
                <span>Stats</span>
            </button>

            <button className={`flex flex-col items-center space-y-1 w-14 text-gray-400`}>
                <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                    <img src="https://picsum.photos/200/200" alt="Profile" />
                </div>
                <span>Profile</span>
            </button>
        </div>
    </div>
  );
};