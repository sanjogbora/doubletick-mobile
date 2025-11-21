import React, { useState, useRef, useEffect } from 'react';
import { ChatThread, AISuggestion, Message } from '../types';
import { Icons } from './Icons';
import { ActionCard } from './ActionCard';

interface ChatDetailProps {
  thread: ChatThread;
  onBack: () => void;
  onUpdateSuggestion: (suggestionId: string, status: 'accepted' | 'rejected') => void;
}

export const ChatDetail: React.FC<ChatDetailProps> = ({ thread, onBack, onUpdateSuggestion }) => {
  const [messages, setMessages] = useState<Message[]>(thread.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeSuggestions, setActiveSuggestions] = useState<AISuggestion[]>(
    thread.suggestions.filter(s => s.status === 'pending')
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeSuggestions]);

  const handleAccept = (id: string) => {
    // Optimistic UI update: Remove suggestion, add system message
    const suggestion = activeSuggestions.find(s => s.id === id);
    if (suggestion) {
        const newMsg: Message = {
            id: Date.now().toString(),
            sender: 'system',
            text: `Action Taken: ${suggestion.title} (${suggestion.suggestedActionPayload})`,
            timestamp: 'Just now',
            isRead: true
        };
        setMessages([...messages, newMsg]);
        setActiveSuggestions(prev => prev.filter(s => s.id !== id));
        onUpdateSuggestion(id, 'accepted');
    }
  };

  const handleReject = (id: string) => {
    setActiveSuggestions(prev => prev.filter(s => s.id !== id));
    onUpdateSuggestion(id, 'rejected');
  };

  return (
    <div className="flex flex-col h-full bg-[#efeae2] relative">
      {/* Header - Compact fixed height */}
      <div className="bg-[#00a884] text-white px-2 flex items-center justify-between shadow-sm z-20 h-[56px] flex-shrink-0 pt-1">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-0.5 p-1 rounded-full hover:bg-white/10">
            <Icons.ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 mr-2">
            <img src={thread.customer.avatar} alt={thread.customer.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col cursor-pointer">
            <h3 className="font-semibold text-[15px] leading-tight">{thread.customer.name}</h3>
            <span className="text-[10px] text-white/80 truncate max-w-[140px]">
                {thread.customer.tags.join(', ') || 'Online'}
            </span>
          </div>
        </div>
        <div className="flex space-x-3 pr-1">
          <Icons.Video className="w-5 h-5 p-0.5" />
          <Icons.Phone className="w-4 h-4 mt-0.5" />
          <Icons.MoreVertical className="w-4 h-4 mt-0.5" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:300px_300px]">
        {/* Encryption Notice Simulator */}
        <div className="flex justify-center mb-4">
            <div className="bg-[#ffebb8] text-gray-800 text-[10px] px-3 py-1 rounded-lg shadow-sm text-center max-w-[85%] border border-[#fbe194] leading-tight">
                Messages to this business are now secured with end-to-end encryption. Tap for more info.
            </div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
            {msg.sender === 'system' ? (
                <div className="bg-[#e6f2ff] text-indigo-800 text-[10px] px-3 py-1 rounded-full flex items-center my-2 border border-indigo-100 shadow-sm">
                    <Icons.CheckCircle2 className="w-3 h-3 mr-1.5" /> {msg.text}
                </div>
            ) : (
                <div className={`max-w-[80%] px-2.5 py-1.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] relative ${
                msg.sender === 'agent' ? 'bg-[#dcf8c6] rounded-lg rounded-tr-none' : 'bg-white rounded-lg rounded-tl-none'
                }`}>
                <p className="text-[13px] text-[#111b21] leading-snug">{msg.text}</p>
                <span className="text-[9px] text-[rgba(17,27,33,0.5)] block text-right mt-0.5 flex justify-end items-center gap-0.5">
                    {msg.timestamp}
                    {msg.sender === 'agent' && (
                    <Icons.Check className={`w-2.5 h-2.5 ${msg.isRead ? 'text-[#53bdeb]' : 'text-gray-400'}`} strokeWidth={3} />
                    )}
                </span>
                </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Suggestion Tray (Sticky) */}
      {activeSuggestions.length > 0 && (
        <div className="bg-[#f0f2f5] border-t border-gray-200 pt-2 pb-1 px-2 z-10 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
             <div className="flex items-center justify-between px-1 mb-1.5">
                 <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center mr-1.5">
                         <Icons.Sparkle className="w-2.5 h-2.5 text-indigo-600" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Suggested Actions ({activeSuggestions.length})</span>
                 </div>
             </div>
             <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto no-scrollbar">
                {activeSuggestions.map(suggestion => (
                    <ActionCard 
                        key={suggestion.id} 
                        suggestion={suggestion} 
                        onAccept={handleAccept} 
                        onReject={handleReject}
                        compact={true}
                    />
                ))}
             </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-[#f0f2f5] px-2 py-1.5 flex items-end space-x-1.5 z-20 pb-4">
        <div className="bg-white rounded-2xl flex-1 flex items-end px-2 py-2 shadow-sm min-h-[40px]">
            <Icons.Smile className="w-5 h-5 text-gray-400 mr-1.5 mb-0.5 cursor-pointer hover:text-gray-600" />
            <input 
            type="text" 
            placeholder="Message" 
            className="flex-1 bg-transparent outline-none text-[15px] text-gray-800 mb-0.5 placeholder-gray-400"
            />
            <div className="flex space-x-3 mb-0.5 ml-1.5 mr-1">
                <Icons.Paperclip className="w-4 h-4 text-gray-500 cursor-pointer rotate-45 hover:text-gray-700" />
                <Icons.Camera className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
            </div>
        </div>
        <button className="bg-[#00a884] w-10 h-10 rounded-full flex items-center justify-center shadow-md text-white hover:bg-[#008f6f] transition-colors mb-0.5">
          <Icons.Mic className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};