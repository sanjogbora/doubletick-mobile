import React, { useState } from 'react';
import { AISuggestion } from '../types';
import { Icons } from './Icons';

interface ScheduleModalProps {
  suggestion: AISuggestion;
  onClose: () => void;
  onConfirm: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ suggestion, onClose, onConfirm }) => {
  const [date, setDate] = useState('2025-11-22');
  const [time, setTime] = useState('04:00 PM');
  const [notes, setNotes] = useState(`Follow up: ${suggestion.title}`);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const checklistItems = [
    "Review previous pricing PDF",
    "Check inventory for Enterprise Plan",
    "Read last 3 emails"
  ];

  const toggleCheckbox = (item: string) => {
    setCheckedItems(prev => ({
        ...prev,
        [item]: !prev[item]
    }));
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90%] animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#4f46e5] text-white px-5 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Icons.Calendar className="w-5 h-5" />
                <h2 className="text-lg font-bold">Schedule Follow-up</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <Icons.X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-5 overflow-y-auto no-scrollbar space-y-5 bg-[#f8fafc]">
            
            {/* AI Suggestion Block */}
            <div className="bg-white border border-indigo-100 rounded-xl p-3 shadow-sm flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Icons.Sparkle className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-indigo-600 mb-0.5">AI Suggestion</h4>
                    <p className="text-sm text-gray-800 leading-tight">{suggestion.description}</p>
                </div>
            </div>

            {/* Date & Time Pickers */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">Date</label>
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center shadow-sm">
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full text-sm bg-transparent outline-none text-gray-700"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">Time</label>
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center shadow-sm">
                        <input 
                            type="text" 
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full text-sm bg-transparent outline-none text-gray-700"
                        />
                        <Icons.Clock className="w-4 h-4 text-gray-400 ml-1" />
                    </div>
                </div>
            </div>
            <div className="flex items-center text-[10px] text-green-600 font-medium px-1">
                <Icons.CheckCircle2 className="w-3 h-3 mr-1" /> Agent Free
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-500 font-normal">Customer Time: 16:00 (IST)</span>
            </div>

            {/* AI Prep Checklist */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
                <div className="flex items-center mb-3">
                    <Icons.Sparkle className="w-3.5 h-3.5 text-indigo-500 mr-2" />
                    <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">AI Prep Checklist</h3>
                </div>
                <div className="space-y-2.5">
                    {checklistItems.map((item, idx) => (
                        <label key={idx} className="flex items-start cursor-pointer group">
                            <div 
                                className={`w-4 h-4 rounded border flex items-center justify-center mr-2.5 mt-0.5 transition-colors ${
                                    checkedItems[item] ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300 group-hover:border-indigo-400'
                                }`}
                                onClick={() => toggleCheckbox(item)}
                            >
                                {checkedItems[item] && <Icons.Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>
                            <span className={`text-sm ${checkedItems[item] ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">Notes</label>
                <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 outline-none focus:border-indigo-500 min-h-[80px] shadow-sm"
                />
            </div>

            {/* Reminder Toggle */}
            <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                 <div className="flex items-center text-gray-600">
                    <Icons.Bell className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">Remind me 15 minutes before</span>
                 </div>
                 <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4" />
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3 pb-8">
            <button 
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={onConfirm}
                className="bg-[#4f46e5] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center"
            >
                <Icons.CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm Schedule
            </button>
        </div>
      </div>
    </div>
  );
};