import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ChatDetail } from './components/ChatDetail';
import { ScheduleModal } from './components/ScheduleModal';
import { MOCK_THREADS } from './constants';
import { ChatThread, AISuggestion } from './types';

const App: React.FC = () => {
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  
  // Modal State
  const [suggestionToReview, setSuggestionToReview] = useState<AISuggestion | null>(null);

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
  };

  const handleBack = () => {
    setSelectedThreadId(null);
  };

  const handleUpdateSuggestion = (suggestionId: string, status: 'accepted' | 'rejected') => {
    setThreads(prev => prev.map(thread => {
      const hasSuggestion = thread.suggestions.some(s => s.id === suggestionId);
      if (hasSuggestion) {
        return {
          ...thread,
          suggestions: thread.suggestions.map(s => 
            s.id === suggestionId ? { ...s, status } : s
          )
        };
      }
      return thread;
    }));
  };

  const handleReviewSuggestion = (suggestion: AISuggestion) => {
    setSuggestionToReview(suggestion);
  };

  const handleConfirmSchedule = () => {
    if (suggestionToReview) {
        handleUpdateSuggestion(suggestionToReview.id, 'accepted');
        setSuggestionToReview(null);
    }
  };

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center font-sans overflow-hidden p-4">
      {/* Fixed Mobile Container Simulator - Larger Size */}
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
        <div className="flex-1 w-full h-full overflow-hidden bg-gray-50 flex flex-col relative">
            
            {/* Main Views */}
            {selectedThread ? (
            <ChatDetail 
                thread={selectedThread} 
                onBack={handleBack} 
                onUpdateSuggestion={handleUpdateSuggestion} 
                onReviewSuggestion={handleReviewSuggestion}
            />
            ) : (
            <Dashboard 
                threads={threads} 
                onSelectThread={handleSelectThread} 
                onUpdateSuggestion={handleUpdateSuggestion}
                onReviewSuggestion={handleReviewSuggestion}
            />
            )}

            {/* Overlays / Modals */}
            {suggestionToReview && (
                <ScheduleModal 
                    suggestion={suggestionToReview} 
                    onClose={() => setSuggestionToReview(null)} 
                    onConfirm={handleConfirmSchedule}
                />
            )}
        </div>
      </div>
    </div>
  );
};

export default App;