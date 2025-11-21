import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle, TrendingUp, Users, DollarSign, FileText } from 'lucide-react';
import { AISuggestion } from '../types';

interface ProactiveActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (action: string, payload: any) => void;
    suggestion: AISuggestion | null;
    contactName?: string;
}

const ProactiveActionModal: React.FC<ProactiveActionModalProps> = ({ isOpen, onClose, onConfirm, suggestion, contactName }) => {
    const [message, setMessage] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('Re_Engagement_Template.pdf');

    useEffect(() => {
        if (isOpen && suggestion) {
            setMessage(`Hi ${contactName || 'there'},\n\nI wanted to check in - it's been a while since we last spoke. Are you still interested in exploring our enterprise solution?`);
        }
    }, [isOpen, suggestion]);

    if (!isOpen || !suggestion) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-end justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity pointer-events-auto"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="bg-white w-full rounded-t-[32px] shadow-2xl transform transition-transform duration-300 ease-out max-h-[85vh] flex flex-col pointer-events-auto animate-[slideIn_0.3s_ease-out]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                            <ClockIcon />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Inactive Lead</h3>
                            <p className="text-xs text-gray-500 font-medium">Proactive Suggestion</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6 [&::-webkit-scrollbar]:hidden">

                    {/* Why This Matters */}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={16} className="text-gray-600" />
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Why This Matters</h4>
                        </div>
                        <p className="text-gray-800 font-medium leading-relaxed mb-3">
                            No contact in 14 days. Lead at risk of going cold.
                        </p>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Trigger: Last message &gt; 14 days</span>
                            <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold">85% Confidence</span>
                        </div>
                    </div>

                    {/* Context Data Grid */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Context Data</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <ContextCard label="Last Contact" value="14 days ago" icon={<ClockIcon size={14} />} />
                            <ContextCard label="Engagement" value="Previously High" icon={<Users size={14} />} />
                            <ContextCard label="Lead Value" value="Medium" icon={<DollarSign size={14} />} />
                            <ContextCard label="Risk Factor" value="80% Churn" icon={<AlertCircle size={14} />} warning />
                        </div>
                    </div>

                    {/* AI Drafted Message */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">AI-Drafted Message</h4>
                        <div className="relative">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800 min-h-[120px] resize-none leading-relaxed"
                            />
                            <span className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-medium">
                                {message.length} chars
                            </span>
                        </div>
                    </div>

                    {/* Template Attachment */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Attach Template</h4>
                        <div className="relative">
                            <select
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 font-medium text-sm"
                            >
                                <option>Re_Engagement_Template.pdf</option>
                                <option>Product_Catalog_v2.pdf</option>
                                <option>Case_Study_2024.pdf</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <FileText size={16} />
                            </div>
                        </div>
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
                        onClick={() => onConfirm('SEND_TEMPLATE', { templateName: selectedTemplate, message })}
                        className="flex-[2] bg-indigo-600 text-white font-bold text-base py-2.5 rounded-xl shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Send size={18} />
                        Send Now
                    </button>
                </div>
            </div>
        </div>
    );
};

const ContextCard: React.FC<{ label: string, value: string, icon: React.ReactNode, warning?: boolean }> = ({ label, value, icon, warning }) => (
    <div className={`p-3 rounded-xl border ${warning ? 'bg-red-50 border-red-100' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            {icon}
            <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
        </div>
        <p className={`text-sm font-bold ${warning ? 'text-red-700' : 'text-gray-800'}`}>{value}</p>
    </div>
);

// Simple Clock Icon component since it was missing in imports or usage context sometimes
const ClockIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

export default ProactiveActionModal;
