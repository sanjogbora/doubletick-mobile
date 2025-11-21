import React, { useState } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import ActionCenter from './components/ActionCenter';
import BottomNav from './components/BottomNav';
import ScheduleModal from './components/ScheduleModal';
import EscalationModal from './components/EscalationModal';
import { MOCK_CHATS, MOCK_AI_SUGGESTIONS } from './constants';
import { Chat, Message, MessageSender, MessageType, AISuggestion, ActionType } from './types';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Initialize suggestions state from mock data
  const [aiSuggestionsMap, setAiSuggestionsMap] = useState<Record<string, AISuggestion[]>>(MOCK_AI_SUGGESTIONS);

  // Modal State
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isEscalationModalOpen, setEscalationModalOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<AISuggestion | null>(null);

  // Navigation State
  const [activeView, setActiveView] = useState<'MESSAGES' | 'ACTIONS' | 'CONTACTS' | 'BROADCAST' | 'SETTINGS'>('MESSAGES');

  // Derived State
  const activeChat = chats.find(c => c.id === activeChatId) || null;

  // Get current suggestions from state
  const currentSuggestions = activeChatId ? (aiSuggestionsMap[activeChatId] || []) : [];

  // Aggregate all suggestions for Action Center from state
  const allSuggestions = Object.keys(aiSuggestionsMap).flatMap(chatId => {
    const chat = chats.find(c => c.id === chatId);
    return aiSuggestionsMap[chatId].map(suggestion => ({
      chatId,
      contactName: chat?.contact.name || 'Unknown',
      contactAvatar: chat?.contact.avatar,
      suggestion
    }));
  });

  const chatsWithSuggestions = new Map(
    Object.keys(aiSuggestionsMap)
      .filter(id => aiSuggestionsMap[id].length > 0)
      .map(id => [id, aiSuggestionsMap[id].map(s => ({ type: s.actionType, priority: s.priority }))])
  );

  const hasAnySuggestions = allSuggestions.length > 0;

  // Handlers
  const handleSendMessage = (text: string, chatId?: string, type: MessageType = MessageType.TEXT, payload?: any) => {
    const targetChatId = chatId || activeChatId;
    if (!targetChatId) return;

    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(),
      content: text,
      sender: MessageSender.USER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: type,
      payload: payload
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === targetChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));
  };

  const removeSuggestion = (chatId: string, suggestionId: string) => {
    setAiSuggestionsMap(prev => {
      const newMap = { ...prev };
      if (newMap[chatId]) {
        newMap[chatId] = newMap[chatId].filter(s => s.id !== suggestionId);
      }
      return newMap;
    });
  };

  const handleAIAccept = (id: string, action: ActionType, payload: any, options?: { navigate?: boolean, chatId?: string }) => {
    // Find suggestion across all chats if needed, or use current
    let suggestion = currentSuggestions.find(s => s.id === id);
    let targetChatId = options?.chatId || activeChatId;

    if (!suggestion) {
      // Search in all suggestions
      const found = allSuggestions.find(s => s.suggestion.id === id);
      if (found) {
        suggestion = found.suggestion;
        targetChatId = found.chatId;
      }
    }

    if (!targetChatId) return;

    if (action === ActionType.SCHEDULE_FOLLOWUP) {
      // Open Modal
      setActiveSuggestion(suggestion || null);
      setScheduleModalOpen(true);
    } else if (action === ActionType.ESCALATE) {
      // Open Escalation Modal
      setActiveSuggestion(suggestion || null);
      setEscalationModalOpen(true);
    } else if (action === ActionType.SEND_TEMPLATE) {
      // Direct Action
      // Check if it's a PDF template and send a PDF message type if possible
      const templateName = payload.templateName || 'Document.pdf';
      if (templateName.toLowerCase().endsWith('.pdf') || templateName.includes('Catalog') || templateName.includes('Brochure')) {
        handleSendMessage(templateName, targetChatId, MessageType.PDF);
      } else {
        handleSendMessage(`[SYSTEM: Sent Template - ${templateName}]`, targetChatId);
      }
      // Remove suggestion immediately for direct actions
      removeSuggestion(targetChatId, id);
    }
  };

  const handleGlobalAccept = (chatId: string, suggestionId: string, action: ActionType, payload: any) => {
    handleAIAccept(suggestionId, action, payload, { navigate: false, chatId });
  };

  const handleGlobalDismiss = (chatId: string, suggestionId: string) => {
    console.log(`Dismissed suggestion ${suggestionId} for chat ${chatId}`);
    removeSuggestion(chatId, suggestionId);
  };

  const handleConfirmSchedule = (details: { date: string, time: string, notes: string, remind: boolean }) => {
    if (activeSuggestion) {
      // Find which chat this suggestion belongs to
      const found = allSuggestions.find(s => s.suggestion.id === activeSuggestion.id);
      if (found) {
        handleSendMessage(`Scheduled Call`, found.chatId, MessageType.SCHEDULE, details);
        removeSuggestion(found.chatId, activeSuggestion.id);
      }
    }
    setScheduleModalOpen(false);
  };

  const handleConfirmEscalation = (note: string) => {
    if (activeSuggestion) {
      const found = allSuggestions.find(s => s.suggestion.id === activeSuggestion.id);
      if (found) {
        handleSendMessage(`[SYSTEM: Ticket Escalated. Note: ${note}]`, found.chatId, MessageType.TEXT);
        removeSuggestion(found.chatId, activeSuggestion.id);
      }
    }
    setEscalationModalOpen(false);
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center font-sans overflow-hidden p-4">
      {/* Fixed Mobile Container Simulator */}
      <div
        className="bg-white shadow-2xl relative flex flex-col overflow-hidden transition-all"
        style={{
          width: '400px',
          height: '850px',
          borderRadius: '40px',
          border: '10px solid #2d3748', // Dark gray bezel
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Notch Simulator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-7 w-32 bg-[#2d3748] rounded-b-2xl z-50 pointer-events-none flex justify-center">
          <div className="w-16 h-4 bg-black/20 rounded-full mt-1"></div>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 w-full h-full overflow-hidden bg-gray-50 flex flex-col relative pt-8 [&::-webkit-scrollbar]:hidden">

          {/* Main Views */}
          {activeChatId ? (
            <ChatWindow
              chat={activeChat}
              aiSuggestions={currentSuggestions}
              onSendMessage={(text) => handleSendMessage(text)}
              onAIAccept={handleAIAccept}
              onBack={() => setActiveChatId(null)}
            />
          ) : (
            <>
              <div className="flex-1 overflow-hidden relative">
                {activeView === 'MESSAGES' && (
                  <ChatList
                    chats={chats}
                    activeChatId={activeChatId}
                    onSelectChat={setActiveChatId}
                    chatsWithSuggestions={chatsWithSuggestions}
                  />
                )}
                {activeView === 'ACTIONS' && (
                  <ActionCenter
                    allSuggestions={allSuggestions}
                    onAccept={handleGlobalAccept}
                    onDismiss={handleGlobalDismiss}
                  />
                )}
                {['CONTACTS', 'BROADCAST', 'SETTINGS'].includes(activeView) && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Settings size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{activeView.charAt(0) + activeView.slice(1).toLowerCase()}</h3>
                    <p className="text-sm">This module is under development.</p>
                  </div>
                )}
              </div>
              <BottomNav
                activeView={activeView}
                onViewChange={setActiveView}
                hasSuggestions={hasAnySuggestions}
              />
            </>
          )}

          {/* Modals */}
          <ScheduleModal
            isOpen={isScheduleModalOpen}
            onClose={() => setScheduleModalOpen(false)}
            onConfirm={handleConfirmSchedule}
            suggestion={activeSuggestion}
          />

          <EscalationModal
            isOpen={isEscalationModalOpen}
            onClose={() => setEscalationModalOpen(false)}
            onConfirm={handleConfirmEscalation}
            suggestion={activeSuggestion}
          />
        </div>
      </div>
    </div>
  );
};

export default App;