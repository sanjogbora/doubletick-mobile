import React, { useState, useRef, useEffect } from 'react';
import { ChatThread, AISuggestion, Message } from '../types';
import { Icons } from './Icons';
import { ActionCard } from './ActionCard';

interface ChatDetailProps {
  thread: ChatThread;
  onBack: () => void;
  onUpdateSuggestion: (suggestionId: string, status: 'accepted' | 'rejected') => void;
  onReviewSuggestion?: (suggestion: AISuggestion) => void;
}

export const ChatDetail: React.FC<ChatDetailProps> = ({ thread, onBack, onUpdateSuggestion, onReviewSuggestion }) => {
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
    const suggestion = activeSuggestions.find(s => s.id === id);
    if (suggestion) {
        const newMsg: Message = {
            id: Date.now().toString(),
            sender: 'system',
            text: `Action Taken: ${suggestion.title}`,
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
      {/* Header */}
      <div className="bg-[#00a884] text-white px-4 flex items-center justify-between shadow-md z-20 h-[72px] flex-shrink-0 pt-4">
        <div className="flex items-center overflow-hidden">
          <button onClick={onBack} className="mr-2 p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <Icons.ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 mr-3 border border-white/20 flex-shrink-0">
            <img src={thread.customer.avatar} alt={thread.customer.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col cursor-pointer min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate">{thread.customer.name}</h3>
            <span className="text-xs text-white/80 truncate block">
                {thread.customer.tags.join(', ') || 'Online'}
            </span>
          </div>
        </div>
        <div className="flex space-x-5 pr-1 flex-shrink-0">
          <Icons.Video className="w-6 h-6 p-0.5" />
          <Icons.Phone className="w-5 h-5 mt-0.5" />
          <Icons.MoreVertical className="w-5 h-5 mt-0.5" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:300px_300px]">
        {/* Encryption Notice */}
        <div className="flex justify-center mb-6 mt-2">
            <div className="bg-[#ffebb8] text-gray-800 text-xs px-4 py-2 rounded-lg shadow-sm text-center max-w-[85%] border border-[#fbe194] leading-tight">
                Messages to this business are now secured with end-to-end encryption. Tap for more info.
            </div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
            {msg.sender === 'system' ? (
                <div className="bg-[#e6f2ff] text-indigo-800 text-xs px-4 py-1.5 rounded-full flex items-center my-2 border border-indigo-100 shadow-sm animate-in fade-in zoom-in duration-300">
                    <Icons.CheckCircle2 className="w-3.5 h-3.5 mr-2" /> {msg.text}
                </div>
            ) : (
                <div className={`max-w-[85%] px-4 py-2 shadow-sm relative text-base ${
                msg.sender === 'agent' ? 'bg-[#dcf8c6] rounded-xl rounded-tr-none' : 'bg-white rounded-xl rounded-tl-none'
                }`}>
                <p className="text-[15px] text-[#111b21] leading-snug">{msg.text}</p>
                <span className="text-[11px] text-[rgba(17,27,33,0.5)] block text-right mt-1 flex justify-end items-center gap-1">
                    {msg.timestamp}
                    {msg.sender === 'agent' && (
                    <Icons.Check className={`w-3.5 h-3.5 ${msg.isRead ? 'text-[#53bdeb]' : 'text-gray-400'}`} strokeWidth={3} />
                    )}
                </span>
                </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Suggestion Tray (Converso Widget) */}
      {activeSuggestions.length > 0 && (
        <div className="bg-transparent px-3 pb-2 z-10">
             <div className="bg-white/90 backdrop-blur-md border border-indigo-100 rounded-2xl shadow-lg overflow-hidden">
                 <div className="bg-indigo-50/80 px-4 py-2 flex items-center justify-between border-b border-indigo-100">
                     <div className="flex items-center gap-2">
                        <Icons.Sparkle className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                        <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Converso Suggestions</span>
                     </div>
                     <span className="bg-white text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{activeSuggestions.length}</span>
                 </div>
                 <div className="p-3 flex flex-col gap-2 max-h-[260px] overflow-y-auto no-scrollbar">
                    {activeSuggestions.map(suggestion => (
                        <ActionCard 
                            key={suggestion.id} 
                            suggestion={suggestion} 
                            onAccept={handleAccept} 
                            onReject={handleReject}
                            onReview={onReviewSuggestion}
                            compact={true}
                        />
                    ))}
                 </div>
             </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-[#f0f2f5] px-3 py-2 flex items-end space-x-2 z-20 pb-6">
        <div className="bg-white rounded-3xl flex-1 flex items-end px-4 py-2.5 shadow-sm min-h-[52px]">
            <Icons.Smile className="w-6 h-6 text-gray-400 mr-3 mb-1 cursor-pointer hover:text-gray-600 transition-colors" />
            <input 
            type="text" 
            placeholder="Message" 
            className="flex-1 bg-transparent outline-none text-base text-gray-800 mb-1 placeholder-gray-400"
            />
            <div className="flex space-x-3 mb-1 ml-2 mr-1">
                <Icons.Paperclip className="w-5 h-5 text-gray-500 cursor-pointer rotate-45 hover:text-gray-700 transition-colors" />
                <Icons.Camera className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
            </div>
        </div>
        <button className="bg-[#00a884] w-12 h-12 rounded-full flex items-center justify-center shadow-md text-white hover:bg-[#008f6f] transition-all active:scale-95 mb-1">
          <Icons.Mic className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};