import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ChatDetail } from './components/ChatDetail';
import { MOCK_THREADS } from './constants';
import { ChatThread, AISuggestion } from './types';
import { Icons } from './components/Icons';

const App: React.FC = () => {
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

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

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  return (
    <div className="w-full h-screen bg-gray-200 flex justify-center items-center font-sans overflow-hidden">
      {/* Fixed Mobile Container Simulator */}
      <div 
        className="bg-white shadow-2xl relative flex flex-col overflow-hidden"
        style={{
            width: '360px',
            height: '720px',
            borderRadius: '36px', // Smooth mobile-like corners
            border: '8px solid #1f2937' // Bezel
        }}
      >
        {/* Notch Simulator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-28 bg-gray-900 rounded-b-xl z-50 pointer-events-none"></div>

        {/* Content Wrapper */}
        <div className="flex-1 w-full h-full overflow-hidden bg-gray-50 flex flex-col">
            {selectedThread ? (
            <ChatDetail 
                thread={selectedThread} 
                onBack={handleBack} 
                onUpdateSuggestion={handleUpdateSuggestion} 
            />
            ) : (
            <Dashboard 
                threads={threads} 
                onSelectThread={handleSelectThread} 
                onUpdateSuggestion={handleUpdateSuggestion}
            />
            )}
        </div>
      </div>
    </div>
  );
};

export default App;