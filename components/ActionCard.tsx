import React, { useState } from 'react';
import { AISuggestion } from '../types';
import { Icons } from './Icons';

interface ActionCardProps {
  suggestion: AISuggestion;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  compact?: boolean; // For inside the chat view vs the dashboard view
}

export const ActionCard: React.FC<ActionCardProps> = ({ suggestion, onAccept, onReject, compact = false }) => {
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Priority Styles (Matching Desktop Screenshot)
  const priorityBadgeStyle = {
    high: 'bg-red-100 text-red-600',
    medium: 'bg-orange-100 text-orange-600',
    low: 'bg-gray-100 text-gray-600'
  };

  // Icon Styles (Matching Desktop Screenshot)
  const getIconStyles = () => {
    switch (suggestion.type) {
      case 'schedule_call': return { bg: 'bg-red-50', text: 'text-red-500', icon: Icons.Clock };
      case 'send_document': return { bg: 'bg-blue-50', text: 'text-blue-500', icon: Icons.FileText };
      default: return { bg: 'bg-indigo-50', text: 'text-indigo-500', icon: Icons.Sparkle };
    }
  };

  const { bg: iconBg, text: iconText, icon: IconComp } = getIconStyles();

  if (suggestion.status !== 'pending') return null;

  return (
    <div className={`bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden transition-all ${compact ? 'mb-2' : 'mb-3'}`}>
      
      {/* Header / Main Row */}
      <div className="p-2.5 flex items-start cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        {/* Icon Circle */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-full ${iconBg} flex items-center justify-center mr-2.5 mt-0.5`}>
          <IconComp className={`w-4 h-4 ${iconText}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
                <h4 className="text-[13px] font-bold text-gray-900 truncate mr-2">{suggestion.title}</h4>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${priorityBadgeStyle[suggestion.priority]}`}>
                    {suggestion.priority}
                </span>
            </div>
            <p className="text-[11px] text-gray-500 leading-tight line-clamp-2">
                {suggestion.description}
            </p>
            
            {/* Rationale (Only in expanded or if explicitly needed) */}
            {isExpanded && (
                <div className="mt-2 pt-2 border-t border-gray-50">
                     <p className="text-[10px] text-gray-400 italic flex items-start">
                        <Icons.Sparkle className="w-2.5 h-2.5 mr-1 mt-0.5 text-indigo-400" />
                        {suggestion.reason}
                    </p>
                </div>
            )}
        </div>

        {/* Toggle Icon */}
        {!compact && (
            <div className="ml-1 text-gray-300">
                 <Icons.ChevronRight className={`w-4