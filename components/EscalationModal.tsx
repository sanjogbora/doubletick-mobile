import React, { useState } from 'react';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';
import { AISuggestion } from '../types';

interface EscalationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (note: string) => void;
    suggestion: AISuggestion | null;
}

const EscalationModal: React.FC<EscalationModalProps> = ({ isOpen, onClose, onConfirm, suggestion }) => {
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-end justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity pointer-events-auto"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="bg-white w-full rounded-t-[32px] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col pointer-events-auto animate-[slideIn_0.3s_ease-out]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Escalate Ticket</h3>
                            <p className="text-xs text-red-600 font-medium">High Priority</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                        <p className="text-sm text-red-800 leading-relaxed">
                            This conversation will be transferred to the <strong>Technical Support Team</strong>. Please add a context note.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Internal Note</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm text-gray-800 min-h-[120px] resize-none placeholder-gray-400"
                            placeholder="Explain the issue briefly..."
                            autoFocus
                        />
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
                        onClick={() => onConfirm(note)}
                        className="flex-[2] bg-red-600 text-white font-bold text-base py-2.5 rounded-xl shadow-lg shadow-red-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <span>Escalate Now</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EscalationModal;
