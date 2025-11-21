import React, { useState } from 'react';
import { ChatThread, AISuggestion } from '../types';
import { Icons } from './Icons';
import { ActionCard } from './ActionCard';

interface DashboardProps {
  threads: ChatThread[];
  onSelectThread: (threadId: string) => void;
  onUpdateSuggestion: (suggestionId: string, status: 'accepted' | 'rejected') => void;
  onReviewSuggestion?: (suggestion: AISuggestion) => void;
}

type Tab = 'chats' | 'converso' | 'broadcast' | 'stats';

export const Dashboard: React.FC<DashboardProps> = ({ threads, onSelectThread, onUpdateSuggestion, onReviewSuggestion }) => {
  const [activeTab, setActiveTab] = useState<Tab>('converso'); 

  // Flatten suggestions for the Converso Center
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
            className="flex items-center px-4 py-4 border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
        >
          <div className="relative w-14 h-14 mr-4 flex-shrink-0">
            <img src={thread.customer.avatar} alt={thread.customer.name} className="w-full h-full rounded-full object-cover border border-gray-100" />
            {thread.suggestions.some(s => s.status === 'pending') && (
                <div className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    <Icons.Sparkle className="w-3 h-3 fill-current" />
                </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-base font-bold text-gray-900 truncate">{thread.customer.name}</h3>
              <span className={`text-xs ${thread.unreadCount > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>{thread.lastMessageTime}</span>
            </div>
            <p className="text-sm text-gray-500 truncate flex items-center leading-tight">
               {thread.lastMessage.startsWith('Action Taken') && <Icons.CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-indigo-500"/>}
               {thread.lastMessage}
            </p>
             {/* Tags Row */}
             {thread.customer.tags.length > 0 && (
                <div className="flex mt-2 space-x-1">
                    {thread.customer.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200">
                            {tag}
                        </span>
                    ))}
                </div>
             )}
          </div>
          {thread.unreadCount > 0 && (
            <div className="ml-3 flex flex-col items-end justify-center space-y-1">
                <div className="bg-green-500 text-white text-xs font-bold min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full">
                {thread.unreadCount}
                </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderConverso = () => (
    <div className="flex-1 overflow-y-auto bg-[#f3f4f6] p-5 no-scrollbar">
       {/* Welcome Header */}
       <div className="mb-6 pt-2 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Hello Riya! 👋</h2>
                <p className="text-sm text-gray-500">You have <span className="font-bold text-indigo-600">{allSuggestions.length} suggestions</span> to review.</p>
            </div>
       </div>

       {/* Filters */}
       <div className="flex space-x-3 mb-6 overflow-x-auto pb-1 no-scrollbar">
            <button className="bg-white border border-red-100 shadow-sm px-4 py-2 rounded-full flex items-center whitespace-nowrap min-w-max active:scale-95 transition-transform">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2.5 animate-pulse"></span>
                <span className="text-xs font-bold text-gray-700">High Priority ({highPriorityCount})</span>
            </button>
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-full flex items-center whitespace-nowrap min-w-max">
                <span className="text-xs font-medium text-gray-600">Follow-ups</span>
            </button>
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-full flex items-center whitespace-nowrap min-w-max">
                <span className="text-xs font-medium text-gray-600">Scheduled</span>
            </button>
       </div>

       <div className="space-y-5 pb-24">
        {allSuggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Icons.Sparkle className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-base font-medium">All caught up! No pending actions.</p>
            </div>
        ) : (
            allSuggestions.map(suggestion => (
                <div key={suggestion.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Context Header */}
                    <div className="flex items-center justify-between mb-2 ml-1 px-1">
                        <div className="flex items-center">
                             <Icons.CornerDownRight className="w-4 h-4 text-gray-300 mr-2" />
                             <span className="text-xs font-bold text-gray-500 uppercase tracking-wide truncate max-w-[180px] flex items-center">
                                <img src={(suggestion as any).customerAvatar} className="w-5 h-5 rounded-full mr-2 border border-gray-200" />
                                {(suggestion as any).customerName}
                             </span>
                        </div>
                        <span className="text-xs text-gray-400">{suggestion.createdAt}</span>
                    </div>
                    <ActionCard 
                        suggestion={suggestion} 
                        onAccept={(id) => onUpdateSuggestion(id, 'accepted')} 
                        onReject={(id) => onUpdateSuggestion(id, 'rejected')} 
                        onReview={onReviewSuggestion}
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
        <div className="bg-white px-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-30 pt-10 h-[80px]">
            <div className="flex items-center gap-3">
                <button>
                    <Icons.Menu className="w-7 h-7 text-gray-700" />
                </button>
                {activeTab === 'converso' ? (
                     <h1 className="text-xl font-bold text-indigo-600 tracking-tight flex items-center">
                        <Icons.Sparkle className="w-5 h-5 mr-1.5 fill-current" />
                        Converso
                     </h1>
                ) : (
                     <h1 className="text-xl font-bold text-[#075E54] tracking-tight">DoubleTick</h1>
                )}
            </div>
            <div className="flex space-x-5 items-center">
                 <Icons.Search className="w-6 h-6 text-gray-500" />
                 <div className="relative">
                    <Icons.Bell className="w-6 h-6 text-gray-500" />
                    {allSuggestions.length > 0 && (
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></div>
                    )}
                 </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
             {activeTab === 'chats' && renderChatList()}
             {activeTab === 'converso' && renderConverso()}
             {(activeTab === 'broadcast' || activeTab === 'stats') && (
                <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                    <Icons.Filter className="w-14 h-14 mb-4 opacity-20" />
                    <p className="text-base font-medium">Feature coming soon</p>
                </div>
            )}
        </div>

        {/* Bottom Navigation - Inline Layout */}
        <div className="bg-white border-t border-gray-200 px-2 flex justify-around items-center h-[85px] pb-5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-40">
            <button onClick={() => setActiveTab('chats')} className={`flex flex-col items-center justify-center space-y-1 w-16 h-full ${activeTab === 'chats' ? 'text-[#075E54]' : 'text-gray-400'}`}>
                <Icons.MessageSquare className="w-7 h-7" strokeWidth={activeTab === 'chats' ? 2.5 : 2} />
                <span className="text-[11px] font-medium">Inbox</span>
            </button>
            
            <button onClick={() => setActiveTab('broadcast')} className={`flex flex-col items-center justify-center space-y-1 w-16 h-full ${activeTab === 'broadcast' ? 'text-[#075E54]' : 'text-gray-400'}`}>
                <Icons.Send className="w-7 h-7" strokeWidth={activeTab === 'broadcast' ? 2.5 : 2} />
                <span className="text-[11px] font-medium">Broadcast</span>
            </button>

            {/* Converso Tab - Inline */}
            <button onClick={() => setActiveTab('converso')} className={`flex flex-col items-center justify-center space-y-1 w-16 h-full ${activeTab === 'converso' ? 'text-indigo-600' : 'text-gray-400'}`}>
                 <div className="relative">
                    <Icons.Sparkle className={`w-7 h-7 ${activeTab === 'converso' ? 'fill-indigo-100' : ''}`} strokeWidth={activeTab === 'converso' ? 2.5 : 2} />
                    {allSuggestions.length > 0 && (
                        <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                            {allSuggestions.length}
                        </span>
                    )}
                 </div>
                 <span className="text-[11px] font-medium">Converso</span>
            </button>

             <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center justify-center space-y-1 w-16 h-full ${activeTab === 'stats' ? 'text-[#075E54]' : 'text-gray-400'}`}>
                <Icons.Filter className="w-7 h-7" strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
                <span className="text-[11px] font-medium">Stats</span>
            </button>

            <button className={`flex flex-col items-center justify-center space-y-1 w-16 h-full text-gray-400`}>
                <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                    <img src="https://picsum.photos/200/200" alt="Profile" />
                </div>
                <span className="text-[11px] font-medium">Profile</span>
            </button>
        </div>
    </div>
  );
};