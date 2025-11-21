import React, { useState } from 'react';
import { AISuggestion } from '../types';
import { Icons } from './Icons';

interface ActionCardProps {
  suggestion: AISuggestion;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onReview?: (suggestion: AISuggestion) => void;
  compact?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({ suggestion, onAccept, onReject, onReview, compact = false }) => {
  
  // Visual Config
  const config = {
    schedule_call: { 
        icon: Icons.Clock, 
        bg: 'bg-red-50', 
        text: 'text-red-600', 
        btn: 'Schedule',
        btnClass: 'bg-gray-900 text-white hover:bg-black'
    },
    send_document: { 
        icon: Icons.FileText, 
        bg: 'bg-blue-50', 
        text: 'text-blue-600', 
        btn: 'Send',
        btnClass: 'bg-[#00a884] text-white hover:bg-[#008f6f]'
    },
    follow_up: { 
        icon: Icons.MessageSquare, 
        bg: 'bg-purple-50', 
        text: 'text-purple-600', 
        btn: 'Reply',
        btnClass: 'bg-indigo-600 text-white hover:bg-indigo-700'
    },
    reply_template: {
        icon: Icons.Zap,
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        btn: 'Send',
        btnClass: 'bg-[#00a884] text-white hover:bg-[#008f6f]'
    }
  };

  const typeConfig = config[suggestion.type] || config.follow_up;
  const IconComp = typeConfig.icon;

  const handleMainAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If it requires review (like scheduling), trigger onReview, else just accept
    if ((suggestion.type === 'schedule_call' || suggestion.type === 'follow_up') && onReview) {
        onReview(suggestion);
    } else {
        onAccept(suggestion.id);
    }
  };

  if (suggestion.status !== 'pending') return null;

  return (
    <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md ${compact ? 'mb-3' : 'mb-4'}`}>
      
      {/* Card Body */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${typeConfig.bg} flex items-center justify-center`}>
                    <IconComp className={`w-5 h-5 ${typeConfig.text}`} />
                </div>
                <div>
                    <h4 className="text-base font-bold text-gray-900 leading-tight">{suggestion.title}</h4>
                </div>
            </div>
             {/* Status Dot or Priority */}
             {suggestion.priority === 'high' && (
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
             )}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-4 pl-1">
            {suggestion.description}
        </p>

        {/* Metadata / Reasoning */}
        <div className="flex items-center gap-2 mb-4 pl-1">
            <Icons.Sparkle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-400 italic">{suggestion.reason}</span>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 mt-2 pt-3 border-t border-gray-50">
            <button 
                onClick={(e) => { e.stopPropagation(); onReject(suggestion.id); }}
                className="text-sm font-medium text-gray-400 px-4 py-2 hover:text-gray-600 transition-colors"
            >
                Dismiss
            </button>
            {/* Removed Edit Button as requested */}
            <button 
                onClick={handleMainAction}
                className={`text-sm font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 ${typeConfig.btnClass}`}
            >
                {typeConfig.btn}
            </button>
        </div>
      </div>
    </div>
  );
};