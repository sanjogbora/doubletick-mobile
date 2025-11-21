import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Check, Bell } from 'lucide-react';
import { AISuggestion } from '../types';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (details: { date: string, time: string, notes: string, remind: boolean }) => void;
    suggestion: AISuggestion | null;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onConfirm, suggestion }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [remind, setRemind] = useState(true);
    const [checklist, setChecklist] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && suggestion) {
            // Pre-fill based on suggestion logic (mock)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setDate(tomorrow.toISOString().split('T')[0]);
            setTime('16:00'); // 4:00 PM
            setNotes(`Follow up: ${suggestion.reasoning}`);
            setChecklist([
                'Review previous pricing PDF',
                'Check inventory',
                'Read last 3 emails'
            ]);
        }
    }, [isOpen, suggestion]);

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-end justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity pointer-events-auto"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="bg-white w-full rounded-t-[32px] shadow-2xl transform transition-transform duration-300 ease-out max-h-[90vh] flex flex-col pointer-events-auto animate-[slideIn_0.3s_ease-out]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Schedule Follow-up</h3>
                            <p className="text-xs text-indigo-600 font-medium">AI Suggestion</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6 [&::-webkit-scrollbar]:hidden">
                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" /> Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" /> Time
                            </label>
                            <div className="relative">
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium text-gray-800"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none bg-gray-50 pl-1">IST</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Prep Checklist */}
                    <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100">
                        <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                            AI Prep Checklist
                        </h4>
                        <div className="space-y-3">
                            {checklist.map((item, idx) => (
                                <label key={idx} className="flex items-start gap-3 group cursor-pointer">
                                    <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                                        <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-indigo-200 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all" />
                                        <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                                    </div>
                                    <span className="text-sm text-gray-700 group-hover:text-indigo-800 transition-colors leading-tight">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800 min-h-[80px] resize-none"
                            placeholder="Add notes for the call..."
                        />
                    </div>

                    {/* Reminder Toggle */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${remind ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-400'}`}>
                                <Bell size={18} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Remind me 15m before</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={remind} onChange={(e) => setRemind(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-white pb-8 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-gray-600 font-bold text-base bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={() => onConfirm({ date, time, notes, remind })}
                        className="flex-[2] bg-indigo-600 text-white font-bold text-base py-2.5 rounded-xl shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Calendar size={18} />
                        Confirm Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;